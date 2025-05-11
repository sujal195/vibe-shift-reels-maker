
import Layout from "@/components/layout/Layout";
import { useAuthSession } from "@/hooks/useAuthSession";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Vault, Lock, Upload, Clock, Key, Shield } from "lucide-react";

const MemoryVaultPage = () => {
  const { user } = useAuthSession();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  if (!user) {
    return <div>Loading...</div>;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
      toast({
        title: "Files selected",
        description: `${e.target.files.length} file(s) ready to upload`,
      });
    }
  };

  const handleUpload = () => {
    toast({
      title: "Upload successful",
      description: `${selectedFiles.length} file(s) uploaded to your Memory Vault`,
    });
    setSelectedFiles([]);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Vault className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Memory Vault</h1>
        </div>
        
        <div className="bg-secondary/30 p-8 rounded-lg mb-8 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Your Encrypted Memory Storage</h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Upload your most precious memories to our secure vault. 
            All files are encrypted and can only be accessed by you or designated trusted contacts.
          </p>
          
          <div className="mt-6">
            <input
              type="file"
              multiple
              id="file-upload"
              className="hidden"
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload">
              <Button variant="outline" className="mr-4" asChild>
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  Select Files
                </span>
              </Button>
            </label>
            
            <Button 
              onClick={handleUpload} 
              disabled={selectedFiles.length === 0}
            >
              Upload to Vault
            </Button>
            
            {selectedFiles.length > 0 && (
              <div className="mt-4 text-sm">
                {selectedFiles.length} file(s) selected
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-card border border-border p-6 rounded-lg">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Key className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">End-to-End Encryption</h3>
                <p className="text-muted-foreground text-sm">
                  Your memories are secured with bank-level encryption.
                  Only you and those you explicitly authorize can access them.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-card border border-border p-6 rounded-lg">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Legacy Protection</h3>
                <p className="text-muted-foreground text-sm">
                  Designate trusted contacts who can access your memories in case of emergency
                  or after a predetermined period of inactivity.
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
                <h3 className="text-lg font-medium mb-2">Time Capsule</h3>
                <p className="text-muted-foreground text-sm">
                  Set memories to be revealed to loved ones at specific dates
                  in the future - perfect for milestone celebrations.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-card border border-border p-6 rounded-lg">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Private Collections</h3>
                <p className="text-muted-foreground text-sm">
                  Create special collections with different privacy levels
                  for different types of memories and different audiences.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Your Vault Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span>Storage Used</span>
              <span className="font-medium">0.2 GB / 10 GB</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '2%' }}></div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>Encryption Status</span>
              <span className="font-medium text-green-500">Protected</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>Last Backup</span>
              <span className="font-medium">Today, 2:45 PM</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MemoryVaultPage;
