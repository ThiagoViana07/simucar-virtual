<template>
  <div class="flex items-center justify-center space-x-10">
    <div class="flex flex-col items-center mt-5">
      <img class="w-[300px]" src="../assets/login.png" alt="" />
      <h1 class="text-3xl font-bold mt-5">Lara - Laboratório Virtual</h1>
    </div>

    <div
      class="bg-white shadow-lg border rounded-md flex items-center justify-center flex-col py-10 px-20 space-y-10 mt-5"
    >
      <div class="flex items-center flex-col">
        <p class="text-2xl text-green-500 outline-0 border-none">
          Conecte-se ao laboratório
        </p>
        <span class="text-[#474749]">Entre com suas credenciais</span>
      </div>

      <div class="flex flex-col space-y-2 w-full">
        <span>Email</span>
        <input v-model="emailInput" class="bg-[#f5f5f5] rounded-md h-[35px]" />
      </div>

      <div class="flex flex-col space-y-2 w-full">
        <span>Senha </span>
        <input
          v-model="passwordInput"
          class="bg-[#f5f5f5] rounded-md h-[35px]"
        />
      </div>

      <button
        @click="signIn"
        class="bg-[#00A551] text-white p-2 w-[100px] rounded-md"
      >
        Entrar
      </button>
      <p>
        Não possui cadastro?
        <a class="text-green-500 underline" @click="goRegister"
          >Criar uma conta</a
        >
      </p>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useAuthStore } from "../store/auth";
import { useRouter } from "vue-router";
export default {
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    const emailInput = ref("");
    const passwordInput = ref("");

    async function signIn() {
      await authStore.login(emailInput.value, passwordInput.value);
    }

    function goRegister() {
      router.push("/register");
    }

    return { signIn, goRegister, emailInput, passwordInput };
  },
};
</script>

<style></style>
