<style lang="stylus" scoped>
.container
  position absolute
  left 0
  display flex
  flex-direction row
  flex-wrap nowrap
  min-width 100vw
  border-top 1px solid black
  bottom 0px
  height 12rem
.content-container
  display flex
  flex-direction column
  justify-content space-evenly
  align-items stretch
  max-height 100%
  width 10 rem
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
.card-item:after
 position absolute
 top: 0px
 left: 0
 width 8rem
 max-width 8rem
 text-align: center
 height 10rem
 flex-direction row
 align-items center
 justify-content center
 margin: 1rem
 content: 'drop'
 color white
 font-size 2em
 border-radius 4px
 border 2px dotted white
 display none
.next-card .card-item:after
 display flex
 transform translate(-10rem,0)
.next-card-last .card-item:after
 display flex
 transform translate(0em,0)
 left 10rem

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
