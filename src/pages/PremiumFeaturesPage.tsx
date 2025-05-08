
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Diamond } from "lucide-react";
import { useAuthSession } from "@/hooks/useAuthSession";
import { fetchPremiumFeatures, PremiumFeature, tryAccessPremiumFeature } from "@/utils/premiumUtils";
import usePremiumAccess from "@/hooks/usePremiumAccess";

const PremiumFeaturesPage = () => {
  const { user, isLoading: authLoading } = useAuthSession();
  const navigate = useNavigate();
  const [features, setFeatures] = useState<PremiumFeature[]>([]);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const { canAccess, isSubscribed, isTrial, usagesLeft } = usePremiumAccess();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }

    // Load premium features
    fetchPremiumFeatures().then(data => {
      setFeatures(data);
      if (data.length > 0) {
        setActiveFeature(data[0].id);
      }
    });
  }, [user, authLoading, navigate]);

  const handleFeatureAccess = async (featureId: string) => {
    if (!user) return;
    
    const feature = features.find(f => f.id === featureId);
    if (!feature) return;
    
    const canUse = await tryAccessPremiumFeature(user.id, feature.name);
    if (canUse) {
      setActiveFeature(featureId);
    } else {
      navigate("/premium");
    }
  };

  const getAccessStatus = () => {
    if (isSubscribed) return "Premium Member";
    if (isTrial) return `Trial Access (${usagesLeft} uses left today)`;
    return "Free Account";
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Premium Features</h1>
          <div className="flex items-center">
            <Diamond className="h-5 w-5 mr-2 text-primary" />
            <span className="text-sm font-medium">{getAccessStatus()}</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar with feature list */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-card rounded-lg border border-border p-4">
              <h2 className="text-xl font-bold mb-4">Features</h2>
              <div className="space-y-2">
                {features.map(feature => (
                  <Button
                    key={feature.id}
                    variant={activeFeature === feature.id ? "secondary" : "ghost"}
                    className="w-full justify-start text-left"
                    onClick={() => handleFeatureAccess(feature.id)}
                  >
                    <span className="mr-2">{feature.icon}</span>
                    {feature.name}
                  </Button>
                ))}
              </div>
              <div className="mt-6">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate("/premium")}
                >
                  <Diamond className="h-4 w-4 mr-2" />
                  Upgrade to Premium
                </Button>
              </div>
            </div>
          </div>

          {/* Main content area showing selected feature */}
          <div className="flex-grow">
            {!activeFeature && features.length > 0 ? (
              <div className="bg-card rounded-lg border border-border p-6 text-center">
                <p className="text-muted-foreground">
                  Select a feature from the sidebar to view details.
                </p>
              </div>
            ) : (
              features.filter(f => f.id === activeFeature).map(feature => (
                <div key={feature.id} className="bg-card rounded-lg border border-border p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-4xl">{feature.icon}</div>
                    <h2 className="text-2xl font-bold">{feature.name}</h2>
                  </div>
                  
                  <p className="text-muted-foreground mb-6">{feature.description}</p>
                  
                  <Tabs defaultValue="about">
                    <TabsList>
                      <TabsTrigger value="about">About</TabsTrigger>
                      <TabsTrigger value="how-to">How to Use</TabsTrigger>
                      <TabsTrigger value="examples">Examples</TabsTrigger>
                    </TabsList>
                    <TabsContent value="about" className="mt-4">
                      <div className="prose dark:prose-invert max-w-none">
                        <p>
                          The {feature.name} feature allows you to enhance your memory experience
                          with advanced capabilities designed to preserve and share your most important moments.
                        </p>
                        <h3>Benefits</h3>
                        <ul>
                          <li>Securely store your most precious memories</li>
                          <li>Easily organize and categorize your content</li>
                          <li>Share with others in meaningful ways</li>
                          <li>Access across all your devices</li>
                        </ul>
                      </div>
                    </TabsContent>
                    <TabsContent value="how-to" className="mt-4">
                      <div className="prose dark:prose-invert max-w-none">
                        <h3>Getting Started</h3>
                        <p>
                          To use the {feature.name} feature:
                        </p>
                        <ol>
                          <li>Navigate to your profile or memory collection</li>
                          <li>Select the {feature.name} option from the menu</li>
                          <li>Follow the guided setup process</li>
                          <li>Start adding content to your {feature.name.toLowerCase()}</li>
                        </ol>
                        <p className="text-sm text-muted-foreground mt-4">
                          Note: This feature is currently in development and will be fully available soon.
                        </p>
                      </div>
                    </TabsContent>
                    <TabsContent value="examples" className="mt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                          <p className="text-muted-foreground">Example coming soon</p>
                        </div>
                        <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                          <p className="text-muted-foreground">Example coming soon</p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  <div className="mt-6">
                    <Button>
                      Try {feature.name} Now
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PremiumFeaturesPage;
