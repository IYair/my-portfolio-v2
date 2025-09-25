import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type RouteContext = {
  params: Promise<{ slug: string }>
}

// GET - Obtener proyecto por slug
export async function GET(
  request: NextRequest, 
  context: RouteContext
) {
  try {
    const { slug } = await context.params

    const project = await prisma.project.findUnique({
      where: { slug },
    })

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