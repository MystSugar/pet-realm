"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Search, ShoppingCart, User, Package, LogOut, ChevronDown } from "lucide-react";
import { signOut } from "next-auth/react";
import { useCart } from "@/hooks/useCart";
import Image from "next/image";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface AuthUser {
  id?: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
  role?: string;
}

interface CustomerHeaderProps {
  user: AuthUser;
}

export default function CustomerHeader({ user }: CustomerHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { itemCount } = useCart();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    window.location.href = "/";
  };

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
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center max-w-lg w-full mx-8 bg-white">
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

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{user.name || "Account"}</span>
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders" className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    My Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 text-red-600">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
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
