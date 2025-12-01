import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, ProductCategory, AccountType, ShopCategory, IDType, PetGender } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SEED_SECRET = process.env.SEED_SECRET;

export async function POST(request: NextRequest) {
  try {
    // Get the secret from the request header
    const authHeader = request.headers.get("authorization");
    const providedSecret = authHeader?.replace("Bearer ", "");

    // Check if the secret matches
    if (providedSecret !== SEED_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid seed secret" },
        { status: 401 }
      );
    }

    console.log("Starting database seed...");

    // Clean up existing data
    console.log("Cleaning up existing data...");
    await prisma.contact.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.shop.deleteMany();
    await prisma.account.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();

    // ========================================
    // USERS
    // ========================================
    console.log("Creating users...");
    
    // Customer Account
    await prisma.user.create({
      data: {
        name: "Ahmed Hassan",
        email: "customer@petrealm.com",
        phone: "7771234",
        password: await bcrypt.hash("customer123", 12),
        accountType: AccountType.CUSTOMER,
        emailVerified: true,
        userType: "MALDIVIAN",
        idType: IDType.NATIONAL_ID,
        idNumber: "A123456",
        island: "Malé",
        atoll: "Kaafu",
        address: "H. Moonlight, Majeedee Magu",
      },
    });

    // Shop Owner Account
    const shopOwner = await prisma.user.create({
      data: {
        name: "Mohamed Rasheed",
        email: "seller@petrealm.com",
        phone: "7773456",
        password: await bcrypt.hash("seller123", 12),
        accountType: AccountType.SELLER,
        emailVerified: true,
        userType: "MALDIVIAN",
        idType: IDType.NATIONAL_ID,
        idNumber: "A345678",
        island: "Malé",
        atoll: "Kaafu",
        address: "M. Seashell, Orchid Magu",
      },
    });

    // SHOPS
    console.log("Creating shops...");

    const petStore = await prisma.shop.create({
      data: {
        name: "Pawfect Paradise",
        description: "Your one-stop shop for all pet supplies in Malé. We offer premium quality food, accessories, toys, and healthcare products for cats, birds, fish, and small pets.",
        category: ShopCategory.PET_STORE,
        ownerId: shopOwner.id,
        phone: "3331234",
        email: "info@pawfectparadise.mv",
        island: "Malé",
        atoll: "Kaafu",
        address: "Chandhanee Magu, Malé 20026",
        license: "BS-2024-001234",
        isVerified: true,
        isActive: true,
        setupComplete: true,
        setupStep: 4,
        bankName: "Bank of Maldives",
        accountHolderName: "Mohamed Rasheed",
        accountNumber: "7701234567890",
        businessHours: {
          days: ["MON", "TUE", "WED", "THU", "SAT", "SUN"],
          openTime: "09:00",
          closeTime: "21:00"
        },
        deliveryZones: {
          zones: [
            { island: "Malé", atoll: "Kaafu", fee: 0 },
            { island: "Hulhumalé", atoll: "Kaafu", fee: 25 },
            { island: "Vilimalé", atoll: "Kaafu", fee: 30 }
          ]
        }
      },
    });

    // PRODUCTS - PET STORE
    console.log("Creating products...");

    // Cat Products
    await prisma.product.create({
      data: {
        shopId: petStore.id,
        name: "Royal Canin Adult Cat Food",
        description: "Premium dry food specially formulated for adult cats (1-7 years). Contains optimal protein levels, vitamins, and minerals for healthy coat and digestion. 2kg pack.",
        category: ProductCategory.PET_FOOD,
        price: 485.00,
        imagesUrl: [],
        tags: ["cat", "dry food", "adult", "premium", "royal canin"],
        stock: 45,
        lowStockThreshold: 10,
        isAvailable: true,
      },
    });

    await prisma.product.create({
      data: {
        shopId: petStore.id,
        name: "Fresh Step Clumping Cat Litter",
        description: "Advanced odor control clumping litter. 99.9% dust-free formula. Easy to scoop and long-lasting. 10L bag.",
        category: ProductCategory.ACCESSORIES,
        price: 195.00,
        imagesUrl: [],
        tags: ["cat", "litter", "clumping", "odor control", "dust free"],
        stock: 30,
        lowStockThreshold: 8,
        isAvailable: true,
      },
    });

    await prisma.product.create({
      data: {
        shopId: petStore.id,
        name: "Interactive Feather Wand Toy",
        description: "Engaging feather toy on a flexible wand. Perfect for interactive play and exercise. Helps satisfy hunting instincts.",
        category: ProductCategory.TOYS,
        price: 65.00,
        imagesUrl: [],
        tags: ["cat", "toy", "interactive", "feather", "exercise"],
        stock: 50,
        lowStockThreshold: 15,
        isAvailable: true,
      },
    });

    await prisma.product.create({
      data: {
        shopId: petStore.id,
        name: "Cat Scratching Post with Platform",
        description: "Sturdy sisal rope scratching post with elevated resting platform. Saves furniture and satisfies natural scratching behavior. 60cm height.",
        category: ProductCategory.ACCESSORIES,
        price: 385.00,
        imagesUrl: [],
        tags: ["cat", "scratching post", "sisal", "furniture", "platform"],
        stock: 12,
        lowStockThreshold: 3,
        isAvailable: true,
      },
    });

    // Live Cats
    await prisma.product.create({
      data: {
        shopId: petStore.id,
        name: "Persian Kitten - Female",
        description: "Beautiful purebred Persian kitten with long silky coat. Playful, affectionate personality. Comes with vaccination records and health certificate.",
        category: ProductCategory.CATS,
        price: 3500.00,
        imagesUrl: [],
        tags: ["cat", "kitten", "persian", "purebred", "female"],
        breed: "Persian",
        age: "3 months",
        gender: PetGender.FEMALE,
        color: "White with gray patches",
        isLiveAnimal: true,
        vaccinationStatus: "First round completed",
        healthCondition: "Excellent - vet certified",
        stock: 1,
        isAvailable: true,
      },
    });

    await prisma.product.create({
      data: {
        shopId: petStore.id,
        name: "Maine Coon Kitten - Male",
        description: "Majestic Maine Coon kitten. One of the largest domestic cat breeds. Friendly, intelligent, and great with families.",
        category: ProductCategory.CATS,
        price: 4200.00,
        imagesUrl: [],
        tags: ["cat", "kitten", "maine coon", "purebred", "male", "large"],
        breed: "Maine Coon",
        age: "4 months",
        gender: PetGender.MALE,
        weight: "2.5 kg",
        color: "Brown tabby",
        isLiveAnimal: true,
        vaccinationStatus: "Up to date - 2 rounds",
        healthCondition: "Excellent",
        stock: 1,
        isAvailable: true,
      },
    });

    // Bird Products
    await prisma.product.create({
      data: {
        shopId: petStore.id,
        name: "Large Bird Cage with Stand",
        description: "Spacious metal cage suitable for parrots and large birds. Includes perches, feeding bowls, and removable tray. 80x60x150cm.",
        category: ProductCategory.ACCESSORIES,
        price: 1250.00,
        imagesUrl: [],
        tags: ["bird", "cage", "large", "parrot", "stand"],
        stock: 8,
        lowStockThreshold: 2,
        isAvailable: true,
      },
    });

    await prisma.product.create({
      data: {
        shopId: petStore.id,
        name: "African Grey Parrot",
        description: "Highly intelligent African Grey parrot. Excellent talker and mimic. Hand-raised and socialized. Includes care guide and dietary instructions.",
        category: ProductCategory.BIRDS,
        price: 12500.00,
        imagesUrl: [],
        tags: ["bird", "parrot", "african grey", "talking bird", "intelligent"],
        breed: "African Grey",
        age: "8 months",
        gender: PetGender.UNKNOWN,
        color: "Gray with red tail",
        isLiveAnimal: true,
        vaccinationStatus: "Fully vaccinated",
        healthCondition: "Excellent - certified by avian vet",
        specialNeeds: "Requires mental stimulation and social interaction daily",
        stock: 1,
        isAvailable: true,
      },
    });

    // Fish Products
    await prisma.product.create({
      data: {
        shopId: petStore.id,
        name: "Glass Aquarium Tank 50L",
        description: "Crystal clear glass aquarium. Includes LED lighting hood and filter system. Perfect for tropical fish. 60x30x35cm.",
        category: ProductCategory.ACCESSORIES,
        price: 875.00,
        imagesUrl: [],
        tags: ["fish", "aquarium", "tank", "50L", "filter", "LED"],
        stock: 15,
        lowStockThreshold: 4,
        isAvailable: true,
      },
    });

    await prisma.product.create({
      data: {
        shopId: petStore.id,
        name: "Tropical Fish Flakes - Premium",
        description: "High-quality tropical fish food with color enhancers. Balanced nutrition for all tropical fish species. 200g container.",
        category: ProductCategory.PET_FOOD,
        price: 145.00,
        imagesUrl: [],
        tags: ["fish", "food", "flakes", "tropical", "nutrition"],
        stock: 60,
        lowStockThreshold: 15,
        isAvailable: true,
      },
    });

    await prisma.product.create({
      data: {
        shopId: petStore.id,
        name: "Clownfish Pair (Saltwater)",
        description: "Beautiful orange and white clownfish pair. Hardy and easy to care for. Great for beginners. Tank-bred and acclimatized.",
        category: ProductCategory.FISH,
        price: 650.00,
        imagesUrl: [],
        tags: ["fish", "clownfish", "saltwater", "pair", "marine"],
        breed: "Clownfish (Amphiprion ocellaris)",
        color: "Orange with white bands",
        isLiveAnimal: true,
        healthCondition: "Healthy and active",
        specialNeeds: "Requires saltwater tank with proper salinity",
        stock: 3,
        isAvailable: true,
      },
    });

    // Small Pets
    await prisma.product.create({
      data: {
        shopId: petStore.id,
        name: "Hamster Habitat Cage",
        description: "Complete hamster habitat with wheel, hideout, water bottle, and food bowl. Wire top for ventilation. 45x30x30cm.",
        category: ProductCategory.ACCESSORIES,
        price: 285.00,
        imagesUrl: [],
        tags: ["small pet", "hamster", "cage", "habitat", "complete"],
        stock: 20,
        lowStockThreshold: 5,
        isAvailable: true,
      },
    });

    await prisma.product.create({
      data: {
        shopId: petStore.id,
        name: "Syrian Hamster",
        description: "Friendly Syrian hamster (also known as Golden hamster). Gentle and easy to handle. Great first pet for children with supervision.",
        category: ProductCategory.SMALL_PETS,
        price: 95.00,
        imagesUrl: [],
        tags: ["small pet", "hamster", "syrian", "golden", "friendly"],
        breed: "Syrian Hamster",
        age: "2 months",
        gender: PetGender.FEMALE,
        color: "Golden brown",
        isLiveAnimal: true,
        healthCondition: "Healthy",
        stock: 6,
        isAvailable: true,
      },
    });

    // Reptile
    await prisma.product.create({
      data: {
        shopId: petStore.id,
        name: "Reptile Terrarium 40L",
        description: "Glass terrarium with mesh top and front opening doors. Includes heat lamp fixture. Ideal for small reptiles. 60x40x40cm.",
        category: ProductCategory.ACCESSORIES,
        price: 1150.00,
        imagesUrl: [],
        tags: ["reptile", "terrarium", "tank", "heat lamp", "glass"],
        stock: 10,
        lowStockThreshold: 3,
        isAvailable: true,
      },
    });

    await prisma.product.create({
      data: {
        shopId: petStore.id,
        name: "Leopard Gecko",
        description: "Docile and easy-to-care-for leopard gecko. Great for reptile beginners. Captive-bred. Comes with care sheet and feeding guide.",
        category: ProductCategory.REPTILES,
        price: 850.00,
        imagesUrl: [],
        tags: ["reptile", "gecko", "leopard gecko", "lizard", "beginner friendly"],
        breed: "Leopard Gecko",
        age: "6 months",
        gender: PetGender.MALE,
        color: "Yellow with black spots",
        isLiveAnimal: true,
        healthCondition: "Healthy",
        specialNeeds: "Requires heat source and calcium supplements",
        stock: 2,
        isAvailable: true,
      },
    });

    // Healthcare Products
    await prisma.product.create({
      data: {
        shopId: petStore.id,
        name: "Multi-Vitamin Supplements for Cats & Dogs",
        description: "Complete daily vitamin and mineral supplement. Supports immune system, coat health, and overall wellness. 60 tablets.",
        category: ProductCategory.HEALTH_CARE,
        price: 265.00,
        imagesUrl: [],
        tags: ["health", "vitamins", "supplements", "cat", "dog"],
        stock: 40,
        lowStockThreshold: 10,
        isAvailable: true,
      },
    });

    await prisma.product.create({
      data: {
        shopId: petStore.id,
        name: "Flea & Tick Treatment Spot-On",
        description: "Fast-acting flea and tick prevention. One month protection per application. For cats and small dogs. Pack of 3.",
        category: ProductCategory.HEALTH_CARE,
        price: 385.00,
        imagesUrl: [],
        tags: ["health", "flea", "tick", "treatment", "prevention"],
        stock: 25,
        lowStockThreshold: 8,
        isAvailable: true,
      },
    });

    // SUMMARY
    const summary = {
      users: await prisma.user.count(),
      customers: await prisma.user.count({ where: { accountType: AccountType.CUSTOMER } }),
      sellers: await prisma.user.count({ where: { accountType: AccountType.SELLER } }),
      shops: await prisma.shop.count(),
      products: await prisma.product.count(),
      liveAnimals: await prisma.product.count({ where: { isLiveAnimal: true } }),
      orders: await prisma.order.count(),
      cartItems: await prisma.cartItem.count(),
    };

    console.log("Seed completed successfully!");
    
    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      summary,
      credentials: {
        customer: {
          email: "customer@petrealm.com",
          password: "customer123"
        },
        seller: {
          email: "seller@petrealm.com",
          password: "seller123"
        }
      }
    });

  } catch (error) {
    console.error("Seed failed:", error);
    return NextResponse.json(
      { 
        error: "Seed failed", 
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
