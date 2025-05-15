import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getApps, getUserAnalytics, deleteApp } from "@/lib/api";
import { AppShell } from "@/components/layout/app-shell";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogClose, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BarChart } from "@/components/charts/bar-chart";
import { useToast } from "@/hooks/use-toast";
import { App, Analytics } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion } from "framer-motion";
import { 
  Settings, 
  Users, 
  Activity, 
  Key, 
  Copy, 
  Edit,
  Trash2, 
  BarChart2, 
  Check, 
  Globe, 
  Calendar, 
  RefreshCw,
  ArrowRight,
  AlertTriangle
} from "lucide-react";

// App users data table with mock data and functionality to delete users
function AppUsersTable() {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { toast } = useToast();

  // Mock users data
  const users = [
    { id: '1', name: 'John Doe', email: 'john@example.com', lastActive: '2023-06-06', status: 'active' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', lastActive: '2023-06-05', status: 'active' },
    { id: '3', name: 'Robert Johnson', email: 'robert@example.com', lastActive: '2023-06-01', status: 'inactive' },
    { id: '4', name: 'Emily Davis', email: 'emily@example.com', lastActive: '2023-06-04', status: 'active' },
    { id: '5', name: 'Michael Brown', email: 'michael@example.com', lastActive: '2023-05-28', status: 'inactive' }
  ];

  const handleDeleteClick = (userId: string) => {
    setSelectedUserId(userId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    // In a real app, you would call an API endpoint to delete the user
    toast({
      title: "User deleted",
      description: `User ID: ${selectedUserId} has been deleted successfully.`,
    });
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="rounded-md border border-slate-700">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-800 text-slate-400">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Email</th>
              <th className="px-4 py-3 text-left font-medium">Last Active</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {users.map((user) => (
              <tr 
                key={user.id} 
                className="bg-slate-900 text-slate-300 hover:bg-slate-800 transition-colors"
              >
                <td className="px-4 py-3.5">{user.name}</td>
                <td className="px-4 py-3.5">{user.email}</td>
                <td className="px-4 py-3.5">{user.lastActive}</td>
                <td className="px-4 py-3.5">
                  
                  <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>{user.status}</Badge>
                </td>
                <td className="px-4 py-3.5 text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    onClick={() => handleDeleteClick(user.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Confirm User Deletion</DialogTitle>
            <DialogDescription className="text-slate-400">
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Plan upgrade component
function PlanUpgradeSection() {
  const { toast } = useToast();
  
  const planUpgradeSchema = z.object({
    tier: z.enum(["freemium", "premium", "enterprise"]),
    customRateLimit: z.number().min(0).optional(),
    currency: z.enum(["USD", "EUR", "GBP"]).default("USD"),
  });
  
  const form = useForm<z.infer<typeof planUpgradeSchema>>({
    resolver: zodResolver(planUpgradeSchema),
    defaultValues: {
      tier: "freemium",
      currency: "USD",
    },
  });
  
  const onSubmit = (values: z.infer<typeof planUpgradeSchema>) => {
    // In a real app, you would call an API endpoint to upgrade the plan
    toast({
      title: "Plan Upgraded",
      description: `Your plan has been upgraded to ${values.tier}.`,
    });
  };
  
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-lg text-white">Upgrade Plan</CardTitle>
        <CardDescription className="text-slate-400">
          Upgrade your plan to get more API calls and features
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="tier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Plan Tier</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
                    >
                      <option value="freemium">Freemium (10,000 API calls)</option>
                      <option value="premium">Premium (100,000 API calls)</option>
                      <option value="enterprise">Enterprise (Custom limit)</option>
                    </select>
                  </FormControl>
                  <FormDescription className="text-slate-500">
                    Select the plan that best fits your needs
                  </FormDescription>
                </FormItem>
              )}
            />
            
            {form.watch("tier") === "enterprise" && (
              <FormField
                control={form.control}
                name="customRateLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Custom API Call Limit</FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                        type="number"
                        min="0"
                        className="bg-slate-800 border-slate-700 text-white"
                        placeholder="Enter custom API call limit"
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Currency</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </FormControl>
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full">
              Upgrade Plan
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

// Main App Details Component
export default function AppDetails() {
  const params = useParams<{ appId: string }>();
  const appId = params?.appId;
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);
  
  // Get app data
  const { data: apps, isLoading: appsLoading } = useQuery({
    queryKey: ["/api/apps"],
    retry: 1,
  });
  
  // Find the specific app
  //@ts-ignore
  const app = apps?.find((a: App) => a.id === appId);
  
  // Get analytics for app
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/analytics", appId],
    enabled: !!appId,
    retry: 1,
  });
  
  // Delete app mutation
  const deleteMutation = useMutation({
    mutationFn: () => deleteApp(appId || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/apps"] });
      toast({
        title: "App Deleted",
        description: "The application has been deleted successfully.",
      });
      setLocation("/dashboard");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete the application.",
        variant: "destructive",
      });
      console.error("Delete app error:", error);
    }
  });
  
  // Copy API key to clipboard
  const copyApiKeyToClipboard = () => {
    if (app?.apiKey) {
      navigator.clipboard.writeText(app.apiKey);
      toast({
        title: "API Key Copied",
        description: "The API key has been copied to your clipboard.",
      });
    }
  };
  
  // Handle delete confirmation
  const confirmDelete = () => {
    deleteMutation.mutate();
    setIsDeleteDialogOpen(false);
  };
  
  // Check if app exists
  if (!appsLoading && !app) {
    return (
      <AppShell>
        <div className="p-4 md:p-6 lg:p-8">
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Application Not Found</AlertTitle>
            <AlertDescription>
              The application you're looking for doesn't exist or you don't have permission to view it.
            </AlertDescription>
          </Alert>
          <Button onClick={() => setLocation("/dashboard")}>
            Return to Dashboard
          </Button>
        </div>
      </AppShell>
    );
  }
  
  // User activity data for the chart
  const userActivityData = [
    { name: 'Mon', value: 180 },
    { name: 'Tue', value: 230 },
    { name: 'Wed', value: 280 },
    { name: 'Thu', value: 250 },
    { name: 'Fri', value: 210 },
    { name: 'Sat', value: 150 },
    { name: 'Sun', value: 140 },
  ];
  
  // New user data for the chart
  const newUserData = [
    { name: 'Mon', value: 10 },
    { name: 'Tue', value: 14 },
    { name: 'Wed', value: 20 },
    { name: 'Thu', value: 15 },
    { name: 'Fri', value: 12 },
    { name: 'Sat', value: 8 },
    { name: 'Sun', value: 9 },
  ];
  
  // Transaction data for the chart
  const transactionData = [
    { name: 'Mon', value: 56 },
    { name: 'Tue', value: 84 },
    { name: 'Wed', value: 120 },
    { name: 'Thu', value: 145 },
    { name: 'Fri', value: 132 },
    { name: 'Sat', value: 78 },
    { name: 'Sun', value: 65 },
  ];

  return (
    <AppShell>
      <div className="p-4 md:p-6 lg:p-8 space-y-6">
        {/* App Header */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                className="mr-2" 
                onClick={() => setLocation("/dashboard")}
              >
                <ArrowRight className="h-4 w-4 rotate-180 mr-1" />
                Back
              </Button>
              
              {appsLoading ? (
                <Skeleton className="h-8 w-64" />
              ) : (
                <h1 className="text-2xl font-bold text-white">{app?.name}</h1>
              )}
              
              {app?.deployedEndpoint && (
                <Badge variant="outline" className="ml-2">Live</Badge>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {app?.deployedEndpoint && (
                <Button variant="outline" size="sm" className="text-sm" asChild>
                  <a href={app.deployedEndpoint} target="_blank" rel="noopener noreferrer">
                    <Globe className="h-4 w-4 mr-1" />
                    View Live
                  </a>
                </Button>
              )}
              
              <Button variant="outline" size="sm" className="text-sm">
                <Edit className="h-4 w-4 mr-1" />
                Edit App
              </Button>
              
              <Button 
                variant="destructive" 
                size="sm" 
                className="text-sm"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete App
              </Button>
            </div>
          </div>
          
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-4 mb-8">
            <div className="bg-slate-800 p-4 rounded-lg">
              <dt className="text-sm font-medium text-slate-400">Created</dt>
              <dd className="mt-1 text-lg font-semibold text-white flex items-center">
                {appsLoading ? (
                  <Skeleton className="h-6 w-32" />
                ) : (
                  <>
                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                    {new Date(app?.createdAt || "").toLocaleDateString()}
                  </>
                )}
              </dd>
            </div>
            
            <div className="bg-slate-800 p-4 rounded-lg">
              <dt className="text-sm font-medium text-slate-400">API Key</dt>
              <dd className="mt-1 text-lg font-semibold text-white">
                {appsLoading ? (
                  <Skeleton className="h-6 w-32" />
                ) : (
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 font-mono text-sm truncate">
                      {isApiKeyVisible ? app?.apiKey : '••••••••••••••••'}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 p-0 px-1" 
                      onClick={() => setIsApiKeyVisible(!isApiKeyVisible)}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">{isApiKeyVisible ? 'Hide' : 'Show'}</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 p-0 px-1" 
                      onClick={copyApiKeyToClipboard}
                    >
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Copy</span>
                    </Button>
                  </div>
                )}
              </dd>
            </div>
            
            <div className="bg-slate-800 p-4 rounded-lg">
              <dt className="text-sm font-medium text-slate-400">Total Users</dt>
              <dd className="mt-1 text-lg font-semibold text-white flex items-center">
                {analyticsLoading ? (
                  <Skeleton className="h-6 w-16" />
                ) : (
                  <>
                    <Users className="h-4 w-4 mr-2 text-primary" />
                    
                    {(analytics as { totalUsers?: number })?.totalUsers || 0}
                  </>
                )}
              </dd>
            </div>
            
            <div className="bg-slate-800 p-4 rounded-lg">
              <dt className="text-sm font-medium text-slate-400">Active Users (24h)</dt>
              <dd className="mt-1 text-lg font-semibold text-white flex items-center">
                {analyticsLoading ? (
                  <Skeleton className="h-6 w-16" />
                ) : (
                  <>
                    <Activity className="h-4 w-4 mr-2 text-primary" />
                    {(analytics as { activeUsersLast24h?: number })?.activeUsersLast24h || 0}
                  </>
                )}
              </dd>
            </div>
          </dl>
          
          {/* App Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-slate-800 border-slate-700 text-slate-400">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white">User Activity</CardTitle>
                    <CardDescription className="text-slate-400">
                      Users active in the last 7 days
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <BarChart 
                        title="Daily Active Users" 
                        data={userActivityData} 
                        dataKey="value" 
                        color="hsl(var(--primary))"
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white">New Registrations</CardTitle>
                    <CardDescription className="text-slate-400">
                      New users in the last 7 days
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <BarChart 
                        title="New Users" 
                        data={newUserData} 
                        dataKey="value" 
                        color="hsl(var(--secondary))"
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white">Transactions</CardTitle>
                    <CardDescription className="text-slate-400">
                      Transactions in the last 7 days
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <BarChart 
                        title="Daily Transactions" 
                        data={transactionData} 
                        dataKey="value" 
                        color="hsl(var(--primary))"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white">API Usage</CardTitle>
                  <CardDescription className="text-slate-400">
                    API calls in the last 30 days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row items-center justify-between mb-6">
                    <div className="flex flex-col">
                      <span className="text-sm text-slate-400">Total Calls</span>
                      <span className="text-2xl font-bold text-white">8,745</span>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-sm text-slate-400">Average per Day</span>
                      <span className="text-2xl font-bold text-white">291</span>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-sm text-slate-400">Plan Limit</span>
                      <span className="text-2xl font-bold text-white">10,000</span>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-sm text-slate-400">Usage</span>
                      <span className="text-2xl font-bold text-white">87.5%</span>
                    </div>
                    
                    <Button variant="outline">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                  
                  <div className="w-full bg-slate-800 rounded-full h-4">
                    <div 
                      className="bg-primary h-4 rounded-full" 
                      style={{ width: "87.5%" }}
                    ></div>
                  </div>
                  
                  <div className="mt-2 text-sm text-slate-400 text-right">
                    8,745 / 10,000 API calls used this month
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="users" className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">App Users</h2>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Search users..." 
                    className="w-64 bg-slate-800 border-slate-700 text-white"
                  />
                  <Button>
                    <Users className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </div>
              
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-0">
                  <AppUsersTable />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="analytics" className="space-y-6">
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white">Analytics Overview</CardTitle>
                  <CardDescription className="text-slate-400">
                    Detailed insights for your application
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-white mb-4">User Statistics</h3>
                      <dl className="space-y-4">
                        <div className="flex justify-between">
                          <dt className="text-slate-400">Total Users</dt>
                          <dd className="font-medium text-white">{(analytics as Analytics)?.totalUsers || 0}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-slate-400">Active Users (24h)</dt>
                          <dd className="font-medium text-white">{(analytics as Analytics)?.activeUsersLast24h || 0}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-slate-400">New Users (7d)</dt>
                          <dd className="font-medium text-white">{(analytics as { registrationsLast7d?: number })?.registrationsLast7d || 0}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-slate-400">Retention Rate</dt>
                          <dd className="font-medium text-white">78%</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-slate-400">Average Session Duration</dt>
                          <dd className="font-medium text-white">12m 34s</dd>
                        </div>
                      </dl>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-white mb-4">Technical Metrics</h3>
                      <dl className="space-y-4">
                        <div className="flex justify-between">
                          <dt className="text-slate-400">API Uptime</dt>
                          <dd className="font-medium text-white">99.98%</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-slate-400">Average Response Time</dt>
                          <dd className="font-medium text-white">112ms</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-slate-400">Error Rate</dt>
                          <dd className="font-medium text-white">0.23%</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-slate-400">Successful Transactions</dt>
                          <dd className="font-medium text-white">12,567</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-slate-400">Failed Transactions</dt>
                          <dd className="font-medium text-white">29</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-6">
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white">App Settings</CardTitle>
                  <CardDescription className="text-slate-400">
                    Manage your application settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">General</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-slate-400 block mb-1">App Name</label>
                          <Input 
                            defaultValue={app?.name} 
                            className="bg-slate-800 border-slate-700 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-400 block mb-1">App ID</label>
                          <Input 
                            defaultValue={app?.id} 
                            disabled
                            className="bg-slate-800 border-slate-700 text-white opacity-60"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="bg-slate-800" />
                  
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">API Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-slate-400 block mb-1">API Key</label>
                        <div className="flex gap-2">
                          <Input 
                            value={app?.apiKey} 
                            readOnly
                            className="bg-slate-800 border-slate-700 text-white font-mono"
                          />
                          <Button variant="outline" onClick={copyApiKeyToClipboard}>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </Button>
                          <Button variant="outline">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Regenerate
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="bg-slate-800" />
                  
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Plan & Billing</h3>
                    <div className="space-y-4">
                      <PlanUpgradeSection />
                    </div>
                  </div>
                  
                  <Separator className="bg-slate-800" />
                  
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Danger Zone</h3>
                    <div className="space-y-4">
                      <Card className="bg-red-950/20 border-red-800">
                        <CardContent className="p-4">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                              <h4 className="text-white font-medium">Delete Application</h4>
                              <p className="text-slate-400 text-sm">
                                Permanently delete this application and all associated data
                              </p>
                            </div>
                            <Button 
                              variant="destructive"
                              onClick={() => setIsDeleteDialogOpen(true)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete App
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Delete App Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Delete Application</DialogTitle>
            <DialogDescription className="text-slate-400">
              Are you sure you want to delete this application? This action cannot be undone and all data will be permanently lost.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-red-950/20 border border-red-800 rounded-md p-3 text-sm text-red-300">
            <p>Warning: This will delete all associated data:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>User accounts</li>
              <li>Analytics data</li>
              <li>Transaction history</li>
              <li>Application configuration</li>
            </ul>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

// Eye icon component
function Eye(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}