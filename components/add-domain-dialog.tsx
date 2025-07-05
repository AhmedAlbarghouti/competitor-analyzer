"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Globe, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AddDomainDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddDomainDialog({ open, onOpenChange }: AddDomainDialogProps) {
  const [domain, setDomain] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ domain: domain.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to start analysis");
      }

      const data = await response.json();
      toast.success(`Analysis started for ${data.domain}`);
      setDomain("");
      onOpenChange(false);
    } catch (error) {
      console.error("Error starting analysis:", error);
      toast.error(error instanceof Error ? error.message : "Failed to start analysis");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Add Domain for Analysis
          </DialogTitle>
          <DialogDescription>
            Enter a competitor domain to analyze their website and strategies.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="domain">Domain</Label>
              <Input
                id="domain"
                placeholder="example.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!domain.trim() || isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Start Analysis
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}