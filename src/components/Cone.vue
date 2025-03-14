<template>
  <div class="relative">
    <div
    
      :style="{
        left: positionX + 'px',
        top: positionY + 'px',
      }"
      ref="cone1"
      class="cone"
    >
      
    </div>
  </div>
</template>

<script>
export default {
  props: {
    positionX: {
      type: Number,
      default: 0,
    },
    positionY: {
      type: Number,
      default: 0,
    },
  },
  setup() {
    return {};
  },
};
</script>

<style scoped>
.cone {
  /* top: 50%;
  left: 50%; */
  position: absolute;
  width: 0;
  height: 0;
  border-left: 12.5px solid #e7a535; /* 50px / 4 */
  border-right: 12.5px solid #e7a535; /* 50px / 4 */
  border-bottom: 12.5px solid #e7a535; /* 50px / 4 */
  border-top: 12.5px solid #e7a535; /* 50px / 4 */
  -webkit-transform: rotate(45deg);
  -moz-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  -o-transform: rotate(45deg);
  transform: rotate(45deg);
  -webkit-border-radius: 2.5%; /* 10% / 4 */
  -moz-border-radius: 2.5%; /* 10% / 4 */
  border-radius: 2.5%; /* 10% / 4 */
  box-shadow: 0.5px 0.5px 0 0.5px rgba(179, 122, 39, 1); /* 2px / 4 */
}
.cone:after {
  width: 0;
  height: 0;
  position: absolute;
  content: "";
  border-left: 17.5px solid transparent; /* 70px / 4 */
  border-right: 17.5px solid transparent; /* 70px / 4 */
  border-top: 35px solid #f7b137; /* 140px / 4 */
  top: -25px; /* -100px / 4 */
  left: -25px; /* -100px / 4 */
  -webkit-transform: rotate(135deg);
  -moz-transform: rotate(135deg);
  -ms-transform: rotate(135deg);
  -o-transform: rotate(135deg);
  transform: rotate(135deg);
  -webkit-border-radius: 12.5%; /* 50% / 4 */
  -moz-border-radius: 12.5%; /* 50% / 4 */
  border-radius: 12.5%; /* 50% / 4 */
}
</style>
