"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { User, LogOut, ChevronDown, BarChart3, Package, Settings, Store } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface AuthUser {
  id?: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
  role?: string;
}

interface SellerHeaderProps {
  user: AuthUser;
  shop?: {
    name: string;
    id: string;
  };
}

export default function SellerHeader({ user, shop }: SellerHeaderProps) {
  const handleSignOut = async () => {
    await signOut({ redirect: false });
    window.location.href = "/";
  };

  return (
    <header className="bg-cream-50 border-b border-gray-200 sticky top-0 z-50">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center">
                <Image src="/icon.png" alt="Pet Realm" width={32} height={32} />
              </div>
              <span className="text-xl font-bold text-charcoal-800">Pet Realm</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/shop/dashboard" className="text-charcoal-600 hover:text-primary-600 font-medium transition-colors">
              Dashboard
            </Link>
            <Link href="/shop/products" className="text-charcoal-600 hover:text-primary-600 font-medium transition-colors">
              Products
            </Link>
            <Link href="/shop/orders" className="text-charcoal-600 hover:text-primary-600 font-medium transition-colors">
              Orders
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{user.name || "Account"}</span>
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="md:hidden">
                  <DropdownMenuItem asChild>
                    <Link href="/shop/dashboard" className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/shop/products" className="flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Products
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/shop/orders" className="flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </div>
                <DropdownMenuItem asChild>
                  <Link href="/shop/settings" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Shop Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={shop ? `/shops/${shop.id}` : "/shop/setup"} className="flex items-center gap-2">
                    <Store className="w-4 h-4" />
                    View Shop
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
      </div>
    </header>
  );
}
