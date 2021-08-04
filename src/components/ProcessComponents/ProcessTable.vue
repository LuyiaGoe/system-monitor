<template>
  <!-- TODO: 右键菜单存在时，应先取消菜单，再单击才弹出进程详情对话框 -->
  <div class="container" @click="show" @contextmenu.prevent>
    <!-- 进程表单 -->
    <el-table
      :data="display"
      stripe
      height="100%"
      style="width: 100%"
      highlight-current-row
      @row-click="showDetail"
      @row-contextmenu="showContextMenu"
    >
      <el-table-column type="index"></el-table-column>

      <el-table-column :label="$t('processName')" class="processName">
        <template slot-scope="scope">
          <span class="stopTag" v-if="scope.row.state.includes('T')">({{$t('stoped')}})</span>
          <span class="processName" style="margin-left: 10px">
            {{
            scope.row.processName
            }}
          </span>
        </template>
      </el-table-column>

      <el-table-column prop="PID" sortable label="PID" width="200px" align="center"></el-table-column>

      <el-table-column prop="processCPU" :label="$t('cpuRate')" width="200" align="center" sortable></el-table-column>

      <el-table-column prop="processMem" :label="$t('memRate')" width="200" align="center" sortable></el-table-column>

      <el-table-column prop="STAT" :label="$t('priority')" width="200" align="center"></el-table-column>
    </el-table>

    <!-- 进程详情 弹出对话框 -->
    <el-dialog :title="title" :visible.sync="centerDialogVisible" width="500px" center>
      <div class="dialogContainer">
        <div class="item label">
          <span>PID:</span>
          <span>{{$t('processName')}}:</span>
          <span>{{$t('command')}}:</span>
          <span>{{$t('start')}}:</span>
          <span>{{$t('usertime')}}:</span>
        </div>

        <div class="item text">
          <span>{{ PID }}</span>
          <span>{{ pName }}</span>
          <span>{{ command }}</span>
          <span>{{ start }}</span>
          <span>{{ time }}</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="centerDialogVisible = false">{{$t('ok')}}</el-button>
      </span>
    </el-dialog>

    <!-- 右键菜单 -->
    <ContextMenu ref="contextMenu" v-if="menuFlag" :PID="PID" :nice="nice" :NAME="pName"></ContextMenu>
  </div>
</template>

<script>
import ContextMenu from "./ContextMenu.vue";

export default {
  components: { ContextMenu, },
  props: ["display", "search"],

  data() {
    return {
      iconPath: "/usr/share/applications/firefox.desktop",

      title: "",
      centerDialogVisible: false,

      PID: "",
      pName: "",
      command: "",
      start: "",
      time: "",
      nice: "",

      menuFlag: true,
    };
  },

  created() {},

  methods: {
    show() {
      this.menuFlag = false;
    },
    // 进程弹出框详情
    showDetail(e) {
      this.title = e.processName;
      this.PID = e.PID;
      this.pName = e.processName;
      this.start = e.START;
      this.time = e.TIME;
      this.command = e.commandAll;
      this.centerDialogVisible = !this.centerDialogVisible;
    },

    // 右键弹出框
    showContextMenu(element, f, mouse) {
      this.PID = element.PID;
      this.nice = element.nice;
      this.pName = element.processName;
      this.$refs.contextMenu.$el.firstChild.style.left = mouse.clientX + "px";
      this.$refs.contextMenu.$el.firstChild.style.top = mouse.clientY + "px";
      this.$refs.contextMenu.$el.firstChild.style.display = "block";
    },
  },

  updated() {
    this.menuFlag = true;
  },

  watch: {
    search(n, o) {
      if (n !== o) {
        this.$refs.contextMenu.$el.firstChild.style.display = "none";
        this.menuFlag = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
}

.stopTag {
  margin-left: 10px;
  margin-right: -10px;
}

.processName {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dialogContainer {
  display: flex;
  margin: 20px 40px 0;
  font-size: 16px;

  .item {
    display: flex;
    flex-direction: column;
    color: black;

    span {
      display: inline-block;
      max-width: 240px;
      margin-bottom: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .label {
    flex: 1;
    margin-right: 10px;
  }
  .text {
    flex: 2;
  }
}
</style>
