<template>
  <!-- CPU负载区域 -->
  <div>
    <div class="title">
      <span>{{$t('cpuLoadAvgInfo')}}：</span>
    </div>

    <el-card>
      <div class="legend">
        <div v-for="(item, index) in cpuColor" :key="index">
          <div
            class="block"
            :style="{
              backgroundColor: cpuColor[index],
            }"
            v-if="index < 3"
          ></div>
          <span id="cpuInfo" class="info" v-if="index == 0">1min</span>
          <span id="cpuInfo" class="info" v-if="index == 1">5min</span>
          <span id="cpuInfo" class="info" v-if="index == 2">15min</span>
        </div>
      </div>
      <!-- 负载图表 -->
      <div id="cpuTab"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "CPULoad",

  data() {
    return {
      // CPU信息
      cpuLoadAverage: [
        {
          data: new Array(60).fill(""),
          type: "line",
          symbol: "none",
          smooth: true,
        }
      ],
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
      // 用于CPUcanvas自适应
      cpuTab: null,

      resizeTable: null,
      timer: null,
    };
  },

  props: ["interval"],

  created() {
    this.getCPULoadInfo();

    this.resizeTable = (delay) => {
      let timer = null;

      return () => {
        if (!timer) {
          timer = setTimeout(() => {
            this.cpuTab && this.cpuTab.resize();
            timer = null;
          }, delay);
        }
      };
    };
    // 内存、CPU的canvas图表自适应
    if (!this.timer) {
      window.addEventListener("resize", this.resizeTable(100));
      window.addEventListener("click", this.resizeTable(0));
    }
    this.timer = setInterval(() => {
      this.getCPULoadInfo();
      this.cpuTab && this.drawTable();
    }, this.interval);
  },

  mounted() {
    this.drawTable();
  },

  methods: {
    // CPU图表
    drawTable() {
      if (!document.getElementById("cpuTab")) {
        return;
      };
      this.cpuTab = echarts.init(document.getElementById("cpuTab"));
      let option = {
        color: this.cpuColor,
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
        },
        series: [...this.cpuLoadAverage],
      };

      this.cpuTab.setOption(option);
    },

    // 获取CPU信息
    getCPULoadInfo() {
      this.$store.dispatch("getCPULoadInfo");
      this.cpuLoadAverage = this.$store.state.cpuLoadAverage;
    },
  },

  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>

<style lang="scss" scoped>
.title {
  margin-left: 20px;
  margin-bottom: 4px;
  font-weight: 600;
  color: #777;
}

.el-card {
  border-radius: 20px !important;
}

#load-header {
  background-color: #66c252;
}

.block {
  position: relative;
  display: inline-block;
  top:-4px;
  margin-right: 5px;
  border-radius: 1px;
  height: 2px;
  width: 30px;
}

#cpuTab {
  height: 200px;
  width: 100%;
}

.legend {
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-around;
}
</style>
