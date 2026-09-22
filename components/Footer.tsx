import React from 'react';
import Link from 'next/link';
// import { FileTextIcon, Github, Twitter, Mail } from 'lucide-react';

interface FooterProps {
  className?: string;
}

export function Footer({ className = '' }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`bg-gray-900 text-white ${className}`}>
      <div className="max-w-[1600px] mx-auto px-4 py-4">
        <nav aria-label="Footer" className="flex flex-wrap gap-6 text-sm text-gray-300">
          <Link href="/about/" className="hover:text-white">About</Link>
          <Link href="/contact/" className="hover:text-white">Contact</Link>
          <Link href="/privacy/" className="hover:text-white">Privacy Policy</Link>
        </nav>
        <div className="border-t border-gray-800 mt-4 pt-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} CSVFilters. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm mt-2 md:mt-0">
            Built with ❤️ for data professionals
          </p>
        </div>
      </div>
    </footer>
  );
}