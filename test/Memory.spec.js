import { mount } from "@vue/test-utils";
import { expect } from "chai";
import Mem from "../src/components/PerformanceComponents/Memory.vue";

describe("Memory.vue", () => {
  const wrapper = mount(Mem);

  // 已用内存
  it("memUsed", async () => {
    for (let i = 0; i < 61; i++) {
      await wrapper.vm.getMeminfo();
    }
    const result = wrapper.vm.memUsed * 1;
    const sum = wrapper.vm.totalmem * 1;

    expect(result).to.be.above(0);
    expect(result).to.be.below(sum);
  } );

  // 总内存
  it("totalmem", () => {
    const result = wrapper.vm.totalmem * 1;

    expect(result).to.be.above(0);
  } );

  // 总交换空间
  it("swapSum", () => {
    const result = wrapper.vm.swapSum * 1;

    expect(result).to.be.above(0);
  } );

  // 已用交换空间
  it("swapUsed", () => {
    const result = wrapper.vm.swapUsed * 1;
    const sum = wrapper.vm.swapSum * 1;

    expect(result).to.be.least(0);
    expect(result).to.be.below(sum);
  } );

  // 内存历史记录
  it("memTabArr", () => {
    const result = wrapper.vm.memTabArr;

    for (const index in result) {
      expect(result[index] ).to.be.above(0);
      expect(result[index] ).to.be.most(1);
    }
  } );

  // 交换空间历史记录
  it("memIO", () => {
    const result = wrapper.vm.memIO;

    for (const index in result) {
      expect(result[index] ).to.be.least(0);
      expect(result[index] ).to.be.most(1);
    }
  } );

  wrapper.destroy();
} );
