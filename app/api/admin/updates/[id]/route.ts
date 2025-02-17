import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import prisma from "@/lib/prisma"
import { adminAuth } from "@/middleware/adminAuth"

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verifica autenticação
    const authResult = await adminAuth(request)
    if (authResult) return authResult

    const session = await getServerSession()
    
    // Verifica se a atualização existe
    const update = await prisma.update.findUnique({
      where: { id: params.id },
      include: { createdBy: true }
    })

    if (!update) {
      return NextResponse.json(
        { error: "Atualização não encontrada" },
        { status: 404 }
      )
    }

    // Apenas criador ou DEVELOPER pode deletar
    if (update.userId !== session.user.id && session.user.role !== "DEVELOPER") {
      return NextResponse.json(
        { error: "Não autorizado a deletar esta atualização" },
        { status: 403 }
      )
    }

    // Deleta atualização
    await prisma.update.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao deletar atualização:", error)
    return NextResponse.json(
      { error: "Erro ao deletar atualização" },
      { status: 500 }
    )
  }
}
