"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Signup successful");
      router.push("/sign-in");
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="space-y-4 w-80">
        <h1 className="text-2xl font-bold">Sign Up</h1>

        <Input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button className="w-full" onClick={handleSignup}>
          Create Account
        </Button>
         <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-primary underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
