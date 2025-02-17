"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { Zap, Star, Clock, Layers, Bot, Brain, Building2, Plus, Save, Trash2 } from "lucide-react"
import { PageContainer } from "@/components/page-container"
import { useToast } from "@/components/ui/use-toast"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

const iconOptions = [
  { value: "Zap", label: "Zap - Atualizações de funcionalidades", icon: Zap },
  { value: "Star", label: "Star - Dicas e recursos destacados", icon: Star },
  { value: "Clock", label: "Clock - Anúncios de tempo/manutenção", icon: Clock },
  { value: "Layers", label: "Layers - Versões do sistema", icon: Layers },
  { value: "Bot", label: "Bot - Recursos de IA/automação", icon: Bot },
  { value: "Brain", label: "Brain - Recursos de Deep Learning/IA", icon: Brain },
  { value: "Building2", label: "Building2 - Sistema completo/enterprise", icon: Building2 },
]

const typeOptions = [
  { value: "UPDATE", label: "Atualização" },
  { value: "TIP", label: "Dica" },
  { value: "ANNOUNCEMENT", label: "Anúncio" },
]

export default function UpdatesAdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [updates, setUpdates] = useState([])
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "UPDATE",
    icon: "Zap",
  })

  // Redireciona se não for admin
  if (status === "loading") return null
  if (!session?.user || !["ADMIN", "DEVELOPER"].includes(session.user.role)) {
    router.push("/")
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch("/api/admin/updates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Falha ao salvar atualização")
      }

      const data = await response.json()

      // Atualiza lista
      setUpdates([data, ...updates])

      // Limpa o formulário após sucesso
      setFormData({
        title: "",
        description: "",
        type: "UPDATE",
        icon: "Zap",
      })

      toast({
        title: "Sucesso!",
        description: "Atualização salva com sucesso.",
        variant: "success",
      })
    } catch (error) {
      console.error("Erro ao salvar atualização:", error)
      toast({
        title: "Erro!",
        description: error.message || "Erro ao salvar atualização",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageContainer
      header={{
        title: "Gerenciar Atualizações",
        description: "Adicione e gerencie as atualizações e novidades do sistema",
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Título
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Ex: Nova Funcionalidade: Exportação em Lote"
                    required
                    disabled={loading}
                    minLength={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Descrição
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Descreva a atualização ou novidade..."
                    required
                    disabled={loading}
                    minLength={10}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Tipo
                    </label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) =>
                        setFormData({ ...formData, type: value })
                      }
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {typeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Ícone
                    </label>
                    <Select
                      value={formData.icon}
                      onValueChange={(value) =>
                        setFormData({ ...formData, icon: value })
                      }
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {iconOptions.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="flex items-center gap-2"
                          >
                            <option.icon className="w-4 h-4" />
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="flex items-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>Salvando...</>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Adicionar Atualização
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Lista de Atualizações */}
        <div className="space-y-4">
          {updates.map((update) => (
            <Card key={update.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{update.title}</h3>
                    <p className="text-sm text-gray-500">{update.description}</p>
                    <div className="text-xs text-gray-400 mt-2">
                      Por {update.createdBy.name} em{" "}
                      {new Date(update.createdAt).toLocaleDateString("pt-BR")}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(update.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageContainer>
  )
}
