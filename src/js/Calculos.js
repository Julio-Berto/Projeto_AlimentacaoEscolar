
const LIMITE_POSITIVA = 4;  
const LIMITE_OTIMA = 4.5;   
const LIMITE_BOA = 3;       

// Recebe a média e devolve o texto da classificação.
function classificar(media) {
  if (media >= LIMITE_OTIMA) return "Ótima";
  if (media >= LIMITE_BOA) return "Boa";
  return "Precisa melhorar";
}

// percorre os pratos com um for
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