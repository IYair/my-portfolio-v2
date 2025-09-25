"use client";

import {
  HomeIcon,
  DocumentTextIcon,
  RocketLaunchIcon,
  EnvelopeIcon,
  PhotoIcon,
  Cog6ToothIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon, current: false },
  { name: 'Posts', href: '/admin/dashboard/posts', icon: DocumentTextIcon, current: false },
  { name: 'Proyectos', href: '/admin/dashboard/projects', icon: RocketLaunchIcon, current: false },
  { name: 'Contactos', href: '/admin/dashboard/contacts', icon: EnvelopeIcon, current: false },
  { name: 'Media', href: '/admin/dashboard/media', icon: PhotoIcon, current: false },
  { name: 'Configuración', href: '/admin/dashboard/settings', icon: Cog6ToothIcon, current: false },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

interface AdminSidebarProps {
  stats?: {
    posts: number
    projects: number
    contacts: number
    unreadContacts: number
  }
}

export default function AdminSidebar({ stats }: AdminSidebarProps) {
  const pathname = usePathname()
  const { data: session } = useSession()

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  // Update current state based on pathname
  const updatedNavigation = navigation.map(item => ({
    ...item,
    current: pathname === item.href
  }))

  return (
    <div className="relative flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 before:pointer-events-none before:absolute before:inset-0 before:border-r before:border-white/10 before:bg-black/10">
      {/* Logo */}
      <div className="relative flex h-16 shrink-0 items-center">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <div className="h-8 w-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">YC</span>
          </div>
          <span className="text-white font-semibold">Admin Panel</span>
        </Link>
      </div>

      <nav className="relative flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {updatedNavigation.map((item) => {
                // Add count badges for specific items
                let count: string | undefined
                if (stats) {
                  if (item.name === 'Posts') count = stats.posts.toString()
                  else if (item.name === 'Proyectos') count = stats.projects.toString()
                  else if (item.name === 'Contactos' && stats.unreadContacts > 0) count = stats.unreadContacts.toString()
                }

                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={classNames(
                        item.current ? 'bg-white/5 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white',
                        'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                      )}
                    >
                      <item.icon aria-hidden="true" className="size-6 shrink-0" />
                      {item.name}
                      {count ? (
                        <span
                          aria-hidden="true"
                          className={classNames(
                            "ml-auto w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium",
                            item.name === 'Contactos' && stats && stats.unreadContacts > 0
                              ? "bg-red-500 text-white"
                              : "bg-gray-700 text-gray-300 outline outline-1 -outline-offset-1 outline-white/15"
                          )}
                        >
                          {count}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </li>

          {/* Quick Actions */}
          <li>
            <div className="text-xs/6 font-semibold text-gray-400">Acciones Rápidas</div>
            <ul role="list" className="-mx-2 mt-2 space-y-1">
              <li>
                <Link
                  href="/admin/dashboard/posts/new"
                  className="text-gray-400 hover:bg-white/5 hover:text-white group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                >
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[0.625rem] font-medium text-gray-400 group-hover:border-white/20 group-hover:text-white">
                    +
                  </span>
                  <span className="truncate">Nuevo Post</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/dashboard/projects/new"
                  className="text-gray-400 hover:bg-white/5 hover:text-white group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                >
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[0.625rem] font-medium text-gray-400 group-hover:border-white/20 group-hover:text-white">
                    +
                  </span>
                  <span className="truncate">Nuevo Proyecto</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  target="_blank"
                  className="text-gray-400 hover:bg-white/5 hover:text-white group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                >
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[0.625rem] font-medium text-gray-400 group-hover:border-white/20 group-hover:text-white">
                    🌐
                  </span>
                  <span className="truncate">Ver Sitio</span>
                </Link>
              </li>
            </ul>
          </li>

          {/* User Profile */}
          <li className="-mx-6 mt-auto">
            <div className="flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-white">
              <div className="size-8 rounded-full bg-indigo-600 flex items-center justify-center">
                <UserIcon className="size-5 text-white" />
              </div>
              <span className="sr-only">Your profile</span>
              <span aria-hidden="true" className="flex-1">
                {session?.user?.name || 'Admin'}
              </span>
              <button
                onClick={handleSignOut}
                className="text-gray-400 hover:text-white text-xs"
              >
                Salir
              </button>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  )
}