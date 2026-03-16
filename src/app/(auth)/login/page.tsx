"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRegisterOverlay, setShowRegisterOverlay] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setIsSubmitting(false);

    if (!result || result.error) {
      setError("Invalid email or password. Please try again.");
      return;
    }

    router.push(result.url ?? callbackUrl);
    router.refresh();
  };

  return (
    <>
      <main className="grid min-h-screen overflow-hidden lg:grid-cols-12">
        <section className="relative z-10 flex flex-col justify-center bg-surface px-8 py-12 lg:col-span-5 lg:px-16">
          <div className="mx-auto w-full max-w-md">
            <header className="mb-12">
              <Link
                href="/"
                className="mb-6 inline-flex items-center text-sm font-medium text-on-surface-variant transition-colors hover:text-primary"
              >
                ← Back to Home
              </Link>
              <div className="mb-8 flex items-center gap-2">
                <span className="material-symbols-outlined text-3xl text-primary"><img src="/spa.svg" alt="Spa Icon" /></span>
                <span className="font-headline text-2xl tracking-tight text-primary">ZenMassage</span>
              </div>
              <div>
                <h1 className="mb-4 font-headline text-4xl leading-tight text-on-surface lg:text-5xl">
                  Welcome back to tranquility
                </h1>
                <p className="leading-relaxed text-on-surface-variant">
                  Please enter your details to access your sanctuary.
                </p>
              </div>
            </header>

            <div className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="group">
                  <label className="mb-2 ml-1 block text-sm text-on-surface-variant">Email address</label>
                  <div className="flex items-center gap-3 rounded-xl border border-outline/15 bg-surface-container-low px-4 py-3 transition-all focus-within:border-outline/40">
                    <span className="material-symbols-outlined text-outline"><img src="/mail.svg" alt="Mail Icon" /></span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="name@example.com"
                      className="w-full border-none bg-transparent text-on-surface placeholder:text-outline-variant focus:ring-0"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="mb-2 ml-1 block text-sm text-on-surface-variant">Password</label>
                  <div className="flex items-center gap-3 rounded-xl border border-outline/15 bg-surface-container-low px-4 py-3 transition-all focus-within:border-outline/40">
                    <span className="material-symbols-outlined text-outline"><img src="/lock.svg" alt="Lock Icon" /></span>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="••••••••"
                      className="w-full border-none bg-transparent text-on-surface placeholder:text-outline-variant focus:ring-0"
                    />
                  </div>
                </div>

                {error ? (
                  <p className="rounded-lg bg-error-container px-4 py-2 text-sm text-on-error-container">{error}</p>
                ) : null}

                <div className="flex items-center justify-between text-sm">
                  {/* <label className="group flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-outline-variant bg-surface-container text-primary focus:ring-primary-fixed"
                    />
                    <span className="text-on-surface-variant transition-colors group-hover:text-primary">
                      Keep me signed in
                    </span>
                  </label> */}
                  {/* <a
                    href="#"
                    className="font-medium text-primary underline-offset-4 transition-colors hover:underline"
                    style={{ textDecorationColor: "var(--secondary-fixed-dim)", textDecorationThickness: "4px" }}
                  >
                    Forgot password?
                  </a> */}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-primary py-4 text-lg font-semibold text-on-primary transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="relative z-10">{isSubmitting ? "Signing In..." : "Sign In"}</span>
                  <span className="material-symbols-outlined relative z-10 text-xl transition-transform group-hover:translate-x-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-arrow-right-icon lucide-arrow-right stroke-white"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </span>
                  <div className="absolute inset-0 bg-white opacity-0 transition-opacity group-hover:opacity-10" />
                </button>
              </form>

              {/* <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-surface-container-highest" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-surface px-4 italic text-outline">or continue with</span>
                </div>
              </div> */}

              {/* <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className="flex items-center justify-center gap-3 rounded-xl border border-outline/15 bg-surface-container-lowest py-3 transition-colors hover:bg-surface-container"
                >
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDG9GHYXZiekAZ-59TDf8gtuWwXfUgqdZ5YrgMeiCi2jVVNQTUp-gX3u-RM912-JCd_dRxsn0iAepYsfrrueASlpawsYrPd7KcSE0onri1w-VjNAyYQdAImwOhFXbh0E6zGDjxMJhNlQ9_m58iqtRXvCqtKxPpXI5bchfEpQaI8IIH5OrlsaDQpCqh6Ljrrh1zulwi4ihtY2egYU-eIFUBBe4NuDj7RWgBE8OWTIBUZ4DbOI0o20VZ7c6a7xBaVuo0lqygqEttorbcC"
                    alt="Google"
                    width={20}
                    height={20}
                    className="h-5 w-5"
                  />
                  <span className="text-sm font-medium">Google</span>
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-3 rounded-xl border border-outline/15 bg-surface-container-lowest py-3 transition-colors hover:bg-surface-container"
                >
                  <span className="material-symbols-outlined text-xl">ios</span>
                  <span className="text-sm font-medium">Apple</span>
                </button>
              </div> */}

              <p className="mt-8 text-center text-on-surface-variant">
                New to ZenMassage?{" "}
                <button
                  type="button"
                //   onClick={() => setShowRegisterOverlay(true)}
                  className="font-bold text-primary underline-offset-4 hover:underline"
                  style={{ textDecorationColor: "var(--secondary-fixed-dim)", textDecorationThickness: "4px" }}
                >
                    <Link href="/register">
                  Create an account
                    </Link>
                </button>
              </p>
            </div>

            {/* <footer className="mt-20 border-t border-surface-container pt-8">
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-outline">
                <a href="#" className="transition-colors hover:text-primary">Privacy Policy</a>
                <a href="#" className="transition-colors hover:text-primary">Terms of Service</a>
                <a href="#" className="transition-colors hover:text-primary">Contact Us</a>
              </div>
              <p className="mt-4 text-[10px] uppercase tracking-widest text-outline-variant">
                © 2026 ZenMassage by Pikiwedia
              </p>
            </footer> */}
          </div>
        </section>

        <section className="relative hidden bg-surface-container lg:col-span-7 lg:block">
          <div className="absolute inset-0 z-0">
            <img
              src="https://img.rachatat.com/insecure/plain/https://fe-storage.rachatat.com/auth-image-4.png"
              alt="Luxury Spa Interior"
              // fill
              sizes="58vw"
              className="h-full w-full object-cover brightness-[0.85] grayscale-20"
            />
          </div>
          <div className="absolute inset-0 z-10 bg-linear-to-t from-primary/60 via-transparent to-transparent" />

          {/* <div className="absolute bottom-16 left-16 right-16 z-20">
            <div className="glass-nav max-w-2xl rounded-3xl border border-white/10 p-10">
              <div className="mb-6 flex gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span
                    key={index}
                    className="material-symbols-outlined text-secondary-fixed-dim"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                ))}
              </div>
              <h2 className="mb-4 font-headline text-3xl leading-snug text-on-primary-container italic">
                &quot;The most intuitive booking experience I&apos;ve used. It feels as calming as the massage itself.&quot;
              </h2>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-primary-fixed">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEZJGdsVh3YbPyuoIW2NIqbGb5v2ZoBkx1nd2eZaf7aXEA4EguNgfAWsrmJSDPOH-y_L6zEUDhZcUT_durO6hf4If3LeCfZP2eJdvqS9RO-LmYf1WXdUfn4AAK0Xn9LDVPVaJfQ5KuHozPF7hM7-z-vgJJSke8_dfRqVYKASw8VHjs2jUYZHsGnZ2r4gdNtNNprdEoYDxD4dp2cY0KG6yrBz6HKyUF7T5ptaK_sZOdMoz7_4FVpJgDYyufDa7UhYxN8uPRzOMQGbF1"
                    alt="Customer Portrait"
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-on-primary-container">Elena Rostova</p>
                  <p className="text-sm text-primary-fixed">ZenSpa Member since 2022</p>
                </div>
              </div>
            </div>
          </div> */}

          {/* <div className="absolute right-16 top-16 z-20">
            <div className="flex flex-col items-end gap-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/30 backdrop-blur-md">
                <div className="flex h-20 w-20 animate-pulse items-center justify-center rounded-full bg-primary/20">
                  <span className="material-symbols-outlined text-3xl text-white">play_arrow</span>
                </div>
              </div>
              <p className="text-right text-xs uppercase tracking-widest text-white">
                Discover the
                <br />
                ZenSpa Ritual
              </p>
            </div>
          </div> */}
        </section>
      </main>

      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-on-background/40 p-4 backdrop-blur-sm transition-opacity ${
          showRegisterOverlay ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="grid w-full max-w-2xl overflow-hidden rounded-3xl bg-surface shadow-2xl md:grid-cols-2">
          <div className="hidden flex-col justify-between bg-linear-to-br from-primary to-primary-container p-12 text-on-primary md:flex">
            <div>
              <span className="material-symbols-outlined mb-6 text-4xl">loyalty</span>
              <h3 className="mb-4 font-headline text-3xl">Start your journey today</h3>
              <ul className="space-y-4 opacity-90">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined mt-1 text-sm">check_circle</span>
                  <span>Exclusive member pricing</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined mt-1 text-sm">check_circle</span>
                  <span>One-tap rebooking</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined mt-1 text-sm">check_circle</span>
                  <span>Wellness tracking</span>
                </li>
              </ul>
            </div>
            <div className="rounded-xl border border-white/10 bg-primary-container/30 p-4 backdrop-blur-md">
              <p className="text-xs italic opacity-80">&quot;Quiet the mind, and the soul will speak.&quot;</p>
            </div>
          </div>

          <div className="relative p-8 lg:p-12">
            <button
              type="button"
              onClick={() => setShowRegisterOverlay(false)}
              className="absolute right-6 top-6 text-outline transition-colors hover:text-on-surface"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <h2 className="mb-2 font-headline text-3xl">Create Account</h2>
            <p className="mb-8 text-sm text-on-surface-variant">Join our community of wellness seekers.</p>

            <div className="space-y-4">
              <div>
                <label className="mb-1 ml-1 block text-xs text-outline">Full Name</label>
                <div className="rounded-xl border border-outline/15 bg-surface-container-low px-4 py-2.5 transition-all focus-within:border-outline/40">
                  <input
                    type="text"
                    placeholder="Jane Doe"
                    className="w-full border-none bg-transparent text-sm text-on-surface placeholder:text-outline-variant focus:ring-0"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 ml-1 block text-xs text-outline">Email</label>
                <div className="rounded-xl border border-outline/15 bg-surface-container-low px-4 py-2.5 transition-all focus-within:border-outline/40">
                  <input
                    type="email"
                    placeholder="jane@example.com"
                    className="w-full border-none bg-transparent text-sm text-on-surface placeholder:text-outline-variant focus:ring-0"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 ml-1 block text-xs text-outline">Phone Number</label>
                <div className="rounded-xl border border-outline/15 bg-surface-container-low px-4 py-2.5 transition-all focus-within:border-outline/40">
                  <input
                    type="tel"
                    placeholder="xxx-xxx-xxxx"
                    className="w-full border-none bg-transparent text-sm text-on-surface placeholder:text-outline-variant focus:ring-0"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 ml-1 block text-xs text-outline">Password</label>
                <div className="rounded-xl border border-outline/15 bg-surface-container-low px-4 py-2.5 transition-all focus-within:border-outline/40">
                  <input
                    type="password"
                    placeholder="Min. 8 characters"
                    className="w-full border-none bg-transparent text-sm text-on-surface placeholder:text-outline-variant focus:ring-0"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  className="w-full rounded-full bg-primary py-3.5 font-semibold text-on-primary transition-all hover:opacity-90"
                >
                  Register Now
                </button>
              </div>

              <p className="mt-4 text-center text-xs text-on-surface-variant">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setShowRegisterOverlay(false)}
                  className="font-bold text-primary hover:underline"
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-surface" />}>
      <LoginPageContent />
    </Suspense>
  );
}
