<?php
/**
 * Funções para integração com APIs de serviços externos como Dropbox, OneDrive, AliExpress, etc.
 */

// ==================== 🔹 Dropbox ====================
function uploadToDropbox($accessToken, $dropboxPath, $localFilePath) {
    $fileContent = file_get_contents($localFilePath);
    $ch = curl_init('https://content.dropboxapi.com/2/files/upload');

    curl_setopt_array($ch, [
        CURLOPT_HTTPHEADER => [
            'Authorization: Bearer ' . $accessToken,
            'Content-Type: application/octet-stream',
            'Dropbox-API-Arg: ' . json_encode([
                "path" => $dropboxPath,
                "mode" => "add",
                "autorename" => true,
                "mute" => false
            ])
        ],
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $fileContent,
        CURLOPT_RETURNTRANSFER => true,
    ]);

    $response = curl_exec($ch);
    curl_close($ch);
    return json_decode($response, true);
}

// ==================== 🔹 OneDrive ====================
function uploadToOneDrive($accessToken, $fileName, $localFilePath) {
    $fileContent = file_get_contents($localFilePath);
    $url = "https://graph.microsoft.com/v1.0/me/drive/root:/{$fileName}:/content";

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_HTTPHEADER => [
            "Authorization: Bearer $accessToken",
            "Content-Type: application/octet-stream",
        ],
        CURLOPT_CUSTOMREQUEST => "PUT",
        CURLOPT_POSTFIELDS => $fileContent,
        CURLOPT_RETURNTRANSFER => true
    ]);

    $response = curl_exec($ch);
    curl_close($ch);
    return json_decode($response, true);
}

// ==================== 🔹 Google Drive (upload resumido) ====================
function uploadToGoogleDrive($accessToken, $filePath, $fileName) {
    $ch = curl_init('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');
    $fileData = file_get_contents($filePath);

    $boundary = uniqid();
    $delimiter = '------' . $boundary;

    $body = "--$delimiter\r\n"
        . "Content-Type: application/json; charset=UTF-8\r\n\r\n"
        . json_encode(["name" => $fileName]) . "\r\n"
        . "--$delimiter\r\n"
        . "Content-Type: application/octet-stream\r\n\r\n"
        . $fileData . "\r\n"
        . "--$delimiter--";

    curl_setopt_array($ch, [
        CURLOPT_HTTPHEADER => [
            "Authorization: Bearer $accessToken",
            "Content-Type: multipart/related; boundary=$delimiter",
            "Content-Length: " . strlen($body),
        ],
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $body,
        CURLOPT_RETURNTRANSFER => true,
    ]);

    $response = curl_exec($ch);
    curl_close($ch);
    return json_decode($response, true);
}

// ==================== 🔹 AliExpress (via RapidAPI) ====================
function searchAliExpressProduct($keyword, $rapidApiKey) {
    $ch = curl_init("https://aliexpress-datahub.p.rapidapi.com/item_search?query=" . urlencode($keyword));

    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            "X-RapidAPI-Host: aliexpress-datahub.p.rapidapi.com",
            "X-RapidAPI-Key: $rapidApiKey"
        ],
    ]);

    $response = curl_exec($ch);
    curl_close($ch);
    return json_decode($response, true);
}

// ==================== 🔹 Shopify (obter produtos) ====================
function getShopifyProducts($shopName, $accessToken) {
    $url = "https://$shopName.myshopify.com/admin/api/2024-01/products.json";
    $ch = curl_init($url);

    curl_setopt_array($ch, [
        CURLOPT_HTTPHEADER => [
            "X-Shopify-Access-Token: $accessToken"
        ],
        CURLOPT_RETURNTRANSFER => true
    ]);

    $response = curl_exec($ch);
    curl_close($ch);
    return json_decode($response, true);
}

// ==================== 🔹 Mercado Livre (busca por categoria) ====================
function searchMercadoLivre($query, $site = 'MLB') {
    $url = "https://api.mercadolibre.com/sites/$site/search?q=" . urlencode($query);
    return json_decode(file_get_contents($url), true);
}

// ==================== 🔹 OpenAI API (exemplo de uso com IA) ====================
function useOpenAI($prompt, $apiKey) {
    $url = 'https://api.openai.com/v1/completions';

    $data = [
        "model" => "text-davinci-003",
        "prompt" => $prompt,
        "max_tokens" => 100,
        "temperature" => 0.7
    ];

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_HTTPHEADER => [
            "Content-Type: application/json",
            "Authorization: Bearer $apiKey"
        ],
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($data),
        CURLOPT_RETURNTRANSFER => true
    ]);

    $response = curl_exec($ch);
    curl_close($ch);
    return json_decode($response, true);
}

/////////////////////////////////////
// ==================== 🔁 Função universal para upload ====================
function uploadToStorageService($service, $accessToken, $remotePath, $localFilePath) {
    switch (strtolower($service)) {
        case 'dropbox':
            return uploadToDropbox($accessToken, $remotePath, $localFilePath);
        case 'onedrive':
            return uploadToOneDrive($accessToken, basename($remotePath), $localFilePath);
        case 'googledrive':
        case 'google_drive':
            return uploadToGoogleDrive($accessToken, $localFilePath, basename($remotePath));
        default:
            return ["error" => "Serviço de armazenamento não suportado: $service"];
    }
}

// ==================== 🛒 Simulação de Venda Dropshipping ====================
function simulateDropshippingSale($platform, $credentials, $productId, $quantity, $customerData = []) {
    switch (strtolower($platform)) {

        case 'aliexpress':
            // Geralmente não há API pública para "emular vendas", mas podemos construir uma URL real de redirecionamento
            $baseUrl = "https://www.aliexpress.com/item/$productId.html";
            return [
                "redirect_url" => $baseUrl,
                "note" => "Redirecione o cliente para essa URL e monitore com ferramentas como Pixel/Facebook/Tag Manager."
            ];

        case 'shopify':
            // Shopify exige criação de pedido via API REST
            $url = "https://{$credentials['store']}.myshopify.com/admin/api/2024-01/orders.json";

            $orderPayload = [
                "order" => [
                    "line_items" => [
                        [
                            "variant_id" => $productId,
                            "quantity" => $quantity
                        ]
                    ],
                    "customer" => [
                        "first_name" => $customerData["first_name"] ?? "Cliente",
                        "last_name" => $customerData["last_name"] ?? "Final",
                        "email" => $customerData["email"] ?? "exemplo@dominio.com"
                    ],
                    "financial_status" => "paid"
                ]
            ];

            $ch = curl_init($url);
            curl_setopt_array($ch, [
                CURLOPT_HTTPHEADER => [
                    "Content-Type: application/json",
                    "X-Shopify-Access-Token: {$credentials['access_token']}"
                ],
                CURLOPT_POST => true,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_POSTFIELDS => json_encode($orderPayload)
            ]);
            $response = curl_exec($ch);
            curl_close($ch);
            return json_decode($response, true);

        case 'mercadolivre':
            return [
                "note" => "O Mercado Livre não permite pedidos simulados via API sem processo de autorização real.",
                "info" => "Você pode monitorar links de produtos com parâmetros UTM, ou usar a API de produtos para gerar links rastreáveis."
            ];

        default:
            return ["error" => "Plataforma de dropshipping não suportada: $platform"];
    }
}









$accessTokenOneDrive = 'SEU_ACCESS_TOKEN_ONEDRIVE';
$fileId = 'ID_DO_ARQUIVO_RETORNADO_NO_UPLOAD';



function getOneDriveFileIdByName($accessTokenOneDrive, $fileName) {
    $url = "https://graph.microsoft.com/v1.0/me/drive/root/children";

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_HTTPHEADER => [
            "Authorization: Bearer $accessTokenOneDrive"
        ],
        CURLOPT_RETURNTRANSFER => true
    ]);

    $response = curl_exec($ch);
    curl_close($ch);

    $result = json_decode($response, true);
    foreach ($result['value'] as $file) {
        if ($file['name'] === $fileName) {
            return $file['id'];
        }
    }
    return null; // Arquivo não encontrado
}





function getOneDriveShareLink($accessTokenOneDrive, $fileId) {
    $url = "https://graph.microsoft.com/v1.0/me/drive/items/$fileId/createLink";

    $body = json_encode(["type" => "view", "scope" => "anonymous"]);

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_HTTPHEADER => [
            "Authorization: Bearer $accessTokenOneDrive",
            "Content-Type: application/json"
        ],
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $body,
        CURLOPT_RETURNTRANSFER => true
    ]);

    $response = curl_exec($ch);
    curl_close($ch);

    $result = json_decode($response, true);
    return $result['link']['webUrl'] ?? null;
}






function getLinkByScraping($email, $password, $loginUrl, $filesUrl) {
    $cookieFile = tempnam(sys_get_temp_dir(), 'cookie');

    // 1. Login e salva sessão
    $loginData = http_build_query([
        'email' => $email,
        'password' => $password
    ]);
    $ch = curl_init($loginUrl);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $loginData,
        CURLOPT_COOKIEJAR => $cookieFile,
        CURLOPT_RETURNTRANSFER => true
    ]);
    curl_exec($ch);
    curl_close($ch);

    // 2. Acessa lista de arquivos
    $ch = curl_init($filesUrl);
    curl_setopt_array($ch, [
        CURLOPT_COOKIEFILE => $cookieFile,
        CURLOPT_RETURNTRANSFER => true
    ]);
    $response = curl_exec($ch);
    curl_close($ch);

    // 3. Extrai link público da resposta (ajustar com regex específico)
    if (preg_match('/https:\/\/[^\s"]+\/public\/[^\s"]+/i', $response, $matches)) {
        return $matches[0];
    }
    return null;
}



/*
🔧 Exemplo:
// getPublicLink('sapato.bmp') retorna link armazenado localmente
$imgSrc = getPublicLink('sapato.bmp');
echo "<img src=\"$imgSrc\">";
*/




/*
✅ Exemplo de uso em qualquer app ou tema:
Upload de arquivo:
php
Copiar
Editar
$response = uploadToStorageService(
    'dropbox',
    $accessToken,
    '/Public/meuarquivo.txt',
    __DIR__ . '/temp/meuarquivo.txt'
);
Simular venda no Shopify:
php
Copiar
Editar
$response = simulateDropshippingSale(
    'shopify',
    ['store' => 'minhaloja', 'access_token' => 'seu_token'],
    123456789, // variant_id do produto
    1,
    [
        'first_name' => 'João',
        'last_name' => 'Silva',
        'email' => 'joao@email.com'
    ]
);
*/










/*
////Exemplo de uso de emulação de dropshipping com chamadas a partir de elemento html.......
🛠️ Estrutura dos Arquivos
css
Copiar
Editar
/public
├── integrationsFunctions.php
└── loja
    ├── index.php         ← Página HTML com botão "Comprar"
    └── comprar.php       ← Endpoint para processar a venda (chama simulateDropshippingSale)
✅ 1. index.php (interface HTML com botão)
php
Copiar
Editar
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Minha Loja</title>
</head>
<body>

  <h2>Produto Exemplo</h2>
  <p>Preço: R$ 99,90</p>

  <form action="comprar.php" method="post">
    <input type="hidden" name="product_id" value="123456789">
    <input type="hidden" name="platform" value="shopify">
    <input type="hidden" name="quantity" value="1">

    <!-- Informações do cliente simuladas -->
    <input type="hidden" name="first_name" value="João">
    <input type="hidden" name="last_name" value="Silva">
    <input type="hidden" name="email" value="joao@email.com">

    <button type="submit">Comprar</button>
  </form>

</body>
</html>
✅ 2. comprar.php (usa simulateDropshippingSale)
php
Copiar
Editar
<?php
require_once __DIR__ . '/../integrationsFunctions.php';

// Dados do formulário
$productId = $_POST['product_id'] ?? null;
$platform = $_POST['platform'] ?? 'shopify';
$quantity = $_POST['quantity'] ?? 1;
$firstName = $_POST['first_name'] ?? 'Cliente';
$lastName = $_POST['last_name'] ?? 'Desconhecido';
$email = $_POST['email'] ?? 'email@exemplo.com';

// Simular venda
$result = simulateDropshippingSale(
    $platform,
    [
        'store' => 'minhaloja',
        'access_token' => 'SEU_ACCESS_TOKEN_SHOPIFY'
    ],
    $productId,
    $quantity,
    [
        'first_name' => $firstName,
        'last_name' => $lastName,
        'email' => $email
    ]
);

// Tratar resultado
if (isset($result['error'])) {
    echo "Erro: " . $result['error'];
} elseif (isset($result['redirect_url'])) {
    // Caso de redirecionamento (ex: AliExpress)
    header("Location: " . $result['redirect_url']);
    exit;
} else {
    // Exibir resposta bruta da API
    echo "<pre>";
    print_r($result);
    echo "</pre>";
}
🧪 Teste Prático
Copie o integrationsFunctions.php para a pasta /public.

Coloque os arquivos index.php e comprar.php em /public/loja/.

Acesse http://localhost/loja/index.php.

Clique em "Comprar" → o backend processará a requisição e:

Redirecionará para o AliExpress (caso seja essa plataforma).

Criará uma ordem no Shopify (se configurado com token real).

Ou exibirá os dados da simulação.
*/







/* Exemplos de uso para renderizar links de dados armazenados pelas funções de armazenamentos de dados com servidores de armazenamento externo com apis públicas
<?php
$accessToken = 'SEU_ACCESS_TOKEN_DO_ONEDRIVE';
$fileName = 'sapato.bmp';

// Primeiro, obtém o ID do arquivo
$fileId = getOneDriveFileIdByName($accessToken, $fileName);

// Depois, gera o link de compartilhamento
$shareLink = $fileId ? getOneDriveShareLink($accessToken, $fileId) : null;
?>

<!DOCTYPE html>
<html>
<head>
    <title>Visualização do OneDrive</title>
</head>
<body>
    <h2>Imagem carregada via OneDrive:</h2>
    <?php if ($shareLink): ?>
        <img src="<?php echo htmlspecialchars($shareLink); ?>" alt="Imagem sapato.bmp" width="400">
    <?php else: ?>
        <p>Imagem não encontrada ou erro ao gerar link.</p>
    <?php endif; ?>
</body>
</html>
*/