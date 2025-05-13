FROM php:8.1-apache

# Instala extensões PHP necessárias
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
    && docker-php-ext-install pdo pdo_mysql mysqli
	
	# Habilita mod_rewrite do Apache
RUN a2enmod rewrite

COPY public/ /var/www/html/
EXPOSE 80
