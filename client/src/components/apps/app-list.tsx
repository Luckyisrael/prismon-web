import { useQuery, useMutation } from "@tanstack/react-query";
import { getApps, deleteApp, regenerateAppKey } from "@/lib/api";
import { App } from "@/types";
import { DataTable } from "@/components/ui/data-table";
import { useState } from "react";
import { queryClient } from "@/lib/queryClient";
import { DeleteAppModal } from "./delete-app-modal";
import { ApiKeyModal } from "./api-key-modal";
import { EditIcon, Trash2Icon, RefreshCcwIcon, BarChart2Icon, CheckCircle, FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function AppList() {
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { toast } = useToast();

  // Fetch apps
  const { data: apps, isLoading, error } = useQuery({
    queryKey: ["/api/apps"],
    retry: 1,
  });

  // Delete app mutation
  const deleteMutation = useMutation({
    mutationFn: (appId: string) => deleteApp(appId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/apps"] });
      toast({
        title: "App Deleted",
        description: "The app has been successfully deleted.",
      });
      setShowDeleteModal(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Could not delete app",
        variant: "destructive",
      });
    },
  });

  // Regenerate API key mutation
  const regenerateMutation = useMutation({
    mutationFn: (appId: string) => regenerateAppKey(appId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/apps"] });
      setSelectedApp(data as unknown as App);
      setShowApiKeyModal(true);
      toast({
        title: "API Key Regenerated",
        description: "Your new API key has been generated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Could not regenerate API key",
        variant: "destructive",
      });
    },
  });

  // Handle delete app
  const handleDeleteApp = (app: App) => {
    setSelectedApp(app);
    setShowDeleteModal(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = () => {
    if (selectedApp) {
      deleteMutation.mutate(selectedApp.id);
    }
  };

  // Handle regenerate API key
  const handleRegenerateKey = (app: App) => {
    regenerateMutation.mutate(app.id);
  };

  // Handle copy API key
  const handleCopyApiKey = (apiKey: string) => {
    navigator.clipboard.writeText(apiKey);
    toast({
      title: "Copied!",
      description: "API key copied to clipboard",
    });
  };

  const columns: ColumnDef<App>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const app = row.original;
        const initials = app.name.substring(0, 2).toUpperCase();
        
        return (
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-4 bg-primary/20 text-primary">
              <AvatarFallback>
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm font-medium text-white">{app.name}</div>
              <div className="text-sm text-slate-400">ID: {app.id.substring(0, 8)}...</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "apiKey",
      header: "API Key",
      cell: ({ row }) => {
        const app = row.original;
        // Show only first 10 chars of API key
        const truncatedKey = `${app.apiKey.substring(0, 10)}...`;
        
        return (
          <div className="flex items-center">
            <span className="text-sm text-slate-300 font-mono">{truncatedKey}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-2 text-slate-400 hover:text-white" 
              onClick={() => handleCopyApiKey(app.apiKey)}
            >
              <FileIcon className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        const app = row.original;
        // Format date: Month DD, YYYY
        const date = new Date(app.createdAt);
        const formatted = date.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        });
        
        return <span className="text-sm text-slate-300">{formatted}</span>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const app = row.original;
        // Example status logic - could be based on deployedAt or other properties
        const isActive = app.deployedEndpoint && app.deployedAt;
        
        return (
          <Badge 
            variant="outline" 
            className={cn(
              "rounded-full",
              isActive ? "bg-secondary/20 text-secondary border-secondary/20" : "bg-slate-700/20 text-slate-400 border-slate-700/20"
            )}
          >
            {isActive ? "Active" : "Development"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const app = row.original;
        
        return (
          <div className="flex items-center justify-end space-x-2">
            <Button variant="ghost" size="icon" className="text-primary hover:text-primary/80" title="Edit">
              <EditIcon className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-slate-400 hover:text-white" 
              title="Regenerate API Key"
              onClick={() => handleRegenerateKey(app)}
              disabled={regenerateMutation.isPending}
            >
              <RefreshCcwIcon className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-destructive hover:text-destructive/80" 
              title="Delete"
              onClick={() => handleDeleteApp(app)}
              disabled={deleteMutation.isPending}
            >
              <Trash2Icon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-primary hover:text-primary/80" title="View Analytics">
              <BarChart2Icon className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-destructive">Error loading apps. Please try again.</p>
      </div>
    );
  }

  return (
    <>
      <DataTable 
        columns={columns}
        data={apps as App[] || []}
      />
      
      {selectedApp && (
        <>
          <DeleteAppModal
            open={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleConfirmDelete}
            appName={selectedApp.name}
            isDeleting={deleteMutation.isPending}
          />
          
          <ApiKeyModal
            open={showApiKeyModal}
            onClose={() => setShowApiKeyModal(false)}
            apiKey={selectedApp.apiKey}
          />
        </>
      )}
    </>
  );
}
