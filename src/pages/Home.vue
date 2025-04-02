<template>
  <div class="p-1">
    <div class="flex space-x-4 items-center">
      <p class="text-3xl text-green-500">SIMUCAR Virtual</p>
      <button class=" border border-green-500  relative bg-green-500 text-white px-2 text-sm" @click="logout">Logout</button>
    </div>
    <div class="flex space-x-2 h-screen">
      <div class="h-[70%]">
        <div class="w-[500px] border border-green-500 mt-2 h-[100%]">
          <header
            class="flex bg-green-500 h-[50px] justify-between items-center px-3"
          >
            <p class="text-white">Programação</p>
            <div
              @click="check"
              class="text-white space-x-2 flex items-center border px-2 cursor-pointer"
            >
              <p>Executar</p>
              <button class=""><img src="../assets/check.png" /></button>
              <!-- <button class="rotate-180" @click="run('left')">
              <img src="../assets/arrow-right.png" />
            </button>
            <button>
              <img src="../assets/arrow-right.png" />
            </button>
            <button class="-rotate-90" @click="run('top')">
              <img src="../assets/arrow-right.png" />
            </button>
            <button class="rotate-90" @click="run('bottom')">
              <img src="../assets/arrow-right.png" />
            </button> -->
            </div>
          </header>

          <div class="" id="codemirror"></div>
        </div>
        <Console :content="consoleError" class="mt-2" />
      </div>
      <div @mousemove="mouseMove" class="w-[50%] border border-green-500 mt-2 relative">
        <div class="absolute right-0 -top-6 text-sm">
          <button
            @click="screen = 'planning'"
            class="px-2"
            :class="screen == 'planning' ? 'bg-green-500 text-white' : ' '"
          >
            Planejamento
          </button>
          <button
            :class="screen == 'visualization' ? 'bg-green-500 text-white' : ' '"
            @click="screen = 'visualization'"
            class="border px-2"
          >
            Visualização 
            {{ mouseX }},
            {{ mouseY }}
          </button>
        </div>
        <header
          class="flex bg-green-500 h-[50px] justify-between items-center px-3 relative"
        >
          <p class="text-white">
            {{ screen == "visualization" ? "Visualização" : "Planejamento" }}
          </p>
          <div class="space-x-3 mt-2 flex items-center justify-center text-sm">
            <button
              @click="chooseBackground(1)"
              class="bg-green-500 text-white px-1 border cursor-pointer mb-2"
            >
              Background 1
            </button>
            <button
              @click="chooseBackground(2)"
              class="bg-green-500 text-white px-1 border cursor-pointer mb-2"
            >
              Background 2
            </button>
            <button
              @click="chooseBackground(3)"
              class="bg-green-500 text-white px-1 border cursor-pointer mb-2"
            >
              Background 3
            </button>
          </div>
        </header>

        <div v-if="screen == 'visualization'" class="w-full relative">
          <!-- <Road :width="700" :height="50" :dashCount="50" :positionY="75" /> -->
          <Cone v-for="cone in cones" :positionX="cone.x" :positionY="cone.y" />
          <Line
            v-for="(line, index) in linesDetection"
            :left="line.left"
            :top="line.top"
            :ref="(el) => (lineRefs[index] = el)"
            :color="line.color"
            :angle="line.angle"
            :width="line.width"
            :thickness="line.height"
          ></Line>

          <Cart
            ref="cart1"
            @detectColor="detectColor"
            :isMoveCart="isMoveCart"
            :moveY="moveY"
            :moveX="moveX"
            :rotate="rotate"
            :colorLine="colorDetectCart"
            v-for="cart in carts"
            :positionX="cart.x"
            :positionY="cart.y"
          >
          </Cart>
          <!-- <Background :cones="cones" :isMoveCart="isMoveCart" :moveY="moveY" :moveX="moveX" :rotate="rotate" :colorLine="colorLine" @detectColor="detectColor" /> -->
        </div>
        <div class="overflow w-full h-[650px] border-black">
          <Wbo v-if="screen == 'planning'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, ref, watch } from "vue";

import { EditorState } from "@codemirror/state";
import { EditorView, basicSetup } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { useElementBounding } from "@vueuse/core";

import Cart from "../components/Cart.vue";
import Cone from "../components/Cone.vue";
import Line from "../components/Line.vue";
import { moveCart } from "../library/library.js";
import Background from "../components/Background.vue";
import Wbo from "../components/Wbo.vue";
import Console from "../components/Console.vue";
import { useAuthStore } from "../store/auth.js";
import Road from "../components/Road.vue";
//mudar os botoes de background de lugar, colonar parte superior em cima
// pesquisar ferramente de planejamento de fluxograma

export default {
  components: { Cart, Cone, Line, Background, Wbo, Console,Road },

  setup() {
    const authStore = useAuthStore();
    const code = ref(``);
    const viewContainer = ref();
    const consoleError = ref([]);
    const isError = ref([]);

    const isMoveCart = ref(false);
    const moveX = ref(0);
    const moveY = ref(0);
    const rotate = ref(0);
    const mouseX = ref(0);
    const mouseY = ref(0);

    const cones = reactive([]);
    const carts = reactive([]);
    const linesDetection = reactive([]);
    const lineRefs = ref([]);

    const colorLine = ref("");
    const colorDetectCart = ref("#fff");
    const colorSet = ref(false);
    const matchColor = ref("");

    const background1 = ref(
      "linha.criar(#000ccc,100,45)\nlinha.criar(#000ccc,100,100)\nlinha.criar(#000ccc,100,300)\nlinha.criar(#000ccc,100,200)\n"
    );
    const background2 = ref(
      "linha.criar(45,45)\nlinha.criar(0,100)\nlinha.criar(100,420)\nlinha.criar(10,200)\n"
    );
    //Variaveis da linha, para verificar onde ela está

    const screen = ref("visualization");

    function check() {
      code.value = viewContainer.value.state.doc.toString();
      verifyRotateCart(code.value);
      verifyCart(code.value);
      verifyCone(code.value);
      verifyLine(code.value);
      verifyLoop(code.value);
      consoleError.value = [];
      run(code.value);

      console.log(consoleError.value);
      // setTimeout(() => {
      //   verifyLine(code);
      // }, 1100);
    }

    function mouseMove(event) {
      mouseX.value = event.clientX-512;
      mouseY.value = event.clientY-100;
    
    }

    function run(doc) {
      //linha.criar(#000000,200,120,0)
      //while(linha == #000000){cart.frente(20)}

      const regexCartFrente = /cart\.frente\(\s*([-+]?\d*\.?\d+)\s*\)/;
      const regexCartRe = /cart\.re\(\s*([-+]?\d*\.?\d+)\s*\)/;
      const regexRotateCart = /cart\.rotacionar\(\s*([-+]?\d*\.?\d+)\s*\)/;
      const regexCart =
        /cart.criar\(\s*([-+]?\d*\.?\d+),\s*([-+]?\d*\.?\d+)\s*\)/;
      const regexCone =
        /cone.criar\(\s*([-+]?\d*\.?\d+),\s*([-+]?\d*\.?\d+)\s*\)/;
      const regexLinha =
        /linha\.criar\(#([0-9a-fA-F]{6}|[0-9a-fA-F]{3}),\s*([-+]?\d*\.?\d+),\s*([-+]?\d*\.?\d+),\s*([-+]?\d*\.?\d+)(,\s*([-+]?\d*\.?\d+))?(,\s*([-+]?\d*\.?\d+))?\s*\)/;
      const regexWhile =
        /while\s*\(\s*linha\s*==\s*#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\s*\)\s*{\s*cart\.frente\(\s*([-+]?\d*\.?\d+)\s*\)\s*}/;
      const lines = doc.split("\n");

      lines.forEach((line, index) => {
        const matchCartFrente = line.match(regexCartFrente);
        const matchCartRe = line.match(regexCartRe);
        const matchRotateCart = line.match(regexRotateCart);
        const matchCart = line.match(regexCart);
        const matchCone = line.match(regexCone);
        const matchLinha = line.match(regexLinha);
        const matchWhile = line.match(regexWhile);

        console.log("matchLinha", matchLinha);

        if (
          !matchCartFrente &&
          !matchCartRe &&
          !matchRotateCart &&
          !matchCart &&
          !matchCone &&
          !matchLinha &&
          !matchWhile
        ) {
          consoleError.value.push(`Error:${line} nao existe`);

          return;
        }

        if (matchCartFrente) {
          const regex = /[-+]?\d*\.?\d+/g;

          const foundNumbers = lines[index].match(regex);

          const numbers = foundNumbers.map((num) => parseFloat(num));

          matchColor.value = "#fff";

          moveX.value = moveCart.moveRight(parseInt(numbers));
          isMoveCart.value = !isMoveCart.value;
        }

        if (matchCartRe) {
          const regex = /[-+]?\d*\.?\d+/g;

          const foundNumbers = lines[index].match(regex);

          const numbers = foundNumbers.map((num) => parseFloat(num));
          matchColor.value = "#fff";

          moveX.value = moveCart.moveLeft(parseInt(numbers));
          isMoveCart.value = !isMoveCart.value;
        }
      });
    }

    function verifyRotateCart(doc) {
      const regexRotateCart = /cart\.rotacionar\(\s*([-+]?\d*\.?\d+)\s*\)/;

      const lines = doc.split("\n");

      lines.forEach((line) => {
        const matchRotateCart = line.match(regexRotateCart);

        if (!matchRotateCart) {
          // consoleError.value = `Error:${line} nao existe`;
          return;
        }

        if (matchRotateCart) {
          const regex = /[-+]?\d*\.?\d+/g;

          const foundNumbers = line.match(regex);
          matchColor.value = "#fff";

          const numbers = foundNumbers.map((num) => parseFloat(num));

          //rotate.value = moveCart.rotate(parseInt(numbers));
          rotate.value += parseInt(numbers);
        }
      });
    }

    function verifyCart(doc) {
      const regexCart =
        /cart.criar\(\s*([-+]?\d*\.?\d+),\s*([-+]?\d*\.?\d+)\s*\)/;
      const lines = doc.split("\n");

      lines.forEach((line) => {
        const matchCart = line.match(regexCart);

        if (!matchCart) {
          // consoleError.value = `Error:${line} nao existe`;
          return;
        }

        if (matchCart) {
          const regex = /[-+]?\d*\.?\d+/g;

          const foundNumbers = doc.match(regex);
          const numbers = foundNumbers.map((num) => parseFloat(num));

          carts.push({ x: numbers[1], y: numbers[0] });
        }
      });
    }

    function verifyCone(doc) {
      const regexCone =
        /cone.criar\(\s*([-+]?\d*\.?\d+),\s*([-+]?\d*\.?\d+)\s*\)/;

      const lines = doc.split("\n");

      lines.forEach((line) => {
        const matchCone = line.match(regexCone);

        if (!matchCone) {
          // consoleError.value = `Error:${line} nao existe`;
          return;
        }

        if (matchCone) {
          const regex = /[-+]?\d*\.?\d+/g;

          const foundNumbers = line.match(regex);
          const numbers = foundNumbers.map((num) => parseFloat(num));

          cones.push({ x: numbers[0], y: numbers[1] });
        }
      });
    }
    function verifyLine(doc) {
      // const regexLinha =
      //   /linha.criar\(#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?,\s*([-+]?\d*\.?\d+),\s*([-+]?\d*\.?\d+)\s*\)/;
      // const regexLinha =
      //   /linha\.criar\(#([0-9a-fA-F]{6}|[0-9a-fA-F]{3}),\s*([-+]?\d*\.?\d+),\s*([-+]?\d*\.?\d+),\s*([-+]?\d*\.?\d+),s*([-+]?\d*\.?\d+)?,\s*([-+]?\d*\.?\d+)\s*\)/;

      const regexLinha =
        /linha\.criar\(#([0-9a-fA-F]{6}|[0-9a-fA-F]{3}),\s*([-+]?\d*\.?\d+),\s*([-+]?\d*\.?\d+),\s*([-+]?\d*\.?\d+)(,\s*([-+]?\d*\.?\d+))?(,\s*([-+]?\d*\.?\d+))?\s*\)/;
      const lines = doc.split("\n");

      lines.forEach((line) => {
        const matchLinha = line.match(regexLinha);

        if (!matchLinha) {
          // consoleError.value = `Error:${line} nao existe`;
          return;
        }

        console.log("MatchLinha", matchLinha);

        if (matchLinha) {
          const regex = /(?<!#)\b[-+]?\d*\.?\d+\b/g;
          const regexHexColor = /#(?:[0-9a-fA-F]{3}){1,2}/;

          const foundNumbers = line.match(regex);
          const colorLine = line.match(regexHexColor).toString();

          const numbers = foundNumbers.map((num) => parseFloat(num));

          linesDetection.push({
            left: numbers[0],
            top: numbers[1],
            color: colorLine,
            angle: numbers[2],
            width: numbers[3],
            height: numbers[4],
          });
        }
      });

      console.log("lines", lineRefs.value);
    }

    // function verifyLineColor(left, right, top, bottom) {
    //   colorSet.value = false;
    //   lineRefs.value.forEach((lineRef, index) => {
    //     if (lineRef && !colorSet.value) {
    //       const {
    //         bottom: lineBottom,
    //         right: lineRight,
    //         top: lineTop,
    //         left: lineLeft,
    //         width: lineWidth,
    //         height: lineHeight,
    //       } = useElementBounding(lineRef);
         
    //       const angle = lineRef.rotate || 0; // Supondo que a rotação esteja armazenada em lineRef.rotate
    //       const rad = (angle * Math.PI) / 180;
    //       const cos = Math.cos(rad);
    //       const sin = Math.sin(rad);

    //       const x1 = lineLeft.value;
    //       const y1 = lineTop.value;
    //       const x2 = x1 + lineWidth.value * cos - lineHeight.value * sin;
    //       const y2 = y1 + lineWidth.value * sin + lineHeight.value * cos;

    //       function isPointOnLine(px, py, x1, y1, x2, y2) {
    //         const d1 = Math.sqrt((px - x1) ** 2 + (py - y1) ** 2);
    //         const d2 = Math.sqrt((px - x2) ** 2 + (py - y2) ** 2);
    //         const lineLen = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    //         const buffer = 2; // Tolerância para considerar o ponto na linha
    //         return d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer;
    //       }

    //       const isOnLine =
    //         isPointOnLine(left, top, x1, y1, x2, y2) ||
    //         isPointOnLine(right, bottom, x1, y1, x2, y2);

    //       if (isOnLine) {
    //         colorDetectCart.value = lineRef.color;

    //         verifyLoop(code.value);

    //         if (colorDetectCart.value == matchColor.value) {
    //           const regexCartFrente = /cart\.frente\(\s*([-+]?\d*\.?\d+)\s*\)/;
    //           const matchCartFrente = code.value.match(regexCartFrente);

    //           if (matchCartFrente) {
    //             const value = parseFloat(matchCartFrente[1]); // Captura o valor de x em cart.frente(x)
    //             moveX.value = moveCart.moveRight(value); // Substitui o número 20 pelo valor capturado
    //             isMoveCart.value = !isMoveCart.value;
    //           }
    //         }

    //         colorSet.value = true;
    //       }
    //     }
    //   });
    //   if (!colorSet.value) {
    //     colorDetectCart.value = "#fff";
    //   }
    // }

    function verifyLineColor(left, right, top, bottom) {
      colorSet.value = false;
      lineRefs.value.forEach((lineRef, index) => {
        if (lineRef && !colorSet.value) {
          const {
            bottom: lineBottom,
            right: lineRight,
            top: lineTop,
            left: lineLeft,
            width: lineWidth,
            height: lineHeight,
          } = useElementBounding(lineRef);

          // Verifica se o ponto está dentro do retângulo delimitador da linha
          if (
            left >= lineLeft.value &&
            right <= lineRight.value &&
            top >= lineTop.value &&
            bottom <= lineBottom.value
          ) {
            const angle = lineRef.rotate || 0; // Supondo que a rotação esteja armazenada em lineRef.rotate
            const rad = (angle * Math.PI) / 180;
            const cos = Math.cos(rad);
            const sin = Math.sin(rad);

            const x1 = lineLeft.value;
            const y1 = lineTop.value;
            const x2 = x1 + lineWidth.value * cos - lineHeight.value * sin;
            const y2 = y1 + lineWidth.value * sin + lineHeight.value * cos;

            function isPointOnLine(px, py, x1, y1, x2, y2) {
              const d1 = Math.sqrt((px - x1) ** 2 + (py - y1) ** 2);
              const d2 = Math.sqrt((px - x2) ** 2 + (py - y2) ** 2);
              const lineLen = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
              const buffer = lineHeight.value / 2; // Ajusta o buffer com base na altura da linha
              return (
                d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer
              );
            }

            const isOnLine =
              isPointOnLine(left, top, x1, y1, x2, y2) ||
              isPointOnLine(right, bottom, x1, y1, x2, y2);

            if (isOnLine) {
              colorDetectCart.value = lineRef.color;

              verifyLoop(code.value);

              if (colorDetectCart.value == matchColor.value) {
                const regexCartFrente = /cart\.frente\(\s*([-+]?\d*\.?\d+)\s*\)/;
                const matchCartFrente = code.value.match(regexCartFrente);

                if (matchCartFrente) {
                  const value = parseFloat(matchCartFrente[1]); // Captura o valor de x em cart.frente(x)
                  moveX.value = moveCart.moveRight(value); // Substitui o número 20 pelo valor capturado
                  isMoveCart.value = !isMoveCart.value;
                }
              }

              colorSet.value = true;
            }
          }
        }
      });
      if (!colorSet.value) {
        colorDetectCart.value = "#fff";
      }
    }

    function detectColor(event) {
      verifyLineColor(event.left, event.right, event.top, event.bottom);
    }

    function verifyLoop(doc) {
      console.log(doc);
      const regexWhile =
        /while\s*\(\s*linha\s*==\s*#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\s*\)\s*{\s*cart\.frente\(\s*([-+]?\d*\.?\d+)\s*\)\s*}/;
      const lines = doc.split("\n");

      return lines.forEach((line) => {
        const matchWhile = line.match(regexWhile);
        console.log(matchWhile);

        if (matchWhile) {
          matchColor.value = "#" + matchWhile[1];

          colorSet.value = true;

          return true;
        } else {
          return false;
        }
      });
    }

    function changeBackground(option) {
      viewContainer.value = null;
      document.querySelector("#codemirror").innerHTML = "";

      const startState = EditorState.create({
        //doc: "linha.criar(100,45)\nlinha.criar(100,100)\nlinha.criar(300,300)\nlinha.criar(200,200)\ncart.frente(100)\n",
        doc:
          option == 1
            ? background1.value
            : option == 2
            ? background2.value
            : "",
        extensions: [basicSetup, javascript()],
      });
      viewContainer.value = new EditorView({
        state: startState,
        parent: document.querySelector("#codemirror"),
      });
    }

    function chooseBackground(option) {
      //linesDetection.length = 0;

      changeBackground(option);
    }

    function logout() {
      authStore.logout();
    }

    onMounted(() => {
      changeBackground();
    });

    return {
      code,
      run,
      carts,
      moveX,
      moveY,
      viewContainer,
      check,
      cones,
      rotate,
      isMoveCart,
      colorLine,
      detectColor,
      linesDetection,
      lineRefs,
      colorSet,
      chooseBackground,
      colorDetectCart,
      screen,
      consoleError,
      isError,
      logout,
      mouseMove,
      mouseX,
      mouseY,
    };
  },
};
</script>

<style>
.overflow {
  overflow: hidden;
}
.overflow::-webkit-scrollbar {
  width: 0px; /* Largura da barra de rolagem */
}

.overflow::-webkit-scrollbar-thumb {
  background-color: #fff; /* Cor da barra de rolagem */
  border-radius: 10px; /* Bordas arredondadas */
}

.overflow::-webkit-scrollbar-thumb:hover {
  background-color: #555; /* Cor da barra de rolagem ao passar o mouse */
}
</style>
