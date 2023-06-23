import React, {useRef} from 'react'
import io from 'socket.io-client'
import style from './Join.module.css'
import {Input, Button} from '@mui/material'

export default function Join({setChatVisibility, setSocket}) {
  const usernameRef = useRef()

  const handleSubmit = async () => {
    const username = usernameRef.current.value.trim()

    // Testando se o username não está vazio
    if (!username) return
  
    // Sanitizando o username usando regex para permitir apenas letras, números e underscores
    const sanitizedUsername = username.replace(/[^a-zA-Z0-9_]/g, '')
  
    // Fazendo conexão com o servidor
    const socket = await io.connect('http://localhost:3001')
    socket.emit('set_username', sanitizedUsername);
    
    //Passando o socket para a aplicacao principal
    setSocket(socket)

    // Tornando o chat visível
    setChatVisibility(true)
  }
  const getEnterKey = (e) => {
    if(e.key === 'Enter')
      handleSubmit()
  }

  return (
    <div className={style['join-container']}>
      <h2>GRUPO</h2>
      <Input inputRef={usernameRef } onKeyDown={(e)=>getEnterKey(e)} placeholder='Nome de usuário' />
      <Button sx={{mt:2}} onClick={()=>handleSubmit()} variant="contained">Entrar</Button>
    </div>
  )
}
