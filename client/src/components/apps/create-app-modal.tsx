import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { createApp } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ApiKeyModal } from "./api-key-modal";

interface CreateAppModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateAppModal({ open, onClose }: CreateAppModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [newApiKey, setNewApiKey] = useState("");
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (name: string) => createApp(name),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/apps"] });
      toast({
        title: "App Created", 
        description: "Your new app has been created successfully."
      });
      
      // Store the API key and show the API key modal
      setNewApiKey(data.apiKey);
      setShowApiKeyModal(true);
      
      // Reset form
      setName("");
      setDescription("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create app",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Validation Error",
        description: "App name is required",
        variant: "destructive",
      });
      return;
    }
    
    mutation.mutate(name);
    onClose();
  };

  const handleApiKeyModalClose = () => {
    setShowApiKeyModal(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-800 text-white">
          <DialogHeader>
            <DialogTitle>Create New App</DialogTitle>
            <DialogDescription className="text-slate-400">
              Create a new Prismon-integrated dApp
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="app-name" className="text-slate-300">App Name</Label>
                <Input
                  id="app-name"
                  className="bg-slate-800 border-slate-700 text-white"
                  placeholder="My Solana dApp"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="app-description" className="text-slate-300">
                  Description (optional)
                </Label>
                <Textarea
                  id="app-description"
                  className="bg-slate-800 border-slate-700 text-white resize-none h-20"
                  placeholder="Brief description of your app"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Creating..." : "Create App"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <ApiKeyModal
        open={showApiKeyModal}
        onClose={handleApiKeyModalClose}
        apiKey={newApiKey}
      />
    </>
  );
}
