import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sparkles, Wand2, Zap, Shield, History, Palette, Image } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                AI Image Studio
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="lg"
                onClick={() => navigate('/auth')}
                className="text-base"
              >
                Sign In
              </Button>
              <Button 
                variant="hero" 
                size="lg"
                onClick={() => navigate('/auth')}
                className="text-base shadow-[var(--shadow-glow)]"
              >
                <Wand2 className="mr-2 h-5 w-5" />
                Sign Up Free
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center pt-20">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-[var(--gradient-mesh)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/70 to-background" />
        
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-5xl mx-auto text-center space-y-8 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md shadow-[var(--shadow-glow)]">
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
              <span className="text-sm font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Powered by Advanced AI
              </span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Create Stunning
              </span>
              <br />
              <span className="bg-gradient-to-r from-secondary via-primary to-accent bg-clip-text text-transparent">
                AI Images
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Transform your imagination into breathtaking visuals with our cutting-edge AI technology
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button 
                variant="hero" 
                size="lg"
                onClick={() => navigate('/auth')}
                className="text-lg px-10 py-6 shadow-[var(--shadow-glow-lg)] hover:scale-105 transition-transform"
              >
                <Wand2 className="mr-2 h-6 w-6" />
                Start Creating Free
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/auth')}
                className="text-lg px-10 py-6 backdrop-blur-sm"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-[var(--gradient-mesh)] opacity-30" />
        <div className="container mx-auto relative">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create amazing AI images
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="group p-8 rounded-3xl bg-gradient-to-br from-card to-card/50 border border-border/50 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-glow)] transition-all duration-500 hover:-translate-y-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6 shadow-[var(--shadow-glow)] group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Lightning Fast</h3>
              <p className="text-muted-foreground leading-relaxed">
                Generate high-quality images in seconds with our optimized AI models. No waiting, just instant creativity.
              </p>
            </div>

            <div className="group p-8 rounded-3xl bg-gradient-to-br from-card to-card/50 border border-border/50 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-glow)] transition-all duration-500 hover:-translate-y-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center mb-6 shadow-[var(--shadow-glow)] group-hover:scale-110 transition-transform">
                <Palette className="w-8 h-8 text-secondary-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Full Customization</h3>
              <p className="text-muted-foreground leading-relaxed">
                Control every aspect - from aspect ratios to quality settings. Create exactly what you envision.
              </p>
            </div>

            <div className="group p-8 rounded-3xl bg-gradient-to-br from-card to-card/50 border border-border/50 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-glow)] transition-all duration-500 hover:-translate-y-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-secondary flex items-center justify-center mb-6 shadow-[var(--shadow-glow)] group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-accent-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-3">30 Daily Credits</h3>
              <p className="text-muted-foreground leading-relaxed">
                Get 30 free credits every day. Create without limits and bring your ideas to life.
              </p>
            </div>

            <div className="group p-8 rounded-3xl bg-gradient-to-br from-card to-card/50 border border-border/50 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-glow)] transition-all duration-500 hover:-translate-y-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6 shadow-[var(--shadow-glow)] group-hover:scale-110 transition-transform">
                <Image className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-3">High Resolution</h3>
              <p className="text-muted-foreground leading-relaxed">
                Generate stunning images in multiple formats and resolutions perfect for any use case.
              </p>
            </div>

            <div className="group p-8 rounded-3xl bg-gradient-to-br from-card to-card/50 border border-border/50 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-glow)] transition-all duration-500 hover:-translate-y-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center mb-6 shadow-[var(--shadow-glow)] group-hover:scale-110 transition-transform">
                <History className="w-8 h-8 text-accent-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Full History</h3>
              <p className="text-muted-foreground leading-relaxed">
                Access all your generated images anytime. Download, share, or recreate past generations.
              </p>
            </div>

            <div className="group p-8 rounded-3xl bg-gradient-to-br from-card to-card/50 border border-border/50 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-glow)] transition-all duration-500 hover:-translate-y-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center mb-6 shadow-[var(--shadow-glow)] group-hover:scale-110 transition-transform">
                <Sparkles className="w-8 h-8 text-secondary-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Smart AI</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our advanced AI understands context and creates images that match your vision perfectly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-[var(--gradient-mesh)] opacity-40" />
        <div className="container mx-auto max-w-5xl relative">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 border border-primary/30 p-12 md:p-16 text-center shadow-[var(--shadow-glow-lg)]">
            <div className="relative z-10 space-y-6">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Ready to Create Magic?
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Join thousands of creators using AI to transform their imagination into stunning visuals. Sign up now and get 30 free credits instantly!
              </p>
              <div className="pt-4">
                <Button 
                  variant="hero" 
                  size="lg"
                  onClick={() => navigate('/auth')}
                  className="text-xl px-12 py-7 shadow-[var(--shadow-glow-lg)] hover:scale-105 transition-transform"
                >
                  <Wand2 className="mr-2 h-6 w-6" />
                  Get Started for Free
                </Button>
              </div>
            </div>
            
            <div className="absolute inset-0 bg-[var(--gradient-mesh)] opacity-50" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;