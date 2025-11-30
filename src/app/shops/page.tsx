import { Metadata } from "next";
import ShopsContent from "@/components/shops/ShopsContent";

export const metadata: Metadata = {
  title: "Pet Shops | Pet Realm",
  description: "Browse local pet shops in the Maldives. Find pet stores, grooming services, veterinary clinics, and boarding facilities.",
};

export default function ShopsPage() {
  return <ShopsContent />;
}
