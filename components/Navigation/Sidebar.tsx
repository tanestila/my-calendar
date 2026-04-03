'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Sidebar() {
  const pathname = usePathname()
  
  const links = [
    { href: '/', label: 'Календарь', icon: '📅' },
    { href: '/tasks', label: 'Задачи', icon: '✅' },
    { href: '/habits', label: 'Привычки', icon: '🔥' },
  ]
  
  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-gray-50 border-r border-gray-200 p-4 fixed left-0 top-0">
      <h1 className="text-xl font-bold mb-8 text-gray-800">Мой Планер</h1>
      <nav className="flex-1 space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              pathname === link.href
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span className="text-xl">{link.icon}</span>
            <span className="font-medium">{link.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}