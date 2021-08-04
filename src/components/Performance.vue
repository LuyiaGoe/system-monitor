<template>
  <div id="countainer">
    <!-- 内存区域 -->
    <Mem :interval="interval" :class="!memShow ? 'disappear' : 'componentDisplay'"></Mem>

    <!-- CPU核心信息区域 -->
    <CPU :interval="interval" :class="!cpuShow ? 'disappear' : 'componentDisplay'"></CPU>

    <!-- CPU负载区域 -->
    <CPULoad :interval="interval" :class="!cpuLoadShow ? 'disappear' : 'componentDisplay'"></CPULoad>

    <!-- 进程线程图表 -->
    <PAT :interval="interval" :class="!PATShow ? 'disappear' : 'componentDisplay'"></PAT>

    <div ref="display" class="defaultDisplay">{{$t('none')}}</div>
  </div>
</template>

<script>
import Mem from "./PerformanceComponents/Memory.vue";
import CPU from "./PerformanceComponents/CPU.vue";
import CPULoad from "./PerformanceComponents/CPULoad.vue";
import PAT from "./PerformanceComponents/ProcessAndThreadNumber.vue";

export default {
  name: "Performance",
  components: {
    Mem,
    CPU,
    CPULoad,
    PAT,
  },
  props: ["memShow", "cpuShow", "cpuLoadShow", "PATShow"],
  data() {
    return {
      // 刷新时间 TODO: 使得刷新时间可控
      interval: 1000,
    };
  },

  created() {},

  methods: {
    displayBlock(command) {
      this[`${command}Show`] = !this[`${command}Show`];
    },

    defaultDisplay() {
      if (
        !this.memShow &&
        !this.cpuShow &&
        !this.cpuLoadShow &&
        !this.PATShow
      ) {
        this.$refs.display.style.display = "block";
      } else {
        this.$refs.display.style.display = "none";
      }
    },
  },

  watch: {
    memShow() {
      this.defaultDisplay();
    },

    PATShow() {
      this.defaultDisplay();
    },

    cpuLoadShow() {
      this.defaultDisplay();
    },

    cpuShow() {
      this.defaultDisplay();
    },
  },
};
</script>

<style lang="scss">
#countainer {
  overflow: auto;
  padding: 10px;
}

#countainer > div {
  margin-bottom: 15px;
  margin-top: 15px;
}

.el-icon-arrow-down {
  font-size: 12px;
}

.defaultDisplay {
  display: none;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: -1;
}

.disappear {
  opacity: 0;
  transform: translateY(-100px);
  height: 0;
  transition: opacity 0.2s, transform 0.2s, height 4s;
}

.componentDisplay {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.2s, transform 0.4s;
}
</style>
