Proposta de Projeto:

Implementação de criptografia em um aplicativo de mensagens: Desenvolva um aplicativo de mensagens que use criptografia de ponta a ponta para garantir a segurança das mensagens. Isso pode incluir a implementação de algoritmos de criptografia como AES ou RSA.

-----------------------------------------------------------------------------------------------------

Ações Necessarias para execução: 
*npm install*
    -  terminal da pasta client
    -  terminal da pasta server
*npm run dev*
    -  terminal da pasta client
    -  terminal da pasta server

-----------------------------------------------------------------------------------------------------

Proposta Apresentada:
A aplicação ChatWeb é desenvolvida no ambiente Vite, usando o FrameWork React para o FrontEnd e usando Sockets para realização da comunicação
em tempo real.

Criptografia:
Está sendo usado o algoritmo de criptografia AES (Advanced Encryption Standard) com o modo de operação CBC (Cipher Block Chaining) para criptografar a mensagem. A biblioteca crypto-js que está sendo utilizada é uma biblioteca JavaScript que fornece implementações de algoritmos criptográficos, incluindo o AES.

- Trecho do código
const encryptedMessage = CryptoJS.AES.encrypt(message, secretKey).toString();

A função CryptoJS.AES.encrypt é usada para realizar a criptografia. Ela recebe dois parâmetros: a mensagem a ser criptografada (message) e a chave secreta (secretKey).
A mensagem é criptografada usando o algoritmo AES com a chave secreta fornecida. O resultado criptografado é convertido para uma representação em formato de string usando o método toString().

Tipo de Criptografia
A criptografia simétrica é um método de criptografia em que a mesma chave é usada tanto para criptografar quanto para descriptografar os dados. Isso significa que o remetente e o destinatário precisam ter acesso à mesma chave compartilhada para que a comunicação criptografada seja bem-sucedida.