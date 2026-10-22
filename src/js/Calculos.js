// ===== REGRAS DE CÁLCULO =====
// Este arquivo só calcula. Não lê nem escreve nada na página.
const LIMITE_POSITIVA = 4;  // nota 4 ou mais conta como avaliação positiva
const LIMITE_OTIMA = 4.5;   // média a partir de 4,5
const LIMITE_BOA = 3;       // média de 3,0 até menos de 4,5

// Recebe a média e devolve o texto da classificação.
function classificar(media) {
  if (media >= LIMITE_OTIMA) return "Ótima";
  if (media >= LIMITE_BOA) return "Boa";
  return "Precisa melhorar";
}

// Recebe a lista de pratos (cada um com .nota) e devolve o resumo.
function calcularResumo(lista) {
  let soma = 0;
  let positivas = 0;

  for (const item of lista) {
    soma += item.nota;                           // soma todas as notas
    if (item.nota >= LIMITE_POSITIVA) positivas++; // conta as positivas
  }

  const quantidade = lista.length;
  const media = soma / quantidade;

  return { quantidade, soma, media, positivas, classificacao: classificar(media) };
}

// 4.1333 -> "4,13" (duas casas, com vírgula)
function formatarNumero(valor) {
  return valor.toFixed(2).replace(".", ",");
}