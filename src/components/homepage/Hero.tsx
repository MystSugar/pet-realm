"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Shield, Truck } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-cream-10">
      {/* Hero Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Platform Badge */}
            <div className="flex justify-center lg:justify-start">
              <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-primary-100">
                <Heart className="w-4 h-4 mr-2" />
                New Pet Marketplace Platform for Maldives
              </Badge>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-charcoal-800 leading-tight">
                Everything Your
                <span className="text-primary-600 block">Beloved Pets</span>
                Need & Deserve
              </h1>
              <p className="text-lg sm:text-xl text-charcoal-600 max-w-2xl">
                From premium food to cozy beds, health care to fun toys - discover quality pet supplies from trusted local and international sellers,
                delivered right to your doorstep across the Maldives.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild size="lg" className="px-8 py-3 text-lg">
                <Link href="/marketplace">
                  <Heart className="w-5 h-5 mr-2" />
                  Shop for Your Pet
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8 py-3 text-lg">
                <Link href="/shops">Discover Local Shops</Link>
              </Button>
            </div>

            {/* Platform Features - Truthful */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start mb-2">
                  <Shield className="w-5 h-5 text-primary-600 mr-2" />
                </div>
                <p className="text-sm text-charcoal-600">
                  <span className="font-semibold">Secure</span>
                  <br />
                  Platform
                </p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start mb-2">
                  <Truck className="w-5 h-5 text-primary-600 mr-2" />
                </div>
                <p className="text-sm text-charcoal-600">
                  <span className="font-semibold">Island-Wide</span>
                  <br />
                  Coverage
                </p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start mb-2">
                  <Heart className="w-5 h-5 text-primary-600 mr-2" />
                </div>
                <p className="text-sm text-charcoal-600">
                  <span className="font-semibold">Pet-Focused</span>
                  <br />
                  Marketplace
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Hero Image/Visual */}
          <div className="relative">
            <div className="relative z-10 rounded-2xl p-8 shadow-2xl">
              {/* Placeholder for hero image - will add when you have pet images */}
              <div className="aspect-square bg-gradient-to-br from-primary-200 to-accent-200 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-12 h-12 text-white" />
                  </div>
                </div>
              </div>

              {/* Floating Stats */}
              <div className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-4 border border-gray-100">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">NEW</div>
                  <div className="text-xs text-gray-600">Platform</div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-4 border border-gray-100">
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary-600">2025</div>
                  <div className="text-xs text-gray-600">Launch</div>
                </div>
              </div>
            </div>

            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl transform rotate-3 scale-105 -z-10"></div>
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-cream-50 via-transparent to-secondary-50 -z-20"></div>
    </div>
  );
}
