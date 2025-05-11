
import Layout from "@/components/layout/Layout";
import { useAuthSession } from "@/hooks/useAuthSession";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Wifi, WifiOff, Download, Check, ArrowDownToLine, Settings, Database, Clock, CloudOff } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

// Sample memory categories
const categories = [
  { id: 1, name: "Recent Uploads", count: 24, size: 120, selected: true },
  { id: 2, name: "Family Photos", count: 86, size: 320, selected: false },
  { id: 3, name: "Favorites", count: 42, size: 180, selected: true },
  { id: 4, name: "Travel Memories", count: 128, size: 540, selected: false },
  { id: 5, name: "Shared with Me", count: 37, size: 160, selected: false }
];

const OfflineMemoriesPage = () => {
  const { user } = useAuthSession();
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [offlineCategories, setOfflineCategories] = useState(categories);
  const [autoSync, setAutoSync] = useState(true);
  const [wifiOnly, setWifiOnly] = useState(true);
  const [offlineEnabled, setOfflineEnabled] = useState(true);
  
  if (!user) {
    return <div>Loading...</div>;
  }

  const handleCategoryToggle = (id: number) => {
    setOfflineCategories(
      offlineCategories.map(category => 
        category.id === id 
          ? { ...category, selected: !category.selected } 
          : category
      )
    );
  };

  const handleDownload = () => {
    const selectedCategories = offlineCategories.filter(c => c.selected);
    
    if (selectedCategories.length === 0) {
      toast({
        title: "No categories selected",
        description: "Please select at least one category to download.",
        variant: "destructive",
      });
      return;
    }
    
    // Mock download process
    setDownloading(true);
    setDownloadProgress(0);
    
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        const next = prev + Math.random() * 10;
        if (next >= 100) {
          clearInterval(interval);
          setDownloading(false);
          
          toast({
            title: "Download complete",
            description: `${selectedCategories.length} categories are now available offline.`,
          });
          
          return 100;
        }
        return next;
      });
    }, 300);
  };

  const totalSelectedSize = offlineCategories
    .filter(c => c.selected)
    .reduce((sum, category) => sum + category.size, 0);

  const totalSelectedCount = offlineCategories
    .filter(c => c.selected)
    .reduce((sum, category) => sum + category.count, 0);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <WifiOff className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Offline Memories</h1>
        </div>
        
        <div className="bg-secondary/30 p-8 rounded-lg mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <CloudOff className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Access Your Memories Anywhere</h2>
                <p className="text-muted-foreground">
                  Download memories to your device for offline viewing.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="offline-toggle">
                {offlineEnabled ? "Enabled" : "Disabled"}
              </Label>
              <Switch 
                id="offline-toggle" 
                checked={offlineEnabled} 
                onCheckedChange={setOfflineEnabled} 
              />
            </div>
          </div>
          
          {offlineEnabled && (
            <>
              {downloading ? (
                <div className="text-center bg-secondary/70 p-6 rounded-lg">
                  <ArrowDownToLine className="h-10 w-10 text-primary animate-pulse mx-auto mb-4" />
                  <h3 className="font-medium mb-3">Downloading Memories...</h3>
                  <Progress value={downloadProgress} className="h-2 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {Math.round(downloadProgress)}% complete
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="mb-4">
                    Selected: <span className="font-medium">{totalSelectedCount} memories</span> ({(totalSelectedSize / 1024).toFixed(1)} GB)
                  </p>
                  <Button onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    Download for Offline Use
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
        
        {offlineEnabled && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Settings className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Sync Settings</h3>
                      <p className="text-sm text-muted-foreground">
                        Configure how your memories sync with your device
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="auto-sync" className="font-medium">Auto Sync</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically sync changes when online
                        </p>
                      </div>
                      <Switch 
                        id="auto-sync" 
                        checked={autoSync} 
                        onCheckedChange={setAutoSync} 
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="wifi-only" className="font-medium">Wi-Fi Only</Label>
                        <p className="text-sm text-muted-foreground">
                          Only download content when on Wi-Fi
                        </p>
                      </div>
                      <Switch 
                        id="wifi-only" 
                        checked={wifiOnly} 
                        onCheckedChange={setWifiOnly} 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Database className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Storage Usage</h3>
                      <p className="text-sm text-muted-foreground">
                        Manage your offline storage space
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Used Space</span>
                        <span className="font-medium">{(totalSelectedSize / 1024).toFixed(1)} GB / 10 GB</span>
                      </div>
                      <Progress value={(totalSelectedSize / 10240) * 100} className="h-2" />
                    </div>
                    
                    <div className="pt-2">
                      <Button variant="outline" className="w-full" onClick={() => {
                        toast({
                          title: "Storage cleared",
                          description: "All offline memories have been cleared from your device.",
                        });
                        setOfflineCategories(categories.map(c => ({ ...c, selected: false })));
                      }}>
                        Clear Offline Storage
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="bg-card border border-border rounded-lg">
              <div className="p-4 border-b border-border">
                <h3 className="font-medium">Select Categories to Download</h3>
              </div>
              <div>
                {offlineCategories.map(category => (
                  <div key={category.id} className="border-b border-border last:border-b-0">
                    <div 
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-secondary/50"
                      onClick={() => handleCategoryToggle(category.id)}
                    >
                      <div>
                        <h4 className="font-medium">{category.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {category.count} items · {(category.size / 1024).toFixed(1)} GB
                        </p>
                      </div>
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
                        category.selected ? 'bg-primary' : 'border border-muted-foreground'
                      }`}>
                        {category.selected && (
                          <Check className="h-4 w-4 text-primary-foreground" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        
        <div className="mt-8 flex items-center gap-4 p-4 bg-secondary/30 rounded-lg">
          <Clock className="h-8 w-8 text-primary" />
          <div>
            <h3 className="font-medium">Last Synced</h3>
            <p className="text-sm text-muted-foreground">Today at 2:45 PM</p>
          </div>
          <div className="ml-auto">
            <Button variant="outline" onClick={() => {
              toast({
                description: "Syncing memories with cloud...",
              });
            }}>
              Sync Now
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OfflineMemoriesPage;
