import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema de validación
const projectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z.string().min(1, 'Slug is required').max(200),
  description: z.string().max(500).optional(),
  longDescription: z.string().optional(),
  image: z.string().url().optional(),
  demoUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  technologies: z.array(z.string()).min(1, 'At least one technology is required'),
  featured: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
})

// GET - Obtener todos los proyectos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')

    const projects = await prisma.project.findMany({
      where: featured === 'true' ? { featured: true } : undefined,
      orderBy: { order: 'asc' },
    })

    // Convertir technologies de string JSON a array
    const projectsWithTech = projects.map(project => ({
      ...project,
      technologies: JSON.parse(project.technologies)
    }))

    return NextResponse.json(projectsWithTech)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo proyecto
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar datos
    const validatedData = projectSchema.parse(body)

    // Verificar que el slug sea único
    const existingProject = await prisma.project.findUnique({
      where: { slug: validatedData.slug },
    })

    if (existingProject) {
      return NextResponse.json(
        { error: 'A project with this slug already exists' },
        { status: 409 }
      )
    }

    // Crear proyecto (convertir technologies array a string JSON)
    const project = await prisma.project.create({
      data: {
        ...validatedData,
        technologies: JSON.stringify(validatedData.technologies),
      },
    })

    return NextResponse.json(
      {
        message: 'Project created successfully',
        project: {
          ...project,
          technologies: JSON.parse(project.technologies)
        }
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

    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}