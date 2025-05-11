function criarProduto(produto) {
  const container = document.createElement("div");
  container.className = "produto";

  const nomeLabel = document.createElement("label");
  nomeLabel.textContent = "Nome do produto:";
  const nomeInput = document.createElement("input");
  nomeInput.value = produto.nome;
  nomeInput.id = "nome_" + produto.id;

  const precoLabel = document.createElement("label");
  precoLabel.textContent = "Preço (R$):";
  const precoInput = document.createElement("input");
  precoInput.type = "number";
  precoInput.value = produto.preco;
  precoInput.id = "preco_" + produto.id;

  const btnSalvar = document.createElement("button");
  btnSalvar.textContent = "Salvar Alterações";
  btnSalvar.onclick = () => {
    const nome = nomeInput.value;
    const preco = parseFloat(precoInput.value).toFixed(2);
    alert(`Produto atualizado: ${nome} - R$${preco}`);
  };

  container.appendChild(nomeLabel);
  container.appendChild(nomeInput);
  container.appendChild(precoLabel);
  container.appendChild(precoInput);
  container.appendChild(btnSalvar);

  return container;
}

function carregarProdutos() {
  const container = document.getElementById("produtosContainer");
  window.produtos.forEach(p => {
    container.appendChild(criarProduto(p));
  });
}

window.onload = carregarProdutos;