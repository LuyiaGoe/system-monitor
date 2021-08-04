<template>
  <div @click.stop>
    <div class="contextMenu" ref="div" @click="handleProcess">
      <div data-tag="STOP">{{$t('TSTP')}}</div>
      <div data-tag="CONT">{{$t('CONT')}}</div>
      <div data-tag="TERM">{{$t('TERM')}}</div>
      <div data-tag="KILL">{{$t('KILL')}}</div>
      <div ref="ChangePriority" data-tag="ChangePriority">{{$t('changePriority')}}&nbsp;&nbsp;></div>
      <div class="secondaryContext" ref="second" @click.stop="selectPriority">
        <div data-tag="-10">{{$t('higher')}}</div>
        <div data-tag="-3">{{$t('high')}}</div>
        <div data-tag="0">{{$t('normal')}}</div>
        <div data-tag="3">{{$t('low')}}</div>
        <div data-tag="10">{{$t('lower')}}</div>
      </div>
    </div>

    <!-- 杀死、结束进程警示 -->
    <el-dialog width="600px" :title="title" :visible.sync="centerDialogVisible" center>
      <div>{{$t('warn')}}</div>
      <div>{{$t('query')}}</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">{{$t('cancel')}}</el-button>
        <el-button type="danger" @click="kill">{{$t('confirm')}}</el-button>
      </span>
    </el-dialog>

    <!-- 验证身份弹窗 -->
    <el-dialog
      width="600px"
      :title="$t('authentication')"
      :visible.sync="verifyVisible"
      center
      destroy-on-close
    >
      <div class="tip">{{$t('rootAuthorization')}}</div>
      <div>
        <el-input show-password v-model="password" class="input"></el-input>
      </div>
      <div ref="error" class="error">{{$t('passwordError')}}</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="verifyVisible = false">{{$t('cancel')}}</el-button>
        <el-button type="danger" @click="changePriority">{{$t('confirm')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
export default {
  props: ["PID", "NAME", "nice"],
  data() {
    return {
      centerDialogVisible: false,
      title: "",

      priorityNumber: 0,

      verifyVisible: false,
      verifyTitle: "",
      password: "",
      timer: null,
    };
  },

  mounted() {
    // 改变优先级弹出菜单
    this.$refs.ChangePriority.addEventListener("mouseover", () => {
      this.$refs.second.style.display = "block";
      this.$refs.second.style.left = this.$refs.div.offsetWidth + 2 + "px";
    } );
  },
  methods: {
    // 选择优先度
    selectPriority(e) {
      const priority = e.target.attributes["data-tag"]?.value;

      // 因为阻止了冒泡，此处单独取消右键菜单显示
      if (priority === undefined) {
        return;
      }
      this.$refs.second.style.display = "none";
      if (typeof (priority * 1) === "number") {
        this.$refs.div.style.display = "none";
        this.priorityNumber = priority;
        this.verifyVisible = true;
      }
    },

    // 改变优先度
    changePriority() {
      this.$store.dispatch("changePriority", {
        priorityNumber: this.priorityNumber,
        PID: this.PID,
        password: this.password,
      } );
      this.timer = setTimeout(() => {
        this.verifyVisible = this.$store.state.verifyVisible;
        if (this.verifyVisible) {
          this.$refs.error.style.display = "block";
        }
        this.timer = null;
      }, 100);
    },

    // 操作菜单
    handleProcess(e) {
      const SIG = e.target.attributes["data-tag"]?.value;

      if (SIG === "ChangePriority") {
        return;
      };
      this.$refs.div.style.display = "none";
      this.$refs.second.style.display = "none";
      if (SIG === "KILL" || SIG === "TERM") {
        let op = SIG === "KILL" ? `${this.$t("kill")}` : `${this.$t("terminate")}`;

        this.title = op + `${this.$t("process")} "${this.NAME}" (PID:${this.PID})`;
        this.centerDialogVisible = !this.centerDialogVisible;
        return;
      }
      let req = axios.get("http://localhost:6001/setSIG", {
        params: { SIG,
          PID: this.PID, },
      } );

      return req;
    },

    // 杀死/结束进程
    kill() {
      // TODO: slice截取字符数量
      const SIG = this.title.slice(0, 2) == "杀死" ? "KILL" : "TERM";
      let req = axios.get("http://localhost:6001/setSIG", {
        params: { SIG,
          PID: this.PID, },
      } );

      return req;
    },
  },

  watch: {
    verifyVisible(n) {
      if (!n) {
        this.password = "";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.contextMenu {
  display: none;
  position: absolute;
  padding: 5px;
  top: 50px;
  left: 100px;
  background-color: #fff;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
  border-radius: 5px;

  div {
    margin: 5px auto;
    border-radius: 5px;
    padding: 5px;
    font-size: 16px;
    font-weight: 500;
  }

  & > :hover,
  div div:hover {
    background-color: #5f9fe9;
    color: white;
    cursor: pointer;
  }
  div div {
    color: black;
  }

  .secondaryContext {
    display: none;
    position: absolute;
    bottom: -170px;
    background-color: #fff;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
    width: 100px;
  }
}

.dialogContainer {
  display: flex;
  div:first-child {
    width: 70px;
  }
  div:last-child {
    flex: 1;
  }
  input {
    border-radius: 50% !important;
    width: 50% !important;
    text-align: center !important;
  }
}

.error {
  display: none;
  margin-left: 100px;
  color: red;
}

.tip {
  margin-top: -20px;
  margin-bottom: 10px;
  text-align: center;
  color: black;
  font-size: 15px;
}
</style>
