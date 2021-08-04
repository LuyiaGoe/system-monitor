<template>
  <!-- CPU区域 -->
  <div>
    <div class="title">
      <span>{{$t('cpuInfo')}}：</span>
    </div>

    <el-card>
      <!-- 信息列表 -->
      <div class="list tableHead">
        <div style="flex:5">{{$t('model')}}</div>
        <div style="flex:2">{{$t('maxFrequence')}}</div>
        <div style="flex:2">{{$t('sequence')}}</div>
        <div style="flex:2">{{$t('realTimeFrequence')}}</div>
        <div style="flex:2">{{$t('utilizationRate')}}</div>
      </div>
      <div class="display table">
        <div class="cpuName">
          <div class="center">{{ cpuInfo.name }}</div>
        </div>
        <div class="cpuFrequence">
          <div class="center">{{ maxFrequence.toFixed(2) }}</div>
        </div>
        <div class="display" style="flex-wrap:wrap;flex:6">
          <div v-for="(item, index) in cpuInfo.details" :key="index" class="list">
            <div style="flex:1">CPU{{ index + 1 }}</div>
            <div style="flex:1">{{ (item.speed / 1000).toFixed(2) }}</div>
            <div style="flex:1">{{ (cpuUsedRate[index] * 100).toFixed(1) }}%</div>
          </div>
        </div>
      </div>
      <div class="list" style="borderTop:1px solid #ccc">
        <div style="flex:1"></div>
        <div style="flex:5">{{$t('avgUtilizationRate')}}</div>
        <div style="flex:2"></div>
        <div style="flex:2"></div>
        <div style="flex:2">{{ (cpuUsedRate[8] * 100).toFixed(1) }}%</div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "CPU",

  data() {
    return {
      // CPU信息
      cpuInfo: {
        execTime: [],
        idle: [],
        name: "",
        baseFraquence: "",
      },
      cpuUsedRate: [],
      cpuColor: [
        "red",
        "green",
        "orange",
        "yellow",
        "purple",
        "pink",
        "gray",
        "blue"
      ],
      maxFrequence: 0,

      resizeTable: null,
      timer: null,
    };
  },

  props: ["interval"],

  created() {
    this.getCPUInfo();
    this.getCPUInfo();
    this.getCPUMaxFrequence();

    this.timer = setInterval(() => {
      this.getCPUInfo();
    }, this.interval);
  },

  methods: {
    // 获取CPU信息
    getCPUInfo() {
      this.$store.dispatch("getCPUInfo");
      this.cpuInfo = this.$store.state.cpuInfo;
      this.cpuUsedRate = this.$store.state.cpuUsedRate;
      this.maxFrequence = this.$store.state.maxFrequence;
    },

    // 获取核心最大频率
    getCPUMaxFrequence() {
      this.$store.dispatch("getCPUMaxFrequence");
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

#cpu-header {
  background-color: #c93871;
}

#procs-header {
  background-color: #f88a1f;
}

.header {
  width: 100%;
  color: 11ee1e;
}

.list {
  display: flex;
  flex-direction: row;
  padding: 5px auto;
  margin: 5px auto;
  width: 100%;
  text-align: center;
}

.cpuName {
  position: relative;
  flex: 5;
  line-height: 100%;
  text-align: center;
}

.cpuFrequence {
  position: relative;
  flex: 2;
  line-height: 100%;
  text-align: center;
}

.center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.tableHead {
  display: flex;
  border-bottom: #ccc 1px solid;
  text-align: center;
}

.table {
  position: relative;
  align-items: stretch;
}
</style>
