<template>
  <div>
    <Cone v-for="cone in cones" :positionX="cone.x" :positionY="cone.y" />
    <Line :left="100" :top="15" ref="line1" color="#000"></Line>
    <Cart
      ref="cart1"
      @detectColor="$emit('detectColor')"
      :isMoveCart="isMoveCart"
      :moveY="moveY"
      :moveX="moveX"
      :rotate="rotate"
      :colorLine="colorLine"
    >
    </Cart>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Cart from "./Cart.vue";
import Cone from "./Cone.vue";
import Line from "./Line.vue";

export default defineComponent({
  components: {Cart, Cone, Line},
  props: {
    cones:[],
    isMoveCart: {
      type: Boolean,
      default: false,
    }, 
    moveY: {
      type: Number,
      default: 0,
    },
    moveX: {
      type: Number,
      default: 0,
    },
    rotate: {
      type: Number,
      default: 0,
    },
    colorLine: {
      type: String,
      default: "#000",
    },

  },
  setup() {
    return {};
  },
});
</script>

<style scoped></style>
