import { Card } from "@/components/ui/card";
import { Target, Eye } from "lucide-react";

interface MissionVisionData {
  mission: {
    icon: React.ReactNode;
    title: string;
    description: string;
  };
  vision: {
    icon: React.ReactNode;
    title: string;
    description: string;
  };
}

interface MissionVisionSectionProps {
  data?: MissionVisionData;
}

export default function MissionVisionSection({ data }: MissionVisionSectionProps) {
  const defaultData: MissionVisionData = {
    mission: {
      icon: <Target className="w-12 h-12 text-primary-600 mx-auto" />,
      title: "Our Mission",
      description:
        "To make pet care across the Maldives easy, joyful, and filled with love; connecting pet parents to the best products, services, and support.",
    },
    vision: {
      icon: <Eye className="w-12 h-12 text-accent-600 mx-auto" />,
      title: "Our Vision",
      description: "To build a trusted home for happy pets, caring families, and thriving local pet communities.",
    },
  };

  const { mission, vision } = data || defaultData;

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card className="py-4 px-4">
        <div className="text-center space-y-4">
          <div className="mb-4">{mission.icon}</div>
          <h2 className="text-2xl font-semibold text-gray-900">{mission.title}</h2>
          <p className="text-gray-700 leading-relaxed">{mission.description}</p>
        </div>
      </Card>

      <Card className="py-4 px-4">
        <div className="text-center space-y-4">
          <div className="mb-4">{vision.icon}</div>
          <h2 className="text-2xl font-semibold text-gray-900">{vision.title}</h2>
          <p className="text-gray-700 leading-relaxed">{vision.description}</p>
        </div>
      </Card>
    </div>
  );
}
