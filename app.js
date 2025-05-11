
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";


// 🔧 Substitua pelos dados reais do seu projeto Firebase
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



const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const produtosRef = ref(db, "produtos");

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
	  alert('ok');alert(update);
    update(ref(db, "produtos/" + id), {
      nome: nomeInput.value,
      preco: parseFloat(precoInput.value),
      descricao: descTextarea.value
    });
    alert("Produto atualizado!");
  };

  div.appendChild(nomeInput);
  div.appendChild(precoInput);
  div.appendChild(descTextarea);
  div.appendChild(btnSalvar);

  return div;
}

onValue(produtosRef, (snapshot) => {
  const container = document.getElementById("produtosContainer");
  container.innerHTML = "";
  const dados = snapshot.val();
  for (const id in dados) {
    const produtoDiv = criarElementoProduto(id, dados[id]);
    container.appendChild(produtoDiv);
  }
});
