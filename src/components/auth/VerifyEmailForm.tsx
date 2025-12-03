"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function VerifyEmailForm() {
  const [status, setStatus] = useState<"verifying" | "success" | "error" | "invalid" | "no-token">("verifying");
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams?.get("token");

  useEffect(() => {
    const verifyEmail = async () => {
      
      if (!token) {
        console.log("No token found");
        setStatus("no-token");
        setMessage("No verification token provided. Please check your email for the verification link.");
        return;
      }

      try {
        console.log("Calling API...");
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        console.log("API response status:", response.status);
        const data = await response.json();
        console.log("API response data:", data);

        if (response.ok) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully!");
        } else {
          setStatus("error");
          setMessage(data.error || "Verification failed");
        }
      } catch (err) {
        console.error("Verification error:", err);
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    };

    verifyEmail();
  }, [token]);

  const handleSignIn = () => {
    router.push("/auth/signin?message=Email verified! You can now sign in.");
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white">
      <CardHeader className="text-center">
        <div className="w-12 h-12 flex items-center justify-center mx-auto">
          <Image src="/icon.png" alt="Pet Realm" width={48} height={48} />
        </div>
        <CardTitle className="text-2xl font-bold">Email Verification</CardTitle>
      </CardHeader>

      <CardContent className="text-center">
        {status === "verifying" && (
          <div className="space-y-4">
            <Mail className="w-16 h-16 text-blue-500 mx-auto animate-pulse" />
            <p className="text-gray-600">Verifying your email address...</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-green-600">Verification Successful!</h3>
              <p className="text-gray-600">{message}</p>
            </div>
            <Button onClick={handleSignIn} className="w-full">
              Sign In to Pet Realm
            </Button>
          </div>
        )}

        {status === "no-token" && (
          <div className="space-y-4">
            <Mail className="w-10 h-10 text-blue-500 mx-auto" />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-blue-600">Email Verification Required</h3>
              <p className="text-gray-600">Please check your email for a verification link to complete your registration.</p>
            </div>
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/auth/register">Create Account</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/auth/signin">Already have an account? Sign In</Link>
              </Button>
            </div>
          </div>
        )}

        {status === "invalid" && (
          <div className="space-y-4">
            <XCircle className="w-10 h-10 text-orange-500 mx-auto" />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-orange-600">Invalid Verification Link</h3>
              <p className="text-gray-600">
                This verification link is invalid or has expired. Please try registering again or request a new verification email.
              </p>
            </div>
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/auth/register">Create New Account</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/auth/signin">Try Signing In</Link>
              </Button>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <XCircle className="w-10 h-10 text-red-500 mx-auto" />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-red-600">Verification Failed</h3>
              <p className="text-gray-600">{message}</p>
            </div>
            <div className="space-y-3">
              <Button asChild variant="outline" className="w-full">
                <Link href="/auth/signin">Try Signing In</Link>
              </Button>
              <Button asChild className="w-full">
                <Link href="/auth/register">Create New Account</Link>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
