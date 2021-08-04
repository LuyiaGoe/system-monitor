import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store( {
  state: {
    // 内存信息
    memUsed: 0,
    totalmem: 0,
    memTabArr: new Array(60).fill(""),
    memIO: new Array(60).fill(""),
    swapUsed: 0,
    swapSum: 0,

    // CPU信息
    cpuInfo: {
      execTime: [],
      idle: [],
      name: "",
      baseFraquence: "",
    },
    cpuPreInfo: {
      execTime: [],
      idle: [],
    },
    cpuUsedRate: [],
    maxFrequence: 0,
    cpuLoadAverage: [
      {
        data: new Array(60).fill(""),
        type: "line",
        symbol: "none",
        smooth: true,
      }, {
        data: new Array(60).fill(""),
        type: "line",
        symbol: "none",
        smooth: true,
      }, {
        data: new Array(60).fill(""),
        type: "line",
        symbol: "none",
        smooth: true,
      }
    ],

    // 进程与线程
    processNum: 0,
    threadNum: 0,
    processArr: new Array(60).fill(""),
    threadArr: new Array(60).fill(""),
    processTab: null,
    process: [
      {
        PID: "",
        processCPU: "",
        processMem: "",
        processName: "",
        START: "",
        TIME: "",
        COMMAND: "",
      }
    ],
    searchTimer: null,
    select: null,
    search: "",
    category: null,
    display: [],
    categoryType: "全部进程",

    verifyVisible: true,

  },
  mutations: {
    // 处理内存信息
    handleMemInfo(state, data) {
      // arr = [total，used，free，shared，buffer，available，swapTotle，swapUsed，swapFree]
      let arr = data.match(/\d+/g);

      state.totalmem = (arr[0] / 1024 ** 2).toFixed(1);
      state.memUsed = ((+arr[0] - arr[5] ) / 1024 ** 2).toFixed(1);
      state.memTabArr.shift();
      state.memTabArr.push(state.memUsed / state.totalmem);
      state.swapSum = (arr[6] / 1024 ** 2).toFixed(1);
      state.swapUsed = (arr[7] / 1024 ** 2).toFixed(1);
      state.memIO.shift();
      state.memIO.push(state.swapUsed / state.swapSum);
    },

    // 处理CPU信息
    handleCPUInfo(state, data) {
      // cpuDetails CPU核心的信息、snapshot CPU总的以及各个核心的运行时间快照
      const { cpuDetails, snapshot, } = data.data;

      state.cpuInfo.details = JSON.parse(cpuDetails);
      state.cpuInfo.name = JSON.parse(cpuDetails)[0].model.split("CPU @")[0];
      state.cpuInfo.baseFraquence = JSON.parse(cpuDetails)[0].model.split("CPU @")[1];
      state.cpuInfo.time = [];

      // 将总CPU快照放在数组最后，处理快照信息
      let snapArr = [...snapshot.slice(1)];

      snapArr.push(snapshot[0] );
      snapArr.forEach((item, i) => {
        let total = item.reduce((pre, cur) => {
          return pre + +cur;
        }, 0);

        state.cpuInfo.time[i] = { total,
          idle: item[3], };
      } );

      // 计算时间段内的CPU使用率
      state.cpuPreInfo.time &&
        (state.cpuUsedRate = state.cpuInfo.time.map((item, index) => {
          const { total: curt, idle: curi, } = item;
          const { total: pret, idle: prei, } = state.cpuPreInfo.time[index];
          let result = curt - pret ? (curi - prei) / (curt - pret) : 1;

          return 1 - result;
        } ));
      state.cpuPreInfo = { ...state.cpuInfo, };
    },

    // 搜索关键词
    searchKey(state, obj) {
      state.search = obj.search ?? state.search;
      if (!state.searchTimer) {
        state.searchTimer = setTimeout(() => {
          state.select = state.process.filter((item) => {
            return (item.processName + "").includes(state.search) || (item.PID + "").includes(state.search);
          } );
          this.commit("intersection");
          state.searchTimer = null;
        }, obj.delay);
      }
    },

    // 选择分类
    selectDropItem(state, category) {
      state.categoryType = category ? category : state.categoryType;
      switch (state.categoryType) {
        case "活动进程":
          state.category = state.process.filter((item) => {
            let { state, } = JSON.parse(JSON.stringify(item));

            state = state.replace(/[SRD]/, "*");
            return state.includes("*");
          } );
          break;
        case "全部进程":
          state.category = state.process;
          break;
        default:
      }
      this.commit("intersection");
    },

    // 求交集
    intersection(state) {
      let obj = {};
      let arr = state.category.concat(state.select);

      state.display = arr.filter((item) => {
        if (item === null) {
          return false;
        }
        if (!obj[item.PID] ) {
          obj[item.PID] = 1;
        } else {
          return item;
        }
        return null;
      } );
    },

  },
  actions: {
    // 获取内存信息
    getMemInfo( { commit, } ) {
      axios.get("http://localhost:6001/memInfo")
        .then((r) => {
          let { data, } = r;

          commit("handleMemInfo", data);
        } );
    },

    // 获取CPU信息
    getCPUInfo( { commit, } ) {
      axios.get("http://localhost:6001/cpuInfo")
        .then((r) => {
          commit("handleCPUInfo", r);
        } );
    },

    // 获取核心最大频率
    getCPUMaxFrequence( { state, } ) {
      axios.get("http://localhost:6001/cpuMaxFrequence")
        .then((r) => {
          state.maxFrequence = r.data / 1000000;
        } );
    },

    // 获取CPU负载
    getCPULoadInfo( { state, } ) {
      axios.get("http://localhost:6001/cpuInfo")
        .then((r) => {
          // cpuDetails CPU核心的信息、CPULoadAvg CPU的平均负载、snapshot CPU总的以及各个核心的运行时间快照
          const { cpuLoadAvg, } = r.data;

          // Load Average
          for (let i = 0; i < 3; i++) {
            state.cpuLoadAverage[i].data.shift();
            state.cpuLoadAverage[i].data.push(cpuLoadAvg[i] - 0);
          }
        } );
    },

    // 进程数
    getProcessNumber( { state, } ) {
      axios.get("http://localhost:6001/processNumber")
        .then((r) => {
          state.processNum = r.data;
          state.processArr.shift();
          state.processArr.push(r.data);
        } );
    },

    // 进程数
    getThreadNumber( { state, } ) {
      axios.get("http://localhost:6001/threadNumber")
        .then((r) => {
          state.threadNum = r.data;
          state.threadArr.shift();
          state.threadArr.push(r.data);
        } );
    },

    // 获取程序信息
    getProcessInfo( { state, commit, } ) {
      axios.get("http://localhost:6001/getProcessInfo")
        .then((r) => {
          state.process = r.data;
          state.display = state.display.length ? state.display : r.data;
          commit("selectDropItem");
          commit("searchKey", { delay: 0, } );
        } );
    },

    // 改变优先度
    changePriority( { state, }, { priorityNumber, PID, password, } ) {
      state.verifyVisible = true;
      axios.get("http://localhost:6001/changePrioriy", {
        params: {
          priority: priorityNumber,
          PID: PID,
          password: password,
        },
      } )
        .then((r) => {
          const { data: msg, } = r;

          if (msg !== "wrong") {
            state.verifyVisible = false;
          }
        } );
    },
  },
  modules: {
  },
} );
