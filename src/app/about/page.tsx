import React from "react";
import { MissionVisionSection, AboutStorySection, AboutValuesSection } from "@/components/about";
import type { Metadata } from "next";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Pet Realm",
  description: "Learn about Pet Realm's mission to connect pet owners with trusted local businesses across the Maldives.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-secondary-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="w-10 h-10" />
            <h1 className="text-4xl md:text-5xl font-bold">About Pet Realm</h1>
            <Sparkles className="w-10 h-10" />
          </div>
          <p className="text-xl text-primary-50 max-w-3xl mx-auto">Connecting pet lovers with trusted local businesses across the Maldives</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Mission & Vision */}
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
          <MissionVisionSection />
        </div>
      </div>

      {/* Story Section */}
      <div className="py-16">
        <AboutStorySection />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Values Section */}
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <AboutValuesSection />
        </div>
      </div>
    </div>
  );
}
