import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import SignInForm from "@/components/auth/SignInForm";

export default async function SignInPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-cream-50 to-secondary-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <SignInForm />
      </div>
    </div>
  );
}
