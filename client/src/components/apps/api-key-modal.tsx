import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ApiKeyModalProps {
  open: boolean;
  onClose: () => void;
  apiKey: string;
}

export function ApiKeyModal({ open, onClose, apiKey }: ApiKeyModalProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "API key copied to clipboard",
    });
    console.log("Copied!", copied); 
    // Reset copied status after 2 seconds
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-800 text-white">
        <DialogHeader>
          <DialogTitle>Your API Key</DialogTitle>
          <DialogDescription className="text-slate-400">
            Store this securely - it grants access to your Prismon resources
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <div className="bg-slate-800 p-3 rounded-md border border-slate-700">
            <p className="text-xs text-slate-400 mb-1">API Key</p>
            <div className="flex items-center">
              <Input 
                type="text"
                readOnly
                value={apiKey}
                className="bg-transparent border-0 text-white font-mono text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 text-slate-400 hover:text-white"
                onClick={handleCopy}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="mt-4 bg-amber-950/20 text-amber-500 p-3 rounded-md text-sm flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>
              This key is only shown once. Store it securely as it grants access to your Prismon resources.
            </span>
          </div>
        </div>
        
        <DialogFooter>
          <Button className="w-full" onClick={onClose}>
            I've Saved My Key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
