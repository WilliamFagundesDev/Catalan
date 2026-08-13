<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { catalanRecursive, catalanBinomial, type AlgorithmResult } from './utils/catalan';
import PerformanceChart from './components/PerformanceChart.vue';
import './style.css';

// Estado do Playground
const inputValue = ref<number>(10);
const recursiveResult = ref<AlgorithmResult | null>(null);
const binomialResult = ref<AlgorithmResult | null>(null);
const errorMessage = ref<string>('');

// Dados do Gráfico
const graphLabels = ref<number[]>([]);
const graphRecursiveData = ref<number[]>([]);
const graphBinomialData = ref<number[]>([]);

const calculate = () => {
  errorMessage.value = '';
  const n = inputValue.value;
  
  if (n < 0) {
    errorMessage.value = 'O valor de N não pode ser negativo.';
    return;
  }
  
  // Executa abordagem Binomial (segura e rápida)
  binomialResult.value = catalanBinomial(n);
  
  // Executa abordagem Recursiva com trava
  if (n > 16) {
    recursiveResult.value = null;
    errorMessage.value = '🚨 Execução Recursiva Bloqueada! Para N > 16, a complexidade exponencial da recursão baseada em somatório (próxima a O(4^n) em algumas arquiteturas ingênuas) pode travar a aba do seu navegador e estourar a pilha (Call Stack). A versão binomial executou normalmente.';
  } else {
    recursiveResult.value = catalanRecursive(n);
  }
};

const generateGraphData = () => {
  const labels = [2, 4, 6, 8, 10, 12, 14, 15]; // Paramos no 15 para não travar
  const recData: number[] = [];
  const binData: number[] = [];
  
  for (const n of labels) {
    recData.push(catalanRecursive(n).timeMs);
    binData.push(catalanBinomial(n).timeMs);
  }
  
  graphLabels.value = labels;
  graphRecursiveData.value = recData;
  graphBinomialData.value = binData;
};

onMounted(() => {
  calculate();
  generateGraphData();
});
</script>

<template>
  <div class="dashboard">
    <!-- Header -->
    <header class="header-section">
      <h1>Números de Catalan</h1>
      <h2>Árvores, Compiladores e Performance Matemática</h2>
      <p>Uma análise profunda sobre complexidade de algoritmos utilizando Vue 3.</p>
    </header>

    <!-- Teoria -->
    <section class="theory-section glass-panel">
      <h3>O que são os Números de Catalan?</h3>
      <p>
        Os números de Catalan formam uma sequência de números naturais que ocorrem em vários problemas de contagem na análise combinatória. Eles resolvem problemas fundamentais de agrupamentos estruturais.
      </p>
      <ul class="theory-list">
        <li>
          <span class="highlight">Árvores Binárias:</span> C(n) representa o número exato de árvores binárias estruturalmente únicas que possuem "n" nós internos.
        </li>
        <li>
          <span class="highlight">Design de Compiladores (ASTs):</span> Usado para validar agrupamento de parênteses e na geração de Árvores de Sintaxe Abstrata. O compilador precisa saber quantas maneiras uma expressão matemática pode ser agrupada para otimizar a ordem das operações.
        </li>
      </ul>
      
      <h3 style="margin-top: 1.5rem;">Definição Matemática</h3>
      <div class="code-font" style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 8px;">
        1. Recursiva: C(n) = Σ C(i) * C(n-1-i)<br/>
        2. Binomial: C(n) = (2n)! / ((n+1)! * n!)
      </div>
    </section>

    <!-- Playground -->
    <section class="calc-section glass-panel">
      <h3>Playground Interativo</h3>
      <p>Digite um valor para <code>N</code> e compare as duas abordagens ao vivo.</p>
      
      <div class="input-group">
        <input 
          type="number" 
          v-model="inputValue" 
          min="0" 
          class="styled-input"
          @keyup.enter="calculate"
        />
        <button class="styled-button" @click="calculate">Calcular N</button>
      </div>

      <div v-if="errorMessage" class="alert">
        <span>{{ errorMessage }}</span>
      </div>

      <div class="result-box">
        <!-- Card Recursivo -->
        <div class="metric-card metric-recursive" :style="!recursiveResult ? 'opacity: 0.5;' : ''">
          <div class="metric-label">1. Recursão por Somatório</div>
          <div class="metric-value">
            {{ recursiveResult?.result !== undefined && recursiveResult?.result !== null ? recursiveResult.result.toString() : 'Bloqueado' }}
          </div>
          <div class="metric-time" v-if="recursiveResult">
            Tempo de CPU: <span class="time-badge">{{ recursiveResult.timeMs.toFixed(3) }} ms</span>
          </div>
        </div>

        <!-- Card Binomial -->
        <div class="metric-card metric-binomial">
          <div class="metric-label">2. Coeficiente Binomial O(n)</div>
          <div class="metric-value">
            {{ binomialResult?.result !== undefined && binomialResult?.result !== null ? binomialResult.result.toString() : '...' }}
          </div>
          <div class="metric-time" v-if="binomialResult">
            Tempo de CPU: <span class="time-badge">{{ binomialResult.timeMs.toFixed(3) }} ms</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Gráfico -->
    <section class="graph-section glass-panel">
      <h3>Curva de Crescimento (Performance)</h3>
      <p>Tempo de execução (ms) em função do aumento de N.</p>
      <PerformanceChart 
        v-if="graphLabels.length > 0"
        :labels="graphLabels" 
        :recursiveData="graphRecursiveData" 
        :binomialData="graphBinomialData" 
      />
    </section>

    <!-- Relatório -->
    <section class="report-section glass-panel">
      <h3>Relatório de Análise Técnica</h3>
      
      <div style="margin-bottom: 1.5rem;">
        <h4 style="color: var(--accent-cyan); margin-bottom: 0.5rem;">O que os gráficos nos dizem sobre a performance?</h4>
        <p>
          O gráfico revela uma explosão exponencial dramática na curva da <span class="highlight" style="color: var(--accent-pink);">abordagem Recursiva</span>. Como ela utiliza múltiplas subchamadas (somatório interno chamando a função recursiva dezenas de vezes para os mesmos valores), a complexidade de tempo se torna catastrófica, similar à sequência de Fibonacci ingênua, porém mais intensa.
        </p>
        <p>
          A <span class="highlight" style="color: var(--accent-cyan);">abordagem Binomial</span>, por outro lado, mantém-se numa linha absolutamente plana e imperceptível (perto de 0ms) em tempo linear <strong>O(n)</strong>, demonstrando o poder de simplificar a lógica usando matemática combinatória pura e operações primitivas com <code>BigInt</code>.
        </p>
      </div>

      <div>
        <h4 style="color: var(--accent-cyan); margin-bottom: 0.5rem;">Qual o maior número calculável em cada versão?</h4>
        <ul class="theory-list">
          <li>
            <span class="highlight">Abordagem Recursiva:</span> O limite máximo viável fica em torno de <strong>N = 16 a 18</strong>. Acima disso, o tempo dobra a cada passo até congelar a "Main Thread" do Javascript e eventualmente gerar um erro de <em>Maximum call stack size exceeded</em>.
          </li>
          <li>
            <span class="highlight">Abordagem Binomial:</span> Graças à estrutura de repetição linear e ao uso do <code>BigInt</code>, o limite algorítmico desaparece. Podemos facilmente processar <strong>C(5000)</strong> ou <strong>C(10000)</strong> instantaneamente (em frações de milissegundo). O único gargalo passa a ser a conversão e renderização do BigInt gigante no DOM, não o cálculo em si!
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>
