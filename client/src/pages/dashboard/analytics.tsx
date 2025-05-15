import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { getApps, getUserAnalytics } from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart } from "@/components/charts/bar-chart";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

export default function Analytics() {
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("7d");
  
  // Get apps
  const { data: apps, isLoading: appsLoading } = useQuery({
    queryKey: ["/api/apps"],
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
  
  // Dummy data for different time periods
  const userActivityData = {
    "7d": [
      { date: '2023-06-01', active: 150, new: 15 },
      { date: '2023-06-02', active: 230, new: 22 },
      { date: '2023-06-03', active: 224, new: 18 },
      { date: '2023-06-04', active: 218, new: 12 },
      { date: '2023-06-05', active: 235, new: 25 },
      { date: '2023-06-06', active: 247, new: 30 },
      { date: '2023-06-07', active: 260, new: 28 },
    ],
    "14d": [
      { date: '2023-05-25', active: 140, new: 12 },
      { date: '2023-05-26', active: 148, new: 10 },
      { date: '2023-05-27', active: 135, new: 8 },
      { date: '2023-05-28', active: 130, new: 9 },
      { date: '2023-05-29', active: 137, new: 11 },
      { date: '2023-05-30', active: 142, new: 14 },
      { date: '2023-05-31', active: 145, new: 13 },
      { date: '2023-06-01', active: 150, new: 15 },
      { date: '2023-06-02', active: 230, new: 22 },
      { date: '2023-06-03', active: 224, new: 18 },
      { date: '2023-06-04', active: 218, new: 12 },
      { date: '2023-06-05', active: 235, new: 25 },
      { date: '2023-06-06', active: 247, new: 30 },
      { date: '2023-06-07', active: 260, new: 28 },
    ],
    "30d": [
      // ... more data for 30 days
      { date: '2023-05-09', active: 110, new: 8 },
      { date: '2023-05-14', active: 118, new: 10 },
      { date: '2023-05-19', active: 125, new: 12 },
      { date: '2023-05-24', active: 133, new: 14 },
      { date: '2023-05-29', active: 137, new: 11 },
      { date: '2023-06-03', active: 224, new: 18 },
      { date: '2023-06-07', active: 260, new: 28 },
    ],
  };
  
  // Placeholder data for platform distribution
  const platformData = [
    { name: 'Web', value: 65 },
    { name: 'Mobile', value: 25 },
    { name: 'Desktop', value: 10 },
  ];
  
  // Placeholder data for user engagement
  const engagementData = [
    { date: '2023-06-01', casual: 100, regular: 40, power: 10 },
    { date: '2023-06-02', casual: 110, regular: 80, power: 40 },
    { date: '2023-06-03', casual: 120, regular: 70, power: 34 },
    { date: '2023-06-04', casual: 105, regular: 70, power: 43 },
    { date: '2023-06-05', casual: 95, regular: 90, power: 50 },
    { date: '2023-06-06', casual: 130, regular: 85, power: 32 },
    { date: '2023-06-07', casual: 140, regular: 90, power: 30 },
  ];
  
  // Colors for pie chart
  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--chart-3))'];
  
  const currentData = userActivityData[selectedPeriod as keyof typeof userActivityData] || userActivityData["7d"];
  
  return (
    <AppShell>
      <div className="p-4 md:p-6 lg:p-8 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Analytics</h1>
            <p className="text-slate-400 mt-1">Detailed insights for your Prismon applications</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Select
              value={selectedAppId || ""}
              onValueChange={(value) => setSelectedAppId(value)}
              disabled={appsLoading || !apps?.length}
            >
              <SelectTrigger className="w-full sm:w-40 bg-slate-800 border-slate-700 text-white">
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
            
            <Select 
              value={selectedPeriod} 
              onValueChange={setSelectedPeriod}
            >
              <SelectTrigger className="w-full sm:w-40 bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Time period" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="14d">Last 14 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Main Analytics Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700 text-slate-400">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">
                    {analyticsLoading ? <Skeleton className="h-10 w-20" /> : analytics?.totalUsers || 0}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    <span className="text-secondary">
                      <span className="inline-block">↑</span> 3.2%
                    </span>
                    <span className="ml-1">since last period</span>
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Active Users (24h)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">
                    {analyticsLoading ? <Skeleton className="h-10 w-20" /> : analytics?.activeUsersLast24h || 0}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    <span className="text-secondary">
                      <span className="inline-block">↑</span> 12.5%
                    </span>
                    <span className="ml-1">since yesterday</span>
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">New Users (7d)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">
                    {analyticsLoading ? <Skeleton className="h-10 w-20" /> : analytics?.registrationsLast7d || 0}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    <span className="text-red-500">
                      <span className="inline-block">↓</span> 3.8%
                    </span>
                    <span className="ml-1">since last week</span>
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {/* Overview Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">User Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={currentData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.1)" />
                        <XAxis dataKey="date" tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 12 }} />
                        <YAxis tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{ 
                            backgroundColor: 'rgba(30, 41, 59, 0.9)',
                            border: '1px solid rgba(71, 85, 105, 0.5)',
                            borderRadius: '0.375rem',
                            color: 'white',
                          }}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="active" 
                          stroke="hsl(var(--primary))" 
                          activeDot={{ r: 8 }} 
                          name="Active Users"
                          strokeWidth={2}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="new" 
                          stroke="hsl(var(--secondary))" 
                          name="New Registrations"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Platform Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex justify-center items-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={platformData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {platformData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ 
                            backgroundColor: 'rgba(30, 41, 59, 0.9)',
                            border: '1px solid rgba(71, 85, 105, 0.5)',
                            borderRadius: '0.375rem',
                            color: 'white',
                          }}
                          formatter={(value) => [`${value} users`, 'Count']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="users" className="space-y-6">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">User Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={currentData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.1)" />
                      <XAxis dataKey="date" tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 12 }} />
                      <YAxis tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: 'rgba(30, 41, 59, 0.9)',
                          border: '1px solid rgba(71, 85, 105, 0.5)',
                          borderRadius: '0.375rem',
                          color: 'white',
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="new" 
                        stackId="1"
                        stroke="hsl(var(--primary))" 
                        fill="hsla(var(--primary), 0.5)" 
                        name="New Users"
                      />
                      <Legend />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="engagement" className="space-y-6">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">User Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={engagementData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.1)" />
                      <XAxis dataKey="date" tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 12 }} />
                      <YAxis tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: 'rgba(30, 41, 59, 0.9)',
                          border: '1px solid rgba(71, 85, 105, 0.5)',
                          borderRadius: '0.375rem',
                          color: 'white',
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="casual" 
                        stackId="1"
                        stroke="hsl(var(--primary))" 
                        fill="hsla(var(--primary), 0.5)" 
                        name="Casual Users"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="regular" 
                        stackId="1"
                        stroke="hsl(var(--secondary))" 
                        fill="hsla(var(--secondary), 0.5)" 
                        name="Regular Users"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="power" 
                        stackId="1"
                        stroke="hsl(var(--chart-3))" 
                        fill="hsla(var(--chart-3), 0.5)" 
                        name="Power Users"
                      />
                      <Legend />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
