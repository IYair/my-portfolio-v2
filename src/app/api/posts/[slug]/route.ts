import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface Params {
  params: { slug: string }
}

// GET - Obtener post por slug
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { slug } = params

    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        tags: true,
      },
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Solo mostrar posts publicados en producción
    if (!post.published && process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    )
  }
}