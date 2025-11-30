import { AccountType } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: AccountType;
      accountType: AccountType;
      image?: string | null;
      phone?: string | null;
    };
  }
  interface User {
    id: string;
    email: string;
    name: string;
    role: AccountType;
    accountType?: AccountType;
    image?: string | null;
    phone?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string;
    role: AccountType;
  }
}
