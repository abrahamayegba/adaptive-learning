"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Eye, EyeOff, BookOpen, Users, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginUser, getCurrentUser, initializeDemoData } from "@/lib/storage";
import { cn } from "@/lib/utils";

const DEMO_ACCOUNTS = [
  { label: "Student", name: "Oluwatobi Adeniran", email: "student@lms.com", password: "demo$$123", icon: <BookOpen className="h-4 w-4" />, desc: "Take courses & quizzes" },
  { label: "Instructor", name: "Husnain Sherazi", email: "instructor@lms.com", password: "demo$$123", icon: <GraduationCap className="h-4 w-4" />, desc: "Manage & teach courses" },
  { label: "Admin", name: "Husnain Sherazi", email: "admin@lms.com", password: "demo$$123", icon: <BarChart3 className="h-4 w-4" />, desc: "Full system access" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initializeDemoData();
    const user = getCurrentUser();
    if (user) router.replace("/dashboard");
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const result = loginUser(email, password);
    setLoading(false);
    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error ?? "Login failed");
    }
  };

  const fillDemo = (acc: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setError("");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sidebar via-sidebar to-sidebar-accent opacity-80" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
              <GraduationCap className="h-6 w-6 text-accent-foreground" />
            </div>
            <span className="text-2xl font-bold text-sidebar-foreground">
              Smart<span className="text-accent">LMS</span>
            </span>
          </div>

          <h1 className="text-4xl font-bold text-sidebar-foreground leading-tight mb-4">
            Adaptive Learning<br />for Every Learner
          </h1>
          <p className="text-sidebar-foreground/70 text-lg leading-relaxed max-w-sm">
            A smart, personalised learning management system that adapts to your pace, style, and performance.
          </p>

          <div className="mt-12 space-y-4">
            {[
              { icon: <BookOpen className="h-5 w-5" />, text: "4 demo courses with full content" },
              { icon: <BarChart3 className="h-5 w-5" />, text: "Adaptive quiz engine with feedback" },
              { icon: <Users className="h-5 w-5" />, text: "Student, Instructor & Admin roles" },
              { icon: <GraduationCap className="h-5 w-5" />, text: "Real-time progress tracking" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sidebar-foreground/80">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-accent text-accent">
                  {item.icon}
                </div>
                <span className="text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-sidebar-foreground/40">
          MSc IT with Web Development · University of the West of Scotland · 2025/26
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">
              Smart<span className="text-primary">LMS</span>
            </span>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
            <p className="text-muted-foreground mt-1 text-sm">Sign in to continue your learning journey</p>
          </div>

          {/* Demo accounts */}
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Quick access – Demo accounts
            </p>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.label}
                  type="button"
                  onClick={() => fillDemo(acc)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-lg border p-3 text-center transition-all hover:border-primary hover:bg-primary/5",
                    email === acc.email ? "border-primary bg-primary/5" : "border-border"
                  )}
                >
                  <div className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-md",
                    email === acc.email ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}>
                    {acc.icon}
                  </div>
                  <span className="text-xs font-medium text-foreground">{acc.label}</span>
                  <span className="text-[10px] font-medium text-primary leading-tight truncate w-full text-center">{acc.name}</span>
                  <span className="text-[10px] text-muted-foreground leading-tight">{acc.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">Demo password: demo$$123</p>
            </div>

            {error && (
              <div className="rounded-md bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
