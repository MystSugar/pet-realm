import { Metadata } from "next";
import ShopDetailContent from "@/components/shops/ShopDetailContent";

interface ShopPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: ShopPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/shops/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        title: "Shop Not Found | Pet Realm",
      };
    }

    const data = await response.json();
    const shop = data.shop;

    return {
      title: `${shop.name} | Pet Realm`,
      description: shop.description || `Browse products from ${shop.name}`,
    };
  } catch {
    return {
      title: "Shop | Pet Realm",
    };
  }
}

export default async function ShopPage({ params }: ShopPageProps) {
  const { id } = await params;
  return <ShopDetailContent shopId={id} />;
}
