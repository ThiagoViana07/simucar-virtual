<template>
  <div  class="top-20" ref="cartElement">
    <div :style="{top: positionX+'px', left: positionY+'px'}" ref="cartElementRotate" class="absolute">
      <div class="w-[80px] h-10 bg-blue-500 rounded-xl z-10 relative"></div>
      <div class="bg-black h-1 w-4 absolute right-2 -bottom-[2px] z-0"></div>
      <div class="bg-black h-5 w-4 absolute left-2 -bottom-[2px] z-0"></div>
      <div class="bg-black h-1 w-4 absolute right-2 -top-[2px] z-0"></div>
      <div class="bg-black h-5 w-4 absolute left-2 -top-[2px] z-0"></div>

      <div
        class="h-2 w-[3px] bg-yellow-300 rounded-xl absolute right-[6px] bottom-1 z-10"
      ></div>
      <div
        class="h-2 w-[3px] bg-yellow-300 rounded-xl absolute right-[6px] top-1 z-10"
      ></div>
     
      <div ref="detectorColor" class=" bg-white h-2 w-2 absolute right-1 bottom-4 z-10">

      </div>
      <div
        class="w-4 h-6 bg-blue-800 absolute z-10 right-4 top-2 rounded-e-[4px]"
      ></div>

      <div
        class="h-2 w-1 bg-blue-600 rounded-md absolute left-[0px] bottom-1"
      ></div>
      <div
        class="h-2 w-1 bg-blue-600 rounded-md absolute left-[0px] top-1"
      ></div>
    </div>
    <label class="absolute -top-12"></label>
  </div>
</template>

<script>
import anime from "animejs/lib/anime.es.js";
import { computed, onMounted, ref, watch } from "vue";
import { useElementBounding } from "@vueuse/core";

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
    moveX: {
      type: Number,
      default: 0,
    },
    moveY: {
      type: Number,
      default: 0,
    },
    rotate: {
      type: Number,
      default: 0,
    },
    isMoveCart: {
      type: Boolean,
      default: false,
    },
    colorLine: {
      type: String,
      default: "#FFF",
    },
  },
  setup(props, { emit }) {
    const cartElement = ref(null);
    const cartElementRotate = ref(null);
    const detectorColor = ref(null);

    const { x, y } = useElementBounding(cartElement);
    const { x: cartElementRotateX, y: cartElementRotateY,  } =
      useElementBounding(cartElementRotate);

    const currentRotation = ref(0);
    const currentX = ref(0);
    const currentY = ref(0);

    watch(
      () => props.colorLine,
      (newValue, oldValue) => {
        console.log('FFF')
        if (newValue === props.colorLine) {
          detectorColor.value.style.backgroundColor = props.colorLine;
        } else {
          detectorColor.value.style.backgroundColor = "white";
        }
      }
    );

    //rotate
    watch(
      () => props.rotate,
      (newValue, oldValue) => {
        //Verificar a posição do carrinho com relação ao cone e impedir o movimento

        currentRotation.value = newValue;

        anime({
          targets: cartElementRotate.value,
          rotate: currentRotation.value,
          duration: 1000,
          easing: "linear",
        });

        setTimeout(() => {
          emit("detectColor", detectorColor.value.getBoundingClientRect());
        }, 1100);
      }
    );


    //move
    watch(
      () => props.isMoveCart,
      (newValue, oldValue) => {
        const angleInRadians = (currentRotation.value * Math.PI) / 180;
        const deltaX = props.moveX * Math.cos(angleInRadians);
        const deltaY = props.moveX * Math.sin(angleInRadians);

        currentX.value += deltaX;
        currentY.value += deltaY;

        

        //Verificar a posição do carrinho com relação ao cone e impedir o movimento
        anime({
          targets: cartElement.value,
          translateX: currentX.value,
          translateY: currentY.value,
          duration: 1000,
          easing: "linear",
        });

        setTimeout(() => {
          emit("detectColor", detectorColor.value.getBoundingClientRect());
        }, 1100);
       
      }
    );
    // watch(
    //   () => props.moveY,
    //   (newValue, oldValue) => {
    //     console.log("AQui");
    //     anime({
    //       targets: cartElement.value,
    //       //translateX: newValue,
    //       translateY: newValue,
    //       duration: 1000,
    //       easing: "linear",
    //     });
    //   }
    // );

    onMounted(() => {});

    return {
      cartElement,
      cartElementRotate,
      x,
      y,
      currentX,
      detectorColor,
      cartElementRotateX,
      cartElementRotateY,
    };
  },
};
</script>

<style scoped>
.clippath {
  clip-path: inset(30% 30% 30% 30%);
}
</style>
