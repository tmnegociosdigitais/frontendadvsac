import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"
import prisma from "@/lib/prisma"
import { adminAuth } from "@/middleware/adminAuth"

// Schema de validação
const updateSchema = z.object({
  title: z.string().min(3, "Título deve ter no mínimo 3 caracteres"),
  description: z.string().min(10, "Descrição deve ter no mínimo 10 caracteres"),
  type: z.enum(["UPDATE", "TIP", "ANNOUNCEMENT"]),
  icon: z.string()
})

export async function POST(request: Request) {
  try {
    // Verifica autenticação
    const authResult = await adminAuth(request)
    if (authResult) return authResult

    const session = await getServerSession()
    const data = await request.json()
    
    // Valida dados
    const validatedData = updateSchema.parse(data)
    
    // Cria atualização
    const update = await prisma.update.create({
      data: {
        ...validatedData,
        userId: session.user.id
      },
      include: {
        createdBy: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(update)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      )
    }
    
    console.error("Erro ao salvar atualização:", error)
    return NextResponse.json(
      { error: "Erro ao salvar atualização" },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    // Verifica autenticação para listagem
    const authResult = await adminAuth(request)
    if (authResult) return authResult

    const updates = await prisma.update.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        createdBy: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(updates)
  } catch (error) {
    console.error("Erro ao listar atualizações:", error)
    return NextResponse.json(
      { error: "Erro ao listar atualizações" },
      { status: 500 }
    )
  }
}
