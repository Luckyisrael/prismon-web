import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { upgradePlan } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface UpgradePlanModalProps {
  open: boolean;
  onClose: () => void;
}

export function UpgradePlanModal({ open, onClose }: UpgradePlanModalProps) {
  const { toast } = useToast();
  const [selectedTier, setSelectedTier] = useState<string>("premium");
  const [customRateLimit, setCustomRateLimit] = useState<number>(200000);
  const [currency, setCurrency] = useState<string>("USD");

  const upgradeMutation = useMutation({
    mutationFn: (data: { tier: string; customRateLimit?: number; currency: string }) => upgradePlan(data),
    onSuccess: () => {
      toast({
        title: "Plan upgraded successfully",
        description: "Your subscription has been updated",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error upgrading plan",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      tier: selectedTier,
      currency,
    };

    if (selectedTier === "enterprise") {
      Object.assign(data, { customRateLimit });
    }

    upgradeMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-slate-900 border-slate-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Upgrade Your Plan</DialogTitle>
          <DialogDescription className="text-slate-400">
            Choose the plan that best fits your needs
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <RadioGroup value={selectedTier} onValueChange={setSelectedTier} className="space-y-4">
            <div className={`flex items-start space-x-3 border border-slate-700 p-4 rounded-md ${selectedTier === "freemium" ? "bg-slate-800/80" : "bg-slate-800/20"}`}>
              <RadioGroupItem value="freemium" id="freemium" className="text-primary border-slate-600" />
              <div className="flex-1">
                <Label htmlFor="freemium" className="font-semibold text-base text-white">Freemium</Label>
                <p className="text-sm text-slate-400">Limited to 10,000 API calls per month. Unlimited apps.</p>
                <div className="mt-2 text-slate-300 font-medium">$0 / month</div>
              </div>
            </div>
            
            <div className={`flex items-start space-x-3 border border-slate-700 p-4 rounded-md ${selectedTier === "premium" ? "bg-slate-800/80" : "bg-slate-800/20"}`}>
              <RadioGroupItem value="premium" id="premium" className="text-primary border-slate-600" />
              <div className="flex-1">
                <Label htmlFor="premium" className="font-semibold text-base text-white">Premium</Label>
                <p className="text-sm text-slate-400">Up to 100,000 API calls per month. Unlimited apps.</p>
                <div className="mt-2 text-slate-300 font-medium">$49 / month</div>
              </div>
            </div>
            
            <div className={`flex items-start space-x-3 border border-slate-700 p-4 rounded-md ${selectedTier === "enterprise" ? "bg-slate-800/80" : "bg-slate-800/20"}`}>
              <RadioGroupItem value="enterprise" id="enterprise" className="text-primary border-slate-600" />
              <div className="flex-1">
                <Label htmlFor="enterprise" className="font-semibold text-base text-white">Enterprise</Label>
                <p className="text-sm text-slate-400">Custom rate limits. Priority support. Custom contract.</p>
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="customRateLimit" className="text-slate-300">API Calls Limit:</Label>
                    <Input
                      id="customRateLimit"
                      type="number"
                      min={100000}
                      value={customRateLimit}
                      onChange={(e) => setCustomRateLimit(parseInt(e.target.value))}
                      className="w-32 bg-slate-900 border-slate-700 text-white"
                      disabled={selectedTier !== "enterprise"}
                    />
                  </div>
                </div>
                <div className="mt-2 text-slate-300 font-medium">Custom pricing</div>
              </div>
            </div>
          </RadioGroup>

          <div className="space-y-2">
            <Label htmlFor="currency" className="text-white">Currency</Label>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant={currency === "USD" ? "default" : "outline"}
                onClick={() => setCurrency("USD")}
                className={`w-20 ${currency !== "USD" && "border-slate-700 text-slate-300 hover:bg-slate-800"}`}
              >
                USD
              </Button>
              <Button
                type="button"
                variant={currency === "EUR" ? "default" : "outline"}
                onClick={() => setCurrency("EUR")}
                className={`w-20 ${currency !== "EUR" && "border-slate-700 text-slate-300 hover:bg-slate-800"}`}
              >
                EUR
              </Button>
              <Button
                type="button"
                variant={currency === "GBP" ? "default" : "outline"}
                onClick={() => setCurrency("GBP")}
                className={`w-20 ${currency !== "GBP" && "border-slate-700 text-slate-300 hover:bg-slate-800"}`}
              >
                GBP
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={upgradeMutation.isPending}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              {upgradeMutation.isPending ? "Processing..." : "Upgrade Plan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}