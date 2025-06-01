
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Diamond, Check, Star } from "lucide-react";

const PremiumPage = () => {
  const features = [
    "Unlimited memory storage",
    "HD video uploads",
    "Advanced privacy controls",
    "Custom themes and layouts",
    "Priority customer support",
    "Export your memories",
    "Collaboration features",
    "Ad-free experience",
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Diamond className="h-12 w-12 text-primary mr-3" />
            <h1 className="text-4xl font-bold">MEMORIA Premium</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Unlock the full potential of your memories with premium features designed to enhance your storytelling experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Free Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Free</CardTitle>
              <div className="text-3xl font-bold">$0<span className="text-lg text-muted-foreground">/month</span></div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Basic memory sharing
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Limited storage (1GB)
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Standard photo quality
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Basic privacy settings
                </li>
              </ul>
              <Button variant="outline" className="w-full">
                Current Plan
              </Button>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="border-primary relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-sm">
              <Star className="h-3 w-3 inline mr-1" />
              Popular
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">Premium</CardTitle>
              <div className="text-3xl font-bold">$9.99<span className="text-lg text-muted-foreground">/month</span></div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="w-full">
                <Diamond className="h-4 w-4 mr-2" />
                Upgrade to Premium
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Can I cancel my subscription anytime?</h4>
              <p className="text-muted-foreground">Yes, you can cancel your premium subscription at any time. You'll continue to have access to premium features until the end of your billing period.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">What happens to my memories if I downgrade?</h4>
              <p className="text-muted-foreground">Your memories will remain safe, but you may lose access to premium features like HD uploads and advanced privacy controls.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Is there a free trial?</h4>
              <p className="text-muted-foreground">Yes! New users get a 7-day free trial of MEMORIA Premium to experience all the premium features.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PremiumPage;
