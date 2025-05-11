
import Layout from "@/components/layout/Layout";
import { useAuthSession } from "@/hooks/useAuthSession";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { ShoppingBag, Search, Filter, Star, Tag, Clock, Shield, Heart, Download } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Sample marketplace items
const templates = [
  {
    id: 1,
    title: "Modern Memory Book",
    image: "https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14",
    price: 4.99,
    rating: 4.8,
    reviews: 124,
    creator: "DesignStudio",
    featured: true,
    category: "templates"
  },
  {
    id: 2,
    title: "Vintage Photo Filters",
    image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e",
    price: 2.99,
    rating: 4.5,
    reviews: 86,
    creator: "RetroLabs",
    featured: false,
    category: "filters"
  },
  {
    id: 3,
    title: "Wedding Memory Package",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc",
    price: 9.99,
    rating: 4.9,
    reviews: 215,
    creator: "ElegantDesigns",
    featured: true,
    category: "templates"
  },
  {
    id: 4,
    title: "Travel Journal Template",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800",
    price: 3.99,
    rating: 4.7,
    reviews: 103,
    creator: "WanderlustCreative",
    featured: false,
    category: "templates"
  },
  {
    id: 5,
    title: "Family Photo Frames",
    image: "https://images.unsplash.com/photo-1581001027797-47e0e6fab517",
    price: 1.99,
    rating: 4.3,
    reviews: 78,
    creator: "FamilyMemories",
    featured: false,
    category: "frames"
  },
  {
    id: 6,
    title: "Summer Vibes Filter Pack",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    price: 2.49,
    rating: 4.6,
    reviews: 92,
    creator: "SummerStudios",
    featured: false,
    category: "filters"
  }
];

const services = [
  {
    id: 101,
    title: "Photo Restoration",
    image: "https://images.unsplash.com/photo-1581579280759-ebd0cc7a3fe8",
    price: 19.99,
    rating: 4.9,
    reviews: 156,
    creator: "RestorationPro",
    description: "Restore old and damaged photos to their former glory"
  },
  {
    id: 102,
    title: "Memory Book Creation",
    image: "https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14",
    price: 49.99,
    rating: 4.8,
    reviews: 87,
    creator: "BookArtists",
    description: "Custom designed memory books for any occasion"
  },
  {
    id: 103,
    title: "Video Memory Montage",
    image: "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb",
    price: 29.99,
    rating: 4.7,
    reviews: 103,
    creator: "VideoMasters",
    description: "Professional video montages from your photos and clips"
  },
  {
    id: 104,
    title: "AI Memory Enhancement",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485",
    price: 14.99,
    rating: 4.5,
    reviews: 64,
    creator: "AIMemories",
    description: "Enhance photo quality using advanced AI technology"
  }
];

const MarketplacePage = () => {
  const { user } = useAuthSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('templates');
  const [favorites, setFavorites] = useState<number[]>([]);
  
  if (!user) {
    return <div>Loading...</div>;
  }
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      description: `Searching for "${searchQuery}"`,
    });
  };

  const handleBuy = (id: number, title: string) => {
    toast({
      title: "Purchase successful",
      description: `You've purchased "${title}"`,
    });
  };

  const handleDownload = (id: number, title: string) => {
    toast({
      title: "Download started",
      description: `Downloading "${title}"`,
    });
  };

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id) 
        : [...prev, id]
    );
    
    toast({
      description: favorites.includes(id) 
        ? "Removed from favorites" 
        : "Added to favorites",
    });
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <ShoppingBag className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Memory Marketplace</h1>
        </div>
        
        <div className="mb-8">
          <div className="bg-secondary/30 p-8 rounded-lg">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold mb-2">Enhance Your Memory Experience</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Discover templates, filters, and professional services to make your memories even more special.
              </p>
            </div>
            
            <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl mx-auto mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search templates, filters, or services..." 
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button type="submit">Search</Button>
            </form>
            
            <div className="flex flex-wrap justify-center gap-2">
              {["All", "Templates", "Filters", "Frames", "Services", "Free", "Premium"].map((category) => (
                <Button 
                  key={category} 
                  variant={category === "All" ? "default" : "outline"}
                  size="sm"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="templates" className="flex items-center gap-2">
              Templates & Filters
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2">
              Professional Services
            </TabsTrigger>
            <TabsTrigger value="purchased" className="flex items-center gap-2">
              My Purchases
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="templates">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((item) => (
                <Card key={item.id} className="overflow-hidden group">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      {item.featured && (
                        <Badge variant="default" className="bg-primary">Featured</Badge>
                      )}
                      <Badge variant="secondary">{item.category}</Badge>
                    </div>
                    <Button 
                      size="icon" 
                      variant="secondary"
                      className="absolute top-2 left-2 h-8 w-8"
                      onClick={() => toggleFavorite(item.id)}
                    >
                      <Heart 
                        className={`h-4 w-4 ${favorites.includes(item.id) ? 'fill-red-500 text-red-500' : ''}`} 
                      />
                    </Button>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">by {item.creator}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-amber-500" />
                        <span className="ml-1 text-sm font-medium">{item.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">({item.reviews} reviews)</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between p-4 pt-0">
                    <div className="font-medium text-lg">${item.price}</div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => handleDownload(item.id, item.title)}>
                        <Download className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button onClick={() => handleBuy(item.id, item.title)}>Buy</Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="services">
            <div className="space-y-6">
              {services.map((service) => (
                <Card key={service.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 aspect-video md:aspect-auto">
                      <img 
                        src={service.image} 
                        alt={service.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="mb-auto">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-xl mb-2">{service.title}</h3>
                          <Button 
                            size="icon" 
                            variant="ghost"
                            onClick={() => toggleFavorite(service.id)}
                          >
                            <Heart 
                              className={`h-4 w-4 ${favorites.includes(service.id) ? 'fill-red-500 text-red-500' : ''}`} 
                            />
                          </Button>
                        </div>
                        <p className="text-muted-foreground mb-4">{service.description}</p>
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-amber-500" />
                            <span className="font-medium">{service.rating}</span>
                            <span className="text-sm text-muted-foreground">({service.reviews})</span>
                          </div>
                          <div className="text-sm text-muted-foreground">by {service.creator}</div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {["Professional", "Quick Turnaround", "High Quality"].map((tag) => (
                            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                        <div className="font-medium text-xl">${service.price}</div>
                        <Button onClick={() => handleBuy(service.id, service.title)}>Book Service</Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="purchased">
            <div className="text-center py-12 bg-card border border-border rounded-lg">
              <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No purchases yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Your purchased templates, filters, and services will appear here.
              </p>
              <Button onClick={() => setActiveTab('templates')}>
                Browse Marketplace
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border border-border p-6 rounded-lg">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Secure Marketplace</h3>
                <p className="text-muted-foreground text-sm">
                  All creators are carefully vetted and products are reviewed for quality.
                  Your purchases are protected by our satisfaction guarantee.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-card border border-border p-6 rounded-lg">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Limited Time Offer</h3>
                <p className="text-muted-foreground text-sm">
                  Get 25% off your first purchase when you sign up for MEMORIA Premium.
                  Use code WELCOME25 at checkout.
                </p>
                <Button variant="link" className="p-0 h-auto mt-2" onClick={() => {
                  toast({
                    title: "Promo code copied",
                    description: "Use WELCOME25 at checkout",
                  });
                }}>
                  Copy Code
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MarketplacePage;
