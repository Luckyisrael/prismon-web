import { useAuth } from "@/context/auth-context";
import { Link } from "wouter";
import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UserPlus, ChevronRight, Shield, Zap, Code, AppWindow, BarChart2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { motion } from "framer-motion";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function Register() {
  const { register, isLoading } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await register(values.email, values.password, values.confirmPassword);
      
      if (response.succeeded) {
        toast({
          title: "Registration Successful",
          description: "Your account has been created. Please log in.",
        });
      } else {
        toast({
          title: "Registration Failed",
          description: response.message || "Could not create account",
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
      {/* Left Side - Image and Description */}
      <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-primary/20 to-slate-900">
        <div className="absolute inset-0 z-0 bg-slate-950/80"></div>
        <div className="relative z-10 flex flex-col justify-center items-start p-12">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="space-y-8 max-w-lg"
          >
            <div className="flex items-center">
              <span className="text-primary text-3xl font-bold">Prismon</span>
              <span className="text-white text-3xl font-medium">Dashboard</span>
            </div>
            
            <h1 className="text-4xl font-bold text-white">Start building on Solana today</h1>
            
            <p className="text-lg text-slate-300">
              Join thousands of developers building innovative applications on Solana with our powerful tools and APIs.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/20 p-2 rounded-lg mt-1">
                  <AppWindow className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Create Apps</h3>
                  <p className="text-slate-400">Build and deploy multiple Solana apps with ease</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-primary/20 p-2 rounded-lg mt-1">
                  <Code className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Developer Tools</h3>
                  <p className="text-slate-400">Access APIs, SDKs, and comprehensive documentation</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-primary/20 p-2 rounded-lg mt-1">
                  <BarChart2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Detailed Analytics</h3>
                  <p className="text-slate-400">Track performance with real-time user analytics</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Right Side - Registration Form */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="w-full max-w-md"
        >
          <Card className="bg-slate-900 border-slate-800 shadow-xl">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl font-bold text-white">Create a new account</CardTitle>
              <CardDescription className="text-slate-400">
                Or{" "}
                <Link href="/login" className="font-medium text-primary hover:text-primary/90">
                  sign in to your account
                </Link>
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                            className="bg-slate-800 border-slate-700 text-white"
                            placeholder="email@example.com"
                            autoComplete="email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            className="bg-slate-800 border-slate-700 text-white"
                            placeholder="••••••••"
                            autoComplete="new-password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            className="bg-slate-800 border-slate-700 text-white"
                            placeholder="••••••••"
                            autoComplete="new-password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Create account"}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </Form>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800"></div>
                </div>
              
              </div>
              
          
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
