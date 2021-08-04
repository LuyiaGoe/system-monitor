<template>
  <!-- 进程/进程数 -->
  <div>
    <div class="title">
      <span>{{$t('processesAndThreads')}}：</span>
    </div>
    <el-card>
      <div class="legend">
        <div v-for="(item, index) in color" :key="index">
          <div
            class="block"
            :style="{
              backgroundColor: color[index],
            }"
            v-if="index < 2"
          ></div>
          <span id="cpuInfo" class="info" v-if="index == 0">{{$t('processNum')}}：{{ processNum }}</span>
          <span id="cpuInfo" class="info" v-if="index == 1">{{$t('threadNum')}}：{{ threadNum }}</span>
        </div>
      </div>
      <div id="process" ref="canvas"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "CPU",

  data() {
    return {
      // 进程与线程
      processNum: 0,
      threadNum: 0,
      processArr: new Array(60).fill(""),
      threadArr: new Array(60).fill(""),
      processTab: null,

      color: [
        "red",
        "green",
        "orange",
        "yellow",
        "purple",
        "pink",
        "gray",
        "blue"
      ],

      resizeTable: null,
      timer: null,
    };
  },

  props: ["interval"],

  created() {
    this.getProcessNumber();
    this.getThreadNumber();

    this.process && this.processTab.destroy();

    this.resizeTable = (delay) => {
      let timer = null;

      return () => {
        if (!timer) {
          timer = setTimeout(() => {
            this.processTab && this.processTab.resize();
            timer = null;
          }, delay);
        }
      };
    };
    // 内存、CPU的canvas图表自适应
    if (!this.timer) {
      window.addEventListener("resize", this.resizeTable(100));
    }
    this.timer = setInterval(() => {
      this.getProcessNumber();
      this.getThreadNumber();
      this.processTab && this.drawProcessThreadTable(this.threadArr[59] );
    }, this.interval);
  },

  mounted() {
    this.drawProcessThreadTable(this.threadArr[59] );
  },

  methods: {
    // 进程线程图表
    drawProcessThreadTable(threads) {
      if (!document.getElementById("process")) {
        return;
      }
      let yAxisInterval = Math.ceil(threads / 4);

      this.processTab = echarts.init(document.getElementById("process"));
      let option = {
        color: ["red", "green"],
        animation: false,
        tooltip: {
          trigger: "axis",
        },
        grid: {
          left: "0%",
          right: "0%",
          bottom: "3%",
          top: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: [],
        },
        yAxis: {
          position: "right",
          interval: yAxisInterval,
        },
        series: [
          {
            type: "line",
            symbol: "none",
            smooth: true,
            data: [...this.processArr],
          },
          {
            type: "line",
            symbol: "none",
            smooth: true,
            data: [...this.threadArr],
          }
        ],
      };

      this.processTab.setOption(option, false, true);
    },

    // 进程数
    getProcessNumber() {
      this.$store.dispatch("getProcessNumber");
      this.processNum = this.$store.state.processNum;
      this.processArr = this.$store.state.processArr;
    },

    // 进程数
    getThreadNumber() {
      this.$store.dispatch("getThreadNumber");
      this.threadNum = this.$store.state.threadNum;
      this.threadArr = this.$store.state.threadArr;
    },
  },

  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>

<style scoped>
.title {
  margin-left: 20px;
  margin-bottom: 4px;
  font-weight: 600;
  color: #777;
}

.el-card {
  border-radius: 20px !important;
}

#procs-header {
  background-color: #f88a1f;
}

.block {
  position: relative;
  display: inline-block;
  top: -4px;
  margin-right: 5px;
  border-radius: 1px;
  height: 2px;
  width: 30px;
}

#process {
  height: 200px;
  width: 100%;
}

.legend {
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-around;
}
</style>
