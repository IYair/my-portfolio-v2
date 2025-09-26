import { Breadcrumbs, BreadcrumbItem } from './Breadcrumbs'
import { useState } from 'react'

// Ejemplo básico del admin panel
export function AdminBreadcrumbsExample() {
  const [currentPath, setCurrentPath] = useState('posts')

  // Diferentes rutas del admin panel
  const breadcrumbRoutes = {
    dashboard: [],
    posts: [
      { name: 'Posts', href: '/admin/posts', current: false, onClick: () => setCurrentPath('posts') }
    ],
    'posts-new': [
      { name: 'Posts', href: '/admin/posts', current: false, onClick: () => setCurrentPath('posts') },
      { name: 'New Post', href: '/admin/posts/new', current: true }
    ],
    'posts-edit': [
      { name: 'Posts', href: '/admin/posts', current: false, onClick: () => setCurrentPath('posts') },
      { name: 'Edit Post', href: '#', current: true }
    ],
    projects: [
      { name: 'Projects', href: '/admin/projects', current: false, onClick: () => setCurrentPath('projects') }
    ],
    'projects-edit': [
      { name: 'Projects', href: '/admin/projects', current: false, onClick: () => setCurrentPath('projects') },
      { name: 'Project Nero', href: '#', current: true }
    ],
    settings: [
      { name: 'Settings', href: '/admin/settings', current: true }
    ],
    'settings-users': [
      { name: 'Settings', href: '/admin/settings', current: false, onClick: () => setCurrentPath('settings') },
      { name: 'User Management', href: '#', current: true }
    ]
  }

  const currentBreadcrumbs = breadcrumbRoutes[currentPath as keyof typeof breadcrumbRoutes] || []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Admin Panel Breadcrumbs</h2>

        {/* Breadcrumbs actuales */}
        <Breadcrumbs
          pages={currentBreadcrumbs}
          homeHref="/admin/dashboard"
          onHomeClick={() => setCurrentPath('dashboard')}
        />

        <p className="text-gray-400 text-sm mt-2">Current path: {currentPath}</p>
      </div>

      {/* Botones para simular navegación */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setCurrentPath('dashboard')}
          className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
        >
          Dashboard
        </button>
        <button
          onClick={() => setCurrentPath('posts')}
          className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
        >
          Posts
        </button>
        <button
          onClick={() => setCurrentPath('posts-new')}
          className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
        >
          New Post
        </button>
        <button
          onClick={() => setCurrentPath('posts-edit')}
          className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
        >
          Edit Post
        </button>
        <button
          onClick={() => setCurrentPath('projects')}
          className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
        >
          Projects
        </button>
        <button
          onClick={() => setCurrentPath('projects-edit')}
          className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
        >
          Edit Project
        </button>
        <button
          onClick={() => setCurrentPath('settings')}
          className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
        >
          Settings
        </button>
        <button
          onClick={() => setCurrentPath('settings-users')}
          className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
        >
          User Management
        </button>
      </div>
    </div>
  )
}

// Ejemplo con URLs reales
export function UrlBreadcrumbsExample() {
  const pages: BreadcrumbItem[] = [
    { name: 'Projects', href: '/projects', current: false },
    { name: 'Project Nero', href: '/projects/nero', current: true },
  ]

  return (
    <Breadcrumbs
      pages={pages}
      homeHref="/"
      className="mb-6"
    />
  )
}

// Ejemplo dinámico basado en path
export function DynamicBreadcrumbsExample() {
  // Simula el path actual de Next.js
  const currentPath = '/admin/dashboard/posts/123/edit'

  const generateBreadcrumbs = (path: string): BreadcrumbItem[] => {
    const segments = path.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = []

    // Skip 'admin' and 'dashboard' para mostrar solo la navegación relevante
    const relevantSegments = segments.slice(2) // ['posts', '123', 'edit']

    relevantSegments.forEach((segment, index) => {
      const isLast = index === relevantSegments.length - 1
      const href = `/${segments.slice(0, 3 + index).join('/')}`

      let name = segment
      // Transformar nombres para ser más legibles
      if (segment === 'posts') name = 'Posts'
      else if (segment === 'projects') name = 'Projects'
      else if (segment === 'edit') name = 'Edit'
      else if (segment === 'new') name = 'New'
      else if (segment.match(/^\d+$/)) name = `ID: ${segment}`

      breadcrumbs.push({
        name,
        href,
        current: isLast
      })
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs(currentPath)

  return (
    <div className="space-y-2">
      <p className="text-gray-400 text-sm">Current path: {currentPath}</p>
      <Breadcrumbs
        pages={breadcrumbs}
        homeHref="/admin/dashboard"
      />
    </div>
  )
}