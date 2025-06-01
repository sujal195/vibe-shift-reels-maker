
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Film, Play } from "lucide-react";

const ReelsPage = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Reels</h1>
          <p className="text-muted-foreground">Discover short memory videos from your friends</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Film className="h-5 w-5 mr-2" />
              Coming Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Play className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                Reels feature is coming soon! Share your memories in short, engaging videos.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ReelsPage;
