<style lang="stylus" scoped>
.container
  position absolute
  top 70%
  left 0
  height 30%
  display flex
  flex-direction row
  flex-wrap nowrap
  padding: 2em
  min-width 100vw
  border-top 1px solid black
.content-container
  display flex
  flex-direction column
  justify-content space-evenly
  align-items stretch
  width 25vw
  max-height 100%
.card-drop
  height 100%
  background transparent
  border 2px dotted white
  font-size 2em
  color white
  width 80%
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
 width 100%
 max-width 100%
 text-align: center
 transform translate(-25vw,0)
 height 100%
 display flex
 flex-direction row
 align-items center
 justify-content center
 content: 'drop'
 color white
 font-size 2em
 border-radius 4px
 border 2px dotted white
.next-card-last .card-item:after
 position absolute
 top: 0px
 left: 50vw
 width 100%
 max-width 100%
 text-align: center
 transform translate(-25vw,0)
 height 100%
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
    v-touch-pan.horizontal.prevent.mouse="handleScroll"
  >
      <div
        class="content-container"
        v-for="(item, index) in items"
        :key="index"
      >
        <item-card
          class="card-item"
          v-if="typeof item.drop === 'undefined'"
          :item="item"
          :index="index"
          ref="card"
          :on-touch-end="onTouchEnd"
          :on-touch-start="onTouchStart"
          :onTouchMoveProps="onTouchMoveProps"
        />
        <q-card v-else class="card-drop" ref="card">
          <div class="text-drop">drop here</div>
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
  props: [
    'items',
    'onTouchEnd',
    'onTouchStart',
    'onTouchMoveProps'
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
