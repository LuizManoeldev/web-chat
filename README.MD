# Proposta de Projeto: Implementação de Criptografia em um Aplicativo de Mensagens

Este projeto consiste no desenvolvimento de um aplicativo de mensagens que utiliza criptografia de ponta a ponta para garantir a segurança das mensagens trocadas entre os usuários. A criptografia será implementada utilizando algoritmos como AES (Advanced Encryption Standard) ou RSA (Rivest-Shamir-Adleman).

## Instalação

Para executar o aplicativo, siga as instruções abaixo:

1. Certifique-se de ter o [Node.js](https://nodejs.org) instalado em seu sistema.
2. Clone este repositório em sua máquina local.
3. Abra o terminal na pasta `client` e execute o comando `npm install` para instalar as dependências do cliente.
4. Em seguida, abra o terminal na pasta `server` e execute também o comando `npm install` para instalar as dependências do servidor.
5. Após a conclusão da instalação, execute o comando `npm run dev` no terminal da pasta `client` e no terminal da pasta `server` para iniciar o aplicativo.

## Funcionalidades

O aplicativo de mensagens possui as seguintes funcionalidades:

- Registro de usuários: os usuários podem se cadastrar no aplicativo fornecendo um nome de usuário
- Troca de mensagens: os usuários podem enviar mensagens criptografadas uns aos outros.
- Criptografia de ponta a ponta: a criptografia AES (Advanced Encryption Standard) é utilizada para criptografar as mensagens antes de serem enviadas e descriptografá-las no destino.
- Chave de criptografia: os usuários compartilham uma chave secreta que é usada tanto para criptografar quanto para descriptografar as mensagens trocadas.

## Criptografia

A criptografia no aplicativo de mensagens é implementada usando o algoritmo AES (Advanced Encryption Standard) com o modo de operação CBC (Cipher Block Chaining). A biblioteca CryptoJS é utilizada para fornecer implementações de algoritmos criptográficos, incluindo o AES.

A criptografia simétrica é adotada, o que significa que a mesma chave é usada tanto para criptografar quanto para descriptografar os dados. Portanto, remetentes e destinatários devem compartilhar a mesma chave secreta para garantir a comunicação criptografada.

A criptografia de ponta a ponta garante que somente os usuários envolvidos na conversa possam ler as mensagens, pois a criptografia ocorre no dispositivo do remetente e a descriptografia ocorre no dispositivo do destinatário.

