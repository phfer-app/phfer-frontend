"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Send, Bot, User, Loader2 } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function IntegratedChatbot() {
  const { language } = useLanguage()
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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
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
    <Card className="w-full max-w-4xl mx-auto mt-12 border-2 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-primary/5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-base">PedroBot</h3>
            <p className="text-xs text-muted-foreground">
              {language === 'pt' ? 'Assistente Virtual' : 'Virtual Assistant'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="h-[400px] overflow-y-auto p-4 space-y-4 bg-background/50">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                <Bot className="h-4 w-4 text-primary" />
              </div>
            )}
            <div
              className={`max-w-[75%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap wrap-break-word">{message.content}</p>
            </div>
            {message.role === 'user' && (
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0 mt-1">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div className="bg-muted rounded-lg p-3">
              <div className="flex gap-2 items-center">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-xs text-muted-foreground">
                  {language === 'pt' ? 'PedroBot está digitando...' : 'PedroBot is typing...'}
                </span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-background flex gap-2">
        <Input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={language === 'pt' ? 'Digite sua mensagem para o PedroBot...' : 'Type your message to PedroBot...'}
          disabled={isLoading}
          className="flex-1"
          maxLength={1000}
        />
        <Button
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
          size="icon"
          className="shrink-0"
          aria-label={language === 'pt' ? 'Enviar mensagem' : 'Send message'}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </Card>
  )
}

