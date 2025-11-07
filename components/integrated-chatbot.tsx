"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Send, Bot, User, Loader2 } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { useIsMobile } from "@/hooks/use-mobile"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function IntegratedChatbot() {
  const { language } = useLanguage()
  const isMobile = useIsMobile()
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: language === 'pt' 
        ? 'Olá! Eu sou o PedroBot 🤖, assistente virtual do Pedro. Estou aqui para responder suas perguntas sobre ele, seus projetos e habilidades. Como posso ajudar?'
        : 'Hello! I\'m PedroBot 🤖, Pedro\'s virtual assistant. I\'m here to answer your questions about him, his projects and skills. How can I help?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    // Scroll apenas dentro do container de mensagens, não da página inteira
    const container = document.getElementById('chat-messages-container')
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth"
      })
    }
  }

  useEffect(() => {
    // Scroll apenas quando novas mensagens são adicionadas, mas não força scroll da página
    const timer = setTimeout(() => {
      scrollToBottom()
    }, 100)
    return () => clearTimeout(timer)
  }, [messages])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = input
    setInput('')
    setIsLoading(true)

    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      console.log('Enviando mensagem para:', `${API_URL}/chat`)
      
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          conversationHistory
        }),
      })

      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))

      // Tentar ler o texto da resposta primeiro para debug
      const responseText = await response.text()
      console.log('Response text:', responseText)

      if (!response.ok) {
        let errorData = {}
        try {
          errorData = JSON.parse(responseText)
        } catch (e) {
          errorData = { error: responseText || `Erro ${response.status}: ${response.statusText}` }
        }
        console.error('Erro da API:', errorData)
        throw new Error(errorData.error || errorData.message || `Erro ${response.status}: ${response.statusText}`)
      }

      let data = {}
      try {
        data = JSON.parse(responseText)
      } catch (e) {
        console.error('Erro ao parsear JSON:', e)
        throw new Error('Resposta inválida do servidor')
      }
      
      console.log('Resposta recebida:', data)

      if (data.response) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        throw new Error(data.error || 'Resposta inválida da API')
      }
    } catch (error: any) {
      console.error('Erro completo ao enviar mensagem:', error)
      console.error('Erro message:', error.message)
      console.error('Erro stack:', error.stack)
      
      const errorMessage: Message = {
        role: 'assistant',
        content: language === 'pt'
          ? `Desculpe, ocorreu um erro: ${error.message || 'Erro desconhecido'}. Verifique o console para mais detalhes.`
          : `Sorry, an error occurred: ${error.message || 'Unknown error'}. Check the console for details.`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto border-2 shadow-2xl bg-card/40 backdrop-blur-md relative overflow-hidden group">
      {/* Marca d'água - canto inferior direito */}
      <div className="absolute bottom-3 right-5 text-[10px] text-muted-foreground/30 font-medium z-0 pointer-events-none select-none">
        powered by <span className="text-primary/50 font-semibold">@initpedro</span>
      </div>

      {/* Efeito de brilho sutil no header */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent opacity-50" />

      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b bg-linear-to-r from-primary/10 via-primary/5 to-transparent relative z-10">
        <div className="flex items-center gap-3">
          <div className="relative group/avatar">
            <div className="h-12 w-12 rounded-full bg-linear-to-br from-primary/30 to-primary/10 flex items-center justify-center ring-2 ring-primary/20 shadow-lg transition-transform duration-300 group-hover/avatar:scale-110">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            {/* Indicador de online - mais moderno */}
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-background flex items-center justify-center shadow-md">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-lg bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                PedroBot
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-600 dark:text-green-400 font-semibold border border-green-500/30">
                Online
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">
              {language === 'pt' ? 'Assistente Virtual' : 'Virtual Assistant'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div 
        id="chat-messages-container"
        className="h-[350px] overflow-y-auto p-6 space-y-4 bg-linear-to-b from-background/30 to-background/20 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent relative z-10"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="h-9 w-9 rounded-full bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center shrink-0 mt-1 ring-1 ring-primary/10">
                <Bot className="h-5 w-5 text-primary" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl p-4 shadow-lg ${
                message.role === 'user'
                  ? 'bg-linear-to-br from-primary to-primary/90 text-primary-foreground rounded-br-sm'
                  : 'bg-muted/90 text-foreground border border-border/50 rounded-bl-sm backdrop-blur-sm'
              }`}
            >
              <p className={`text-sm leading-relaxed whitespace-pre-wrap wrap-break-word ${
                message.role === 'user' ? 'text-right' : 'text-left'
              }`}>
                {message.content}
              </p>
            </div>
            {message.role === 'user' && (
              <div className="h-9 w-9 rounded-full bg-linear-to-br from-primary to-primary/80 flex items-center justify-center shrink-0 mt-1 ring-2 ring-primary/20">
                <User className="h-5 w-5 text-primary-foreground" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="h-9 w-9 rounded-full bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center shrink-0 ring-1 ring-primary/10">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div className="bg-muted/90 rounded-2xl rounded-bl-sm p-4 border border-border/50 backdrop-blur-sm shadow-lg">
              <div className="flex gap-2 items-center">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-xs text-muted-foreground font-medium text-left">
                  {language === 'pt' ? 'PedroBot está digitando...' : 'PedroBot is typing...'}
                </span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-5 border-t bg-background/30 backdrop-blur-md relative z-10">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                isMobile 
                  ? (language === 'pt' ? 'Digite aqui...' : 'Type here...')
                  : (language === 'pt' ? 'Digite sua mensagem para o PedroBot...' : 'Type your message to PedroBot...')
              }
              disabled={isLoading}
              className="w-full pr-12 rounded-lg border-2 focus:border-primary/50 transition-colors bg-background/80 backdrop-blur-sm placeholder:text-xs md:placeholder:text-sm"
              maxLength={1000}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground/70 font-medium">
              {input.length}/1000
            </div>
          </div>
          <Button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            size="icon"
            className={`shrink-0 rounded-lg h-11 w-11 bg-linear-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg transition-all duration-200 ${
              !isLoading && input.trim() ? 'cursor-pointer hover:scale-105' : 'opacity-50'
            }`}
            aria-label={language === 'pt' ? 'Enviar mensagem' : 'Send message'}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  )
}

