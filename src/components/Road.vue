<template>
  <div class="road-container absolute">
    <svg :width="width + positionX" :height="height + positionY" xmlns="http://www.w3.org/2000/svg">
      <!-- Estrada -->
      <rect
        :x="positionX"
        :y="positionY"
        :width="width"
        :height="height"
        fill="#636363"
      />
      <!-- Faixas centrais tracejadas -->
      <line
        v-for="(dash, index) in dashes"
        :key="index"
        :x1="dash.x1 + positionX"
        :y1="dash.y1 + positionY"
        :x2="dash.x2 + positionX"
        :y2="dash.y2 + positionY"
        stroke="#fff"
        stroke-width="4"
        stroke-dasharray="10, 10"
      />
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    width: {
      type: Number,
      default: 800, // Largura padrão da estrada
    },
    height: {
      type: Number,
      default: 200, // Altura padrão da estrada
    },
    dashCount: {
      type: Number,
      default: 20, // Número de traços na faixa central
    },
    positionX: {
      type: Number,
      default: 0, // Posição X inicial da estrada
    },
    positionY: {
      type: Number,
      default: 0, // Posição Y inicial da estrada
    },
  },
  computed: {
    dashes() {
      const dashSpacing = this.width / this.dashCount;
      const dashLength = dashSpacing / 2;
      const dashes = [];
      for (let i = 0; i < this.dashCount; i++) {
        const x1 = i * dashSpacing;
        const x2 = x1 + dashLength;
        const y1 = this.height / 2;
        const y2 = this.height / 2;
        dashes.push({ x1, y1, x2, y2 });
      }
      return dashes;
    },
  },
};
</script>

<style scoped>
.road-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;

}
</style>