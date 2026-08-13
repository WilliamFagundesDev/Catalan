export type AlgorithmResult = {
  result: bigint | null;
  timeMs: number;
};

/**
 * Abordagem 1: Pela Definição Recursiva (Somatório)
 * C(0) = 1. Para n >= 1, C(n) é o somatório de C(i) * C(n-1-i) para i variando de 0 até n-1.
 * Complexidade de Tempo: Exponencial
 */
export function catalanRecursive(n: number): AlgorithmResult {
  const start = performance.now();

  function calc(num: number): bigint {
    if (num === 0) return 1n;
    let sum = 0n;
    for (let i = 0; i < num; i++) {
      sum += calc(i) * calc(num - 1 - i);
    }
    return sum;
  }

  let result: bigint | null = null;

  // Trava de segurança para evitar travamento do navegador
  if (n <= 16) {
    result = calc(n);
  }

  const end = performance.now();

  return {
    result,
    timeMs: end - start
  };
}

/**
 * Abordagem 2: Fórmula do Coeficiente Binomial (Matemática O(n))
 * C(n) = (2n)! / ((n+1)! * n!)
 * Otimizado iterativamente para não calcular fatoriais inteiros.
 * Complexidade de Tempo: O(n)
 */
export function catalanBinomial(n: number): AlgorithmResult {
  const start = performance.now();

  let result = 1n;
  if (n > 0) {
    const bigN = BigInt(n);
    const n2 = bigN * 2n;

    let c = 1n;
    // Calcula Combinação (2n, n)
    for (let i = 1n; i <= bigN; i++) {
      c = (c * (n2 - i + 1n)) / i;
    }
    // C(n) = C(2n, n) / (n + 1)
    result = c / (bigN + 1n);
  }

  const end = performance.now();

  return {
    result,
    timeMs: end - start
  };
}
