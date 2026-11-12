// dados do cardapio
const cardapioPadrao = [
  { dia: "Segunda-feira, 14/09", prato: "Sanduiche natural", nota: 5, foto: "Galeria/foto1.jpg" },
  { dia: "Terça-feira, 15/09",   prato: "Salada de frutas",  nota: 4, foto: "Galeria/foto2.jpeg" },
  { dia: "Quarta-feira, 16/09",  prato: "Pão com manteiga",  nota: 3, foto: "Galeria/foto3.jpeg" },
  { dia: "Quinta-feira, 17/09",  prato: "Arroz de leite",    nota: 2, foto: "Galeria/foto4.png" },
  { dia: "Sexta-feira, 18/09",   prato: "Bolacha com suco",  nota: 5, foto: "Galeria/foto5.jpeg" },
  { dia: "Segunda-feira, 21/09", prato: "Cuscuz",            nota: 4, foto: "Galeria/foto6.jpg" },
];


let cardapio = cardapioPadrao;


// Cria as 5 estrelas: as que têm número até a nota ficam escuras ("acesas").
function criarEstrelas(posicao, nota) {
  let estrelas = "";
  for (let n = 1; n <= 5; n++) {
    const cor = n <= nota ? "text-kershew-ouro-escuro" : "text-kershew-carvao/30";
    estrelas += `<button type="button" data-posicao="${posicao}" data-nota="${n}"
      aria-label="Dar nota ${n}" class="text-3xl ${cor} hover:text-kershew-ouro">★</button>`;
  }
  return `<div class="mt-4 flex gap-1">${estrelas}</div>`;
}

// Monta o HTML de um card (foto, dia, prato e estrelas).
function criarCard(item, posicao) {
  return `
    <article class="overflow-hidden rounded border border-kershew-ouro/40 bg-kershew-superficie">
      <img src="${item.foto}" alt="Foto do prato: ${item.prato}" class="h-40 w-full object-cover">
      <div class="p-5">
        <p class="text-sm font-bold text-kershew-ouro-escuro">${item.dia}</p>
        <h3 class="mt-2 text-lg font-bold">${item.prato}</h3>
        ${criarEstrelas(posicao, item.nota)}
        <p class="mt-2 text-sm">Nota atual: ${item.nota} de 5. Clique nas estrelas para avaliar.</p>
      </div>
    </article>
  `;
}

function mostrarCardapio() {
  const lista = document.getElementById("lista-cardapio");
  if (!lista) return; // esta página não tem a lista de cards
  lista.innerHTML = cardapio.map(criarCard).join("");
}

// resultados do cardapio

const CORES = {
  "Ótima": "text-green-700",
  "Boa": "text-kershew-ouro-escuro",
  "Precisa melhorar": "text-red-700",
};

function mostrarResultados() {
  const campoMedia = document.getElementById("res-media");
  if (!campoMedia) return; // esta página não tem a seção de resultados

  const resumo = calcularResumo(cardapio);

  campoMedia.textContent = formatarNumero(resumo.media);
  document.getElementById("res-soma").textContent = resumo.soma;
  document.getElementById("res-positivas").textContent = `${resumo.positivas} de ${resumo.quantidade}`;

  const campoClassificacao = document.getElementById("res-classificacao");
  campoClassificacao.textContent = resumo.classificacao;
  campoClassificacao.className = `mt-2 text-3xl font-bold ${CORES[resumo.classificacao]}`;

  // Tabela com os seis dados processados
  document.getElementById("res-tabela").innerHTML = cardapio.map((item) => {
    const positiva = item.nota >= LIMITE_POSITIVA ? "Sim" : "Não";
    return `<tr class="border-t border-kershew-ouro/40">
      <td class="p-3">${item.dia}</td>
      <td class="p-3">${item.prato}</td>
      <td class="p-3">${item.nota}</td>
      <td class="p-3">${positiva}</td>
    </tr>`;
  }).join("");
}

// clique nas estrelas para avaliar
const lista = document.getElementById("lista-cardapio");

if (lista && lista.dataset.avaliavel === "true") {
  lista.addEventListener("click", (evento) => {
    const botao = evento.target.closest("button[data-nota]");
    if (!botao) return; // clicou fora de uma estrela

    cardapio[botao.dataset.posicao].nota = Number(botao.dataset.nota); // 1) muda a nota
    mostrarCardapio();                                                 // 2) redesenha as estrelas
    mostrarResultados();                                               // 3) recalcula o resultado
  });
}

// ===== 5. INICIAR =====
mostrarCardapio();
mostrarResultados();