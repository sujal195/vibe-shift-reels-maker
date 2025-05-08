
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PremiumFeature } from "@/utils/premiumUtils";

interface PremiumFeatureCardProps {
  feature: PremiumFeature;
}

const PremiumFeatureCard = ({ feature }: PremiumFeatureCardProps) => {
  return (
    <Card className="border-border hover:border-primary transition-colors">
      <CardHeader>
        <div className="text-3xl mb-2">{feature.icon}</div>
        <CardTitle>{feature.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{feature.description}</CardDescription>
      </CardContent>
    </Card>
  );
};

export default PremiumFeatureCard;
