<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span
        class="dot"
        v-for="(item,index) in dots"
        :key="index"
        :class="{active: currentPageIndex === index}"
      ></span>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import {addClass} from 'common/js/dom'

export default {
  data() {
    return {
      dots: [],
      currentPageIndex: 0
    }
  },
  props: {
    loop: { // 是否循环轮播
      type: Boolean,
      default: true
    },
    autoPlay: { // 是否自动轮播
      type: Boolean,
      default: true
    },
    interval: { // 滚动时间间隔
      type: Number,
      default: 4000
    }
  },
  mounted() {
    setTimeout(() => {
      this._setSliderWidth()
      this._initDots()
      this._initSlider()

      if (this.autoPlay) {
        this._play()
      }
    }, 20)

    window.addEventListener('resize', () => {
      // 使该方法执行次数减少，优化性能
      clearTimeout(this.resizeTimer)
      this.resizeTimer = setTimeout(() => {
        this._setSliderWidth(true)
        this.slider.refresh()
      }, 60)
    })
  },
  methods: {
    // 设置轮播图的宽度
    _setSliderWidth(isResize) {
      // 获取 sliderGroup 内的所有子元素
      this.children = this.$refs.sliderGroup.children

      // 初始化轮播图宽度
      let width = 0
      // 获取父级的当前宽度
      let sliderWidth = this.$refs.slider.clientWidth

      // 给每个子元素添加class 并计算总宽度和设置他们的宽度
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i]
        addClass(child, 'slider-item')

        child.style.width = sliderWidth + 'px'
        width += sliderWidth
      }

      // 如果是循环无缝轮播则要多计算两张图的宽度
      if (this.loop && !isResize) { // 窗口大小改变的时候子元素已经多渲染了两个 不需要在计算多余的那两个的宽度
        width += 2 * sliderWidth
      }
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    // 初始化dots
    _initDots() {
      this.dots = new Array(this.children.length)
    },
    // 初始化轮播图
    _initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false, // 惯性
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        },
        click: true
      })

      // 监听滚动结束的事件
      this.slider.on('scrollEnd', () => {
        // 获取滚动结束时的index
        let pageIndex = this.slider.getCurrentPage().pageX
        this.currentPageIndex = pageIndex

        if (this.autoPlay) {
          clearTimeout(this.timer)
          this._play()
        }
      })
    },
    _play() {
      this.timer = setTimeout(() => {
        // this.slider.goToPage(pageIndex, 0, 400)
        this.slider.next()
      }, this.interval)
    }
  },
  destroyed() {
    clearTimeout(this.timer)
  }
}
</script>

<style  lang="stylus" scoped>
@import "~common/stylus/variable"

.slider
  min-height: 1px
  .slider-group
    position: relative
    overflow: hidden
    white-space: nowrap
    .slider-item
      float: left
      box-sizing: border-box
      overflow: hidden
      text-align: center
      a
        display: block
        width: 100%
        overflow: hidden
        text-decoration: none
      img
        display: block
        width: 100%
  .dots
    position: absolute
    right: 0
    left: 0
    bottom: 12px
    text-align: center
    font-size: 0
    .dot
      display: inline-block
      margin: 0 4px
      width: 8px
      height: 8px
      border-radius: 50%
      background: $color-text-l
      &.active
        width: 20px
        border-radius: 5px
        background: $color-text-ll
</style>