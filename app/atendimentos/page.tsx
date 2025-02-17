'use client'

import { useState, useEffect } from 'react'
import { TicketList } from '@/app/components/atendimentos/ticket-list'
import { ChatWindow } from '@/app/components/atendimentos/chat-window'
import { ContactDetails } from '@/app/components/atendimentos/contact-details'
import { SidebarNavigation } from '@/app/components/atendimentos/sidebar-navigation'

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
  email?: string | null
  address?: string | null
  tags: { id: string; name: string }[]
  notes?: string | null
}

interface Ticket {
  id: string
  status: string
  priority: string
  contact: Contact
  messages: Message[]
  tags: { id: string; name: string }[]
  createdAt: Date
  updatedAt: Date
}

export default function AtendimentosPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null)
  const [loading, setLoading] = useState(true)
  const [isContactDetailsOpen, setIsContactDetailsOpen] = useState(false)

  useEffect(() => {
    loadTickets()
  }, [])

  const loadTickets = async () => {
    // Mock data para demonstração visual
    const mockTickets: Ticket[] = [
      {
        id: '1',
        status: 'aberto',
        priority: 'alta',
        contact: {
          id: '1',
          name: 'Cliente Exemplo',
          phone: '+5511999999999',
          email: 'cliente@exemplo.com',
          tags: [{ id: '1', name: 'VIP' }, { id: '2', name: 'Reclamação' }]
        },
        messages: [
          {
            id: '1',
            content: 'Bom dia, preciso de ajuda com meu pedido!',
            from: 'client',
            timestamp: new Date(),
            status: 'received',
            type: 'text'
          },
          {
            id: '2',
            content: 'Claro, vamos verificar agora mesmo.',
            from: 'agent',
            timestamp: new Date(),
            status: 'sent',
            type: 'text'
          }
        ],
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
    
    setTickets(mockTickets)
    setActiveTicket(mockTickets[0])
    setLoading(false)
  }

  const handleSendMessage = async (message: string, type: 'text' | 'image' | 'document') => {
    if (!activeTicket) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      from: 'agent',
      timestamp: new Date(),
      status: 'sent',
      type
    }

    const updatedTicket = {
      ...activeTicket,
      messages: [...activeTicket.messages, newMessage]
    }

    setActiveTicket(updatedTicket)
    setTickets(tickets.map(t => (t.id === updatedTicket.id ? updatedTicket : t)))
  }

  const handleStatusChange = async (status: string) => {
    if (!activeTicket) return

    const updatedTicket = {
      ...activeTicket,
      status
    }

    setActiveTicket(updatedTicket)
    setTickets(tickets.map(t => (t.id === updatedTicket.id ? updatedTicket : t)))
  }

  const handleSearch = (query: string) => {
    // Implementar busca
    console.log('Searching:', query)
  }

  const handleNewChat = () => {
    // Implementar criação de novo chat
    console.log('Creating new chat')
  }

  const handleTicketSelect = (ticketId: string) => {
    const ticket = tickets.find(t => t.id === ticketId)
    if (ticket) {
      setActiveTicket(ticket)
    }
  }

  if (loading) {
    return <div>Carregando...</div>
  }

  return (
    <div className="flex h-screen bg-white">
      <div className="w-[280px] flex-shrink-0 border-r">
        <SidebarNavigation 
          onNewChat={handleNewChat} 
          onSearch={handleSearch}
          onTicketSelect={handleTicketSelect}
          selectedTicketId={activeTicket?.id}
        />
      </div>
      
      <main className="flex-1 flex min-w-0 relative">
        <div className="flex-1 flex flex-col min-w-0">
          <ChatWindow
            contact={activeTicket?.contact || null}
            messages={activeTicket?.messages || []}
            onSendMessage={handleSendMessage}
            onStatusChange={handleStatusChange}
            onToggleContactDetails={() => setIsContactDetailsOpen(!isContactDetailsOpen)}
          />
        </div>
        
        {/* Contact Details Sliding Panel */}
        <div 
          className={`fixed top-0 right-0 h-full w-[300px] bg-white border-l shadow-lg transform transition-transform duration-300 ease-in-out ${
            isContactDetailsOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ zIndex: 50 }}
        >
          {activeTicket && isContactDetailsOpen && (
            <ContactDetails 
              contact={activeTicket.contact}
              onClose={() => setIsContactDetailsOpen(false)}
            />
          )}
        </div>

        {/* Overlay when contact details is open */}
        {isContactDetailsOpen && (
          <div 
            className="fixed inset-0 bg-black/20" 
            style={{ zIndex: 40 }}
            onClick={() => setIsContactDetailsOpen(false)}
          />
        )}
      </main>
    </div>
  )
}
