import Image from "next/image";
import Link from "next/link";
import { Gamepad2, Stethoscope, ShoppingBag, Package } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-charcoal-800 text-cream-50">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Column 1: Logo & Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Image src="/icon.png" alt="Pet Realm Logo" width={30} height={30} className="object-contain rounded-full" />
              <span className="text-xl font-bold text-primary-500">Pet Realm</span>
            </div>
            <p className="text-charcoal-300 text-sm">Connecting pet lovers with trusted shops and professional services.</p>
          </div>

          {/* Column 2: Explore */}
          <div>
            <h3 className="font-semibold mb-3 text-primary-500">Explore</h3>
            <ul className="space-y-2 text-sm text-charcoal-300">
              <li>
                <Link href="/marketplace" className="hover:text-primary-300 active:text-primary-400 duration-300 transition-colors">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link href="/shops" className="hover:text-primary-300 active:text-primary-400 duration-300 transition-colors">
                  Pet Shops
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary-300 active:text-primary-400 duration-300 transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div>
            <h3 className="font-semibold mb-3 text-primary-500">Categories</h3>
            <ul className="space-y-2 text-sm text-charcoal-300">
              <li>
                <Link
                  href="/marketplace?category=PET_FOOD"
                  className="flex items-center space-x-2 hover:text-primary-300 active:text-primary-400 duration-300 transition-colors">
                  <Package className="w-4 h-4" />
                  <span>Pet Food</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/marketplace?category=ACCESSORIES"
                  className="flex items-center space-x-2 hover:text-primary-300 active:text-primary-400 duration-300 transition-colors">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Accessories</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/marketplace?category=TOYS"
                  className="flex items-center space-x-2 hover:text-primary-300 active:text-primary-400 duration-300 transition-colors">
                  <Gamepad2 className="w-4 h-4" />
                  <span>Toys</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/marketplace?category=HEALTH_CARE"
                  className="flex items-center space-x-2 hover:text-primary-300 active:text-primary-400 duration-300 transition-colors">
                  <Stethoscope className="w-4 h-4" />
                  <span>Health Care</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Service Areas */}
          <div>
            <h3 className="font-semibold mb-3 text-accent-300">Service Areas</h3>
            <ul className="space-y-2 text-sm text-charcoal-300">
              <li>Male&apos;</li>
              <li>Hulhumale Phase 1</li>
              <li>Hulhumale Phase 2</li>
              <li>Villimale</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-charcoal-700 mt-8 pt-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-charcoal-400">&copy; {new Date().getFullYear()} Pet Realm Maldives. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-charcoal-400">
            <Link href="/terms" className="hover:text-primary-300 active:text-primary-400 duration-300 transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-accent-300 active:text-accent-400 duration-300 transition-colors">
              Contact Us
            </Link>
            <Link href="/privacy" className="hover:text-primary-300 active:text-primary-400 duration-300 transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
