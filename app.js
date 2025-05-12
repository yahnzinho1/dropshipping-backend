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

// Função que aplica o tema
function aplicarTema(tema = "neonBlackGold") {
  const temas = {
    neonBlackGold: `
      body {
        margin: 0;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #000;
        color: #ffd700;
        animation: rainbowShadow 5s infinite alternate;
      }

      @keyframes rainbowShadow {
        0%   { box-shadow: 0 0 10px red; }
        20%  { box-shadow: 0 0 10px orange; }
        40%  { box-shadow: 0 0 10px yellow; }
        60%  { box-shadow: 0 0 10px green; }
        80%  { box-shadow: 0 0 10px blue; }
        100% { box-shadow: 0 0 10px violet; }
      }

      .login-container, .produto-container, .form-container {
        max-width: 500px;
        margin: 30px auto;
        padding: 20px;
        border-radius: 15px;
        background-color: #111;
        color: #ffd700;
        border: 2px solid #ffd700;
        box-shadow: 0 0 15px rgba(255, 215, 0, 0.5), 0 0 40px rgba(255, 255, 255, 0.1);
        animation: rainbowShadow 10s infinite alternate;
      }

      h2, h3 {
        color: #ffd700;
        text-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
      }

      .input-field {
        width: 100%;
        padding: 12px;
        margin: 10px 0;
        border-radius: 8px;
        border: 1px solid #ffd700;
        background-color: #222;
        color: #ffd700;
      }

      .button {
        padding: 12px 20px;
        background: linear-gradient(to right, #ffcc00, #ffaa00);
        color: #000;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease-in-out;
        box-shadow: 0 0 10px #ffd700;
      }

      .button:hover {
        background: linear-gradient(to right, #ffaa00, #ffcc00);
        box-shadow: 0 0 20px #ffd700;
      }

      .produto {
        border: 1px solid #ffd700;
        padding: 15px;
        margin: 10px 0;
        border-radius: 10px;
        background-color: #1a1a1a;
        box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
      }

      .produto input, .produto textarea {
        width: 100%;
        padding: 10px;
        margin: 10px 0;
        border-radius: 8px;
        border: 1px solid #ffd700;
        background-color: #222;
        color: #ffd700;
      }

      .status {
        color: #ff4444;
        font-size: 14px;
      }
    `
  };

  let estiloFinal = "";

  if (typeof tema === "string" && temas[tema]) {
    estiloFinal = temas[tema];
  } else if (typeof tema === "object") {
    estiloFinal = tema.css || "";
  } else {
    console.warn("Tema não reconhecido.");
    return;
  }

  const styleTag = document.createElement("style");
  styleTag.innerHTML = estiloFinal;
  document.head.appendChild(styleTag);
}


// Aplica o tema

aplicarTema();

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
