'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { MessageCircle } from 'lucide-react'

interface TicketItemProps {
  id: string
  phone: string
  name?: string | null
  lastMessage?: string
  time?: string
  isSelected?: boolean
  tags?: string[]
  status?: 'TESTE' | 'SEM SETOR' | string
  onClick?: () => void
  hasUnread?: boolean
  platform?: 'whatsapp' | 'other'
}

export function TicketItem({
  id,
  phone,
  name,
  lastMessage,
  time,
  isSelected,
  tags = [],
  status,
  onClick,
  hasUnread,
  platform = 'whatsapp'
}: TicketItemProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 p-3 cursor-pointer hover:bg-muted/50 relative',
        isSelected && 'bg-muted',
        hasUnread && 'bg-primary/5'
      )}
      onClick={onClick}
    >
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${phone}`} />
        <AvatarFallback>{name?.[0] || phone[0]}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 min-w-0">
            <span className="font-medium truncate">
              {name || 'Sem nome'}
            </span>
            {platform === 'whatsapp' && (
              <MessageCircle 
                className="w-4 h-4 text-emerald-500 fill-current shrink-0" 
              />
            )}
          </div>
          {time && (
            <span className="text-xs text-muted-foreground shrink-0">
              {time}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <span className="truncate">{phone}</span>
        </div>

        {status && (
          <div className="flex flex-wrap gap-1 mt-1">
            <Badge 
              variant="outline" 
              className={cn(
                'text-xs font-normal',
                status === 'TESTE' && 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
                status === 'SEM SETOR' && 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
              )}
            >
              {status}
            </Badge>
            {tags.map((tag, index) => (
              <Badge 
                key={index}
                variant="outline" 
                className="text-xs font-normal"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {lastMessage && (
          <p className="text-sm text-muted-foreground truncate mt-1">
            {lastMessage}
          </p>
        )}

        {hasUnread && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-destructive rounded-full" />
        )}
      </div>
    </div>
  )
}
