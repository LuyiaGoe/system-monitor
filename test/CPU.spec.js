import { mount } from "@vue/test-utils";
import { expect } from "chai";
import CPU from "../src/components/PerformanceComponents/CPU.vue";
import CPULoad from "../src/components/PerformanceComponents/CPULoad.vue";

describe("CPU.vue", () => {
  // CPU
  describe("getCPUInfo", () => {
    const wrapper = mount(CPU);

    // CPU型号
    it("cpuName", async () => {
      for (let i = 0; i < 60; i++) {
        await wrapper.vm.getCPUInfo();
      }
      const { name, } = wrapper.vm.cpuInfo;

      expect(name).not.to.be.null;
    } );

    // CPU基本频率
    it("baseFraquence", () => {
      const { baseFraquence, } = wrapper.vm.cpuInfo;
      const result = baseFraquence.match(/\d+.\d+/g)[0] * 1;

      expect(result).to.be.above(0);
    } );

    // CPU最大频率
    it("maxFraquence", async () => {
      for (let i = 0; i < 60; i++) {
        await wrapper.vm.getCPUMaxFrequence();
      }
      const result = wrapper.vm.maxFrequence;

      expect(result).to.be.above(0);
    } );

    // CPU频率
    it("currentFrequence", () => {
      const result = wrapper.vm.cpuUsedRate;
      const max = wrapper.vm.maxFrequence;

      for (const index in result) {
        expect(result[index] ).to.be.least(0);
        expect(result[index] ).to.be.most(max);
      }
    } );

    // CPU使用率
    it("usedRate", async () => {
      const result = wrapper.vm.cpuUsedRate;

      for (const index in result) {
        expect(result[index] ).to.be.least(0);
        expect(result[index] ).to.be.most(1);
      }
    } );
    wrapper.destroy();
  } );

  describe("CPULoad", () => {
    const wrapper = mount(CPULoad);

    // CPU平均负载
    it("loadAverage", async () => {
      for (let i = 0; i < 60; i++) {
        await wrapper.vm.getCPULoadInfo();
      }

      const result = wrapper.vm.cpuLoadAverage;

      for (const index in result) {
        expect(result[index].data[0] ).to.be.above(0);
      }
    } );
    wrapper.destroy();
  } );
} );
