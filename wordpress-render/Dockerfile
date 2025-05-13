FROM php:8.2-apache

# Instala dependências necessárias
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    curl \
    libzip-dev \
    default-mysql-client \
    && docker-php-ext-install pdo pdo_mysql mysqli \
    && docker-php-ext-enable mysqli

# Ativa mod_rewrite do Apache (necessário para links permanentes do WP)
RUN a2enmod rewrite

# Define diretório de trabalho
WORKDIR /var/www/html

# Copia os arquivos do WordPress para o container
COPY src/ /var/www/html/

# Ajusta permissões
RUN chown -R www-data:www-data /var/www/html
