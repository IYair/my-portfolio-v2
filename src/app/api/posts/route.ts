import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema de validación
const postSchema = z.object({
  title: z.string().min(1, 'Title is required').max(300),
  slug: z.string().min(1, 'Slug is required').max(300),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1, 'Content is required'),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  coverImage: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
})

// GET - Obtener todos los posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const published = searchParams.get('published')
    const featured = searchParams.get('featured')
    const tag = searchParams.get('tag')
    const limit = searchParams.get('limit')

    const where: Record<string, unknown> = {}

    if (published === 'true') {
      where.published = true
    }

    if (featured === 'true') {
      where.featured = true
    }

    if (tag) {
      where.tags = {
        some: {
          name: tag
        }
      }
    }

    const posts = await prisma.post.findMany({
      where,
      include: {
        tags: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit) : undefined,
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar datos
    const validatedData = postSchema.parse(body)

    // Verificar que el slug sea único
    const existingPost = await prisma.post.findUnique({
      where: { slug: validatedData.slug },
    })

    if (existingPost) {
      return NextResponse.json(
        { error: 'A post with this slug already exists' },
        { status: 409 }
      )
    }

    // Procesar tags si existen
    const tags = validatedData.tags || []
    const tagConnections = []

    for (const tagName of tags) {
      // Crear o encontrar tag
      const tag = await prisma.tag.upsert({
        where: { name: tagName },
        update: {},
        create: { name: tagName },
      })
      tagConnections.push({ id: tag.id })
    }

    // Crear post
    const post = await prisma.post.create({
      data: {
        title: validatedData.title,
        content: validatedData.content,
        excerpt: validatedData.excerpt,
        slug: validatedData.slug,
        published: validatedData.published,
        featured: validatedData.featured,
        tags: {
          connect: tagConnections,
        },
      },
      include: {
        tags: true,
      },
    })

    return NextResponse.json(
      {
        message: 'Post created successfully',
        post,
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}