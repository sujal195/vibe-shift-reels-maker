
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Diamond } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuthSession } from "@/hooks/useAuthSession";
import usePremiumAccess from "@/hooks/usePremiumAccess";
import PremiumFeatureCard from "@/components/premium/PremiumFeatureCard";
import { fetchPremiumFeatures, PremiumFeature } from "@/utils/premiumUtils";
import SmartNotificationManager from "@/components/premium/SmartNotificationManager";

const PremiumPage = () => {
  const { user, isLoading: authLoading } = useAuthSession();
  const navigate = useNavigate();
  const [features, setFeatures] = useState<PremiumFeature[]>([]);
  const [isLoadingFeatures, setIsLoadingFeatures] = useState(true);
  const { 
    canAccess, 
    isSubscribed, 
    isTrial, 
    trialEndsAt, 
    usagesLeft 
  } = usePremiumAccess();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }

    // Load premium features
    fetchPremiumFeatures().then(data => {
      setFeatures(data);
      setIsLoadingFeatures(false);
    });
  }, [user, authLoading, navigate]);

  const handleUpgrade = () => {
    // This would connect to a payment processor in a real implementation
    toast({
      title: "Coming Soon",
      description: "Payments will be integrated soon with Stripe, PayPal and eSewa.",
    });
  };

  const renderAccessStatus = () => {
    if (isSubscribed) {
      return (
        <div className="mb-6 text-center">
          <Badge className="bg-primary text-lg py-2 px-4">Premium Member</Badge>
          <p className="mt-3 text-muted-foreground">
            Thank you for being a premium member! Enjoy unlimited access to all features.
          </p>
        </div>
      );
    }

    if (isTrial) {
      const daysLeft = trialEndsAt ? 
        Math.ceil((trialEndsAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;
      
      return (
        <div className="mb-6 text-center">
          <Badge variant="outline" className="text-lg py-2 px-4">Trial Access</Badge>
          <p className="mt-3 text-muted-foreground">
            You have {daysLeft} day{daysLeft !== 1 ? 's' : ''} left in your trial period.
            You can use premium features {usagesLeft} more time{usagesLeft !== 1 ? 's' : ''} today.
          </p>
        </div>
      );
    }

    return (
      <div className="mb-6 text-center">
        <Badge variant="destructive" className="text-lg py-2 px-4">Free Account</Badge>
        <p className="mt-3 text-muted-foreground">
          Upgrade to premium for unlimited access to all features.
        </p>
      </div>
    );
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center mb-8">
          <Diamond className="h-8 w-8 mr-2 text-primary" />
          <h1 className="text-3xl font-bold">Memoria Premium</h1>
        </div>
        
        {renderAccessStatus()}
        
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
          {isLoadingFeatures ? (
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="border-border animate-pulse">
                <CardHeader>
                  <div className="h-8 w-8 bg-muted rounded-full mb-2"></div>
                  <div className="h-6 w-3/4 bg-muted rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 w-full bg-muted rounded mb-2"></div>
                  <div className="h-4 w-5/6 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))
          ) : (
            features.map((feature) => (
              <PremiumFeatureCard key={feature.id} feature={feature} />
            ))
          )}
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
      
      {/* Smart Notification Manager */}
      <SmartNotificationManager />
    </Layout>
  );
};

export default PremiumPage;
