import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

interface ResetPasswordPageProps {
  searchParams: { token?: string };
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
  }

  const token = searchParams.token;

  if (!token) {
    redirect("/auth/forgot-password");
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-cream-50 to-secondary-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
}
