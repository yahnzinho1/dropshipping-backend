


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

//Função que aplica tema universal
function aplicarTemaUniversal(nomeTema = "neonBlackGold") {
  let estilo = "";

  if (nomeTema === "neonBlackGold") {
    estilo = `
      :root {
        --gold-neon: #FFD700;
        --black-deep: #0d0d0d;
        --rainbow-gradient: 
          linear-gradient(45deg, red, orange, yellow, green, cyan, blue, violet, red);
      }

      body {
        background-color: var(--black-deep);
        color: var(--gold-neon);
        font-family: 'Segoe UI', sans-serif;
        margin: 0;
        padding: 0;
        animation: rainbowShadow 10s linear infinite;
      }

      * {
        box-sizing: border-box;
        transition: all 0.3s ease;
      }

      h1, h2, h3, h4, h5, h6, label {
        color: var(--gold-neon);
        text-shadow: 0 0 5px var(--gold-neon);
      }

      input, textarea, select {
        background-color: #1a1a1a;
        color: var(--gold-neon);
        border: 1px solid var(--gold-neon);
        border-radius: 5px;
        padding: 10px;
        width: 100%;
      }

      button {
        background-color: var(--gold-neon);
        color: var(--black-deep);
        border: none;
        border-radius: 5px;
        padding: 10px 20px;
        cursor: pointer;
        font-weight: bold;
        box-shadow: 0 0 10px var(--gold-neon), 0 0 20px var(--gold-neon);
      }

      button:hover {
        background-color: #e6b800;
      }

      .login-container, .form-container, .produto, .card, .container {
        background-color: #121212;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 0 12px 2px rgba(255, 215, 0, 0.4), 0 0 30px 6px rgba(255, 215, 0, 0.2);
        margin: 15px auto;
      }

      @keyframes rainbowShadow {
        0% { box-shadow: 0 0 15px red; }
        14% { box-shadow: 0 0 15px orange; }
        28% { box-shadow: 0 0 15px yellow; }
        42% { box-shadow: 0 0 15px green; }
        57% { box-shadow: 0 0 15px cyan; }
        71% { box-shadow: 0 0 15px blue; }
        85% { box-shadow: 0 0 15px violet; }
        100% { box-shadow: 0 0 15px red; }
      }
    `;
  } else {
    // Tema padrão leve
    estilo = `
      body {
        background-color: #f4f4f4;
        color: #333;
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
      }
    `;
  }

  const tag = document.createElement("style");
  tag.innerHTML = estilo;
  document.head.appendChild(tag);
}








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
