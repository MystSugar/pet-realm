import React from "react";
import { Card } from "@/components/ui/card";
import { Shield, Users, Heart, Rocket } from "lucide-react";

interface ValueItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface AboutValuesSectionProps {
  title?: string;
  values?: ValueItem[];
}

export default function AboutValuesSection({ title = "Our Values", values }: AboutValuesSectionProps) {
  const defaultValues: ValueItem[] = [
    {
      icon: <Shield className="w-8 h-8 text-primary-600" />,
      title: "Trust & Safety",
      description: "We make sure every shop and service is genuine, caring, and reliable.",
    },
    {
      icon: <Users className="w-8 h-8 text-accent-600" />,
      title: "Local Community",
      description: "We love supporting Maldivian pet businesses and helping them grow.",
    },
    {
      icon: <Heart className="w-8 h-8 text-secondary-600" />,
      title: "Animal Welfare",
      description: "We care deeply about pets and promote kind, responsible ownership.",
    },
    {
      icon: <Rocket className="w-8 h-8 text-charcoal-600" />,
      title: "Innovation",
      description: "We keep finding better ways to make pet care easy for everyone.",
    },
  ];

  const valuesList = values || defaultValues;

  return (
    <Card className="p-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">{title}</h2>
      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-8">
          {valuesList.slice(0, 2).map((value, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0">{value.icon}</div>
              <div>
                <h4 className="font-semibold text-gray-900">{value.title}</h4>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-8">
          {valuesList.slice(2, 4).map((value, index) => (
            <div key={index + 2} className="flex items-start space-x-3">
              <div className="flex-shrink-0">{value.icon}</div>
              <div>
                <h4 className="font-semibold text-gray-900">{value.title}</h4>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
