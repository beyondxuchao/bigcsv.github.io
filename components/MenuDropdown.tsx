'use client';
import React from 'react';
import { HelpCircle, Info, BookOpen, Wrench, History } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface MenuDropdownProps {
  className?: string;
}

export function MenuDropdown({ className = '' }: MenuDropdownProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      id: 'tutorials',
      label: 'Tutorials',
      icon: BookOpen,
      href: '/tutorials',
    },
    {
      id: 'tools',
      label: 'Tools',
      icon: Wrench,
      href: '/tools',
    },
    {
      id: 'updates',
      label: 'Updates',
      icon: History,
      href: '/updates',
    },
    {
      id: 'help',
      label: 'Help',
      icon: HelpCircle,
      href: '/help',
    },
    {
      id: 'about',
      label: 'About',
      icon: Info,
      href: '/about',
    },
  ];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
        return (
          <Link key={item.id} href={item.href}>
            <Button
              variant={isActive ? 'default' : 'ghost'}
              size="sm"
              className={`flex items-center gap-2 ${isActive ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{item.label}</span>
            </Button>
          </Link>
        );
      })}
    </div>
  );
}
