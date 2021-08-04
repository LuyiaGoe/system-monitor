<template>
  <div class="container">
    <!-- 进程表单 -->
    <ProcessTable :display="display" :search="search"></ProcessTable>

    <!-- 搜索框 -->
    <el-input
      class="input"
      v-model="search"
      size="medium"
      :placeholder="$t('keyWord')"
      @input="searchKey"
    />

    <!-- 分类框 -->
    <div class="neumorphism-toggle" @click="selectDropItem">
      <input id="switch" type="checkbox" checked />
      <label for="switch">
        <span></span>
        <div class="dot"></div>
        <span></span>
      </label>
    </div>
  </div>
</template>

<script>
import ProcessTable from "./ProcessComponents/ProcessTable.vue";

export default {
  components: { ProcessTable, },

  data() {
    return {
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
      timer: null,

      switchItem: "全部进程",
      title: "",
      PID: "",
      pName: "",
      command: "",
      start: "",
      time: "",

      search: "",
      searchTimer: null,
      select: null,
      category: null,
      display: null,

      type: true,
    };
  },

  created() {
    this.process = [];
    this.getProcessInfo();
    const { display, process, } = this.$store.state;

    if (display.length) {
      this.$store.commit("searchKey", {
        delay: 0,
        search: this.search,
      } );
      this.display = process;
    }
    this.timer = setInterval(this.getProcessInfo, 1500);
  },

  beforeDestroy() {
    clearInterval(this.timer);
  },

  methods: {
    // 选择分类
    selectDropItem(e) {
      if (e?.target.localName === "input") {
        this.switchItem =
          this.switchItem === "全部进程" ? "活动进程" : "全部进程";
        this.$store.commit("selectDropItem", this.switchItem);
        this.display = this.$store.state.display;
      }
    },

    // 搜索关键词
    searchKey() {
      this.$store.commit("searchKey", {
        delay: 200,
        search: this.search,
      } );
    },

    // 获取程序信息
    getProcessInfo() {
      this.$store.dispatch("getProcessInfo");
      this.display = this.$store.state.display;
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
}
.el-input {
  position: absolute;
  top: 22px;
  right: 20px;
  width: 30%;
  max-width: 300px;
  z-index: 101;
}

// toggle
.neumorphism-toggle {
  position: absolute;
  top: 25px;
  right: 35%;
  transition: transform 0.3s;
  z-index: 101;
  @media screen and (max-width: 500px) {
    display: none;
  }
  input {
    display: none;
    & + label {
      position: relative;
      display: block;
      background: #afb1b9;
      border-radius: 11px;
      width: 100px;
      height: 30px;
      cursor: pointer;
      &::before {
        position: absolute;
        content: '';
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        border-radius: inherit;
        background: #6d7277;
        opacity: var(--opacity, 0);
        transition: opacity 0.4s;
      }
      .dot {
        position: absolute;
        transform: translateX(var(--transform, 0));
        background-color: #fff;
        border-radius: inherit;
        top: 3px;
        left: 3px;
        width: 44px;
        height: 24px;
        transition: all 0.4s;
        z-index: 1;

        &::after {
          content: '';
          position: absolute;
          right: var(--move, 7px);
          top: 3px;
          border: 2px solid #afb1b9;
          border-radius: 50%;
          width: 14px;
          height: 14px;
          transition: all 0.4s;
        }
      }
      span {
        position: absolute;
        &::before {
          color: white;
          font-weight: 600;
          line-height: 28px;
        }
      }
      span:first-child {
        left: 20px;
        &::before {
          content: 'All';
          text-align: left;
          font-size: 12px;
        }
      }
      span:last-child {
        right: 10px;
        &::before {
          content: 'Active';
          text-align: right;
          font-size: 12px;
        }
      }
    }
    &:checked + label {
      --transform: 50px;
      --bgc: #333;
      --opacity: 1;
      --move: 19px;
    }
  }
}
.input {
  input {
    border: none !important;
  }
}
.el-popper {
  transform: translateY(-10px);
  width: 115px;
}
.popper__arrow {
  display: none !important;
}

.contextMenu {
  display: none;
  position: absolute;
  padding: 5px;
  top: 50px;
  left: 100px;
  background-color: #fff;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  width: 100px;

  div {
    margin: 5px auto;
    border-radius: 5px;
    padding: 5px;
    font-size: 16px;
    font-weight: 500;

    &:hover {
      background-color: #5f9fe9;
      color: white;
      cursor: pointer;
    }
  }
}

.disappear {
  display: none;
}
</style>
