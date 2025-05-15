<?php
/**
 * motor.php
 * Motor JSON para simulação de banco de dados e armazenamento em servidores estáticos
 * Compatível com WordPress ou qualquer aplicação PHP
 */

define('DB_JSON_PATH', __DIR__ . '/db-json'); // Diretório local para simular banco
if (!file_exists(DB_JSON_PATH)) {
    mkdir(DB_JSON_PATH, 0755, true);
}

// Função para salvar dados (inserção ou atualização)
function salvar_json($tabela, $dados) {
    $arquivo = DB_JSON_PATH . "/{$tabela}.json";
    $registros = file_exists($arquivo) ? json_decode(file_get_contents($arquivo), true) : [];

    // Se for array com índice, adiciona novo
    if (isset($dados['id'])) {
        $registros[$dados['id']] = $dados;
    } else {
        $dados['id'] = uniqid();
        $registros[$dados['id']] = $dados;
    }

    file_put_contents($arquivo, json_encode($registros, JSON_PRETTY_PRINT));
    return $dados['id'];
}

// Função para buscar todos os registros
function buscar_todos_json($tabela) {
    $arquivo = DB_JSON_PATH . "/{$tabela}.json";
    if (!file_exists($arquivo)) return [];
    return json_decode(file_get_contents($arquivo), true);
}

// Função para buscar um registro por ID
function buscar_por_id_json($tabela, $id) {
    $registros = buscar_todos_json($tabela);
    return isset($registros[$id]) ? $registros[$id] : null;
}

// Função para deletar por ID
function deletar_por_id_json($tabela, $id) {
    $registros = buscar_todos_json($tabela);
    if (isset($registros[$id])) {
        unset($registros[$id]);
        file_put_contents(DB_JSON_PATH . "/{$tabela}.json", json_encode($registros, JSON_PRETTY_PRINT));
        return true;
    }
    return false;
}

// Função exemplo para retornar link de conteúdo estático armazenado
function gerar_link_estatico($nome_arquivo, $servico = 'onedrive') {
    $base_links = [
        'onedrive' => 'https://onedrive.live.com/embed?cid=SUA_CID_E_ARQUIVO=',
        'github'   => 'https://raw.githubusercontent.com/SEU_USUARIO/SEU_REPO/main/',
        'dropbox'  => 'https://dl.dropboxusercontent.com/s/SEU_CAMINHO/'
    ];

    return isset($base_links[$servico]) ? $base_links[$servico] . urlencode($nome_arquivo) : '';
}
?>
