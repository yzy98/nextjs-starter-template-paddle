import { SignIn } from "@/components/auth/sign-in";
import { SignUp } from "@/components/auth/sign-up";
import { Tabs } from "@/components/ui/tabs2";

export default function Page() {
  return (
    <div className="w-full">
      <div className="flex items-center justify-center w-full md:py-10">
        <div className="w-[400px]">
          <Tabs
            tabs={[
              {
                title: "Sign In",
                value: "sign-in",
                content: <SignIn />,
              },
              {
                title: "Sign Up",
                value: "sign-up",
                content: <SignUp />,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
