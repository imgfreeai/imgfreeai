import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Home, Wand2, LogOut, Trash2, Download, Search, Filter, Images as ImagesIcon } from "lucide-react";
import type { User } from "@supabase/supabase-js";

interface GeneratedImage {
  id: string;
  prompt: string;
  image_url: string;
  aspect_ratio: string;
  quality: string;
  created_at: string;
}

const Gallery = () => {
  const [user, setUser] = useState<User | null>(null);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRatio, setFilterRatio] = useState("all");
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
      fetchImages();
    }
  }, [user]);

  useEffect(() => {
    filterImages();
  }, [searchTerm, filterRatio, images]);

  const fetchImages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('generated_images')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load images",
      });
    } else {
      setImages(data || []);
    }
    setLoading(false);
  };

  const filterImages = () => {
    let filtered = images;

    if (searchTerm) {
      filtered = filtered.filter(img => 
        img.prompt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterRatio !== "all") {
      filtered = filtered.filter(img => img.aspect_ratio === filterRatio);
    }

    setFilteredImages(filtered);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('generated_images')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete image",
      });
    } else {
      toast({
        title: "Success",
        description: "Image deleted successfully",
      });
      fetchImages();
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
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
              <Button variant="ghost" size="sm" onClick={() => navigate("/generator")}>
                <Wand2 className="w-4 h-4 mr-2" />
                Generator
              </Button>
            </nav>
          </div>

          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">Sign Out</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="mb-8 space-y-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Your Gallery
            </h2>
            <p className="text-muted-foreground text-lg">
              All your AI-generated masterpieces in one place
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search prompts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterRatio} onValueChange={setFilterRatio}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratios</SelectItem>
                <SelectItem value="square">Square</SelectItem>
                <SelectItem value="landscape">Landscape</SelectItem>
                <SelectItem value="portrait">Portrait</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center animate-pulse">
              <ImagesIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-lg">Loading your gallery...</p>
          </div>
        ) : filteredImages.length === 0 ? (
          <Card className="p-12 md:p-16 text-center border-border/50 shadow-[var(--shadow-card)] bg-gradient-to-br from-card to-card/50">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <Wand2 className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-3">
              {searchTerm || filterRatio !== "all" ? "No images found" : "No images yet"}
            </h3>
            <p className="text-muted-foreground mb-8 text-lg max-w-md mx-auto">
              {searchTerm || filterRatio !== "all" 
                ? "Try adjusting your search or filters"
                : "Start creating amazing images with AI"}
            </p>
            <Button 
              onClick={() => navigate("/generator")}
              className="shadow-[var(--shadow-glow)]"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Create Your First Image
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image) => (
              <Card 
                key={image.id} 
                className="group overflow-hidden border-border/50 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-glow)] transition-all duration-500 bg-gradient-to-br from-card to-card/50"
              >
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={image.image_url}
                    alt={image.prompt}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-4 space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {image.prompt}
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 text-primary font-medium">
                      {image.aspect_ratio}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-secondary/10 to-secondary/5 border border-secondary/20 text-secondary font-medium">
                      {image.quality}
                    </span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = image.image_url;
                        link.download = `ai-image-${image.id}.png`;
                        link.click();
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(image.id)}
                      className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border/50 shadow-[var(--shadow-elevation)] z-10">
        <div className="flex items-center justify-around p-2">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="flex-col h-auto py-2">
            <Home className="w-5 h-5" />
            <span className="text-xs mt-1">Home</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate("/generator")} className="flex-col h-auto py-2">
            <Wand2 className="w-5 h-5" />
            <span className="text-xs mt-1">Create</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate("/gallery")} className="flex-col h-auto py-2">
            <ImagesIcon className="w-5 h-5 text-primary" />
            <span className="text-xs mt-1 text-primary">Gallery</span>
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default Gallery;