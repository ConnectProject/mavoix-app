<style lang="stylus" scoped>
.container
  position absolute
  left 0
  display flex
  flex-direction row
  flex-wrap nowrap
  min-width 100vw
  border-top 1px solid black
  bottom: 0px
.content-container
  display flex
  flex-direction column
  justify-content space-evenly
  align-items stretch
  max-height 100%
.card-drop
  height 100%
  margin 10%
  background transparent
  border 2px dotted white
  font-size 2em
  color white
  position relative
.text-drop
  position absolute
  top 0
  bottom 0
  margin auto
  left 0
  right 0
  height fit-content
  width fit-content
.next-card
 transform none !important
 position relative
.card-item
 position relative
.next-card .card-item:after
 position absolute
 top: 0px
 left: 0px
 width 80%
 max-width 80%
 text-align: center
 height 80%
 display flex
 flex-direction row
 align-items center
 justify-content center
 margin: 10%
 content: 'drop'
 color white
 font-size 2em
 border-radius 4px
 border 2px dotted white
.next-card-last .card-item:after
 position absolute
 top: 0px
 width 80%
 margin: 10%
 max-width 80%
 text-align: center
 height 80%
 display flex
 flex-direction row
 align-items center
 justify-content center
 content: 'drop'
 color white
 font-size 2em
 border-radius 4px
 border 2px dotted white
</style>

<template>
  <div
    ref="container"
    class="container"
    :style="{height: rowHeight + 'px'}"
    v-touch-pan.horizontal.prevent.mouse="handleScroll"
  >
      <div
        class="content-container"
        :style="{width: columnWidth + 'px'}"
        v-for="(item, index) in items"
        :key="index"
      >
        <item-card
          class="card-item"
          v-if="typeof item.drop === 'undefined'"
          :item="item"
          :index="index"
          :rowHeight='rowHeight'
          :columnWidth='columnWidth'
          ref="card"
          :on-touch-end="onTouchEnd"
          :on-touch-start="onTouchStart"
          :onTouchMoveProps="onTouchMoveProps"
        />
        <q-card v-else class="card-drop" ref="card">
          <div class="text-drop">drop</div>
        </q-card>
      </div>
  </div>
</template>

<script>
import ItemCard from './ItemCard'

export default {
  name: 'ActiveItems',
  components: {
    ItemCard
  },
  data () {
    return {
      lastX: 0
    }
  },
  mounted () {
    console.log(this.columnWidth)
    document.styleSheets[0].addRule('.card-item:after', 'transform: translate(-' + this.columnWidth + 'px,0)')
    document.styleSheets[0].addRule('.next-card-last .card-item:after', 'left: ' + 2 * this.columnWidth + 'px')
  },
  props: [
    'items',
    'onTouchEnd',
    'onTouchStart',
    'onTouchMoveProps',
    'rowHeight',
    'columnWidth',
    'rows'
  ],
  methods: {
    /**
     * Handle horizontal scroll
     */
    handleScroll ({ offset, isFinal }) {
      let container = this.$refs.container
      let translateVal = Math.min(0, Math.max(offset.x + this.lastX, -(container.clientWidth - window.innerWidth)))

      if (isFinal) {
        this.lastX = translateVal
      }
      container.style.transform = `translateX(${translateVal}px)`
    }
  }
}
</script>
