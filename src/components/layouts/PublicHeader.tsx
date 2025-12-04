"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Search } from "lucide-react";
import Image from "next/image";

export default function PublicHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/marketplace?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/marketplace");
    }
  };
  return (
    <header className="bg-cream-50 border-b border-gray-200 sticky top-0 z-50">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center">
                <Image src="/icon.png" alt="Pet Realm" width={32} height={32} />
              </div>
              <span className="text-xl font-bold text-charcoal-800">Pet Realm</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/marketplace" 
              className={pathname === '/marketplace' 
                ? "text-primary-600 font-bold" 
                : "text-charcoal-600 hover:text-primary-600 font-medium"}
            >
              Marketplace
            </Link>
            <Link 
              href="/shops" 
              className={pathname === '/shops' 
                ? "text-primary-600 font-bold" 
                : "text-charcoal-600 hover:text-primary-600 font-medium"}
            >
              Pet Shops
            </Link>
            <Link 
              href="/about" 
              className={pathname === '/about' 
                ? "text-primary-600 font-bold" 
                : "text-charcoal-600 hover:text-primary-600 font-medium"}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className={pathname === '/contact' 
                ? "text-primary-600 font-bold" 
                : "text-charcoal-600 hover:text-primary-600 font-medium"}
            >
              Contact
            </Link>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex items-center max-w-sm w-full mx-8 bg-white">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search for pets, food, toys..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </form>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            <Link href="/auth/signin">
              <Button variant="ghost" size="sm" className="text-charcoal-600 hover:text-primary-600">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm" className="bg-primary-600 hover:bg-primary-700">
                Get Started
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden pb-3">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search for pets, food, toys..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </form>
        </div>
      </div>
    </header>
  );
}
