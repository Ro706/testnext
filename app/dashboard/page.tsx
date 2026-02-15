import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LogoutButton from "./LogoutButton";

export default async function DashboardPage() {
  // 🔐 Get cookies (Next.js 15+ requires await)
  const cookieStore = await cookies();

  const auth = cookieStore.get("auth");

  // ❌ If not logged in → redirect
  if (!auth) {
    redirect("/sign-in");
  }

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            Dashboard 🎉
          </h1>

          <LogoutButton />
        </div>

        {/* Content */}
        <div className="rounded-xl border p-6 shadow-sm">
          <h2 className="text-xl font-semibold">
            Welcome back!
          </h2>

          <p className="text-muted-foreground mt-2">
            You are successfully logged in.
          </p>
        </div>

      </div>
    </main>
  );
}
