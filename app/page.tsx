import { homeConfig } from "@/config/home.config";

export default function Home() {
  const { hero, features, stats } = homeConfig;

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/50 to-background">
      <div className="container mx-auto px-4 py-20">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 drop-shadow-sm">
            {hero.title}
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            {hero.description}
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href={hero.buttons.primary.href}
              className="bg-primary/90 text-primary-foreground hover:bg-primary px-8 py-3 rounded-lg font-semibold transition-all hover:shadow-lg"
            >
              {hero.buttons.primary.text}
            </a>
            <a
              href={hero.buttons.secondary.href}
              className="bg-secondary/80 text-secondary-foreground hover:bg-secondary px-8 py-3 rounded-lg font-semibold transition-all hover:shadow-lg"
            >
              {hero.buttons.secondary.text}
            </a>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className="backdrop-blur-sm bg-card/50 text-card-foreground p-6 rounded-xl 
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
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center backdrop-blur-sm bg-card/30 p-6 rounded-lg"
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
