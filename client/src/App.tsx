import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/context/auth-context";
import { useEffect } from "react";

// Pages
import Login from "@/pages/login";
import Register from "@/pages/register";
import Dashboard from "@/pages/dashboard";
import Analytics from "@/pages/dashboard/analytics";
import Solana from "@/pages/dashboard/solana";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing";
import AppDetails from "@/pages/dashboard/app-details";
import StatusPage from "@/pages/dashboard/status";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  const [location, setLocation] = useLocation();

  const isAuthRoute = location === "/login" || location === "/register";
  const isLandingRoute = location === "/";
  const isDashboardRoute = location.startsWith("/dashboard");

  // Redirect logic
  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      // Redirect to login if trying to access protected routes
      if (isDashboardRoute) {
        setLocation("/login");
      }
    } else {
      // Redirect to dashboard if authenticated and on auth pages
      if (isAuthRoute) {
        setLocation("/dashboard");
      }
    }
  }, [isAuthenticated, isLoading, location, setLocation]);

  // Protected route wrapper
  const ProtectedRoute = ({ component: Component, ...rest }: any) => {
    if (!isAuthenticated && !isLoading && isDashboardRoute) {
      return null; // or a loading spinner
    }
    return <Component {...rest} />;
  };

  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      
      {/* Protected routes */}
      <Route path="/dashboard">
        <ProtectedRoute component={Dashboard} />
      </Route>
      <Route path="/dashboard/analytics">
        <ProtectedRoute component={Analytics} />
      </Route>
      <Route path="/dashboard/solana">
        <ProtectedRoute component={Solana} />
      </Route>
      <Route path="/dashboard/status">
        <ProtectedRoute component={StatusPage} />
      </Route>
      <Route path="/dashboard/settings">
        <ProtectedRoute component={Dashboard} />
      </Route>
      <Route path="/dashboard/app/:appId">
        <ProtectedRoute component={AppDetails} />
      </Route>
      
      {/* Public routes */}
      <Route path="/" component={LandingPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Router />
    </QueryClientProvider>
  );
}

export default App;