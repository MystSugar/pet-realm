import { PrismaClient, ProductCategory, AccountType, ShopCategory, OrderStatus, DeliveryType, IDType } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting -- Seeding database...");

  // Clean up existing data
  console.log("Cleaning up existing data...");
  await prisma.cartItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.shop.deleteMany();
  await prisma.user.deleteMany();

  // Create test users
  console.log("Creating test users...");
  const customerUser = await prisma.user.create({
    data: {
      name: "Ahmed Hassan",
      email: "customer@petrealm.com",
      phone: "7001234",
      password: await bcrypt.hash("password123", 12),
      accountType: AccountType.CUSTOMER,
      emailVerified: true,
      userType: "MALDIVIAN",
      idType: IDType.NATIONAL_ID,
      idNumber: "A001234",
      island: "Malé",
      atoll: "Kaafu",
    },
  });

  const shopOwner = await prisma.user.create({
    data: {
      name: "Fatima Ibrahim",
      email: "shopowner@petrealm.com",
      phone: "7002345",
      password: await bcrypt.hash("password123", 12),
      accountType: AccountType.SELLER,
      emailVerified: true,
      userType: "MALDIVIAN",
      idType: IDType.NATIONAL_ID,
      idNumber: "A002345",
      island: "Malé",
      atoll: "Kaafu",
    },
  });

  // Create shops
  console.log("🏪 Creating shops...");
  const petShop = await prisma.shop.create({
    data: {
      name: "Pawsome Pets Malé",
      description: "Your neighborhood pet store with everything your pets need!",
      category: ShopCategory.PET_STORE,
      ownerId: shopOwner.id,
      phone: "3001234",
      email: "info@pawsomepets.mv",
      island: "Malé",
      atoll: "Kaafu",
      address: "Chandhanee Magu, Malé 20026",
      license: "BL001234",
      isVerified: true,
      isActive: true,
    },
  });

  // Create products
  console.log("Creating products...");
  const products = await Promise.all([
    prisma.product.create({
      data: {
        shopId: petShop.id,
        name: "Premium Cat Food - Adult",
        description: "High-quality dry cat food for adult cats",
        category: ProductCategory.PET_FOOD,
        price: 450.0,
        imagesUrl: [],
        tags: ["dry food", "adult", "premium"],
        stock: 25,
      },
    }),
    prisma.product.create({
      data: {
        shopId: petShop.id,
        name: "Cat Litter - Clumping",
        description: "Premium clumping cat litter for odor control",
        category: ProductCategory.ACCESSORIES,
        price: 180.0,
        imagesUrl: [],
        tags: ["litter", "clumping", "odor control"],
        stock: 15,
      },
    }),
    prisma.product.create({
      data: {
        shopId: petShop.id,
        name: "Cat Collar - Adjustable",
        description: "Comfortable adjustable collar for medium cats",
        category: ProductCategory.ACCESSORIES,
        price: 120.0,
        imagesUrl: [],
        tags: ["collar", "adjustable", "medium"],
        stock: 30,
      },
    }),
  ]);

  // Create cart items for customer
  console.log("Creating cart items...");
  await prisma.cartItem.createMany({
    data: [
      {
        id: randomUUID(),
        userId: customerUser.id,
        productId: products[0].id, // Premium Cat Food
        quantity: 2,
      },
      {
        id: randomUUID(),
        userId: customerUser.id,
        productId: products[2].id, // Cat Collar
        quantity: 1,
      },
    ],
  });

  // Create orders
  console.log("Creating orders...");
  const order1 = await prisma.order.create({
    data: {
      id: randomUUID(),
      orderNumber: "ORD-001",
      customerId: customerUser.id,
      shopId: petShop.id,
      status: OrderStatus.DELIVERED,
      subtotal: 570.0,
      delivery: 0.0,
      total: 570.0,
      deliveryType: DeliveryType.DELIVERY,
      deliveryAddress: "Chandhanee Magu, Malé 20026",
      deliveryIsland: "Malé",
      deliveryAtoll: "Kaafu",
    },
  });

  // Create order items
  console.log("Creating order items...");
  await prisma.orderItem.createMany({
    data: [
      {
        id: randomUUID(),
        orderId: order1.id,
        productId: products[0].id, // Premium Cat Food
        quantity: 1,
        price: 450.0,
      },
      {
        id: randomUUID(),
        orderId: order1.id,
        productId: products[2].id, // Cat Collar
        quantity: 1,
        price: 120.0,
      },
    ],
  });

  console.log("✅ Seed completed successfully!");

  // Print summary
  console.log("\n📊 Seed Summary:");
  console.log(`Users: ${await prisma.user.count()}`);
  console.log(`Shops: ${await prisma.shop.count()}`);
  console.log(`Products: ${await prisma.product.count()}`);
  console.log(`Cart Items: ${await prisma.cartItem.count()}`);
  console.log(`Orders: ${await prisma.order.count()}`);
  console.log(`Order Items: ${await prisma.orderItem.count()}`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
