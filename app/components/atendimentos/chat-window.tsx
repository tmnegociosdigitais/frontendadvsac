'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Phone, 
  Video, 
  MoreVertical, 
  Image, 
  Paperclip, 
  Send, 
  Camera, 
  List, 
  Bookmark, 
  MessageSquare, 
  Smile, 
  FileUp,
  User
} from 'lucide-react'

interface Message {
  id: string
  content: string
  from: string
  timestamp: Date
  status: 'sent' | 'received' | 'read'
  type: 'text' | 'image' | 'document'
}

interface Contact {
  id: string
  name: string | null
  phone: string
}

interface ChatWindowProps {
  contact: Contact | null
  messages: Message[]
  onSendMessage: (message: string, type: 'text' | 'image' | 'document') => void
  onStatusChange: (status: string) => void
  onToggleContactDetails: () => void
}

export function ChatWindow({
  contact,
  messages,
  onSendMessage,
  onStatusChange,
  onToggleContactDetails
}: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return
    onSendMessage(newMessage, 'text')
    setNewMessage('')
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSendMessage()
    }
  }

  if (!contact) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Selecione um chat para começar</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${contact.phone}`} />
              <AvatarFallback>{contact.name?.[0] || contact.phone[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{contact.name || contact.phone}</h3>
              <p className="text-sm text-muted-foreground">
                {isTyping ? 'Digitando...' : 'Online'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Video className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={onToggleContactDetails}
              title="Detalhes do Contato"
            >
              <User className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onStatusChange('RESOLVED')}>
                  Marcar como Resolvido
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange('PENDING')}>
                  Marcar como Pendente
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.print()}>
                  Imprimir Conversa
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Tags Input */}
        <div className="mt-2">
          <Input placeholder="Tags" className="h-8" />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${
                message.from === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  message.from === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {message.type === 'text' ? (
                  <p>{message.content}</p>
                ) : message.type === 'image' ? (
                  <img
                    src={message.content}
                    alt="Imagem"
                    className="max-w-full rounded"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Paperclip className="w-4 h-4" />
                    <span>Documento</span>
                  </div>
                )}
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span className="text-xs opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                  {message.from === 'user' && (
                    <Badge variant="secondary" className="text-[10px] px-1">
                      {message.status}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Right Sidebar */}
        <div className="w-12 border-l flex flex-col items-center py-4 space-y-4">
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Câmera/Mídia">
            <Camera className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Lista">
            <List className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Anexos">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Marcadores">
            <Bookmark className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Respostas Rápidas">
            <MessageSquare className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Emojis">
            <Smile className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Enviar Arquivo">
            <FileUp className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Input */}
      <div className="border-t p-3">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Digite uma mensagem..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 h-9"
          />
          <Button 
            onClick={handleSendMessage} 
            size="icon"
            className="h-9 w-9"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
