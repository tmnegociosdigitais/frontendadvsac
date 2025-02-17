'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  MessageSquare, 
  CheckSquare, 
  Users, 
  Plus, 
  Search,
  Filter
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TicketItem } from './ticket-item'

interface SidebarNavigationProps {
  onNewChat: () => void
  onSearch: (query: string) => void
  onTicketSelect?: (ticketId: string) => void
  selectedTicketId?: string
}

export function SidebarNavigation({ 
  onNewChat, 
  onSearch,
  onTicketSelect,
  selectedTicketId 
}: SidebarNavigationProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  // Mock data para exemplo
  const mockTickets = [
    {
      id: '1',
      phone: '553491942200',
      name: 'Opa',
      time: '12:18',
      status: 'TESTE',
      tags: ['GWEGEGWG', 'SEM SETOR'],
      hasUnread: true,
      platform: 'whatsapp' as const
    },
    // Adicione mais tickets conforme necessário
  ]

  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="abertas" className="flex-1 flex flex-col">
        <TabsList className="flex justify-between border-b px-2 h-12">
          <div className="flex space-x-1">
            <TabsTrigger value="abertas" className="data-[state=active]:bg-primary/10">
              <MessageSquare className="w-4 h-4 mr-2" />
              ABERTAS
            </TabsTrigger>
            <TabsTrigger value="resolvidos" className="data-[state=active]:bg-primary/10">
              <CheckSquare className="w-4 h-4 mr-2" />
              RESOLVIDOS
            </TabsTrigger>
            <TabsTrigger value="grupos" className="data-[state=active]:bg-primary/10">
              <Users className="w-4 h-4 mr-2" />
              GRUPOS
            </TabsTrigger>
          </div>
        </TabsList>

        <div className="p-3 space-y-3 border-b">
          <Button 
            onClick={onNewChat} 
            className="w-full bg-primary hover:bg-primary/90"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            NOVO
          </Button>

          <form onSubmit={handleSearch} className="relative">
            <Input
              placeholder="Buscar atendimento e mensagens"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-8 h-9"
            />
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-9 w-9"
            >
              <Search className="w-4 h-4" />
            </Button>
          </form>
        </div>

        <div className="px-3 py-2 border-b">
          <div className="flex items-center gap-2">
            <Select defaultValue="todos">
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="atendendo">Atendendo</SelectItem>
                <SelectItem value="aguardando">Aguardando</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="setores">
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Setores" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="setores">Setores</SelectItem>
                <SelectItem value="comercial">Comercial</SelectItem>
                <SelectItem value="suporte">Suporte</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="tags">
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Tags" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tags">Tags</SelectItem>
                <SelectItem value="urgente">Urgente</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="abertas" className="h-full overflow-auto">
            <div className="space-y-1">
              <div className="px-3 py-2">
                <h3 className="text-sm font-medium text-muted-foreground">ATENDENDO</h3>
              </div>
              {mockTickets.map(ticket => (
                <TicketItem
                  key={ticket.id}
                  {...ticket}
                  isSelected={selectedTicketId === ticket.id}
                  onClick={() => onTicketSelect?.(ticket.id)}
                />
              ))}
            </div>
            
            <div className="space-y-1 mt-2">
              <div className="px-3 py-2">
                <h3 className="text-sm font-medium text-muted-foreground">AGUARDANDO</h3>
              </div>
              {/* Lista de tickets aguardando */}
            </div>
          </TabsContent>

          <TabsContent value="resolvidos" className="h-full overflow-auto">
            <div className="space-y-1">
              {/* Lista de atendimentos resolvidos */}
            </div>
          </TabsContent>

          <TabsContent value="grupos" className="h-full overflow-auto">
            <div className="space-y-1">
              {/* Lista de grupos */}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
