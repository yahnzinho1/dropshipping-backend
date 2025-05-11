const container = document.getElementById("produtos");

function carregarProdutos() {
  db.collection("produtos").onSnapshot(snapshot => {
    container.innerHTML = '';
    snapshot.forEach(doc => {
      const produto = doc.data();
      const div = document.createElement("div");
      div.className = "produto";
      div.innerHTML = `
        <strong>${produto.nome}</strong><br>
        R$ <input type="number" value="${produto.preco}" id="preco-${doc.id}">
        <button onclick="salvar('${doc.id}')">Salvar</button>
      `;
      container.appendChild(div);
    });
  });
}

function salvar(id) {
  const novoPreco = parseFloat(document.getElementById("preco-" + id).value);
  db.collection("produtos").doc(id).update({ preco: novoPreco })
    .then(() => alert("Atualizado!"))
    .catch(err => console.error(err));
}

carregarProdutos();