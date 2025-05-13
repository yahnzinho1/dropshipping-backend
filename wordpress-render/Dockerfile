# Escolha a imagem PHP com Apache
FROM php:7.4-apache

# Instale a extensão mysqli
RUN docker-php-ext-install mysqli && docker-php-ext-enable mysqli

# Copie os arquivos do WordPress para o diretório do Apache
COPY src/ /var/www/html/

# Dê as permissões corretas
RUN chown -R www-data:www-data /var/www/html

# Exponha a porta usada pelo Apache
EXPOSE 80
