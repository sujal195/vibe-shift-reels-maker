import Layout from "@/components/layout/Layout";
import { useAuthSession } from "@/hooks/useAuthSession";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { FolderKanban, Plus, Pencil, Trash2, MoreHorizontal, Grid, List, Settings } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ColorPicker } from "./components/ColorPicker";
import { Badge } from "@/components/ui/badge";

// Memory space colors
const spaceColors = [
  "bg-red-500",
  "bg-amber-500",
  "bg-lime-500",
  "bg-emerald-500",
  "bg-cyan-500",
  "bg-blue-500",
  "bg-violet-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-rose-500",
];

// Sample memory spaces
const sampleSpaces = [
  {
    id: 1,
    name: "Family Memories",
    description: "Special moments with my loved ones",
    color: "bg-blue-500",
    memories: 124
  },
  {
    id: 2,
    name: "Travel Adventures",
    description: "Exploring the world one trip at a time",
    color: "bg-amber-500",
    memories: 87
  },
  {
    id: 3,
    name: "School Life",
    description: "Memories from college and university",
    color: "bg-emerald-500",
    memories: 56
  },
  {
    id: 4,
    name: "Work Achievements",
    description: "Career milestones and celebrations",
    color: "bg-violet-500",
    memories: 32
  },
];

const MemorySpacesPage = () => {
  const { user } = useAuthSession();
  const [spaces, setSpaces] = useState(sampleSpaces);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentSpace, setCurrentSpace] = useState<typeof sampleSpaces[0] | null>(null);
  const [newSpaceName, setNewSpaceName] = useState('');
  const [newSpaceDescription, setNewSpaceDescription] = useState('');
  const [newSpaceColor, setNewSpaceColor] = useState('bg-blue-500');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  if (!user) {
    return <div>Loading...</div>;
  }

  const handleCreateSpace = () => {
    if (!newSpaceName.trim()) {
      toast({
        title: "Space name required",
        description: "Please enter a name for your memory space.",
        variant: "destructive",
      });
      return;
    }
    
    const newSpace = {
      id: Date.now(),
      name: newSpaceName,
      description: newSpaceDescription,
      color: newSpaceColor,
      memories: 0
    };
    
    setSpaces([...spaces, newSpace]);
    setIsCreateDialogOpen(false);
    resetForm();
    
    toast({
      title: "Space created",
      description: `"${newSpaceName}" has been created.`,
    });
  };

  const handleEditSpace = () => {
    if (!currentSpace) return;
    if (!newSpaceName.trim()) {
      toast({
        title: "Space name required",
        description: "Please enter a name for your memory space.",
        variant: "destructive",
      });
      return;
    }
    
    const updatedSpaces = spaces.map(space => 
      space.id === currentSpace.id 
        ? { 
            ...space, 
            name: newSpaceName, 
            description: newSpaceDescription,
            color: newSpaceColor
          }
        : space
    );
    
    setSpaces(updatedSpaces);
    setIsEditDialogOpen(false);
    resetForm();
    
    toast({
      title: "Space updated",
      description: `"${newSpaceName}" has been updated.`,
    });
  };

  const handleDeleteSpace = () => {
    if (!currentSpace) return;
    
    const updatedSpaces = spaces.filter(space => space.id !== currentSpace.id);
    setSpaces(updatedSpaces);
    setIsDeleteDialogOpen(false);
    
    toast({
      title: "Space deleted",
      description: `"${currentSpace.name}" has been deleted.`,
    });
  };

  const openEditDialog = (space: typeof sampleSpaces[0]) => {
    setCurrentSpace(space);
    setNewSpaceName(space.name);
    setNewSpaceDescription(space.description);
    setNewSpaceColor(space.color);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (space: typeof sampleSpaces[0]) => {
    setCurrentSpace(space);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setNewSpaceName('');
    setNewSpaceDescription('');
    setNewSpaceColor('bg-blue-500');
    setCurrentSpace(null);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <FolderKanban className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Memory Spaces</h1>
        </div>
        
        <div className="mb-8">
          <div className="bg-secondary/30 p-8 rounded-lg">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold mb-2">Organize Your Memories</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Create custom spaces to organize your memories by theme, timeline, or any way that makes sense to you.
              </p>
            </div>
            
            <div className="flex justify-center">
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Space
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">My Memory Spaces</h2>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-5 w-5" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {spaces.map((space) => (
              <Card key={space.id} className="overflow-hidden group">
                <div className={`h-2 ${space.color}`}></div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-xl">{space.name}</h3>
                    <div className="relative">
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                      <div className="absolute right-0 top-full mt-2 w-36 bg-card border border-border rounded-md shadow-lg hidden group-hover:block z-10">
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start px-3 py-2 h-auto"
                          onClick={() => openEditDialog(space)}
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start px-3 py-2 h-auto text-destructive hover:text-destructive"
                          onClick={() => openDeleteDialog(space)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">{space.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{space.memories} memories</span>
                    <Button variant="outline" size="sm">View Space</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <Card className="border-dashed flex flex-col items-center justify-center h-full min-h-[200px]">
              <Button 
                variant="ghost" 
                className="h-full w-full flex flex-col gap-3"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <Plus className="h-12 w-12 text-muted-foreground" />
                <span>Create New Space</span>
              </Button>
            </Card>
          </div>
        ) : (
          <div className="space-y-4">
            {spaces.map((space) => (
              <div 
                key={space.id}
                className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:bg-secondary/10 group"
              >
                <div className={`w-12 h-12 ${space.color} rounded-md flex items-center justify-center text-white font-bold text-2xl`}>
                  {space.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-lg">{space.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{space.description}</p>
                </div>
                <Badge variant="secondary">{space.memories} memories</Badge>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" onClick={() => openEditDialog(space)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => openDeleteDialog(space)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline">View Space</Button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Create Space Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Memory Space</DialogTitle>
              <DialogDescription>
                Create a new space to organize your memories.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Space Name
                </label>
                <Input
                  id="name"
                  placeholder="e.g., Family Memories"
                  value={newSpaceName}
                  onChange={(e) => setNewSpaceName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description (Optional)
                </label>
                <Input
                  id="description"
                  placeholder="e.g., Special moments with my loved ones"
                  value={newSpaceDescription}
                  onChange={(e) => setNewSpaceDescription(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Color
                </label>
                <ColorPicker onColorChange={setNewSpaceColor} defaultColor={newSpaceColor} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateSpace}>Create Space</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Edit Space Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Memory Space</DialogTitle>
              <DialogDescription>
                Modify your memory space details.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="edit-name" className="text-sm font-medium">
                  Space Name
                </label>
                <Input
                  id="edit-name"
                  placeholder="e.g., Family Memories"
                  value={newSpaceName}
                  onChange={(e) => setNewSpaceName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-description" className="text-sm font-medium">
                  Description (Optional)
                </label>
                <Input
                  id="edit-description"
                  placeholder="e.g., Special moments with my loved ones"
                  value={newSpaceDescription}
                  onChange={(e) => setNewSpaceDescription(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Color
                </label>
                <ColorPicker onColorChange={setNewSpaceColor} defaultColor={newSpaceColor} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleEditSpace}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Delete Space Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Memory Space</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{currentSpace?.name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDeleteSpace}>Delete Space</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <div className="mt-8 bg-card border border-border p-6 rounded-lg">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Settings className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Advanced Space Features</h3>
              <p className="text-muted-foreground">
                Set permissions, add automations, and customize how your memories are organized within each space.
              </p>
              <Tabs defaultValue="permissions" className="mt-4">
                <TabsList>
                  <TabsTrigger value="permissions">Permissions</TabsTrigger>
                  <TabsTrigger value="automations">Automations</TabsTrigger>
                  <TabsTrigger value="templates">Templates</TabsTrigger>
                </TabsList>
                <TabsContent value="permissions" className="pt-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Control who can view and contribute to each memory space
                  </p>
                  <Button variant="outline">Manage Permissions</Button>
                </TabsContent>
                <TabsContent value="automations" className="pt-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Set up rules to automatically organize memories into the right spaces
                  </p>
                  <Button variant="outline">Create Automation</Button>
                </TabsContent>
                <TabsContent value="templates" className="pt-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Use and create custom templates for your memory spaces
                  </p>
                  <Button variant="outline">Browse Templates</Button>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MemorySpacesPage;
