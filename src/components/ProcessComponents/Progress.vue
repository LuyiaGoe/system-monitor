<template>
  <div class="container" ref="container">
    <div>
      <div class="progressBar" ref="bar"></div>
      <div class="button" ref="button"></div>
      <div class="block"></div>
      <div class="colorBar" ref="colorBar"></div>
    </div>

    <!-- 数字显示 -->
    <div>
      <div class="number">{{ nice }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["nice"],
  data() {
    return {
      clickPoint: 0,
      stab: 0,
      length: 0,
      left: void 0,
      right: void 0,
      moveFlag: false,
    };
  },

  mounted() {
    this.$refs.button.addEventListener("mousedown", (e) => {
      this.clickPoint = e.clientX;
      this.stab = this.$refs.button.offsetLeft;
      this.moveFlag = true;
      this.length = this.$refs.bar.clientWidth;
    } );
    this.$refs.container.addEventListener("mousemove", (e) => {
      if (this.moveFlag) {
        let move = e.clientX - this.clickPoint;

        if (Math.abs(move) >= this.length / 2) {
          return;
        };

        // 按钮移动
        this.$refs.button.style.left = this.stab + move + "px";

        // 进度条
        let { style, } = this.$refs.colorBar;

        if (this.stab + move <= this.length / 2) {
          style.left = this.stab + move + "px";
          style.right = this.length / 2;
        } else {
          style.right = this.stab + move + "px";
          style.left = this.length / 2;
        }
      }
    } );
    // window.addEventListener('mouseup', () => {
    //   this.moveFlag = false
    // })
  },

  method: {},
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;

  div:first-child {
    position: relative;
    box-sizing: border-box;
    flex: 1;
    padding: 5px;

    .progressBar {
      margin-top: 3px;
      border-radius: 5px;
      background-color: #ddd;
      width: 100%;
      z-index: 1;
    }

    .colorBar {
      position: absolute;
      top: 8px;
      left: 50%;
      right: 50%;
      background-color: rgb(206, 134, 134);
      border-radius: 0;
      height: 10px;
      z-index: 2;
    }

    .button {
      position: absolute;
      top: 5px;
      left: 50%;
      transform: translateX(-50%);
      height: 15px;
      width: 15px;
      border-radius: 50%;
      background-color: red;
      z-index: 3;
      cursor: pointer;
    }
  }

  div:last-child {
    .number {
      width: 50px;
      border: none;
      text-align: center;
    }
  }
}
</style>
