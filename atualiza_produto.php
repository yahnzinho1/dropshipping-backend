<?php

// Recebe os dados enviados pelo JavaScript
$data = json_decode(file_get_contents('php://input'), true);

// Abre o arquivo JSON
$produtos = json_decode(file_get_contents('produtos.json'), true);

// Procura pelo produto com o ID fornecido
foreach ($produtos as &$produto) {
    if ($produto['id'] == $data['id']) {
        // Atualiza os dados do produto
        $produto['nome'] = $data['nome'];
        $produto['preco'] = $data['preco'];
    }
}

// Salva as alterações no arquivo JSON
file_put_contents('produtos.json', json_encode($produtos, JSON_PRETTY_PRINT));

// Retorna uma mensagem de sucesso
echo "Produto atualizado com sucesso!";
?>
