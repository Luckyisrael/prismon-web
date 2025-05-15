import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { AppStatCard } from "@/components/apps/app-stat-card";
import { AppList } from "@/components/apps/app-list";
import { CreateAppModal } from "@/components/apps/create-app-modal";
import { UpgradePlanModal } from "@/components/upgrade-plan-modal";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getApps, getUserAnalytics } from "@/lib/api";
import { AppWindow, BarChart2, UserPlus, Users, ZapIcon } from "lucide-react";
import { BarChart } from "@/components/charts/bar-chart";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";

export default function Dashboard() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  
  // Get apps
  const { data: apps, isLoading: appsLoading } = useQuery({
    queryKey: ["/api/apps"],
    queryFn: getApps,
    retry: 1,
  });
  
  // Get analytics for selected app
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/analytics", selectedAppId],
    enabled: !!selectedAppId,
    retry: 1,
  });
  
  // Set first app as selected when apps load
  useEffect(() => {
    if (apps && apps.length > 0 && !selectedAppId) {
      setSelectedAppId(apps[0].id);
    }
  }, [apps, selectedAppId]);
  
  // Dummy user activity data for the chart
  const userActivityData = [
    { name: 'Mon', value: 180 },
    { name: 'Tue', value: 230 },
    { name: 'Wed', value: 280 },
    { name: 'Thu', value: 250 },
    { name: 'Fri', value: 210 },
    { name: 'Sat', value: 150 },
    { name: 'Sun', value: 140 },
  ];
  
  // Dummy new user data for the chart
  const newUserData = [
    { name: 'Mon', value: 10 },
    { name: 'Tue', value: 14 },
    { name: 'Wed', value: 20 },
    { name: 'Thu', value: 15 },
    { name: 'Fri', value: 12 },
    { name: 'Sat', value: 8 },
    { name: 'Sun', value: 9 },
  ];
  
  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboards</h1>
            <p className="text-slate-400 mt-1">Manage your Prismon applications</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={() => setShowUpgradeModal(true)}
              variant="outline"
              className="sm:w-auto w-full"
            >
              <ZapIcon className="mr-2 h-4 w-4" />
              Upgrade Plan
            </Button>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="sm:w-auto w-full"
            >
              <AppWindow className="mr-2 h-4 w-4" />
              Create App
            </Button>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AppStatCard
            title="Total Apps"
            value={appsLoading ? "..." : apps?.length || 0}
            icon={<AppWindow className="h-5 w-5" />}
            iconBgColor="bg-primary/20"
            iconColor="text-primary"
            change={{
              value: "2",
              isPositive: true,
              label: "since last month"
            }}
          />
          
          <AppStatCard
            title="Total Users"
            //@ts-ignore
            value={analyticsLoading || !analytics ? "..." : analytics.totalUsers}
            icon={<Users className="h-5 w-5" />}
            iconBgColor="bg-secondary/20"
            iconColor="text-secondary"
            change={{
              value: "3.2%",
              isPositive: true,
              label: "since last week"
            }}
          />
          
          <AppStatCard
            title="Active Users (24h)"
             //@ts-ignore
            value={analyticsLoading || !analytics ? "..." : analytics.activeUsersLast24h}
            icon={<Users className="h-5 w-5" />}
            iconBgColor="bg-primary/20"
            iconColor="text-primary"
            change={{
              value: "12.5%",
              isPositive: true,
              label: "since yesterday"
            }}
          />
          
          <AppStatCard
            title="New Users (7d)"
             //@ts-ignore
            value={analyticsLoading || !analytics ? "..." : analytics.registrationsLast7d}
            icon={<UserPlus className="h-5 w-5" />}
            iconBgColor="bg-secondary/20"
            iconColor="text-secondary"
            change={{
              value: "3.8%",
              isPositive: false,
              label: "since last week"
            }}
          />
        </div>
        
        {/* AppWindow Table */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-3 flex flex-row items-start justify-between">
            <div>
              <CardTitle className="text-lg text-white">Your Applications</CardTitle>
              <p className="text-sm text-slate-400 mt-1">Manage your Prismon integrated dApps</p>
            </div>
          </CardHeader>
          <CardContent>
            <AppList />
          </CardContent>
        </Card>
        
        {/* Analytics Preview */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg text-white">Analytics Overview</CardTitle>
              <p className="text-sm text-slate-400 mt-1">Quick summary of your app performance</p>
            </div>
            
            <div className="ml-auto">
              <Select
                value={selectedAppId || ""}
                onValueChange={(value) => setSelectedAppId(value)}
                disabled={appsLoading || !apps?.length}
              >
                <SelectTrigger className="w-40 sm:w-60 bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Select an app" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  {apps?.map((app) => (
                    <SelectItem key={app.id} value={app.id}>
                      {app.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BarChart 
                title="User Activity (Last 7 Days)" 
                data={userActivityData} 
                dataKey="value" 
                color="hsl(var(--primary))"
              />
              
              <BarChart 
                title="New User Registrations (Last 7 Days)" 
                data={newUserData} 
                dataKey="value" 
                color="hsl(var(--secondary))"
              />
            </div>
            
            <div className="mt-6 text-center">
              <Link href="/dashboard/analytics" className="inline-flex items-center text-sm text-primary hover:text-primary/80">
                View detailed analytics
                <BarChart2 className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </CardContent>
        </Card>
        
        {/* Create App Modal */}
        <CreateAppModal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
        
        {/* Upgrade Plan Modal */}
        <UpgradePlanModal
          open={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
        />
      </div>
    </AppShell>
  );
}
