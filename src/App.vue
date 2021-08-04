<template>
  <div id="app">
    <div class="menu">
      <!-- 功能切换 -->
      <div class="slotSelect slotTab" @click="routerSelect">
        <div ref="process" data-router="process" class="slotIn">{{$t('process')}}</div>
        <div ref="performance" data-router="performance" class="slotOut">{{$t('performance')}}</div>
      </div>

      <!-- 自定义显示 -->
      <div class="slotSelect" @click="displayBlock" v-show="flag">
        <div data-tag="mem" class="slotIn">{{$t('mem')}}</div>
        <div data-tag="cpu" class="slotIn">{{$t('cpuInfo')}}</div>
        <div data-tag="cpuLoad" class="slotIn">{{$t('cpuLoad')}}</div>
        <!-- TODO: 超长了 -->
        <div data-tag="PAT" class="slotIn">{{$t('PAT')}}</div>
      </div>
    </div>

    <!-- 显示区域 -->
    <router-view
      class="context"
      :memShow="memShow"
      :cpuShow="cpuShow"
      :cpuLoadShow="cpuLoadShow"
      :PATShow="PATShow"
    ></router-view>

    <!-- 语言切换 -->
    <!-- TODO： 点击切换时会切换成英语 -->
    <div class="switchLanguage">
      <input type="checkbox" id="switchL" />
      <label for="switchL" class="switchLabel">
        <div class="displayLanguage">
          <div>{{language}}</div>
        </div>
        <div class="selectLanguage" @click="changeLanguage">
          <div class="en">English</div>
          <div class="zh">中文</div>
        </div>
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      activeIndex: "",
      flag: false,

      memShow: true,
      cpuShow: true,
      cpuLoadShow: true,
      PATShow: true,

      language: "中文",
    };
  },
  created() {
    this.activeIndex = this.$route.path.match(/\w+/g)[0];
    // 阻止右键
    // window.addEventListener('contextmenu', (event) => {
    //   event.preventDefault()
    // })
  },

  mounted() {
    this.flag = this.activeIndex === "performance" ? true : false;
    if (this.flag) {
      this.$refs.performance.className = "slotIn";
      this.$refs.process.className = "slotOut";
    } else {
      this.$refs.performance.className = "slotOut";
      this.$refs.process.className = "slotIn";
    }
  },

  methods: {
    // 路由跳转
    routerSelect(e) {
      if (e.target.attributes["data-router"] ) {
        const router = e.target.attributes["data-router"].value;

        if (this.$route.name !== router) {
          this.$router.push(`/${router}`);
          this.flag = router === "performance" ? true : false;
        }
        if (this.flag) {
          this.$refs.performance.className = "slotIn";
          this.$refs.process.className = "slotOut";
        } else {
          this.$refs.performance.className = "slotOut";
          this.$refs.process.className = "slotIn";
        }
      }
    },

    // 更改每个功能模块的显示状态，如 memShow = ！memShow
    displayBlock(e) {
      if (e.target.attributes["data-tag"] ) {
        const tag = e.target.attributes["data-tag"].value;

        this[`${tag}Show`] = !this[`${tag}Show`];
        if (this[`${tag}Show`] ) {
          e.target.className = "slotIn";
        } else {
          e.target.className = "slotOut";
        }
      }
    },

    // 切换语言
    changeLanguage(e) {
      const lang = e.target.className;

      console.log(lang);
      localStorage.setItem("locale", lang);
      this.$i18n.locale = lang;
    },
  },
};
</script>

<style lang="scss">
body,
#app,
.context,
.menu {
  font-size: 0.9rem;
  padding: 0;
  margin: 0;
  height: 100%;
  overflow: hidden;
}
body {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
}
#app {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.menu {
  position: fixed;
  display: flex;
  justify-content: space-between;
  padding-bottom: 15px;
  padding-top: 15px;
  background-color: #eee !important;
  border-bottom: 1px solid #ececec;
  box-shadow: 0 4px 11px #ccc;
  width: 100%;
  height: 40px;
  color: #333;
  font-weight: 600;
  z-index: 100;

  .slotSelect {
    position: absolute;
    display: flex;
    right: 10px;
    background-color: #eee;
    border-radius: 11px;
    height: 40px;
    width: 420px;
    text-align: center;
    line-height: 40px;
    font-size: 15px;

    div {
      width: 25%;
      height: 100%;
      cursor: pointer;
    }

    div:first-child {
      border-radius: 11px 0 0 11px;
    }

    div:last-child {
      margin-right: 0;
      border-radius: 0 11px 11px 0;
    }

    .slotIn {
      background-color: #ececec;
      box-shadow: inset 0px 5px 11px #d9d9d9, inset -0px -5px 11px #ffffff;
    }

    .slotOut {
      background-color: #ececec;
      box-shadow: 5px 5px 11px #bebebe, -0px -5px 8px #ffffff;
    }
  }

  .slotTab {
    left: 10px;
    right: inherit;
    width: 210px;

    div {
      width: 50%;
    }
  }
}

.context {
  flex: 1;
  padding-top: 70px !important;
  box-sizing: border-box;
  height: 100%;
}

label {
  display: inline-block;
  margin-bottom: 15px;
}

.header {
  width: 100%;
  color: 11ee1e;
}

.display {
  display: flex;
  justify-content: space-around;
}

.popper__arrow {
  display: none !important;
}
// 表单单元格
.cell {
  white-space: nowrap !important;
}

.switchLanguage {
  position: absolute;
  bottom: 10px;
  right: -125px;
  height: 20px;
  transition: all 0.4s;
  &:hover {
    right: -50px;
    --display: 1;
    --height: 59px
  }
  #switchL {
    display: none;

    & + .switchLabel {
      display: inline-block;
      cursor: pointer;
      user-select: none;

      & > div {
        position: absolute;
        right: 0;
        bottom: 0;
        width: var(--width, 70px);
        height: var(--heightChecked, 25px);
        background-color: #fff;
        text-align: center;
        line-height: 25px;
        transition: all 0.4s;
        overflow: hidden;
      }
      .selectLanguage {
        background-color: #fff;
        box-shadow: -3px 0px 5px #ccc;
        border-radius: 10px 0 0 10px;
        width: 150px;
        opacity: var(--selectOp, 0);
        z-index: var(--index, 0);
        div {
          margin: 3px;
          border-radius: 10px;
          width: 100px;
        }
        div:hover {
          background-color: #ccc;
        }
      }
      .displayLanguage {
        background-color: #fff;
        box-shadow: -3px 0px 5px #ccc;
        border-radius: 10px;
        width: 150px;
        z-index: 1;
        div {
          width: 100px;
        }
      }
    }
    &:checked {
      & + .switchLabel {
        --heightChecked: var(--height, 25px);
        --selectOp: var(--display, 0);
        --index: 2;
      }
    }
  }
}
</style>
