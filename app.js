


window.myServerBase = "https://yahnzinho1.github.io/";
window.myProject = myServerBase + "dropshipping-backend/";
 
// Função para carregar dinamicamente scripts JS externos
let mediaEffectsLoaded = false;

function loadMediaEffectsScript(script_src, callback) {
  if (mediaEffectsLoaded) {
    // Já carregado, só chama a função desejada
    callback?.();
    return;
  }

  const script = document.createElement("script");
  script.src = script_src;//"source/mediaEffectsHandler.js";
  script.type = "text/javascript";
  script.onload = () => {
    mediaEffectsLoaded = true;
    callback?.();
  };
  script.onerror = () => console.error("Erro ao carregar mediaEffectsHandler.js");
  document.head.appendChild(script);
}

// Carrega efeitos visuais e de mídia personalizados
//appendScript(myProject + "mediaEffectsHandler.js");



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



//alert(window.aplicarTemaOuro);
// Aplica o tema

//aplicarTema();
//window.aplicarTemaOuro();

loadMediaEffectsScript("source/mediaEffectsHandler.js", () => {
  if (typeof aplicarTemaUniversal === "function") {
    aplicarTemaUniversal();
  } else {
    console.error("Função aplicarTemaUniversal não encontrada.");
  }
});



loadMediaEffectsScript("source/dropshippingEngine.js", () => {
  if (typeof teste === "function") {
    teste();
  } else {
    console.error("Função teste não encontrada.");
  }
});


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



// Função para adicionar produto via PHP Com Servidor Infinityfree
function adicionarProdutoComServidorInfinityFree(){
  const nome = document.getElementById("novoNome").value.trim();
  const preco = parseFloat(document.getElementById("novoPreco").value);
  const descricao = document.getElementById("novaDescricao").value.trim();

  if (!nome || isNaN(preco)) {
    alert("Preencha corretamente nome e preço.");
    return;
  }

  // Dados a serem enviados
  const produto = { nome, preco, descricao };

  // Envia via AJAX para o PHP
  fetch("https://servshopp.infinityfreeapp.com/addProduct.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `nome=${encodeURIComponent(produto.nome)}&preco=${encodeURIComponent(produto.preco)}&descricao=${encodeURIComponent(produto.descricao)}`
  })
  .then(response => response.text())
  .then(data => {
    alert(data);  // Exibe a resposta do PHP
  })
  .catch(error => {
    alert("Erro ao enviar para o servidor PHP: " + error.message);
  });
}




function adicionarProdutoComServidorFirebase(){
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
}



async function carregarIndexPHPComServidorRepli() {
  try {
    const resposta = await fetch("https://SEU_USUARIO.repl.co/index.php", {
      method: "GET",
      mode: "cors"
    });

    if (!resposta.ok) throw new Error("Erro ao acessar o servidor Replit");

    const html = await resposta.text();
    document.getElementById("areaPHP").innerHTML = html;
  } catch (erro) {
    console.error("Erro ao carregar index.php:", erro);
    document.getElementById("areaPHP").innerHTML = "<p>Erro ao carregar conteúdo PHP.</p>";
  }
}




async function fetchPhp(url) {
    try {
        const resposta = await fetch(url);
        if (!resposta.ok) throw new Error("Erro na resposta do servidor");

        const dados = await resposta.json();
        console.log("Resposta do PHP:", dados);
        alert(dados.mensagem);
    } catch (erro) {
        console.error("Erro ao buscar do Replit:", erro);
        alert("Falha ao conectar com o servidor PHP.");
    }
}


// Opcional: chame automaticamente ao carregar
// window.onload = fetchPhpFromReplit;





function fetchPhpComUpTime(url, delay = 5000) {

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error("Erro de resposta");
      return res.text();
    })
    .then(data => {
      alert("Resposta do servidor: " + data);
    })
    .catch(err => {
      console.warn("Servidor pode estar dormindo. Tentando novamente em 5s...");
      setTimeout(() => {
        fetch(url)
          .then(res => res.text())
          .then(data => alert("Resposta (segunda tentativa): " + data))
          .catch(erroFinal => {
            console.error("Erro persistente:", erroFinal);
            alert("Erro ao tentar conectar ao servidor PHP.");
          });
      }, delay);
    });
}






function fetchPersistente(url, tentativas = 3, delay = 3000) {
  let tentativaAtual = 0;

  function tentarFetch() {
    tentativaAtual++;
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error("Resposta não OK");
        return res.text();
      })
      .then(data => {
        alert("Servidor respondeu: " + data);
      })
      .catch(err => {
        if (tentativaAtual < tentativas) {
          console.log(`Tentativa ${tentativaAtual} falhou. Repetindo em ${delay}ms...`);
          setTimeout(tentarFetch, delay);
        } else {
          alert("Erro: o servidor Replit pode estar dormindo.");
        }
      });
  }

  tentarFetch();
}





  // Ação de adicionar produto
  document.getElementById("btnAdicionar").onclick = () => {
//adicionarProdutoComServidorFirebase();
//adicionarProdutoComServidorInfinityFree();
//fetchPhp("https://2b6b859c-f7f1-4936-9146-d2fbd2b82917-00-1cq7dbnazpy9n.worf.replit.dev/");
fetchPersistente("https://2b6b859c-f7f1-4936-9146-d2fbd2b82917-00-1cq7dbnazpy9n.worf.replit.dev/");
//fetchPhpComUpTime("https://2b6b859c-f7f1-4936-9146-d2fbd2b82917-00-1cq7dbnazpy9n.worf.replit.dev/");
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
