
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Diamond } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuthSession } from "@/hooks/useAuthSession";
import { useEffect } from "react";

const PremiumPage = () => {
  const { user, isLoading } = useAuthSession();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !user) {
      navigate("/auth");
      return;
    }
  }, [user, isLoading, navigate]);

  const handleUpgrade = () => {
    // This would connect to a payment processor in a real implementation
    toast({
      title: "Coming Soon",
      description: "Payments will be integrated soon with Stripe, PayPal and eSewa.",
    });
  };

  const premiumFeatures = [
    {
      icon: "🔒",
      title: "Memory Vault",
      description: "Upload encrypted photos, videos, and voice notes to create a long-term digital time capsule."
    },
    {
      icon: "📊",
      title: "Emotion Timeline",
      description: "Organize memories automatically based on emotions (happy, sad, excited, etc.)."
    },
    {
      icon: "👪",
      title: "Private Legacy Mode",
      description: "Share memories with selected family and friends after you go inactive."
    },
    {
      icon: "💬",
      title: "Deep Private Messaging",
      description: "Create a messenger system with emotional reactions (Anxiety, Excited, Cry, etc.)."
    },
    {
      icon: "👥",
      title: "Memory Collaboration",
      description: "Allow multiple users to upload media to the same memory."
    },
    {
      icon: "🎬",
      title: "Memory Reels",
      description: "Auto-generate 1-minute reels summarizing important memories."
    },
    {
      icon: "📴",
      title: "Offline Memories",
      description: "Save and view memories offline, without an internet connection."
    },
    {
      icon: "🛍️",
      title: "Marketplace for Memories",
      description: "Access artists/photographers selling memory-related templates and filters."
    },
    {
      icon: "🏠",
      title: "Customizable Memory Spaces",
      description: "Organize memories into rooms like \"School Life\", \"My Pet's Life\", etc."
    },
    {
      icon: "🌍",
      title: "Global Memory Wall",
      description: "Optional public posting feature to share beautiful memories with others."
    }
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center mb-8">
          <Diamond className="h-8 w-8 mr-2 text-primary" />
          <h1 className="text-3xl font-bold">Memoria Premium</h1>
        </div>
        
        <div className="text-center mb-12">
          <p className="text-xl text-muted-foreground mb-6">
            Upgrade your memories with exclusive premium features
          </p>
          <div className="inline-block bg-secondary/30 p-6 rounded-lg">
            <p className="text-muted-foreground mb-2">Regular Price</p>
            <p className="text-2xl line-through text-muted-foreground">$19/month</p>
            <p className="text-muted-foreground mt-4 mb-2">Limited Time Offer</p>
            <p className="text-4xl font-bold text-primary">$9<span className="text-xl">/month</span></p>
          </div>
        </div>
        
        {/* Premium Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {premiumFeatures.map((feature, index) => (
            <Card key={index} className="border-border hover:border-primary transition-colors">
              <CardHeader>
                <div className="text-3xl mb-2">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Comparison Table */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Compare Plans</h2>
          
          <div className="grid grid-cols-3 gap-4">
            <div></div>
            <div className="text-center font-medium">Free</div>
            <div className="text-center font-medium">Premium</div>
            
            {/* Basic Posts */}
            <div className="py-3 border-t">Basic Posts</div>
            <div className="py-3 border-t text-center"><Check className="h-5 w-5 mx-auto text-primary" /></div>
            <div className="py-3 border-t text-center"><Check className="h-5 w-5 mx-auto text-primary" /></div>
            
            {/* Photo & Voice Posts */}
            <div className="py-3 border-t">Photo & Voice Posts</div>
            <div className="py-3 border-t text-center"><Check className="h-5 w-5 mx-auto text-primary" /></div>
            <div className="py-3 border-t text-center"><Check className="h-5 w-5 mx-auto text-primary" /></div>
            
            {/* Profile Customization */}
            <div className="py-3 border-t">Profile Customization</div>
            <div className="py-3 border-t text-center"><Check className="h-5 w-5 mx-auto text-primary" /></div>
            <div className="py-3 border-t text-center"><Check className="h-5 w-5 mx-auto text-primary" /></div>
            
            {/* Premium Features */}
            <div className="py-3 border-t">Premium Features</div>
            <div className="py-3 border-t text-center">
              <Badge variant="outline">Limited</Badge>
            </div>
            <div className="py-3 border-t text-center">
              <Badge className="bg-primary">Unlimited</Badge>
            </div>
            
            {/* Memory Collaboration */}
            <div className="py-3 border-t">Memory Collaboration</div>
            <div className="py-3 border-t text-center">❌</div>
            <div className="py-3 border-t text-center"><Check className="h-5 w-5 mx-auto text-primary" /></div>
            
            {/* Memory Vault */}
            <div className="py-3 border-t">Memory Vault</div>
            <div className="py-3 border-t text-center">❌</div>
            <div className="py-3 border-t text-center"><Check className="h-5 w-5 mx-auto text-primary" /></div>
            
            {/* Memory Reels */}
            <div className="py-3 border-t">Memory Reels</div>
            <div className="py-3 border-t text-center">❌</div>
            <div className="py-3 border-t text-center"><Check className="h-5 w-5 mx-auto text-primary" /></div>
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="text-center">
          <div className="max-w-md mx-auto bg-card p-8 rounded-lg border border-border">
            <h3 className="text-xl font-bold mb-4">Ready to upgrade your memories?</h3>
            <p className="mb-6 text-muted-foreground">Get unlimited access to all premium features for just $9/month.</p>
            <Button size="lg" onClick={handleUpgrade}>
              <Diamond className="h-5 w-5 mr-2" />
              Upgrade to Premium
            </Button>
          </div>
        </div>
        
        {/* Additional Info */}
        <div className="mt-12 text-center text-muted-foreground text-sm">
          <p>All new users get free access to premium features twice a day for 3 days.</p>
          <p className="mt-2">For business inquiries, please <a href="/contact" className="text-primary hover:underline">contact us</a>.</p>
        </div>
      </div>
    </Layout>
  );
};

export default PremiumPage;
