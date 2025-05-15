<?php
/*
 * Template Name: Tema Dropshipping Profissional
 * Description: Tema moderno, responsivo e profissional para dropshipping com motor JSON e suporte a plugins.
 * Author: Seu Nome
 * Version: 1.0
 */

get_header(); // Carrega header padrão do WordPress (flexível para plugins e child themes)
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Servshop - Sua Loja Virtual de Alta Performance</title>
    <?php wp_head(); // Importa scripts, estilos e plugins ?>
    <link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/style.css" />
</head>
<body <?php body_class(); ?>>

<header class="header__container">
    <div class="logo__area">
        <h1>Servshop</h1>
        <p class="tagline">Os Melhores Produtos, Preços Imbatíveis, Entrega Rápida!</p>
    </div>

    <nav class="main__nav">
        <?php
        if(has_nav_menu('primary')) {
            wp_nav_menu(['theme_location' => 'primary', 'menu_class' => 'menu__principal']);
        } else {
            echo '<ul class="menu__principal"><li><a href="#">Início</a></li><li><a href="#">Categorias</a></li><li><a href="#">Promoções</a></li><li><a href="#">Contato</a></li></ul>';
        }
        ?>
    </nav>

    <div class="search__container">
        <form role="search" method="get" action="<?php echo home_url('/'); ?>">
            <input type="search" name="s" placeholder="Buscar produtos..." aria-label="Buscar produtos" />
            <button type="submit" title="Buscar">🔍</button>
        </form>
    </div>
</header>

<main class="content__container">
    <section class="promo__highlight">
        <h2>Ofertas Exclusivas para Você</h2>
        <p>Descubra uma seleção incomparável de produtos com preços especiais, frete grátis acima de R$99 e entrega ágil garantida!</p>
    </section>

    <section class="produtos__destaque">
        <h3>Produtos em Destaque</h3>
        <div class="grid__produtos">

        <?php
        // Produtos mockados - futuramente integrar via motor JSON e WP loop
        $produtos = [
            [
                'nome' => 'Canetas Artísticas Premium - 24 a 168 Cores',
                'descricao' => 'Marcadores de ponta dupla à base de óleo, ideais para desenhos, esboços e material escolar.',
                'preco' => 'R$31,19',
                'preco_antigo' => 'R$86,87',
                'avaliacao' => 4.6,
                'vendidos' => 3000,
                'imagem' => 'https://onedrive.live.com/download?cid=EXEMPLO&resid=EXEMPLO&authkey=EXEMPLO' // Exemplo servidor estático gratuito
            ],
            [
                'nome' => 'Fita Retro para Cartão com Cordão Resistente',
                'descricao' => 'Ideal para identificação, crachás e proteção de seus cartões com estilo vintage.',
                'preco' => 'R$11,69',
                'preco_antigo' => 'R$28,61',
                'avaliacao' => 4.8,
                'vendidos' => 2000,
                'imagem' => 'https://onedrive.live.com/download?cid=EXEMPLO2&resid=EXEMPLO2&authkey=EXEMPLO2'
            ],
            // ... adicionar mais produtos conforme necessário
        ];

        foreach($produtos as $p): ?>
            <article class="produto__card">
                <img src="<?php echo esc_url($p['imagem']); ?>" alt="<?php echo esc_attr($p['nome']); ?>" />
                <h4><?php echo $p['nome']; ?></h4>
                <p class="descricao"><?php echo $p['descricao']; ?></p>
                <p class="preco">
                    <span class="preco__atual"><?php echo $p['preco']; ?></span>
                    <span class="preco__antigo"><?php echo $p['preco_antigo']; ?></span>
                </p>
                <p class="avaliacao">⭐ <?php echo number_format($p['avaliacao'],1); ?> • <?php echo number_format($p['vendidos']); ?> vendidos</p>
                <button class="btn__comprar" title="Comprar Agora">🛒 Comprar</button>
            </article>
        <?php endforeach; ?>

        </div>
    </section>

    <section class="vantagens__servshop">
        <h3>Por que escolher a Servshop?</h3>
        <ul>
            <li>🚚 Frete gratuito para compras acima de R$99 em todos os produtos selecionados</li>
            <li>⚡ Entrega rápida e garantida com suporte e reembolso em caso de problemas</li>
            <li>💎 Produtos selecionados com qualidade premium e preços exclusivos</li>
            <li>💳 Pagamentos seguros e diversos métodos para sua comodidade</li>
        </ul>
    </section>

</main>

<footer class="footer__container">
    <p>&copy; <?php echo date('Y'); ?> Servshop - Todos os direitos reservados.</p>
    <p>Desenvolvido para máxima performance e integração com WordPress e plugins.</p>
</footer>

<?php wp_footer(); ?>
</body>
</html>