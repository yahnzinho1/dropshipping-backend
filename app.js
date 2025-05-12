


window.myServerBase = "https://yahnzinho1.github.io/";
window.myProject = myServerBase + "dropshipping-backend/";
 
// Função para carregar dinamicamente scripts JS externos
function appendScript(scriptUrl, callback = null) {
  const script = document.createElement('script');
  script.src = scriptUrl;
  script.type = 'text/javascript';
  script.async = true;
  script.onload = () => {
    if (typeof callback === 'function') callback();
  };
  script.onerror = () => {
    console.error('Erro ao carregar o script:', scriptUrl);
  };
  document.head.appendChild(script);
}

// Carrega efeitos visuais e de mídia personalizados
appendScript(myProject + "mediaEffectsHandler.js");



import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import {
  getDatabase,
  ref,
  onValue,
  update,
  push
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

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
const auth = getAuth(app);



alert('ok');
// Aplica o tema

//aplicarTema();
aplicarTemaUniversal();

// Referência ao container
const container = document.getElementById("produtosContainer");

// Interface de login/cadastro
const loginDiv = document.createElement("div");
loginDiv.classList.add("login-container");
loginDiv.innerHTML = `
  <h2>Autenticação</h2>
  <input id="email" type="email" placeholder="Seu e-mail" class="input-field"><br>
  <input id="senha" type="password" placeholder="Sua senha" class="input-field"><br>
  <button id="btnLogin" class="button">Entrar</button>
  <button id="btnCadastro" class="button" style="background-color: #4CAF50;">Cadastrar</button>
  <p id="status" class="status"></p>
`;
document.body.prepend(loginDiv);

// Lógica de login
document.getElementById("btnLogin").onclick = () => {
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();
  signInWithEmailAndPassword(auth, email, senha)
    .catch(e => document.getElementById("status").textContent = "Erro: " + e.message);
};

// Lógica de cadastro
document.getElementById("btnCadastro").onclick = () => {
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();
  if (senha.length < 6) {
    document.getElementById("status").textContent = "A senha deve ter no mínimo 6 caracteres.";
    return;
  }
  createUserWithEmailAndPassword(auth, email, senha)
    .then(() => {
      document.getElementById("status").style.color = "green";
      document.getElementById("status").textContent = "Cadastro realizado com sucesso!";
    })
    .catch(e => document.getElementById("status").textContent = "Erro: " + e.message);
};

// Detecta login automático
onAuthStateChanged(auth, (user) => {
  if (user) {
    loginDiv.style.display = "none";
    iniciarApp();
  }
});

// Função que carrega o app
function iniciarApp() {
  const produtosRef = ref(db, "produtos");

  // Formulário de novo produto
  const form = document.createElement("div");
  form.classList.add("form-container");
  form.innerHTML = `
    <h3>Novo Produto</h3>
    <input id="novoNome" placeholder="Nome do produto" class="input-field"><br>
    <input id="novoPreco" type="number" placeholder="Preço" class="input-field"><br>
    <textarea id="novaDescricao" placeholder="Descrição" class="input-field"></textarea><br>
    <button id="btnAdicionar" class="button">Adicionar Produto</button>
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

    const novoProduto = { nome, preco, descricao };
    push(produtosRef, novoProduto)
      .then(() => alert("Produto adicionado!"))
      .catch(err => alert("Erro ao adicionar produto: " + err.message));
  };

  // Escuta mudanças no Realtime Database
  onValue(produtosRef, (snapshot) => {
    container.innerHTML = "";
    const dados = snapshot.val();
    if (dados) {
      for (const id in dados) {
        const div = criarElementoProduto(id, dados[id]);
        container.appendChild(div);
      }
    } else {
      container.innerHTML = "<p>Nenhum produto cadastrado.</p>";
    }
  });
}

// Criação de elemento produto
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
  btnSalvar.classList.add("button");
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
