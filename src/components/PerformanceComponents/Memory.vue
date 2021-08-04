<template>
  <!-- 内存区域 -->
  <div>
    <div class="title">
      <span>{{$t('memInfo')}}：</span>
    </div>
    <el-card>
      <!-- 内存图表 -->
      <div id="memTab"></div>

      <div class="divDisplay">
        <!-- 内存饼图 -->
        <div class="display">
          <div id="chartPie"></div>
          <p class="info">
            {{$t('memUsed')}}：{{ memUsed }}GiB/{{ totalmem }}GiB ({{
            memTabArr[59] ? (memTabArr[59] * 100).toFixed(2) : 0
            }}%)
          </p>
        </div>

        <!-- 交换空间饼图 -->
        <div class="display">
          <div id="chartPie1"></div>
          <p class="info">{{$t('swapUsed')}}：{{ swapUsed }}GiB/{{ swapSum }}GiB</p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "Memory",

  data() {
    return {
      // 内存信息
      memUsed: 0,
      totalmem: 0,
      memTabArr: "",
      memIO: "",
      swapUsed: 0,
      swapSum: 0,
      // 存放内存动态canvas的DOM，用与自适应
      memTab: null,

      resizeTable: null,
      timer: null,
    };
  },

  props: ["interval"],

  created() {
    this.getMeminfo();

    this.resizeTable = (delay) => {
      let timer = null;

      return () => {
        if (!timer) {
          timer = setTimeout(() => {
            this.memTab && this.memTab.resize();
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
      this.getMeminfo();
      this.drawPieChart();
      this.drawTable();
    }, this.interval);
  },

  mounted() {
    this.drawPieChart();
    this.drawTable();
  },

  methods: {
    // 内存饼状图
    drawPieChart() {
      if (!document.getElementById("chartPie")) {
        return;
      };
      this.chartPie = echarts.init(document.getElementById("chartPie"));
      let option = {
        color: ["red", "#ccc"],
        animation: false,
        series: [
          {
            type: "pie",
            radius: ["20%", "70%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "40",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              { value: this.memUsed, },
              { value: this.totalmem - this.memUsed, }
            ],
          }
        ],
      };

      this.chartPie.setOption(option);
      this.chartPie1 = echarts.init(document.getElementById("chartPie1"));
      let option1 = option;

      option1.color = ["green", "#ccc"];
      option1.series[0].data[0] = { value: this.memIO[59], };
      option1.series[0].data[1] = { value: this.swapSum - this.memIO[59], };
      this.chartPie1.setOption(option);
    },

    // 内存图表
    drawTable() {
      if (!document.getElementById("chartPie")) {
        return;
      };
      this.memTab = echarts.init(document.getElementById("memTab"));
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
          min: 0,
          max: 1,
          position: "right",
          interval: 0.5,
          axisLabel: {
            formatter: function (value) {
              let texts = [];

              if (value == 0) {
                texts.push("0");
              } else if (value <= 0.5) {
                texts.push("50%");
              } else if (value <= 1) {
                texts.push("100%");
              }
              return texts;
            },
          },
        },
        series: [
          {
            type: "line",
            symbol: "none",
            smooth: true,
            data: [...this.memTabArr],
          },
          {
            type: "line",
            symbol: "none",
            smooth: true,
            data: [...this.memIO],
          }
        ],
      };

      this.memTab.setOption(option);
    },

    // 内存信息获取
    getMeminfo() {
      this.$store.dispatch("getMemInfo");

      // 内存信息
      this.memUsed = this.$store.state.memUsed;
      this.totalmem = this.$store.state.totalmem;
      this.memTabArr = this.$store.state.memTabArr;
      this.memIO = this.$store.state.memIO;
      this.swapUsed = this.$store.state.swapUsed;
      this.swapSum = this.$store.state.swapSum;
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

.divDisplay {
  display: flex;
  justify-content: space-around;
  @media screen and (max-width: 550px) {
    display: block;
  }
}

.el-card {
  border-radius: 20px !important;
}

#mem-header {
  background-color: #4a97cc;
}

#chartPie,
#chartPie1 {
  width: 50px;
  height: 50px;
  padding: 5px;
  border-radius: 50%;
}

.info {
  margin: 0;
  height: 60px;
  line-height: 60px;
}

#memTab {
  height: 200px;
  width: 100%;
}
</style>
