
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Coins } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  reward: number;
  progress: number;
  max: number;
  completed: boolean;
}

interface AchievementsTabProps {
  achievements: Achievement[];
}

export const AchievementsTab = ({ achievements }: AchievementsTabProps) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {achievements.map((achievement) => (
        <Card key={achievement.id} className={`border ${achievement.completed ? 'border-primary/50 bg-primary/5' : 'border-border'}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>{achievement.title}</span>
              <span className="text-sm font-normal flex items-center">
                <Coins className="h-4 w-4 text-amber-400 mr-1" />
                {achievement.reward}
              </span>
            </CardTitle>
            <CardDescription>{achievement.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-1 text-sm">
              <span>{achievement.progress} / {achievement.max}</span>
              <span className={achievement.completed ? "text-primary" : "text-muted-foreground"}>
                {achievement.completed ? "Completed!" : "In Progress"}
              </span>
            </div>
            <Progress 
              value={(achievement.progress / achievement.max) * 100} 
              className={`h-2 ${achievement.completed ? "bg-primary/20" : "bg-secondary"}`}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
