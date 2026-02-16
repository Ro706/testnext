import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LogoutButton from "./LogoutButton";
import { verifyToken } from "@/lib/jwt";

export default async function DashboardPage() {
  // Get cookies (Next.js 15+ requires await)
  const cookieStore = await cookies();

  const token = cookieStore.get("auth")?.value;

  // Not logged in → redirect
  if (!token) {
    redirect("/sign-in");
  }

  let user: any;

  try {
    // Verify JWT token
    user = verifyToken(token);
  } catch (err) {
    console.error("Invalid or expired token:", err);
    redirect("/sign-in");
  }

  //Extract username from email
  const username =
    user?.email?.split("@")[0] || "User";

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* 🔹 Header */}
        <div className="flex items-center justify-between">
          <img src="/favicon.ico" alt="Favicon" className="w-16 h-16" />
          <h1 className="text-3xl font-bold">
            Hello {username}
          </h1>

          <LogoutButton />
        </div>

        {/* 🔹 Dashboard Card */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">
            Dashboard 🎉
          </h2>

          <p className="text-muted-foreground mt-2">
            You are successfully logged in.
          </p>
        </div>

      </div>
    </main>
  );
}
