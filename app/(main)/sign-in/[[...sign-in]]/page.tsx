import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <SignIn
          appearance={{
            elements: {
              rootBox: "mx-auto w-full",
              card: "shadow-lg rounded-xl border border-gray-100",
              headerTitle: "text-2xl font-semibold",
              headerSubtitle: "text-gray-600",
              socialButtonsBlockButton:
                "border border-gray-200 hover:bg-gray-50",
              formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
              footerActionLink: "text-blue-600 hover:text-blue-700",
            },
          }}
        />
      </div>
    </div>
  );
}
