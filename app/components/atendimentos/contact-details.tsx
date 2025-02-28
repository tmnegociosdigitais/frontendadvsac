'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Phone, Mail, MapPin, Tag, Edit2, X } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface Contact {
  id: string
  name: string | null
  phone: string
  email?: string | null
  address?: string | null
  tags: { id: string; name: string }[]
  notes?: string | null
}

interface ContactDetailsProps {
  contact: Contact | null
  onUpdate: (contact: Contact) => void
  onClose: () => void
}

export function ContactDetails({ contact, onUpdate, onClose }: ContactDetailsProps) {
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<Contact>>(contact || {})

  const handleSave = async () => {
    if (!contact) return

    try {
      const response = await fetch(`/api/contacts/${contact.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Erro ao atualizar contato')

      const updatedContact = await response.json()
      onUpdate(updatedContact)
      setEditing(false)
    } catch (error) {
      console.error('Erro ao atualizar contato:', error)
    }
  }

  if (!contact) return null

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="font-semibold">Detalhes do Contato</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
          <Edit2 className="w-4 h-4 mr-2" />
          Editar
        </Button>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-16 w-16">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${contact.phone}`} />
            <AvatarFallback>{contact.name?.[0] || contact.phone[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-lg">{contact.name}</h3>
            <p className="text-sm text-muted-foreground">{contact.phone}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-500" />
            <span>{contact.phone}</span>
          </div>
          {contact.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <span>{contact.email}</span>
            </div>
          )}
          {contact.address && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span>{contact.address}</span>
            </div>
          )}
        </div>

        <Separator />

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Tag className="w-4 h-4 text-gray-500" />
            <span className="font-medium">Tags</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {contact.tags.map(tag => (
              <Badge key={tag.id} variant="outline">
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>

        {contact.notes && (
          <>
            <Separator />
            <div>
              <p className="text-sm text-gray-500 mb-2">Observações</p>
              <p>{contact.notes}</p>
            </div>
          </>
        )}
      </div>

      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Contato</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nome do contato"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="email@exemplo.com"
              />
            </div>

            <div>
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                value={formData.address || ''}
                onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Endereço completo"
              />
            </div>

            <div>
              <Label htmlFor="notes">Observações</Label>
              <textarea
                id="notes"
                className="w-full min-h-[100px] p-2 border rounded-md"
                value={formData.notes || ''}
                onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Observações sobre o contato..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
