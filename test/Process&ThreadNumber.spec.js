import { mount } from "@vue/test-utils";
import { expect } from "chai";
import Process from "../src/components/PerformanceComponents/Process&ThreadNumber.vue";

// 线程进程
describe("processes_threadsNumber", () => {
  const wrapper = mount(Process);

  // 进程
  it("process&threadNumber", async () => {
    await wrapper.vm.getProcessNumber();
    await wrapper.vm.getThreadNumber();
    const processArr = wrapper.vm.processArr;
    const threadArr = wrapper.vm.threadArr;

    expect(processArr[59] ).to.be.above(0);
    expect(threadArr[59] ).to.be.above(0);
    expect(processArr[59] ).to.be.most(threadArr[59] );
  } );
  wrapper.destroy();
} );
