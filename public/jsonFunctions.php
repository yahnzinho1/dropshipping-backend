<?php
/**
 * jsonFunctions.php
 * Biblioteca universal de funções auxiliares para manipulação de JSON
 * Pode ser usada em qualquer aplicação PHP (WordPress, Vanilla PHP, APIs etc)
 * 
 * Desenvolvido por ChatGPT para Maurício Wagner dos Reis
 */

// ✅ Converte array para JSON com tratamento de erros
function jsonEncodeSafe($data, $pretty = false) {
    $options = JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES;
    if ($pretty) $options |= JSON_PRETTY_PRINT;
    
    $json = json_encode($data, $options);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        return false;
    }
    return $json;
}

// ✅ Converte JSON para array com validação
function jsonDecodeSafe($json, $assoc = true) {
    $result = json_decode($json, $assoc);
    if (json_last_error() !== JSON_ERROR_NONE) {
        return false;
    }
    return $result;
}

// ✅ Valida se uma string é JSON válida
function isValidJson($string) {
    json_decode($string);
    return (json_last_error() === JSON_ERROR_NONE);
}

// ✅ Lê um arquivo JSON do disco e retorna como array
function readJsonFile($filepath) {
    if (!file_exists($filepath)) return false;
    $json = file_get_contents($filepath);
    return jsonDecodeSafe($json);
}

// ✅ Escreve um array em um arquivo JSON
function writeJsonFile($filepath, $data, $pretty = true) {
    $json = jsonEncodeSafe($data, $pretty);
    if ($json === false) return false;
    return file_put_contents($filepath, $json) !== false;
}

// ✅ Atualiza um campo específico dentro de um arquivo JSON
function updateJsonField($filepath, $key, $value) {
    $data = readJsonFile($filepath);
    if ($data === false) return false;
    $data[$key] = $value;
    return writeJsonFile($filepath, $data);
}

// ✅ Remove um campo específico de um arquivo JSON
function removeJsonField($filepath, $key) {
    $data = readJsonFile($filepath);
    if ($data === false || !isset($data[$key])) return false;
    unset($data[$key]);
    return writeJsonFile($filepath, $data);
}

// ✅ Mescla dois arrays JSON (prioridade para o segundo)
function mergeJsonArrays($json1, $json2) {
    $a1 = jsonDecodeSafe($json1);
    $a2 = jsonDecodeSafe($json2);
    if ($a1 === false || $a2 === false) return false;
    return jsonEncodeSafe(array_merge($a1, $a2));
}

// ✅ Extrai um valor de chave aninhada usando notação "dot" (ex: "cliente.endereco.cidade")
function getNestedJsonValue($array, $keyPath) {
    $keys = explode('.', $keyPath);
    foreach ($keys as $key) {
        if (!isset($array[$key])) return null;
        $array = $array[$key];
    }
    return $array;
}

// ✅ Define um valor em chave aninhada usando notação "dot"
function setNestedJsonValue(&$array, $keyPath, $value) {
    $keys = explode('.', $keyPath);
    $ref = &$array;
    foreach ($keys as $key) {
        if (!isset($ref[$key]) || !is_array($ref[$key])) {
            $ref[$key] = [];
        }
        $ref = &$ref[$key];
    }
    $ref = $value;
}

// ✅ Remove uma chave aninhada
function unsetNestedJsonValue(&$array, $keyPath) {
    $keys = explode('.', $keyPath);
    $ref = &$array;
    while (count($keys) > 1) {
        $key = array_shift($keys);
        if (!isset($ref[$key]) || !is_array($ref[$key])) return false;
        $ref = &$ref[$key];
    }
    $lastKey = array_shift($keys);
    unset($ref[$lastKey]);
    return true;
}

// ✅ Filtra um array JSON com base em uma chave e valor
function filterJsonArrayByKeyValue($array, $key, $value) {
    return array_filter($array, function ($item) use ($key, $value) {
        return isset($item[$key]) && $item[$key] == $value;
    });
}

// ✅ Ordena um array JSON por uma chave
function sortJsonArrayByKey(&$array, $key, $ascending = true) {
    usort($array, function ($a, $b) use ($key, $ascending) {
        $valA = $a[$key] ?? null;
        $valB = $b[$key] ?? null;
        return $ascending ? $valA <=> $valB : $valB <=> $valA;
    });
}
