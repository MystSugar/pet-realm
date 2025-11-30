import React from "react";
import ContactContent from "@/components/contact/ContactContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Pet Realm",
  description: "Get in touch with Pet Realm. We're here to help with any questions about pet products, services, or our platform.",
};

export default function ContactPage() {
  return <ContactContent />;
}
