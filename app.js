import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { get, child } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDmkOA4qM-djOhha2_PoIaTGTp08VYpdaE",
  authDomain: "catalogo-dropshipping-b9546.firebaseapp.com",
  databaseURL: "https://catalogo-dropshipping-b9546-default-rtdb.firebaseio.com",
  projectId: "catalogo-dropshipping-b9546",
  storageBucket: "catalogo-dropshipping-b9546.firebasestorage.app",
  messagingSenderId: "687748267454",
  appId: "1:687748267454:web:b0c8c2c85f639926f54def",
  measurementId: "G-ND6SRRNH4W"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const produtosRef = ref(db, "produtos");

// Cria elementos HTML para exibir e editar produtos
function criarElementoProduto(id, produto) {
  const div = document.createElement("div");
  div.className = "produto";

  const nomeInput = document.createElement("input");
  nomeInput.value = produto.nome || "";

  const precoInput = document.createElement("input");
  precoInput.type = "number";
  precoInput.value = produto.preco || 0;

  const descTextarea = document.createElement("textarea");
  descTextarea.value = produto.descricao || "";

  const btnSalvar = document.createElement("button");
  btnSalvar.textContent = "Salvar Alterações";
  btnSalvar.onclick = () => {
    update(ref(db, "produtos/" + id), {
      nome: nomeInput.value,
      preco: parseFloat(precoInput.value),
      descricao: descTextarea.value
    }).then(() => {
      alert("Produto atualizado com sucesso!");
    }).catch((error) => {
      alert("Erro ao atualizar: " + error.message);
    });
  };

  div.appendChild(nomeInput);
  div.appendChild(precoInput);
  div.appendChild(descTextarea);
  div.appendChild(btnSalvar);

  return div;
}




window.onload = () => {
  const container = document.getElementById("produtosContainer");

  // Formulário de novo produto
  const form = document.createElement("div");
  form.innerHTML = `
    <h3>Novo Produto</h3>
    <input id="novoNome" placeholder="Nome do produto"><br>
    <input id="novoPreco" type="number" placeholder="Preço"><br>
    <textarea id="novaDescricao" placeholder="Descrição"></textarea><br>
    <button id="btnAdicionar">Adicionar Produto</button>
    <hr>
  `;
  document.body.insertBefore(form, container);

  // Ação de adicionar produto
  document.getElementById("btnAdicionar").onclick = () => {
    const nome = document.getElementById("novoNome").value.trim();
    const preco = parseFloat(document.getElementById("novoPreco").value);
    const descricao = document.getElementById("novaDescricao").value.trim();

    if (!nome || isNaN(preco)) {
      alert("Preencha corretamente nome e preço.");
      return;
    }

    const novoProduto = {
      nome,
      preco,
      descricao
    };

    // Insere no Firebase
    const novoRef = ref(db, "produtos");
    import("https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js").then(({ push }) => {
      push(novoRef, novoProduto)
        .then(() => alert("Produto adicionado!"))
        .catch(err => alert("Erro ao adicionar produto: " + err.message));
    });
  };

  // Escuta mudanças no Realtime Database
  onValue(produtosRef, (snapshot) => {
    if (!container) {
      console.error("Elemento com ID 'produtosContainer' não encontrado.");
      return;
    }

    container.innerHTML = "";
    const dados = snapshot.val();
    if (dados) {
      for (const id in dados) {
        const produtoDiv = criarElementoProduto(id, dados[id]);
        container.appendChild(produtoDiv);
      }
    } else {
      container.innerHTML = "<p>Nenhum produto cadastrado.</p>";
    }
  });
};
