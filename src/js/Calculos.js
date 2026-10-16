// ===== REGRAS DE CÁLCULO =====
// Este arquivo só calcula. Não lê nem escreve nada na página.
const NOTA_MINIMA = 1;
const NOTA_MAXIMA = 5;
const LIMITE_POSITIVA = 4;  // nota 4 ou mais conta como avaliação positiva
const LIMITE_OTIMA = 4.5;   // média a partir de 4,5
const LIMITE_BOA = 3;       // média de 3,0 até menos de 4,5

function classificar(media) {
  if (media >= LIMITE_OTIMA) return "Ótima";
  if (media >= LIMITE_BOA) return "Boa";
  return "Precisa melhorar";
}

// Recebe uma lista de pratos (cada um com .nota) e devolve o resumo.
// Notas fora da escala (menores que 1 ou maiores que 5) são ignoradas.
// Sem nenhuma nota válida, devolve null.
function calcularResumo(lista) {
  const notas = lista
    .map((item) => item.nota)
    .filter((nota) => Number.isFinite(nota) && nota >= NOTA_MINIMA && nota <= NOTA_MAXIMA);

  if (notas.length === 0) return null;

  const soma = notas.reduce((total, nota) => total + nota, 0);
  const media = soma / notas.length;

  return {
    quantidade: notas.length,
    soma,
    media,
    positivas: notas.filter((nota) => nota >= LIMITE_POSITIVA).length,
    classificacao: classificar(media),
  };
}

// 4.1333 -> "4,13" (formato brasileiro, duas casas)
function formatarNumero(valor) {
  return valor.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}