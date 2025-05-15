import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, AlertTriangle, XCircle, Clock, ArrowDownCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

// Interface for service status
interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'outage' | 'maintenance';
  lastUpdated: string;
  message?: string;
}

export default function StatusPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  // Mock data for service statuses - in a real app, this would come from an API
  const mockServices: ServiceStatus[] = [
    {
      name: 'API Gateway',
      status: 'operational',
      lastUpdated: new Date().toISOString(),
    },
    {
      name: 'Authentication Service',
      status: 'operational',
      lastUpdated: new Date().toISOString(),
    },
    {
      name: 'Analytics Engine',
      status: 'degraded',
      lastUpdated: new Date().toISOString(),
      message: 'Some users may experience slower response times'
    },
    {
      name: 'User Management',
      status: 'operational',
      lastUpdated: new Date().toISOString(),
    },
    {
      name: 'Solana RPC Service',
      status: 'operational',
      lastUpdated: new Date().toISOString(),
    },
    {
      name: 'Database Cluster',
      status: 'maintenance',
      lastUpdated: new Date().toISOString(),
      message: 'Scheduled maintenance in progress'
    },
    {
      name: 'CDN',
      status: 'operational',
      lastUpdated: new Date().toISOString(),
    }
  ];

  // Function to refresh service status
  const refreshStatus = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setServices(mockServices);
      setLoading(false);
      setLastRefreshed(new Date());
      
      // Show toast notification
      toast({
        title: "Status Refreshed",
        description: "Service status has been updated",
      });
    }, 1500);
  };

  // Load initial data
  useEffect(() => {
    refreshStatus();
  }, []);

  // Get status badge styling and icon
  const getStatusBadge = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'operational':
        return {
          label: 'Operational',
          color: 'bg-green-500/20 text-green-500 hover:bg-green-500/30',
          icon: <CheckCircle2 className="h-4 w-4 mr-1" />
        };
      case 'degraded':
        return {
          label: 'Degraded',
          color: 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30',
          icon: <AlertTriangle className="h-4 w-4 mr-1" />
        };
      case 'outage':
        return {
          label: 'Outage',
          color: 'bg-red-500/20 text-red-500 hover:bg-red-500/30',
          icon: <XCircle className="h-4 w-4 mr-1" />
        };
      case 'maintenance':
        return {
          label: 'Maintenance',
          color: 'bg-blue-500/20 text-blue-500 hover:bg-blue-500/30',
          icon: <Clock className="h-4 w-4 mr-1" />
        };
      default:
        return {
          label: 'Unknown',
          color: 'bg-slate-500/20 text-slate-500 hover:bg-slate-500/30',
          icon: <AlertTriangle className="h-4 w-4 mr-1" />
        };
    }
  };

  // Calculate overall system status
  const getSystemStatus = () => {
    if (loading) return { label: 'Loading...', color: 'bg-slate-500/20 text-slate-500' };
    
    if (services.some(s => s.status === 'outage')) {
      return { 
        label: 'System Outage', 
        color: 'bg-red-500/20 text-red-500',
        icon: <XCircle className="h-5 w-5 mr-2" />
      };
    }
    
    if (services.some(s => s.status === 'degraded')) {
      return { 
        label: 'Degraded Performance', 
        color: 'bg-yellow-500/20 text-yellow-500',
        icon: <AlertTriangle className="h-5 w-5 mr-2" />
      };
    }
    
    if (services.some(s => s.status === 'maintenance')) {
      return { 
        label: 'Maintenance in Progress', 
        color: 'bg-blue-500/20 text-blue-500',
        icon: <Clock className="h-5 w-5 mr-2" />
      };
    }
    
    return { 
      label: 'All Systems Operational', 
      color: 'bg-green-500/20 text-green-500',
      icon: <CheckCircle2 className="h-5 w-5 mr-2" />
    };
  };

  const systemStatus = getSystemStatus();

  // Format the last refreshed time
  const formatLastRefreshed = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">System Status</h1>
          <p className="text-slate-400 mt-1">Monitor the operational status of Prismon services</p>
        </div>
        <Button 
          onClick={refreshStatus} 
          disabled={loading} 
          className="bg-slate-800 hover:bg-slate-700 text-white"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <Card className="p-6 bg-slate-900 border-slate-800">
        <div className="flex flex-col items-center md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <div className="flex items-center">
            {loading ? (
              <Skeleton className="h-5 w-40" />
            ) : (
              <Badge className={`text-sm py-1 px-3 ${systemStatus.color}`}>
                <span className="flex items-center">
                  {systemStatus.icon}
                  {systemStatus.label}
                </span>
              </Badge>
            )}
          </div>
          <div className="text-sm text-slate-400">
            Last updated: {loading ? <Skeleton className="h-4 w-24 inline-block" /> : formatLastRefreshed(lastRefreshed)}
          </div>
        </div>
        
        <div className="space-y-4">
          {loading ? (
            // Loading skeletons
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-md">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-6 w-24" />
              </div>
            ))
          ) : (
            // Service list
            services.map((service) => {
              const status = getStatusBadge(service.status);
              
              return (
                <div 
                  key={service.name}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 bg-slate-800/50 rounded-md border border-slate-800"
                >
                  <div>
                    <h3 className="font-medium text-white">{service.name}</h3>
                    {service.message && (
                      <p className="text-sm text-slate-400 mt-1">{service.message}</p>
                    )}
                  </div>
                  <Badge className={`${status.color}`}>
                    <span className="flex items-center">
                      {status.icon}
                      {status.label}
                    </span>
                  </Badge>
                </div>
              );
            })
          )}
        </div>
      </Card>
      
      <Card className="p-6 bg-slate-900 border-slate-800">
        <h2 className="text-lg font-medium text-white mb-4">Incident History</h2>
        
        {loading ? (
          <Skeleton className="h-16 w-full" />
        ) : (
          <div className="space-y-4">
            <div className="border-l-2 border-yellow-500 pl-4 pb-6 relative">
              <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-yellow-500"></div>
              <h3 className="font-medium text-white">Analytics Engine Degraded Performance</h3>
              <p className="text-sm text-slate-400 mt-1">Some users experienced slower analytics processing times</p>
              <div className="flex items-center mt-2">
                <Badge className="bg-green-500/20 text-green-500 mr-2">Resolved</Badge>
                <span className="text-xs text-slate-500">Apr 28, 2025 - 2:45 PM</span>
              </div>
            </div>
            
            <div className="border-l-2 border-red-500 pl-4 pb-6 relative">
              <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-red-500"></div>
              <h3 className="font-medium text-white">API Gateway Outage</h3>
              <p className="text-sm text-slate-400 mt-1">API Gateway experienced a complete outage affecting all services</p>
              <div className="flex items-center mt-2">
                <Badge className="bg-green-500/20 text-green-500 mr-2">Resolved</Badge>
                <span className="text-xs text-slate-500">Apr 15, 2025 - 10:30 AM</span>
              </div>
            </div>
            
            <div className="border-l-2 border-blue-500 pl-4 relative">
              <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-blue-500"></div>
              <h3 className="font-medium text-white">Scheduled Database Maintenance</h3>
              <p className="text-sm text-slate-400 mt-1">Scheduled maintenance to improve database performance</p>
              <div className="flex items-center mt-2">
                <Badge className="bg-green-500/20 text-green-500 mr-2">Completed</Badge>
                <span className="text-xs text-slate-500">Apr 10, 2025 - 3:00 AM</span>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}