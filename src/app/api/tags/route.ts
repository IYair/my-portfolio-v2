import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Obtener todos los tags con conteo de posts
export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            posts: {
              where: {
                published: true, // Solo contar posts publicados
              },
            },
          },
        },
      },
      orderBy: {
        posts: {
          _count: 'desc', // Ordenar por popularidad
        },
      },
    })

    // Formatear respuesta
    const formattedTags = tags.map(tag => ({
      id: tag.id,
      name: tag.name,
      postCount: tag._count.posts,
    }))

    return NextResponse.json(formattedTags)
  } catch (error) {
    console.error('Error fetching tags:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    )
  }
}