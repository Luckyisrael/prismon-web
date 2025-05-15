import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppList } from "@/components/apps/app-list";
import { CreateAppModal } from "@/components/apps/create-app-modal";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getApps } from "@/lib/api";
import { AppWindow } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AppsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Get apps
  const { data: apps, isLoading: appsLoading } = useQuery({
    queryKey: ["/api/apps"],
    queryFn: getApps,
    retry: 1,
  });
  
  return (
    <AppShell>
      <div className="p-4 md:p-6 lg:p-8 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Applications</h1>
            <p className="text-slate-400 mt-1">Manage your Prismon dApps</p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="sm:w-auto w-full"
          >
            <AppWindow className="mr-2 h-4 w-4" />
            Create App
          </Button>
        </div>
        
        {/* AppWindow Table */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-white">Your Applications</CardTitle>
            <p className="text-sm text-slate-400 mt-1">
              {appsLoading
                ? "Loading applications..."
                : apps?.length
                ? `You have ${apps.length} application${apps.length !== 1 ? 's' : ''}`
                : "You don't have any applications yet. Create one to get started!"
              }
            </p>
          </CardHeader>
          <CardContent>
            {appsLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <AppList />
            )}
          </CardContent>
        </Card>
        
        {/* Create App Modal */}
        <CreateAppModal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      </div>
    </AppShell>
  );
}
