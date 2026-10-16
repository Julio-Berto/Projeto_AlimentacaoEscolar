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
    return false; // sem espaço ou sem armazenamento disponível
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

// Evita que texto digitado vire HTML dentro dos cards.
function escapar(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML.replace(/"/g, "&quot;");
}

// ===== CARDS DO CARDÁPIO =====
function criarEstrelas(nota) {
  const cheias = "★".repeat(nota);
  const vazias = "☆".repeat(5 - nota);
  return `<span class="text-kershew-ouro-escuro" aria-hidden="true">${cheias}</span><span class="text-kershew-carvao/30" aria-hidden="true">${vazias}</span>`;
}

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

function criarCard(item, avaliavel, gerenciavel) {
  const { dia, semana } = detalhesDaData(item.data);
  const imagem = item.foto
    ? `<img src="${item.foto}" alt="Foto do prato: ${escapar(item.prato)}" class="h-40 w-full object-cover">`
    : `<div class="flex h-40 w-full items-center justify-center bg-kershew-creme text-sm text-kershew-carvao/60">Sem foto</div>`;
  const parteDaNota = avaliavel
    ? `${criarControleDeNota(item)}
       <p class="mt-2 text-sm">Nota atual: ${item.nota} de 5. Clique nas estrelas para avaliar.</p>`
    : `<p class="mt-4 text-xl" aria-label="Nota ${item.nota} de 5">${criarEstrelas(item.nota)}</p>
       <p class="text-sm">Nota ${item.nota} de 5</p>`;

  const botaoExcluir = gerenciavel
    ? `<button type="button" data-excluir="${item.data}"
         aria-label="Excluir o prato ${escapar(item.prato)}"
         class="mt-4 rounded border border-red-700 px-4 py-2 text-sm font-bold text-red-700 hover:bg-red-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-700">Excluir prato</button>`
    : "";

  return `
    <article class="overflow-hidden rounded border border-kershew-ouro/40 bg-kershew-superficie">
      ${imagem}
      <div class="p-5">
        <p class="text-sm font-bold text-kershew-ouro-escuro">${semana}, ${dia}</p>
        <h3 class="mt-2 text-lg font-bold">${escapar(item.prato)}</h3>
        ${parteDaNota}
        ${botaoExcluir}
      </div>
    </article>
  `;
}

function renderizarCardapio() {
  const lista = document.getElementById("lista-cardapio");
  if (!lista) return; // esta página não tem a lista de cards
  const avaliavel = lista.dataset.avaliavel === "true";
  const gerenciavel = lista.dataset.gerenciavel === "true";

  if (cardapio.length === 0) {
    lista.innerHTML = `<p class="col-span-full">Nenhum prato cadastrado. Adicione um prato no formulário acima ou restaure o cardápio original.</p>`;
    return;
  }
  lista.innerHTML = cardapio.map((item) => criarCard(item, avaliavel, gerenciavel)).join("");
}

// Clique em "Excluir prato": pede confirmação, remove e salva.
function configurarExclusao() {
  const lista = document.getElementById("lista-cardapio");
  if (!lista || lista.dataset.gerenciavel !== "true") return;

  lista.addEventListener("click", (evento) => {
    const botao = evento.target.closest("button[data-excluir]");
    if (!botao) return;

    const item = cardapio.find((prato) => prato.data === botao.dataset.excluir);
    if (!item) return;

    if (!window.confirm(`Excluir o prato "${item.prato}"?`)) return;

    const copia = cardapio;
    cardapio = cardapio.filter((prato) => prato !== item);
    if (!salvarCardapio()) {
      cardapio = copia;
      mostrarErro("Não foi possível excluir o prato. Tente de novo.");
      return;
    }

    mostrarErro("");
    renderizarCardapio();
    mostrarSucesso(`Prato excluído: ${item.prato}. Agora o cardápio tem ${cardapio.length} pratos.`);
  });
}

// Clique nas estrelas: grava a nova nota do prato e redesenha os cards.
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

    // devolve o foco para a estrela clicada (o redesenho recria os botões)
    const novo = lista.querySelector(`button[data-data="${botao.dataset.data}"][data-nota="${botao.dataset.nota}"]`);
    if (novo) novo.focus();
  });
}

// ===== FORMULÁRIO: ADICIONAR PRATO =====
function mostrarErro(mensagem) {
  const erro = document.getElementById("form-erro");
  if (!erro) return;
  erro.textContent = mensagem;
  erro.classList.toggle("hidden", mensagem === "");
}

function mostrarSucesso(mensagem) {
  const sucesso = document.getElementById("form-sucesso");
  if (!sucesso) return;
  sucesso.textContent = mensagem;
  sucesso.classList.toggle("hidden", mensagem === "");
}

// Reduz a foto (largura máxima 800 px, JPEG) para caber no armazenamento do navegador.
function reduzirImagem(arquivo, larguraMax = 800) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(arquivo);
    const img = new Image();
    img.onload = () => {
      const escala = Math.min(1, larguraMax / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * escala);
      canvas.height = Math.round(img.height * escala);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.8));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("imagem inválida"));
    };
    img.src = url;
  });
}

function configurarFormulario() {
  const form = document.getElementById("form-prato");
  if (!form) return; // esta página não tem o formulário

  const campoFoto = document.getElementById("campo-foto");
  const previa = document.getElementById("foto-previa");
  let foto = ""; // foto já reduzida, em formato de texto (data URL)

  function limparFoto() {
    foto = "";
    if (previa) {
      previa.removeAttribute("src");
      previa.classList.add("hidden");
    }
  }

  if (campoFoto) {
    campoFoto.addEventListener("change", async () => {
      const arquivo = campoFoto.files[0];
      limparFoto();
      if (!arquivo) return;

      if (!arquivo.type.startsWith("image/")) {
        mostrarErro("Escolha um arquivo de imagem (JPG, PNG...).");
        campoFoto.value = "";
        return;
      }
      try {
        foto = await reduzirImagem(arquivo);
        if (previa) {
          previa.src = foto;
          previa.classList.remove("hidden");
        }
        mostrarErro("");
      } catch (erro) {
        mostrarErro("Não foi possível ler essa imagem. Tente outra.");
        campoFoto.value = "";
      }
    });
  }

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const data = document.getElementById("campo-data").value;
    const prato = document.getElementById("campo-prato").value.trim();
    const nota = Number(document.getElementById("campo-nota").value);

    if (!data || !prato) {
      mostrarErro("Preencha a data e o nome do prato.");
      return;
    }
    if (!Number.isInteger(nota) || nota < 1 || nota > 5) {
      mostrarErro("Escolha uma nota de 1 a 5.");
      return;
    }
    if (cardapio.some((item) => item.data === data)) {
      mostrarErro("Já existe um prato para essa data.");
      return;
    }

    mostrarErro("");
    mostrarSucesso("");

    const novo = { data, prato, nota };
    if (foto) novo.foto = foto;

    cardapio.push(novo);
    cardapio.sort((a, b) => a.data.localeCompare(b.data));

    if (!salvarCardapio()) {
      cardapio = cardapio.filter((item) => item !== novo);
      mostrarErro("Não foi possível salvar o prato. Se enviou uma foto, tente uma menor ou cadastre sem foto.");
      return;
    }

    renderizarCardapio();
    form.reset();
    limparFoto();
    mostrarSucesso(`Prato adicionado: ${prato}. Agora o cardápio tem ${cardapio.length} pratos.`);
  });

  const botaoRestaurar = document.getElementById("btn-restaurar");
  if (botaoRestaurar) {
    botaoRestaurar.addEventListener("click", () => {
      cardapio = cardapioPadrao.map((item) => ({ ...item }));
      salvarCardapio();
      mostrarErro("");
      limparFoto();
      form.reset();
      renderizarCardapio();
      mostrarSucesso("Cardápio original restaurado.");
    });
  }
}

// ===== INICIAR =====
renderizarCardapio();
configurarAvaliacao();
configurarExclusao();
configurarFormulario();