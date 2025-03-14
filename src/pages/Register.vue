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
          Registre-se para acessar o laboratório
        </p>
        <span class="text-[#474749]">Preencha os campos abaixo</span>
      </div>
      <div class="flex flex-col space-y-2 w-full">
        <span>Nome</span>
        <input v-model="nameInput" class="bg-[#f5f5f5] rounded-md h-[35px]" />
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
        @click="signUp"
        class="bg-[#00A551] text-white p-2 w-[100px] rounded-md"
      >
        Registrar
      </button>
      <p>
        Já possui cadastro?
        <a @click="goLogin" class="text-green-500 underline">Fazer login</a>
      </p>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { supabase } from "../service/supabase";
import { useRouter } from "vue-router";
export default {
  setup() {
    const router = useRouter();
    const nameInput = ref("");
    const emailInput = ref("");
    const passwordInput = ref("");

    async function signUp() {
      const { data, error } = await supabase.auth.signUp({
        email: emailInput.value,
        password: passwordInput.value,
        options: {
          data: {
            name: nameInput.value,
          },
        },
      });

      console.log("data", data);
      console.log("error", error);
    }

    function goLogin() {
      router.push("/login");
    }

    return { signUp, goLogin, nameInput, emailInput, passwordInput };
  },
};
</script>

<style></style>
