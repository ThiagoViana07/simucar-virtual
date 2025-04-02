<template>
  <div
    :style="{
      left: left + 'px',
      top: top + 'px',
      background: color,
      width: width + 'px',
      height: thickness + 'px',
      transform: `rotate(${angle}deg)`,
      'transform-origin': 'left center',
    }"
    class="absolute"
  ></div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
    },
    left: {
      type: Number,
      default: 0,
    },
    top: {
      type: Number,
      default: 0,
    },
    angle: {
      type: Number,
      default: 0,
    },
    width: {
      type: Number,
      default: 150,
    },
    thickness: {
      type: Number,
      default: 12,
    },
  },
  setup(props) {
    return {};
  },
};
//Colocar linha na vertical
//Tamanho da linha
//Cor dinâmica
</script>

<style scoped></style>
