// dropshippingCore.js

/**
 * Importa produtos do fornecedor através de API pública.
 */
async function importarProdutosFornecedor(apiUrl, apiKey) {
  const response = await fetch(`${apiUrl}/products`, {
    headers: { 'Authorization': `Bearer ${apiKey}` }
  });
  const data = await response.json();
  return data.products || [];
}

/**
 * Sincroniza estoque local com fornecedor.
 */
async function sincronizarEstoqueComFornecedor(apiUrl, apiKey, produtosLocais) {
  const produtosFornecedor = await importarProdutosFornecedor(apiUrl, apiKey);
  const atualizacoes = [];

  for (const local of produtosLocais) {
    const remoto = produtosFornecedor.find(p => p.id === local.idFornecedor);
    if (remoto && remoto.quantity !== local.estoque) {
      atualizacoes.push({ id: local.id, novoEstoque: remoto.quantity });
    }
  }

  return atualizacoes;
}

/**
 * Aplica margem, frete e taxa fixa para precificar produto.
 */
function aplicarRegraDePrecificacaoDinamica(produto, regra = { margemPercentual: 40, frete: 15, taxaFixa: 2 }) {
  const precoCusto = parseFloat(produto.price);
  const margem = precoCusto * (regra.margemPercentual / 100);
  const precoFinal = precoCusto + margem + regra.frete + regra.taxaFixa;
  return Math.ceil(precoFinal * 100) / 100;
}

/**
 * Detecta produtos com estoque crítico.
 */
function verificarRupturaEstoqueCritico(produtos, limiteMinimo = 5) {
  return produtos.filter(p => p.quantity <= limiteMinimo);
}

/**
 * Integra com API da Shopee para subir novo produto.
 */
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
    return await response.json();
  } catch (e) {
    console.error("Erro ao integrar com Shopee:", e);
    return null;
  }
}

/**
 * Gera um pedido localmente no sistema.
 */
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

/**
 * Detecta possíveis fraudes em pedidos com base em regras simples.
 */
function detectarPedidoFraude(pedido) {
  const suspeito =
    pedido.total > 1000 ||
    pedido.cliente.cidade.toLowerCase().includes("favela") ||
    pedido.cliente.email.includes("+") ||
    pedido.cliente.nome.split(" ").length < 2;

  return suspeito;
}

/**
 * Notifica o cliente sobre mudanças no pedido.
 */
async function notificarClienteStatusPedido(email, pedidoId, status) {
  const payload = {
    to: email,
    subject: `Atualização do Pedido ${pedidoId}`,
    message: `Seu pedido está agora com o status: ${status}`
  };

  console.log("Notificando cliente:", payload);
  // Aqui você pode integrar com SendGrid, AWS SES, etc.
}
