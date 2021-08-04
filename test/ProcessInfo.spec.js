import { mount } from "@vue/test-utils";
import { expect } from "chai";
import Process from "../src/components/Process.vue";

describe("ProcessInfo", () => {
  const wrapper = mount(Process);

  for (let i = 0; i < 60; i++) {
    wrapper.vm.getProcessInfo();
  }
  const processInfo = wrapper.vm.process;

  // processCPU进程内存使用率
  it("Verify-processCPU", () => {
    for (const index in processInfo) {
      const { processCPU, } = processInfo[index];

      expect(processCPU * 1).to.be.most(100);
      expect(processCPU).not.to.be.equal(/\s*/g);
    }
  } );


  // processMem进程内存使用率
  it("Verify-processMem", () => {
    for (const index in processInfo) {
      const { processMem, } = processInfo[index];

      expect(processMem * 1).to.be.most(100);
      expect(processMem).not.to.be.equal(/\s*/g);
    }
  } );

  // processName进程名验证
  it("Verify-processName", () => {
    for (const index in processInfo) {
      const { processName, } = processInfo[index];

      expect(processName).not.to.be.equal(/\s*/g);
    }
  } );

  // STAT状态验证
  it("Verify-STAT", () => {
    for (const index in processInfo) {
      const { STAT, } = processInfo[index];

      expect(STAT).to.match(/[高低普通]/);
    }
  } );

  // START开始时间验证
  it("Verify-START", () => {
    for (const index in processInfo) {
      const { START, } = processInfo[index];

      expect(START).not.to.be.equal(/\s*/g);
    }
  } );

  // TIME运行时间验证
  it("Verify-TIME", () => {
    for (const index in processInfo) {
      const { TIME, } = processInfo[index];

      expect(TIME).not.to.be.equal(/\s*/g);
    }
  } );

  // COMMAND命令行验证
  it("Verify-COMMAND", () => {
    for (const index in processInfo) {
      const { COMMAND, } = processInfo[index];

      expect(COMMAND).not.to.be.equal(/\s*/g);
    }
  } );

  // PID验证
  it("Verify-PID", () => {
    for (const index in processInfo) {
      const { PID, } = processInfo[index];

      expect(PID).not.to.be.equal(/\s*/g);
    }
  } );
  wrapper.destroy();
} );
