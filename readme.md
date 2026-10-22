# Avaliação do Cardápio Escolar

Projeto de WebDesign: um site onde o usuário avalia, com estrelas, o cardápio escolar de seis dias e vê o resultado calculado na hora.

## O que o site faz

- Mostra **seis pratos** (14 a 21 de setembro de 2026) em cards, cada um com cinco estrelas clicáveis.
- Ao clicar numa estrela, a nota é salva no navegador e o resultado é recalculado.
- Exibe **média, soma das notas, quantidade de avaliações positivas** e a **classificação** do cardápio.
- As notas são **fictícias**, e o site **não faz recomendação médica ou nutricional**.

## Regras de avaliação

| Item | Regra |
|---|---|
| Escala | Notas de 1 a 5 |
| Avaliação positiva | Nota 4 ou mais |
| Ótima | Média a partir de 4,5 |
| Boa | Média de 3,0 até menos de 4,5 |
| Precisa melhorar | Média abaixo de 3,0 |

## Estrutura da página

Cabeçalho, menu com links internos, seção de propósito, seção de cards, seção de resultados (via JavaScript), seção com os seis dados processados e rodapé com integrantes e turma.

## Tecnologias

HTML, CSS, JavaScript, Tailwind CSS e Docker.

## Arquivos principais

- `app.js`: dados do cardápio, desenho dos cards e das estrelas, clique de avaliação e exibição dos resultados.
- `Calculos.js`: só faz a conta (média, soma, positivas e classificação). Não mexe na página.
- `imagens/`: fotos dos pratos (campo `foto` de cada item no `app.js`).

## Como editar o cardápio

No início do `app.js`, altere a lista `cardapioPadrao` (campos `data`, `prato`, `nota` e `foto`).
As notas ficam salvas no navegador (localStorage). Depois de mudar o cardápio no código, apague a chave `cardapio-escolar` ou troque o valor de `CHAVE_ARMAZENAMENTO` para ver as mudanças.

## Integrantes

Júlio e Carlos Eduardo, turma TSI.