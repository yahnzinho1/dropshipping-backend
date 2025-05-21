<?php
// firebaseFunctions.php

// 🔐 Autenticar com Firebase
function firebaseLogin($email, $password, $apiKey) {
    $url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={$apiKey}";

    $postData = json_encode([
        'email' => $email,
        'password' => $password,
        'returnSecureToken' => true
    ]);

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $result = curl_exec($ch);
    curl_close($ch);

    return json_decode($result, true);
}

// ➕ Inserir dados no Firebase
function firebaseInsert($path, $data, $idToken = null) {
    $url = "https://SEU_PROJETO.firebaseio.com/{$path}.json";
    if ($idToken) {
        $url .= "?auth={$idToken}";
    }

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);

    $response = curl_exec($ch);
    curl_close($ch);

    return json_decode($response, true);
}

// 📝 Atualizar dados no Firebase
function firebaseUpdate($path, $data, $idToken = null) {
    $url = "https://SEU_PROJETO.firebaseio.com/{$path}.json";
    if ($idToken) {
        $url .= "?auth={$idToken}";
    }

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PATCH");
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);
    curl_close($ch);

    return json_decode($response, true);
}

// ❌ Deletar dados do Firebase
function firebaseDelete($path, $idToken = null) {
    $url = "https://SEU_PROJETO.firebaseio.com/{$path}.json";
    if ($idToken) {
        $url .= "?auth={$idToken}";
    }

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);
    curl_close($ch);

    return json_decode($response, true);
}



/*
//Exemplo de importação estando numa função da pasta themes de um tema
//////////////////////////////////////////////

<?php
// Caminho absoluto até firebaseFunctions.php
$basePath = dirname(dirname(dirname(__DIR__))); // Sobe três níveis até "public"
require_once $basePath . '/firebaseFunctions.php';

add_action('init', function() {
    $apiKey = 'SUA_FIREBASE_API_KEY';
    $login = firebaseLogin('email@email.com', 'senha123', $apiKey);

    if (!empty($login['idToken'])) {
        $data = [
            'produto' => 'Notebook',
            'preco' => 3499.99
        ];
        $resultado = firebaseInsert('produtos', $data, $login['idToken']);
        error_log('Produto inserido: ' . print_r($resultado, true));
    }
});

//////////////////////////////////////
*/
