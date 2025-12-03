"use client";

import { Suspense } from "react";
import VerifyEmailForm from "@/components/auth/VerifyEmailForm";

export default function VerifyEmailPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-cream-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Verify Your Email</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Complete your registration by verifying your email address</p>
        </div>
        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <VerifyEmailForm />
        </Suspense>
      </div>
    </div>
  );
}
