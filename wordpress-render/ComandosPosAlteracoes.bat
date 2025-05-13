git add .
//Esse abaixocomando adiciona todos os arquivos modificados ou novos para serem incluídos no commit.
git commit -m "Deploy WordPress com Docker"

//Esse comando abaixo cria um commit com uma mensagem descritiva.
git pull origin main --rebase

//Esse comando abaixo sincroniza com a versão remota para evitar conflitos antes de enviar.
git push origin main

