## 打开流程

### 运行

需要 node 环境:apt install nodejs npm,安装完后，在项目根目录下执行以下命令

1. npm i
2. node node.js
3. npm run serve

### build 项目后运行

1. npm run build
2. node node.js
3. 打开 dist/index.html

---

## Ver 0.1.0

1. 完成了初步功能的 demo
2. 实现有内存、CPU、进程线程数量的图表显示功能

---

## Ver 0.1.1

1. 添加了切换进程页面和性能页面功能
2. 性能页面添加了自定义显示功能
3. 进程页面显示用户的所有进程信息，显示信息：
   - 进程名称
   - 进程 ID
   - CPU 使用率
   - 内存使用率
   - 进程优先级
4. 修复 Echarts 图表重复绘图 bug

---

## Ver 0.1.2

1. 添加搜索功能
2. 添加分类功能
3. 添加右键控制进程功能，已完成：
   - 暂停
   - 继续运行
   - 杀死
   - 退出
4. 添加单击显示进程详情功能
5. 下阶段目标：
   - 添加右键调整优先度功能
   - 探索进程图标显示问题
   - UI 更新

---

## Ver 0.2.0

1. UI 更新
2. 完成右键调整优先度功能
3. 记录问题：

- 部分进程图标文件存在读取权限问题
- 未能找到图标文件中地址字段下的图标

4. 下阶段目标：

- 媒体查询适配，调整视图 bug
- 性能提升

## 思路

1. 界面参照 Linux 的 gnome-system-monitor，利用 vue 框架 + echarts 实现
2. 桌面端通过 node 获取系统资源信息，返回给上层应用

   - 利用 `child_process` 模块的 `execAsync` 执行 Linux 的命令
   - `free -k`获取内存信息
   - os.cpus 获取每个逻辑 CPU 内核的信息，再利用 `fs` 模块读取`/proc/stat`两个时间点的 CPU 快照信息，来计算使用率情况
   - os.loadAvg 获取 1、 5、 15min 时的 CPU 负载情况
   - `ps -N | wc -l`命令获取所有进程数量（不包含本命令）；`ps -NT | wc -l`命令获取所有进程数量
   - `ps -No [tableHead] | grep [user] | grep -v grep | awk '{print $[column],...}'`获取进程详细信息
   - `kill -SIG PID`控制进程

3. 利用 vue-test-utils、Mocha 测试框架和 Chai 断言库进行自动化测试
4. 进程页面显示用户进程，并利用 node 提供控制方法

- 桌面端提供右键菜单，显示各种控制功能

5. 性能页面显示终端的各种信息，并可以自定义显示

## TODO

1. webpack 管理资源(vue.config.js)

## Additional

1. 引入国际化资源控制，做好中英文切换功能
2. 应用性能监控（对首屏、刷新、帧率等）
3. 使用 babel 在 webpack 配置下生成不同版本的代码（测试、开发、生产）
4. system-monitor 取拿系统资源信息使用 callc、sysutils、ctypes 分别实现；（平板终端）
