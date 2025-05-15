import { useAuth } from "@/context/auth-context";
import { Link } from "wouter";
import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, ChevronRight, Shield, Zap, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { motion } from "framer-motion";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export default function Login() {
  const { login, isLoading } = useAuth();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await login(values.email, values.password);
      
      if (!response.succeeded) {
        toast({
          title: "Login Failed",
          description: response.message || "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };
  
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-950">
      {/* Left Side - Branding and Features */}
      <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-primary/20 to-slate-900">
        <div className="absolute inset-0 z-0 bg-slate-950/80"></div>
        <div className="relative z-10 flex flex-col justify-center items-start p-12">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="space-y-8 max-w-lg"
          >
            <div className="flex items-center gap-2">
              <Lock className="h-6 w-6 text-primary" />
              <span className="text-primary text-3xl font-bold">Prismon</span>
              <span className="text-white text-3xl font-medium">Dashboard</span>
            </div>
            
            <h1 className="text-4xl font-bold text-white">Welcome back to your development journey</h1>
            
            <p className="text-lg text-slate-300">
              Access your projects, track user analytics, and manage your Solana applications all in one place.
            </p>
            
            <div className="space-y-4">
              {[
                {
                  icon: <Shield className="h-5 w-5 text-primary" />,
                  title: "Secure Authentication",
                  description: "Enterprise-grade security for your development account"
                },
                {
                  icon: <Database className="h-5 w-5 text-primary" />,
                  title: "Centralized Management",
                  description: "Manage all your apps and API keys in one dashboard"
                },
                {
                  icon: <Zap className="h-5 w-5 text-primary" />,
                  title: "Real-time Analytics",
                  description: "Monitor usage and performance across your applications"
                }
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="bg-primary/20 p-2 rounded-lg mt-1">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{feature.title}</h3>
                    <p className="text-slate-400">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Right Side - Login Form */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="w-full max-w-md"
        >
          <Card className="bg-slate-900 border-slate-800 shadow-xl">
            <CardHeader className="space-y-2">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                <CardTitle className="text-2xl font-bold text-white">Sign in to your account</CardTitle>
              </div>
              <CardDescription className="text-slate-400">
                Don't have an account?{" "}
                <Link href="/register" className="font-medium text-primary hover:text-primary/90">
                  Create one now
                </Link>
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            className="bg-slate-800 border-slate-700 text-white focus:ring-primary focus:border-primary"
                            placeholder="email@example.com"
                            autoComplete="email"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel className="text-slate-300">Password</FormLabel>
                          <Link href="#" className="text-xs text-primary hover:text-primary/90">
                            Forgot password?
                          </Link>
                        </div>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            className="bg-slate-800 border-slate-700 text-white focus:ring-primary focus:border-primary"
                            placeholder="••••••••"
                            autoComplete="current-password"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full mt-6" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        Sign in <ChevronRight className="ml-2 h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </form>
              </Form>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-slate-900 px-2 text-slate-500">Or continue with</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700 hover:text-white">
                  GitHub
                </Button>
                <Button variant="outline" className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700 hover:text-white">
                  Google
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}