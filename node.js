const express = require("express");
// node调用系统命令接口
const exec = require("child_process").execSync;
const exe = require("child_process").exec;
const fs = require("fs");
// 调用系统信息
const os = require("os");
const app = express();

// 执行系统命令，并将返回的ArrayBuffer转换为String字符串
const execBufferToString = (command) => {
  const result = exec(command);

  return String.fromCharCode.apply(null, new Uint16Array(result));
};

// 跨域头
app.all("*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
} );

// 内存信息
app.get("/memInfo", function (req, res) {
  // 执行Linux的 free -k 命令并输出结果
  const result = execBufferToString("free -k");

  res.end(result);
} );

// CPU信息,包括:
// 核心型号model、数量.length、基本频率model、实时频率speed、CPU各核的各类运行时间times
app.get("/cpuInfo", (req, res) => {
  // 获得CPU核心快照的二维数组
  function getCPUSnapshot() {
    // 读取CPU运行时间文件，返回一个ArrayBuffer数据
    let data = fs.readFileSync("/proc/stat");

    data = String.fromCharCode.apply(null, new Uint16Array(data));
    data = data.split("intr")[0].split(/\n/g);
    data.pop();

    const cpuSnapshot = data.map((item, index) => {
      const arr = item.split(" ");

      index === 0 ? arr.shift() : "";
      arr.shift();
      return arr;
    } );

    return cpuSnapshot;
  }

  const cpuInfo = {
    // CPU核心信息
    cpuDetails: JSON.stringify(os.cpus()),
    // 本次CPU运行时间快照，用于计算使用率
    snapshot: getCPUSnapshot(),
    // CPU负载，返回一个数组，分别是1min 5min 15min的CPU平均负载
    cpuLoadAvg: os.loadavg(),
  };

  res.end(JSON.stringify(cpuInfo));
} );

// 核心最大频率
app.get("/cpuMaxFrequence", (req, res) => {
  const result = execBufferToString("cat /sys/devices/system/cpu/cpu4/cpufreq/cpuinfo_max_freq");

  res.end(result);
} );

// 进程数
app.get("/processNumber", (req, res) => {
  const result = execBufferToString("ps -N | wc -l");

  res.end(result);
} );

// 线程数
app.get("/threadNumber", (req, res) => {
  const result = execBufferToString("ps -NT | wc -l");

  res.end(result);
} );

// 发送进程信号
app.get("/setSIG", (req, res) => {
  const { SIG, PID, } = req.query;

  try {
    execBufferToString(`kill -${SIG} ${PID}`);
  } catch (error) {
    res.end(error);
  }
} );

// 获取所有进程信息
app.get("/getProcessInfo", (req, res) => {
  // 获取用户的进程ID
  const getUserProcessPID = () => {
    let name = execBufferToString("whoami");

    if (name.length > 7) {
      name = name.slice(0, 7) + "+";
    }
    return execBufferToString(`ps  -No user,pid,%cpu,%mem,vsz,rss,tty,stat,lstart,time,nice,command | grep ${name} | grep -v grep | awk '{print $2,$3,$4,$8,$10,$11,$12,$13,$14,$15,$16,$17,$18}'`).split(/\n/g);
  };

  const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // 通过用户进程ID获取进程信息
  const getProcessInfo = () => {
    const PIDArray = getUserProcessPID();

    PIDArray.pop();
    const arr = [];

    for (const index in PIDArray) {
      let [PID, processCPU, processMem, STAT, STARTMonth, STARTDate, STARTTime, STARTYear, TIME, nice, COMMAND, option] = PIDArray[index].split(" ");

      STARTMonth = month.findIndex((item) => {
        return item == STARTMonth;
      } ) + 1;
      const commandArr = COMMAND.split(" ")[0].split("/");
      const processName = commandArr[commandArr.length - 1];
      const state = STAT;

      if (state.includes("Z")) {
        continue;
      } else if (STAT.includes("<")) {
        STAT = "↑";
      } else if (STAT.includes("N")) {
        STAT = "↓";
      } else {
        STAT = "—";
      }
      const obj = {
        PID: PID * 1,
        processCPU: processCPU * 1,
        processMem: processMem * 1,
        processName,
        state,
        STAT,
        START: `${STARTYear}-${STARTMonth}-${STARTDate} ${STARTTime}`,
        TIME,
        COMMAND,
        commandAll: `${COMMAND}  ${option}`,
        nice: nice * 1,
      };

      arr.push(obj);
    }
    return arr;
  };
  const result = JSON.stringify(getProcessInfo());

  res.end(result);
} );


let password = void 0;

// 修改进程的优先度
app.get("/changePrioriy", (req, res) => {
  const { PID, } = req.query;
  const { priority, } = req.query;
  const { password: psd, } = req.query;

  if (!password || password === psd) {
    exe(`echo '${psd}' | sudo -S renice ${priority} ${PID}`, (err) => {
      if (err) {
        res.end("wrong");
      } else {
        password = psd;
        res.end("correct");
      }
    } );
  } else {
    res.end("wrong");
  }
} );

app.listen(6001, function () {
  console.log("port : 6001");
} );
