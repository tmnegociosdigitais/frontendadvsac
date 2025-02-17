import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function adminAuth(request: NextRequest) {
  const token = await getToken({ req: request })

  if (!token) {
    return new NextResponse(
      JSON.stringify({ error: 'Não autenticado' }),
      { status: 401, headers: { 'content-type': 'application/json' } }
    )
  }

  // Verifica se o usuário é admin ou dev
  if (!['ADMIN', 'DEVELOPER'].includes(token.role as string)) {
    return new NextResponse(
      JSON.stringify({ error: 'Acesso não autorizado' }),
      { status: 403, headers: { 'content-type': 'application/json' } }
    )
  }
}
