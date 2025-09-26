import { useState } from 'react'
import { Tabs, TabItem } from './Tabs'
import {
  UserIcon,
  BuildingOfficeIcon,
  UsersIcon,
  CreditCardIcon,
  DocumentTextIcon,
  PhotoIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon
} from '@heroicons/react/20/solid'

// Ejemplo básico para admin panel
export function AdminTabsExample() {
  const [activeTab, setActiveTab] = useState('posts')

  const adminTabs: TabItem[] = [
    {
      name: 'Posts',
      icon: DocumentTextIcon,
      current: activeTab === 'posts',
      onClick: () => setActiveTab('posts')
    },
    {
      name: 'Projects',
      icon: PhotoIcon,
      current: activeTab === 'projects',
      onClick: () => setActiveTab('projects')
    },
    {
      name: 'Messages',
      icon: ChatBubbleLeftRightIcon,
      current: activeTab === 'messages',
      onClick: () => setActiveTab('messages')
    },
    {
      name: 'Settings',
      icon: Cog6ToothIcon,
      current: activeTab === 'settings',
      onClick: () => setActiveTab('settings')
    },
  ]

  const handleTabChange = (tab: TabItem) => {
    // Esta función se ejecuta cuando cambia el tab
    console.log('Tab changed to:', tab.name)
  }

  return (
    <div className="space-y-6">
      <Tabs
        tabs={adminTabs}
        onTabChange={handleTabChange}
      />

      {/* Contenido dinámico basado en el tab activo */}
      <div className="mt-6">
        {activeTab === 'posts' && (
          <div className="text-white">
            <h2 className="text-xl font-semibold">Gestión de Posts</h2>
            <p className="text-gray-400">Administra tus artículos del blog</p>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="text-white">
            <h2 className="text-xl font-semibold">Gestión de Proyectos</h2>
            <p className="text-gray-400">Administra tu portfolio de proyectos</p>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="text-white">
            <h2 className="text-xl font-semibold">Mensajes de Contacto</h2>
            <p className="text-gray-400">Revisa los mensajes de tus visitantes</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="text-white">
            <h2 className="text-xl font-semibold">Configuración</h2>
            <p className="text-gray-400">Ajusta la configuración del sitio</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Ejemplo con navegación por URL (original style)
export function TabsWithUrlExample() {
  const urlTabs: TabItem[] = [
    { name: 'My Account', href: '/account', icon: UserIcon, current: false },
    { name: 'Company', href: '/company', icon: BuildingOfficeIcon, current: false },
    { name: 'Team Members', href: '/team', icon: UsersIcon, current: true },
    { name: 'Billing', href: '/billing', icon: CreditCardIcon, current: false },
  ]

  return (
    <Tabs tabs={urlTabs} />
  )
}