import Hero from "@/components/homepage/Hero";
import PetCategory from "@/components/homepage/PetCategory";
import { Button } from "@/components/ui/button";
import { ProductCategory } from "@prisma/client";
import Link from "next/link";
import Layout from "@/components/layouts/Layout";

export default function Home() {
  return (
    <Layout>
      {/* Enhanced Hero Section */}
      <Hero />

      {/* Categories and other content */}
      <div className="bg-gradient-to-br from-cream-10 to-primary-50">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Product Categories Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center text-charcoal-800">Shop by Category</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <PetCategory
                lucideIcon="package"
                title="Pet Food"
                description="Nutritious meals for all your pets."
                category={ProductCategory.PET_FOOD}
              />
              <PetCategory
                lucideIcon="shopping-bag"
                title="Accessories"
                description="Collars, leashes, and essentials."
                category={ProductCategory.ACCESSORIES}
              />
              <PetCategory lucideIcon="gamepad" title="Toys" description="Fun and engaging toys for playtime." category={ProductCategory.TOYS} />
              <PetCategory
                lucideIcon="stethoscope"
                title="Health Care"
                description="Vitamins, supplements, and wellness."
                category={ProductCategory.HEALTH_CARE}
              />
            </div>
          </div>

          {/* Become a Seller section */}
          <div className="py-8">
            <div className="bg-gradient-to-br from-accent-200 to-secondary-50 rounded-xl shadow-lg p-8 mb-12 text-center">
              <h2 className="text-3xl font-bold mb-4 text-charcoal-800">Become a Seller</h2>
              <p className="text-md text-charcoal-600 mb-8">Sell products, services, and more on Pet Realm</p>
              <div className="">
                <Link href="/auth/register">
                  <Button variant="default" size="lg" className="inline-flex items-center gap-2">
                    Become a Seller
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Live Animals Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-2 text-center text-charcoal-800">Find Your New Companion</h2>
            <p className="text-center text-charcoal-600 mb-8">Browse live animals from trusted sellers</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <PetCategory icon="/cat-icon.png" title="Cats" description="Adopt adorable cats and kittens." category={ProductCategory.CATS} />
              <PetCategory icon="/bird-icon.png" title="Birds" description="Colorful birds for your home." category={ProductCategory.BIRDS} />
              <PetCategory icon="/fish-icon.png" title="Fish" description="Beautiful aquatic companions." category={ProductCategory.FISH} />
              <PetCategory
                icon="/reptile-icon.png"
                title="Reptiles"
                description="Unique reptiles and amphibians."
                category={ProductCategory.REPTILES}
              />
            </div>
          </div>

          {/* Location section */}
          <div className="text-center pt-8 ">
            <h2 className="text-2xl font-bold mb-6 text-charcoal-800">Serving Across the Maldives</h2>
            <div className="flex justify-center gap-8 flex-wrap">
              <span className="bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium">Male</span>
              <span className="bg-secondary-100 text-secondary-700 px-4 py-2 rounded-full text-sm font-medium">Hulhumale Phase 1</span>
              <span className="bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium">Hulhumale Phase 2</span>
              <span className="bg-accent-100 text-accent-700 px-4 py-2 rounded-full text-sm font-medium">Villimale</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
