// ===== DADOS =====
// Cardápio inicial: seis dias (14 a 21 de setembro de 2026). Notas fictícias de 1 a 5.
const CHAVE_ARMAZENAMENTO = "cardapio-escolar";

const cardapioPadrao = [
  { data: "2026-09-14", prato: "Arroz, feijão e frango grelhado", nota: 5 },
  { data: "2026-09-15", prato: "Macarrão com carne moída",        nota: 4 },
  { data: "2026-09-16", prato: "Baião de dois com legumes",       nota: 3 },
  { data: "2026-09-17", prato: "Arroz, feijão e peixe assado",    nota: 2 },
  { data: "2026-09-18", prato: "Strogonoff de frango com arroz",  nota: 5 },
  { data: "2026-09-21", prato: "Feijoada leve com arroz",         nota: 4 },
];

// Lê o cardápio salvo no navegador; se não houver, usa o inicial.
function carregarCardapio() {
  try {
    const salvo = localStorage.getItem(CHAVE_ARMAZENAMENTO);
    if (salvo) {
      const lista = JSON.parse(salvo);
      if (Array.isArray(lista)) return lista;
    }
  } catch (erro) {
    // armazenamento indisponível: segue com o cardápio inicial
  }
  return cardapioPadrao.map((item) => ({ ...item }));
}

function salvarCardapio() {
  try {
    localStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(cardapio));
    return true;
  } catch (erro) {
    return false;
  }
}

let cardapio = carregarCardapio();

// ===== FUNÇÕES AUXILIARES =====
const DIAS_DA_SEMANA = [
  "Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira",
  "Quinta-feira", "Sexta-feira", "Sábado",
];

// "2026-09-14" -> { dia: "14/09", semana: "Segunda-feira" }
function detalhesDaData(iso) {
  const [ano, mes, dia] = iso.split("-").map(Number);
  const data = new Date(ano, mes - 1, dia);
  return {
    dia: `${String(dia).padStart(2, "0")}/${String(mes).padStart(2, "0")}`,
    semana: DIAS_DA_SEMANA[data.getDay()],
  };
}

// Evita que texto vire HTML dentro dos cards.
function escapar(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML.replace(/"/g, "&quot;");
}

// ===== CARDS DO CARDÁPIO =====
// Cinco estrelas clicáveis para avaliar o prato.
function criarControleDeNota(item) {
  const botoes = [1, 2, 3, 4, 5].map((n) => {
    const cor = n <= item.nota ? "text-kershew-ouro-escuro" : "text-kershew-carvao/30";
    return `<button type="button" data-data="${item.data}" data-nota="${n}"
      aria-label="Dar nota ${n} ao prato ${escapar(item.prato)}" aria-pressed="${n === item.nota}"
      class="rounded text-3xl leading-none ${cor} hover:text-kershew-ouro focus:outline-none focus:ring-2 focus:ring-kershew-ouro">★</button>`;
  }).join("");
  return `<div class="mt-4 flex gap-1" role="group" aria-label="Avaliar ${escapar(item.prato)}">${botoes}</div>`;
}

function criarCard(item) {
  const { dia, semana } = detalhesDaData(item.data);
  const imagem = item.foto
    ? `<img src="${item.foto}" alt="Foto do prato: ${escapar(item.prato)}" class="h-40 w-full object-cover">`
    : `<div class="flex h-40 w-full items-center justify-center bg-kershew-creme text-sm text-kershew-carvao/60">Sem foto</div>`;

  return `
    <article class="overflow-hidden rounded border border-kershew-ouro/40 bg-kershew-superficie">
      ${imagem}
      <div class="p-5">
        <p class="text-sm font-bold text-kershew-ouro-escuro">${semana}, ${dia}</p>
        <h3 class="mt-2 text-lg font-bold">${escapar(item.prato)}</h3>
        ${criarControleDeNota(item)}
        <p class="mt-2 text-sm">Nota atual: ${item.nota} de 5. Clique nas estrelas para avaliar.</p>
      </div>
    </article>
  `;
}

function renderizarCardapio() {
  const lista = document.getElementById("lista-cardapio");
  if (!lista) return; // esta página não tem a lista de cards
  lista.innerHTML = cardapio.map(criarCard).join("");
}

// ===== RESULTADOS (usa as funções do Calculos.js) =====
const CORES_CLASSIFICACAO = {
  "Ótima": "text-green-700",
  "Boa": "text-kershew-ouro-escuro",
  "Precisa melhorar": "text-red-700",
};

function renderizarResultados() {
  const campoMedia = document.getElementById("res-media");
  if (!campoMedia) return; // esta página não tem a seção de resultados

  const campoSoma = document.getElementById("res-soma");
  const campoPositivas = document.getElementById("res-positivas");
  const campoClassificacao = document.getElementById("res-classificacao");
  const tabela = document.getElementById("res-tabela");

  const resumo = calcularResumo(cardapio);

  if (!resumo) {
    campoMedia.textContent = "-";
    campoSoma.textContent = "-";
    campoPositivas.textContent = "-";
    campoClassificacao.textContent = "-";
    tabela.innerHTML = "";
    return;
  }

  campoMedia.textContent = formatarNumero(resumo.media);
  campoSoma.textContent = resumo.soma;
  campoPositivas.textContent = `${resumo.positivas} de ${resumo.quantidade}`;
  campoClassificacao.textContent = resumo.classificacao;
  campoClassificacao.className = `mt-2 text-3xl font-bold ${CORES_CLASSIFICACAO[resumo.classificacao]}`;

  tabela.innerHTML = cardapio.map((item) => {
    const { dia, semana } = detalhesDaData(item.data);
    const positiva = item.nota >= LIMITE_POSITIVA ? "Sim" : "Não";
    return `<tr class="border-t border-kershew-ouro/40">
      <td class="p-3">${semana}, ${dia}</td>
      <td class="p-3">${escapar(item.prato)}</td>
      <td class="p-3">${item.nota}</td>
      <td class="p-3">${positiva}</td>
    </tr>`;
  }).join("");
}

// Clique nas estrelas: grava a nova nota, redesenha os cards e recalcula os resultados.
function configurarAvaliacao() {
  const lista = document.getElementById("lista-cardapio");
  if (!lista || lista.dataset.avaliavel !== "true") return;

  lista.addEventListener("click", (evento) => {
    const botao = evento.target.closest("button[data-nota]");
    if (!botao) return;

    const item = cardapio.find((prato) => prato.data === botao.dataset.data);
    if (!item) return;

    item.nota = Number(botao.dataset.nota);
    salvarCardapio();
    renderizarCardapio();
    renderizarResultados();

    // devolve o foco para a estrela clicada (o redesenho recria os botões)
    const novo = lista.querySelector(`button[data-data="${botao.dataset.data}"][data-nota="${botao.dataset.nota}"]`);
    if (novo) novo.focus();
  });
}

// ===== INICIAR =====
renderizarCardapio();
renderizarResultados();
configurarAvaliacao();