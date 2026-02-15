# Next.js Authentication App (Sign In / Sign Up / Dashboard)

A full-stack authentication system built with **Next.js App Router**, **MongoDB**, **Mongoose**, **Zod validation**, and **shadcn/ui**.

This project demonstrates a professional architecture for building modern SaaS-ready authentication with server-side protection and secure cookies.

---

## ✨ Features

* 🔐 User Sign Up & Sign In
* 🧠 Secure password hashing (bcrypt)
* 🍪 HTTP-only cookie authentication
* 🛡️ Server-side protected dashboard
* 🎨 Modern UI using shadcn/ui + Tailwind CSS
* ⚡ Next.js App Router architecture
* 🧾 Input validation with Zod
* 🗂️ Clean scalable folder structure

---

## 🧱 Tech Stack

* **Framework:** Next.js (App Router)
* **UI:** Tailwind CSS + shadcn/ui
* **Database:** MongoDB
* **ODM:** Mongoose
* **Validation:** Zod
* **Authentication:** Cookie-based session
* **Language:** TypeScript

---

## 📁 Project Structure

```
app/
 ├── (auth)/
 │    ├── sign-in/page.tsx
 │    └── sign-up/page.tsx
 │
 ├── dashboard/
 │    ├── page.tsx
 │    └── LogoutButton.tsx
 │
 ├── api/
 │    └── auth/
 │         ├── signup/route.ts
 │         ├── signin/route.ts
 │         └── logout/route.ts
 │
 ├── layout.tsx
 └── page.tsx
     
components/ui/    → shadcn components
lib/              → database connection
model/            → mongoose models
schemas/          → zod validation
types/            → TypeScript types
```

---

## ⚙️ Installation

### 1️⃣ Create Next.js App

```bash
npx create-next-app@latest my-auth-app
cd my-auth-app
```

---

### 2️⃣ Install Dependencies

```bash
npm install mongoose bcryptjs zod
```

---

### 3️⃣ Install shadcn/ui

```bash
npx shadcn@latest init
npx shadcn@latest add button input card
```

---

## 🔌 Environment Variables

Create `.env.local`:

```
MONGODB_URI=mongodb://127.0.0.1:27017/nextjs-auth
```

---

## 🧩 Backend Setup

### 📄 lib/db.ts — MongoDB Connection

```ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(MONGODB_URI);
}
```

---

### 📄 model/User.ts — User Model

```ts
import mongoose, { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export const User =
  models.User || model("User", userSchema);
```

---

### 📄 schemas/auth.ts — Validation

```ts
import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const signinSchema = signupSchema;
```

---

## 🔐 API Routes

### 🟢 Signup API

📄 `app/api/auth/signup/route.ts`

```ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/model/User";
import { signupSchema } from "@/schemas/auth";

export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();
  const parsed = signupSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const { email, password } = parsed.data;

  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json({ error: "User exists" }, { status: 409 });
  }

  const hashed = await bcrypt.hash(password, 10);

  await User.create({ email, password: hashed });

  return NextResponse.json({ message: "User created" }, { status: 201 });
}
```

---

### 🔑 Signin API (with cookie)

📄 `app/api/auth/signin/route.ts`

```ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/model/User";
import { signinSchema } from "@/schemas/auth";

export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();
  const parsed = signinSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { email, password } = parsed.data;

  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const response = NextResponse.json({ message: "Login successful" });

  response.cookies.set("auth", user._id.toString(), {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return response;
}
```

---

### 🚪 Logout API

📄 `app/api/auth/logout/route.ts`

```ts
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out" });

  response.cookies.set("auth", "", {
    expires: new Date(0),
    path: "/",
  });

  return response;
}
```

---

## 🎨 Frontend Pages

### 📝 Sign Up Page

📄 `app/(auth)/sign-up/page.tsx`

```tsx
"use client";

import { useState } from "react";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  };

  return (
    <div>
      <input onChange={(e) => setEmail(e.target.value)} />
      <input type="password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSignup}>Sign Up</button>
    </div>
  );
}
```

---

### 🔐 Sign In Page

📄 `app/(auth)/sign-in/page.tsx`

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignin = async () => {
    const res = await fetch("/api/auth/signin", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) router.push("/dashboard");
  };

  return (
    <div>
      <input onChange={(e) => setEmail(e.target.value)} />
      <input type="password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSignin}>Login</button>
    </div>
  );
}
```

---

### 📊 Protected Dashboard

📄 `app/dashboard/page.tsx`

```tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const cookieStore = await cookies();
  const auth = cookieStore.get("auth");

  if (!auth) redirect("/sign-in");

  return <h1>Dashboard 🎉</h1>;
}
```

---

### 🚪 Logout Button

📄 `app/dashboard/LogoutButton.tsx`

```tsx
"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/sign-in");
  };

  return <button onClick={logout}>Logout</button>;
}
```

---

## 🏠 Make Dashboard Default Page

📄 `app/page.tsx`

```tsx
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard");
}
```

---

## 🔗 Routing Notes

* Next.js uses **file-based routing**
* React Router is NOT required
* Use `next/link` for navigation

---

## 🏆 Future Improvements

* JWT authentication
* Refresh tokens
* Middleware route protection
* Role-based access control
* NextAuth.js integration
* User profile system
* Full SaaS dashboard UI

---