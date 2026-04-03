'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileNav() {
    const pathname = usePathname();

    const links = [
        {
            name: "Home",
            href: "/",
            icon: '📅'
        },
        {
            name: "Habits",
            href: "/habits",
            icon: '✅'
        },
        {
            name: "Events",
            href: "/events",
            icon: '🔥'
        }
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden z-50">
        <div className="flex justify-around py-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center ${
                pathname === link.href ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              <span className="text-xl">{link.icon}</span>
              <span className="text-xs mt-1">{link.name}</span>
            </Link>
          ))}
        </div>
      </nav>
    );
}