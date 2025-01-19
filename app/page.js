"use client"
import { api } from "@/convex/_generated/api";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const { user, isSignedIn } = useUser();
  const createUser = useMutation(api.user.createUser);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      checkUser();
    }
  }, [user]);

  const checkUser = async () => {
    const result = await createUser({
      email: user?.primaryEmailAddress?.emailAddress,
      imageUrl: user?.imageUrl,
      userName: user?.fullName,
    });

    console.log(result);
  };

  const handleGetStarted = () => {
    if (isSignedIn) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 text-white">
      {/* Header */}
      <header className="w-full py-6 px-10 flex justify-between items-center">
        <h1 className="text-3xl font-extrabold tracking-wide">Simplify Notes</h1>
        <div>
          {isSignedIn ? <UserButton /> : <SignInButton afterSignInUrl="/dashboard" mode="modal" />}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-6">
        <Image
          src="/note-taking-illustration.svg"
          alt="Note Taking"
          width={350}
          height={350}
          className="animate-fade-in-up"
        />
        <h2 className="text-5xl font-bold mt-6 animate-fade-in-up">
          Take Notes, Organize, and Simplify Your Life
        </h2>
        <p className="mt-4 text-lg animate-fade-in-up max-w-2xl">
          Simplify Notes helps you keep track of your thoughts, ideas, and tasks.
          Sign up today to experience a smarter way of note-taking.
        </p>
        {isSignedIn ? (
          <button
            onClick={handleGetStarted}
            className="mt-8 mb-10 px-6 py-3 text-lg font-semibold bg-white text-indigo-600 rounded-full shadow-md hover:bg-gray-100 transition-transform transform hover:scale-105"
          >
            Start Working
          </button>
        ) : (
          <SignInButton mode="modal" afterSignInUrl="/dashboard">
            <button className="mt-8 mb-10 px-6 py-3 text-lg font-semibold bg-white text-indigo-600 rounded-full shadow-md hover:bg-gray-100 transition-transform transform hover:scale-105">
              Get Started
            </button>
          </SignInButton>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-6 bg-gray-800 text-gray-400 flex justify-center items-center">
        <p className="text-sm">
          © {new Date().getFullYear()} Simplify Notes. All Rights Reserved.
        </p>
      </footer>

      <style jsx>{`
        .animate-fade-in-up {
          animation: fadeInUp 1.5s ease-in-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}