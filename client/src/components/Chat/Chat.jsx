import React, {useRef, useState, useEffect} from 'react'
import {Input} from '@mui/material'
import SendIcon from '@mui/icons-material/Send';
import style from './Chat.module.css'
import CryptoJS from 'crypto-js'
import { object } from 'prop-types';



export default function Chat({socket}) {

  const bottomRef = useRef()
  const messageRef = useRef()
  const [messageList, setMessageList] = useState([])

    // Função para converter uma string hexadecimal em ArrayBuffer
  function hexStringToArrayBuffer(hexString) {
    const strippedString = hexString.replace(/\s/g, '');
    const buffer = new ArrayBuffer(strippedString.length / 2);
    const uint8View = new Uint8Array(buffer);
    for (let i = 0; i < strippedString.length; i += 2) {
      const byteValue = parseInt(strippedString.substr(i, 2), 16);
      uint8View[i / 2] = byteValue;
    }
    return buffer;
  }

  // Importa a chave como uma chave criptográfica usando a API Web Crypto
  async function importEncryptionKey() {
    const encryptionKey = '0123456789abcdef0123456789abcdef';
    const keyBuffer = hexStringToArrayBuffer(encryptionKey);
  
    const importedKey = await window.crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'AES-CBC', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
  
    return importedKey;
  }
  const importedKey = importEncryptionKey();

  // Cria um vetor de inicialização aleatório
  const iv = window.crypto.getRandomValues(new Uint8Array(16));

  // Criptografa uma mensagem usando a chave fornecida
  async function criptografar(message) {
    const textEncoder = new TextEncoder();
    const encodedMessage = textEncoder.encode(message);
    // Criptografa a mensagem usando a chave e o vetor de inicialização
    const encryptedData = await window.crypto.subtle.encrypt(
      { name: 'AES-CBC', iv },
      await importedKey,
      encodedMessage
    );

    // Retorna a mensagem criptografada e o vetor de inicialização
    return encryptedData;
  }

  // Descriptografa uma mensagem usando a chave fornecida
  async function decryptMessage(encryptedData) {
    // Descriptografa a mensagem usando a chave e o vetor de inicialização
    const decryptedData = await window.crypto.subtle.decrypt(
      { name: 'AES-CBC', iv },
      await importedKey,
      hexStringToArrayBuffer(encryptedData)
    );

    const textDecoder = new TextDecoder();
    const decryptedMessage = textDecoder.decode(decryptedData);

    return decryptedMessage;
  }

  function arrayBufferToHex(buffer) {
    const byteArray = new Uint8Array(buffer);
    const hexParts = [];
    for (let i = 0; i < byteArray.length; i++) {
      const hex = byteArray[i].toString(16).padStart(2, '0');
      hexParts.push(hex);
    }
    return hexParts.join('');
  }

  function hexToBuffer(hexString) {
    // Remover espaços em branco da string hexadecimal
    const strippedString = hexString.replace(/\s/g, '');
  
    // Verificar se o comprimento da string é par
    if (strippedString.length % 2 !== 0) {
      throw new Error('A string hexadecimal deve ter um número par de dígitos.');
    }
  
    // Criar um ArrayBuffer com metade do comprimento da string
    const buffer = new ArrayBuffer(strippedString.length / 2);
    const uint8View = new Uint8Array(buffer);
  
    // Converter cada par de dígitos em um byte e armazenar no ArrayBuffer
    for (let i = 0; i < strippedString.length; i += 2) {
      const byteValue = parseInt(strippedString.substr(i, 2), 16);
      uint8View[i / 2] = byteValue;
    }
  
    return buffer;
  }


  useEffect(() => {
    socket.on('receive_message', async data => {
   
      const decryptedMessage = await decryptMessage(data.text);

      const updatedMessage = {
        ...data,
        text: decryptedMessage
      };
   
   
      setMessageList(current => [...current, updatedMessage]);
    });
  
    return () => socket.off('receive_message');
  }, [socket]);


  const handleSubmit = async  () => {
    const message = messageRef.current.value
    if (!message.trim()) return
    

    try {
      const buffer = await criptografar(message)
      const buffer2 = arrayBufferToHex(buffer)
   

      socket.emit('message', buffer2);
      
      clearInput();
      focusInput(); 
    } catch (error) {
      console.error('Erro ao criptografar a mensagem:', error);
    }
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

  useEffect(()=>{
    scrollDown()
  }, [messageList])

  return (
    <div>
      <div className={style['chat-container']}>
        <div className={style["chat-body"]}>
        {
          messageList.map((message,index) => (
            <div className={`${style["message-container"]} ${message.authorId === socket.id && style["message-mine"]}`} key={index}>
              <div className="message-author"><strong>{message.author}</strong></div>
              <div className="message-text">{message.text}</div>

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