const notaMinima = 1;
const notaMaxima = 5;
const LimitePositiva = 4;
const LimiteOtima = 4.5;
const LimiteBoa = 3;

const dados = [
    {dia: "Segunda-feira", data: "14/09/2026", prato: "Arroz, feijão, frango assado e salada de repolho", nota: 4.5},
    {dia: "Terça-feira", data: "15/09/2026", prato: "Feijão, arroz, carne moída e salada de alface", nota: 3.5},
    {dia: "Quarta-feira", data: "16/09/2026", prato: "Macarrão com queijo, tomate e alface", nota: 4.0},
    {dia: "Quinta-feira", data: "17/09/2026", prato: "Peixe grelhado, arroz e salada de cenoura", nota: 4.8},
    {dia: "Sexta-feira", data: "18/09/2026", prato: "Hambúrguer, batata frita e suco de laranja", nota: 3.8},
    {dia: "Sábado", data: "19/09/2026", prato: "Pizza de pepperoni com refrigerante", nota: 4.2}
];

function classificar(nota) {
    if (nota >= LimiteOtima) {
        return "Ótima";
    } else if (nota >= LimiteBoa) {
        return "Boa";
    } else {
        return "Precisa melhorar";
    }
}

const soma = dados.reduce((total, item) => total + item.nota, 0);
const media = soma / dados.length;

const avaliacoesPositivas = dados.filter(item => item.nota >= LimitePositiva).length;

const classificacaoGeral = classificar(media);

function calcular() {
    const resultado = document.getElementById("resultado");
    resultado.innerHTML = `<h2 class="text-2xl font-bold mb-4">Resumo do cardápio</h2>
    <p><strong>Soma das notas:</strong> ${soma.toFixed(2)}</p>
    <p><strong>Média das notas:</strong> ${media.toFixed(2)}</p>
    <p><strong>Avaliações positivas:</strong> ${avaliacoesPositivas}</p>
    <p><strong>Classificação geral:</strong> ${classificacaoGeral}</p>`;
}


console.log("Dados do cardápio:", dados);
console.log("Soma das notas:", soma);
console.log("Média das notas:", media);
console.log("Avaliações positivas:", avaliacoesPositivas);
console.log("Classificação geral:", classificacaoGeral);