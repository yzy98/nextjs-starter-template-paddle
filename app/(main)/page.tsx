export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-b from-secondary/50 to-background">
      <div className="container mx-auto px-4 py-20">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 drop-shadow-xs">
            NextJS Starter Template Paddle
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            A modern, full-stack SaaS starter template with built-in
            authentication, database, UI components, and payment processing.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/pricing"
              className="bg-primary/90 text-primary-foreground hover:bg-primary px-8 py-3 rounded-lg font-semibold transition-all hover:shadow-lg"
            >
              Get Started
            </a>
            <a
              href="/dashboard"
              className="bg-secondary/80 text-secondary-foreground hover:bg-secondary px-8 py-3 rounded-lg font-semibold transition-all hover:shadow-lg"
            >
              My Dashboard
            </a>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {[
            {
              icon: "⚡",
              title: "Next.js 14",
              description:
                "The React framework for production-grade applications.",
            },
            {
              icon: "🎯",
              title: "Tailwind CSS",
              description:
                "Utility-first CSS framework for rapid UI development.",
            },
            {
              icon: "🎨",
              title: "Shadcn UI",
              description:
                "Beautiful, accessible UI components out of the box.",
            },
            {
              icon: "🔐",
              title: "Clerk Authentication",
              description:
                "Secure, feature-rich authentication and user management.",
            },
            {
              icon: "🗄️",
              title: "Neon Database",
              description:
                "Powerful PostgreSQL database with real-time capabilities.",
            },
            {
              icon: "💳",
              title: "Paddle Payments",
              description:
                "Complete payment and subscription management system.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="backdrop-blur-xs bg-card/50 text-card-foreground p-6 rounded-xl 
                        hover:bg-card/80 transition-all hover:shadow-lg hover:scale-[1.02]"
            >
              <div className="text-primary/90 text-3xl mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "10K+", label: "Downloads" },
            { value: "24/7", label: "Support" },
            { value: "v2.0", label: "Version" },
            { value: "4.9/5", label: "Rating" },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center backdrop-blur-xs bg-card/30 p-6 rounded-lg"
            >
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {stat.value}
              </div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
