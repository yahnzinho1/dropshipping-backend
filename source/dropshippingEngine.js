

/*
Liste produtos automaticamente

Sincronize estoque e preços

Faça pedidos diretamente ao fornecedor

Acompanhe o status dos pedidos

Atualize informações de rastreamento
*/


// dropshippingEngine.js

/**
 * Conecta a um fornecedor de dropshipping e armazena as credenciais para futuras requisições.
 * Suporte a múltiplos tipos de autenticação (API Key, Bearer Token, Basic Auth).
 *
 * @param {string} fornecedorId - Identificador interno para este fornecedor.
 * @param {string} apiURL - Endpoint base da API do fornecedor.
 * @param {Object} auth - Objeto de autenticação. Ex: { tipo: 'Bearer', token: '...', chave: '...', usuario: '...', senha: '...' }
 * @returns {Promise<boolean>} - Retorna true se a conexão for validada, senão lança erro.
 */
async function conectarFornecedor(fornecedorId, apiURL, auth) {
    if (!fornecedorId || !apiURL || !auth) {
        throw new Error('Parâmetros obrigatórios ausentes para conectarFornecedor');
    }

    const headers = {};

    switch (auth.tipo.toLowerCase()) {
        case 'bearer':
            headers['Authorization'] = `Bearer ${auth.token}`;
            break;
        case 'apikey':
            headers[auth.nome || 'X-API-Key'] = auth.chave;
            break;
        case 'basic':
            const credenciais = btoa(`${auth.usuario}:${auth.senha}`);
            headers['Authorization'] = `Basic ${credenciais}`;
            break;
        default:
            throw new Error('Tipo de autenticação não suportado.');
    }

    // Teste de conexão opcional
    try {
        const response = await fetch(apiURL, {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            throw new Error(`Falha na conexão com fornecedor (${response.status})`);
        }

        // Armazena o fornecedor conectado (em memória ou localStorage / indexedDB, dependendo da aplicação)
        window.__fornecedoresConectados = window.__fornecedoresConectados || {};
        window.__fornecedoresConectados[fornecedorId] = {
            apiURL,
            headers,
            conectadoEm: new Date().toISOString()
        };

        console.info(`Fornecedor '${fornecedorId}' conectado com sucesso.`);
        return true;

    } catch (err) {
        console.error(`Erro ao conectar com o fornecedor '${fornecedorId}':`, err);
        throw err;
    }
}


//////////////////////////////////////////////////////////////////////////

async function importarProdutosFornecedor(apiUrl, apiKey, categoria = '') {
  const endpoint = `${apiUrl}/product.list.json`;
  const params = new URLSearchParams({
    api_key: apiKey,
    params: JSON.stringify({
      category_id: categoria,
      start: 0,
      count: 100,
      params: ['id', 'name', 'price', 'quantity', 'images', 'description']
    })
  });

  try {
    const response = await fetch(`${endpoint}?${params}`);
    const data = await response.json();

    if (data.return_code === 0) {
      return data.products;
    } else {
      console.error("Erro ao importar produtos:", data.message);
      return [];
    }
  } catch (err) {
    console.error("Erro de conexão com o fornecedor:", err);
    return [];
  }
}

////////////////////////////////////////////////////////////////////

async function enviarPedidoParaFornecedor(apiUrl, apiKey, pedido) {
  const endpoint = `${apiUrl}/order.add.json`;
  const payload = {
    api_key: apiKey,
    params: JSON.stringify({
      customer: {
        first_name: pedido.cliente.nome,
        email: pedido.cliente.email,
        address: pedido.cliente.endereco,
        city: pedido.cliente.cidade,
        zip: pedido.cliente.cep,
        country: pedido.cliente.pais
      },
      products: pedido.produtos.map(prod => ({
        product_id: prod.id,
        quantity: prod.quantidade
      }))
    })
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(payload)
    });

    const data = await response.json();
    return data.return_code === 0;
  } catch (err) {
    console.error("Falha ao enviar pedido:", err);
    return false;
  }
}
///////////////////////////////////////////////////////////

async function obterStatusPedidoFornecedor(apiUrl, apiKey, idPedidoFornecedor) {
  const endpoint = `${apiUrl}/order.info.json`;
  const params = new URLSearchParams({
    api_key: apiKey,
    params: JSON.stringify({ order_id: idPedidoFornecedor })
  });

  try {
    const response = await fetch(`${endpoint}?${params}`);
    const data = await response.json();
    if (data.return_code === 0) {
      return data.order.status;
    } else {
      console.warn("Erro ao obter status do pedido:", data.message);
      return null;
    }
  } catch (err) {
    console.error("Erro de conexão:", err);
    return null;
  }
}

////////////////////////////////////////////////////
async function sincronizarEstoqueComFornecedor(apiUrl, apiKey, produtosLocais) {
  const produtosFornecedor = await importarProdutosFornecedor(apiUrl, apiKey);
  const atualizacoes = [];

  for (const local of produtosLocais) {
    const remoto = produtosFornecedor.find(p => p.id === local.idFornecedor);
    if (remoto && remoto.quantity !== local.estoque) {
      atualizacoes.push({
        id: local.id,
        novoEstoque: remoto.quantity
      });
    }
  }

  return atualizacoes;
}
////////////////////////////////////////////////////

function aplicarRegraDePrecificacaoDinamica(produto, regra = { margemPercentual: 40, frete: 15, taxaFixa: 2 }) {
  const precoCusto = parseFloat(produto.price);
  const margem = precoCusto * (regra.margemPercentual / 100);
  const precoFinal = precoCusto + margem + regra.frete + regra.taxaFixa;

  return Math.ceil(precoFinal * 100) / 100; // Arredonda para 2 casas
}

//////////////////////////////////////////////////

function verificarRupturaEstoqueCritico(produtos, limiteMinimo = 5) {
  return produtos.filter(p => p.quantity <= limiteMinimo);
}

////////////////////////////////////////////////

async function integrarComShopee(apiEndpoint, token, produto) {
  try {
    const response = await fetch(`${apiEndpoint}/item/add`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: produto.nome,
        price: produto.preco,
        stock: produto.estoque,
        images: [produto.imagem],
        description: produto.descricao
      })
    });
    const data = await response.json();
    return data;
  } catch (e) {
    console.error("Erro ao integrar com Shopee:", e);
    return null;
  }
}
///////////////////////////////////////////

function gerarPedidoLocal(cliente, produtos) {
  const total = produtos.reduce((acc, p) => acc + (p.preco * p.quantidade), 0);
  return {
    id: `PED-${Date.now()}`,
    data: new Date().toISOString(),
    cliente,
    produtos,
    total,
    status: "aguardando_pagamento"
  };
}

/////////////////////////////////////

function detectarPedidoFraude(pedido) {
  const suspeito =
    pedido.total > 1000 ||
    pedido.cliente.cidade.toLowerCase().includes("favela") ||
    pedido.cliente.email.includes("+") ||
    pedido.cliente.nome.split(" ").length < 2;

  return suspeito;
}
/////////////////////////////////////////

async function notificarClienteStatusPedido(email, pedidoId, status) {
  const payload = {
    to: email,
    subject: `Atualização do Pedido ${pedidoId}`,
    message: `Seu pedido está agora com o status: ${status}`
  };

  // Simulando notificação (substituir com API real de envio de e-mail)
  console.log("Notificando cliente:", payload);
}


////////////////////////////////////






window.teste = function(){
	//alert('ok');
}