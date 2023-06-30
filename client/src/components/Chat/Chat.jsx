import React, {useRef, useState, useEffect} from 'react'
import {Input} from '@mui/material'
import SendIcon from '@mui/icons-material/Send';
import style from './Chat.module.css'
import CryptoJS from 'crypto-js'

export default function Chat({socket}) {

  const bottomRef = useRef()
  const messageRef = useRef()
  const [messageList, setMessageList] = useState([])

  function gerarChave() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%¨&*/';
    let chaveAleatoria = '';
    
    for (let i = 0; i < 11; i++) {
      const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
      chaveAleatoria += caracteres.charAt(indiceAleatorio);
    }
    
    return chaveAleatoria;
  }
  
  useEffect(() => {
    socket.on('receive_message', async pacote => {
      //Estraindo a mensagem e a chave publica.
      const message = pacote.message
      const secretKey = pacote.secretKey

      // Passando a mensagem e chave para o metodo de decrypt
      const decryptedBytes = CryptoJS.AES.decrypt(message, secretKey).toString(CryptoJS.enc.Utf8)
      
      // Substituindo a mensagem criptografada pela mensagem original no pacote.
      pacote.message = decryptedBytes
      console.log(pacote.author)
      // Adicionando todos os dados ao array de mensagens para que o front possa exibi-los
      setMessageList(current => [...current, pacote]);
    });
  
    return () => socket.off('receive_message');
  }, [socket]);

  useEffect(()=>{
    scrollDown()
  }, [messageList])


  const handleSubmit = async  () => {
    // Coletando mensagem digitada pelo user
    const message = messageRef.current.value
    if (!message.trim()) return
    
    //Gerando Chave Publica
    const secretKey = gerarChave()
    // Criptografando a mensagem usando CryptoJS
    const encryptedMessage = CryptoJS.AES.encrypt(message, secretKey).toString()

    // Criando pacote para ser enviado ao servidor
    const pacote = {
      message: encryptedMessage,
      secretKey
    }

    // Enviando pacotes
    socket.emit('message',pacote)


    clearInput();
    focusInput();
  }

  const clearInput = () => {
    messageRef.current.value = ''
  }

  const focusInput = () => {
    messageRef.current.focus()
  }

  const getEnterKey = (e) => {
    if(e.key === 'Enter')
      handleSubmit()
  }

  const scrollDown = () => {
    bottomRef.current.scrollIntoView({behavior: 'smooth'})
  }


  return (
    <div>
      <div className={style['chat-container']}>
        <div className={style["chat-body"]}>
        {
          messageList.map((message,index) => (
            <div className={`${style["message-container"]} ${message.authorId === socket.id && style["message-mine"]}`} key={index}>
              <div className="message-author"><strong>{message.author}</strong></div>
              <div className="message-message">{message.message}</div>
            </div>
          ))
        }
        <div ref={bottomRef} />
        </div>
        <div className={style["chat-footer"]}>
          <Input inputRef={messageRef} placeholder='Mensagem' onKeyDown={(e)=>getEnterKey(e)} fullWidth />
          <SendIcon sx={{m:1, cursor: 'pointer'}} onClick={()=>handleSubmit()} color="primary" />
        </div>
      </div>
    </div>
  )
}