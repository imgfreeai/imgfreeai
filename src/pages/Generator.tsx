import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Wand2, LogOut, Image as ImageIcon, Sparkles, Home, Images, Download, RefreshCw, Settings } from "lucide-react";
import type { User } from "@supabase/supabase-js";

const Generator = () => {
  const [user, setUser] = useState<User | null>(null);
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("square");
  const [quality, setQuality] = useState("high");
  const [style, setStyle] = useState("realistic");
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [credits, setCredits] = useState(30);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (!session?.user) {
          navigate("/auth");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchCredits();
    }
  }, [user]);

  const fetchCredits = async () => {
    const { data, error } = await supabase
      .from('user_credits')
      .select('credits_remaining')
      .eq('user_id', user?.id)
      .single();

    if (!error && data) {
      setCredits(data.credits_remaining);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const enhancePrompt = () => {
    const styleModifiers: Record<string, string> = {
      realistic: "ultra realistic, photorealistic, highly detailed, 8k",
      artistic: "artistic, creative, expressive, stylized",
      anime: "anime style, manga, vibrant colors, clean lines",
      abstract: "abstract, surreal, creative interpretation",
      cinematic: "cinematic lighting, dramatic, movie-like quality"
    };

    return `${prompt}, ${styleModifiers[style]}`;
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a prompt",
      });
      return;
    }

    setLoading(true);
    setGeneratedImage(null);

    try {
      const enhancedPrompt = enhancePrompt();
      
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { prompt: enhancedPrompt, aspectRatio, quality }
      });

      if (error) throw error;

      if (data.error) {
        toast({
          variant: "destructive",
          title: "Generation failed",
          description: data.error,
        });
      } else {
        setGeneratedImage(data.imageUrl);
        setCredits(data.creditsRemaining);
        toast({
          title: "Success!",
          description: "Your image has been generated",
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate image. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-md sticky top-0 z-10 shadow-[var(--shadow-elevation)]">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent shadow-[var(--shadow-glow)]">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                AI Generator
              </h1>
            </div>
            
            <nav className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate("/gallery")}>
                <Images className="w-4 h-4 mr-2" />
                Gallery
              </Button>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 shadow-inner">
              <span className="text-sm font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {credits} credits
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 max-w-7xl mx-auto">
          {/* Generation Form */}
          <Card className="p-6 md:p-8 border-border/50 shadow-[var(--shadow-card)] bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Create Your Image
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                <Settings className="w-4 h-4 mr-2" />
                {showAdvanced ? "Simple" : "Advanced"}
              </Button>
            </div>
            
            <form onSubmit={handleGenerate} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="prompt" className="text-base font-semibold">Your Vision</Label>
                <Textarea
                  id="prompt"
                  placeholder="A majestic lion in a sunset savanna, cinematic lighting, 8k quality..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[120px] resize-none bg-muted/30 border-primary/20 focus:border-primary/50 transition-colors"
                  disabled={loading}
                />
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Sparkles className="w-3 h-3" />
                  Be detailed and specific for best results
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="aspect-ratio" className="text-base font-semibold">Aspect Ratio</Label>
                  <Select value={aspectRatio} onValueChange={setAspectRatio} disabled={loading}>
                    <SelectTrigger id="aspect-ratio">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="square">Square (1:1)</SelectItem>
                      <SelectItem value="landscape">Landscape (3:2)</SelectItem>
                      <SelectItem value="portrait">Portrait (2:3)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="style" className="text-base font-semibold">Style</Label>
                  <Select value={style} onValueChange={setStyle} disabled={loading}>
                    <SelectTrigger id="style">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realistic">Realistic</SelectItem>
                      <SelectItem value="artistic">Artistic</SelectItem>
                      <SelectItem value="anime">Anime</SelectItem>
                      <SelectItem value="abstract">Abstract</SelectItem>
                      <SelectItem value="cinematic">Cinematic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {showAdvanced && (
                <div className="space-y-4 p-4 rounded-xl bg-muted/20 border border-border/30">
                  <h3 className="font-semibold text-sm">Advanced Settings</h3>
                  <div className="space-y-2">
                    <Label htmlFor="quality" className="text-sm">Quality</Label>
                    <Select value={quality} onValueChange={setQuality} disabled={loading}>
                      <SelectTrigger id="quality">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High Quality</SelectItem>
                        <SelectItem value="medium">Medium Quality</SelectItem>
                        <SelectItem value="low">Fast Generation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full py-6 text-lg shadow-[var(--shadow-glow)] hover:shadow-[var(--shadow-glow-lg)] transition-all"
                disabled={loading || credits <= 0}
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Generating Magic...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 mr-2" />
                    Generate Image
                  </>
                )}
              </Button>

              {credits <= 0 && (
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive text-center font-medium">
                    ⚠️ Out of credits. They refresh in 24 hours after your last login.
                  </p>
                </div>
              )}
            </form>
          </Card>

          {/* Generated Image Display */}
          <Card className="p-6 md:p-8 border-border/50 shadow-[var(--shadow-card)] bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Result
            </h2>
            
            {generatedImage ? (
              <div className="space-y-4">
                <div className={`relative rounded-2xl overflow-hidden border border-border/50 shadow-[var(--shadow-glow)] group ${
                  aspectRatio === 'landscape' ? 'aspect-[3/2]' : 
                  aspectRatio === 'portrait' ? 'aspect-[2/3]' : 
                  'aspect-square'
                }`}>
                  <img
                    src={generatedImage}
                    alt="Generated image"
                    className="w-full h-full object-contain bg-background/50 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = generatedImage;
                      link.download = 'ai-generated-image.png';
                      link.click();
                    }}
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => setGeneratedImage(null)}
                  >
                    <Wand2 className="w-4 h-4 mr-2" />
                    New Image
                  </Button>
                </div>
              </div>
            ) : (
              <div className="aspect-square rounded-2xl border-2 border-dashed border-border/50 flex items-center justify-center bg-muted/10">
                <div className="text-center space-y-4 p-8">
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <ImageIcon className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg mb-2">
                      {loading ? "✨ Creating your masterpiece..." : "Ready to create"}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {loading ? "This may take a few seconds" : "Enter a prompt and click generate"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border/50 shadow-[var(--shadow-elevation)] z-10">
        <div className="flex items-center justify-around p-2">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="flex-col h-auto py-2">
            <Home className="w-5 h-5" />
            <span className="text-xs mt-1">Home</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate("/generator")} className="flex-col h-auto py-2">
            <Wand2 className="w-5 h-5 text-primary" />
            <span className="text-xs mt-1 text-primary">Create</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate("/gallery")} className="flex-col h-auto py-2">
            <Images className="w-5 h-5" />
            <span className="text-xs mt-1">Gallery</span>
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default Generator;