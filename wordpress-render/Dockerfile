FROM php:7.4-apache

# Instala e ativa a extensão mysqli
RUN docker-php-ext-install mysqli && docker-php-ext-enable mysqli

# Copia os arquivos do WordPress para o diretório padrão do Apache
COPY src/ /var/www/html/

# Expõe a porta padrão do Apache
EXPOSE 80
