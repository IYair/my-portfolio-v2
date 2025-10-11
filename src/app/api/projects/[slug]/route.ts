import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

type RouteContext = {
  params: Promise<{ slug: string }>
}

// Schema de validación para actualización
const projectUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  slug: z.string().min(1).max(200).optional(),
  description: z.string().max(500).optional(),
  longDescription: z.string().optional(),
  image: z.string().url().optional(),
  demoUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  technologies: z.array(z.string()).min(1).optional(),
  featured: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
})

// GET - Obtener proyecto por slug o ID
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { slug } = await context.params

    // Intentar encontrar por ID primero (si es numérico), luego por slug
    const isNumeric = /^\d+$/.test(slug)
    const project = isNumeric
      ? await prisma.project.findUnique({ where: { id: parseInt(slug) } })
      : await prisma.project.findUnique({ where: { slug } })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Convertir technologies de string JSON a array
    const projectWithTech = {
      ...project,
      technologies: JSON.parse(project.technologies)
    }

    return NextResponse.json(projectWithTech)
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}

// PATCH - Actualizar proyecto
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { slug } = await context.params
    const body = await request.json()

    // Validar datos
    const validatedData = projectUpdateSchema.parse(body)

    // Intentar encontrar por ID primero (si es numérico), luego por slug
    const isNumeric = /^\d+$/.test(slug)
    const existingProject = isNumeric
      ? await prisma.project.findUnique({ where: { id: parseInt(slug) } })
      : await prisma.project.findUnique({ where: { slug } })

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Si se actualiza el slug, verificar que no exista otro proyecto con ese slug
    if (validatedData.slug && validatedData.slug !== existingProject.slug) {
      const slugExists = await prisma.project.findUnique({
        where: { slug: validatedData.slug }
      })

      if (slugExists) {
        return NextResponse.json(
          { error: 'A project with this slug already exists' },
          { status: 409 }
        )
      }
    }

    // Preparar datos para actualización
    const updateData: Record<string, unknown> = { ...validatedData }

    // Convertir technologies array a string JSON si está presente
    if (validatedData.technologies) {
      updateData.technologies = JSON.stringify(validatedData.technologies)
    }

    // Actualizar proyecto
    const updatedProject = await prisma.project.update({
      where: { id: existingProject.id },
      data: updateData,
    })

    return NextResponse.json({
      message: 'Project updated successfully',
      project: {
        ...updatedProject,
        technologies: JSON.parse(updatedProject.technologies)
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar proyecto
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { slug } = await context.params

    // Intentar encontrar por ID primero (si es numérico), luego por slug
    const isNumeric = /^\d+$/.test(slug)
    const project = isNumeric
      ? await prisma.project.findUnique({ where: { id: parseInt(slug) } })
      : await prisma.project.findUnique({ where: { slug } })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Eliminar proyecto
    await prisma.project.delete({
      where: { id: project.id }
    })

    return NextResponse.json({
      message: 'Project deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}