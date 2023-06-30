const { Socket } = require('socket.io')


const { text } = require('express')
const app = require('express')() // importando a biblioteca express
const server = require('http').createServer(app) // criando o servidor passando o express como parametro
const io = require('socket.io')(server,{cors:{origin:'http://localhost:5173'}}) // importando o socket.io, passando como parametro
// o server e um objeto com: cors = recurso que limita o numero de requisições, aceitando so da url passada

const PORT = 3001 //porta padrao usada para o backend



io.on('connection', socket => {
    //console.log('Usuario conectado. ID:', socket.id)

    socket.on('disconnect', readon =>{
        //console.log('Usuario Desconectado', socket.id)
    })

    socket.on('set_username', username => {
        socket.data.username = username
        console.log(`${socket.data.username} entrou`)
    })

   
    socket.on('message', pacote => {
        console.log(socket.data.username)
        console.log(`Enviou: ${pacote.message}`)
        
        // Recebendo mensagem e enviando novamente para ser exibida no chat
        // Adicionando informações: Nome do Autor e ID do autor
        io.emit('receive_message', {
            message: pacote.message,
            authorId: socket.id,
            author: socket.data.username,
            secretKey: pacote.secretKey
        })

    })
})

//rodar o servidor:
            //porta  //mensagem por arrow fucntion
server.listen(PORT, () => console.log('Server Running...'))
