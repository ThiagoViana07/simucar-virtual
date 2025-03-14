<template>
  <div class="border border-red-500 h-[30%] flex flex-wrap flex-col  max-w-[500px]">
    <div class="bg-red-500 w-full text-white px-2">
      <p>Console de erros</p>
    </div>
    <label class="text-sm px-2" v-for="con in content">
      {{ con }}
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  components: {},
  props: {
    content: {
      type: String,
      default: "",
    },
  },
  setup() {
    return {};
  },
});
</script>

<style scoped></style>
