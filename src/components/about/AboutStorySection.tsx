import React from "react";
import { Card } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

interface AboutStorySectionProps {
  title?: string;
  paragraphs?: string[];
}

export default function AboutStorySection({ title = "Our Story", paragraphs }: AboutStorySectionProps) {
  const defaultParagraphs = [
    "Pet Realm began with a simple goal: to make life easier for pet owners across the Maldives. Like many others, I struggled to find quality pet products and services scattered across countless pages and shops.",

    "Founded in 2025, Pet Realm brings trusted local businesses together in one place, making pet care simple, reliable, and connected.",
  ];

  const storyParagraphs = paragraphs || defaultParagraphs;

  return (
    <Card className="p-12 w-full rounded-none shadow-none bg-gradient-to-br from-primary-200 to-secondary-200 border-t border-b border-charcoal-100">
      <div className="container max-w-6xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <BookOpen className="w-8 h-8 text-primary-600" />
            <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
          </div>
        </div>
        <div className="space-y-4 text-gray-700 leading-relaxed text-md">
          {storyParagraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </Card>
  );
}
