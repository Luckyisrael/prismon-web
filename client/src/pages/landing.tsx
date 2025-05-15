import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ChevronRight, 
  Zap, 
  Shield, 
  Database, 
  Globe, 
  Users, 
  Code,
  Check,
  ArrowRight,
  Copy,
  BookOpen,
  FileCode,
  TerminalSquare,
  UserPlus,
  ExternalLink
} from "lucide-react";

export default function LandingPage() {
  const [activePricingTab, setActivePricingTab] = useState<string>("monthly");
  
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const features = [
    {
      icon: <Shield className="h-10 w-10 text-primary" />,
      title: "Secure Wallet Authentication",
      description: "Built-in user authentication and management for your dApps."
    },
    {
      icon: <Zap className="h-10 w-10 text-primary" />,
      title: "Solana Integration",
      description: "Seamless integration with Solana blockchain and Other Solana Protocols"
    },
    {
      icon: <Database className="h-10 w-10 text-primary" />,
      title: "Decentralised Storage",
      description: "Easily store your data on the blockchain via walrus protocol"
    },
    {
      icon: <Database className="h-10 w-10 text-primary" />,
      title: "Artificial Intelligence ",
      description: "Easily bring in your favorite AI model into your dApps (HuggingFace or OpenAI)"
    },
    {
      icon: <Database className="h-10 w-10 text-primary" />,
      title: "Analytics Dashboard",
      description: "Real-time insights into your application performance."
    },
    {
      icon: <Code className="h-10 w-10 text-primary" />,
      title: "Developer DK",
      description: "Powerful SDK for seamless integration with your applications."
    }
  ];

  // Pricing plans
  const plans = {
    monthly: [
      {
        name: "Freemium",
        price: "$0",
        description: "For individuals and small projects",
        features: [
          "Unlimited applications",
          "10,000 API calls per month",
          "Basic analytics",
          "Email support"
        ],
        highlighted: false,
        buttonText: "Get Started",
        buttonVariant: "outline" as const
      },
      {
        name: "Premium",
        price: "$49",
        description: "For professional developers",
        features: [
          "Unlimited applications",
          "100,000 API calls per month",
          "Advanced analytics",
          "Priority support",
          "Custom domain",
          "Team collaboration"
        ],
        highlighted: true,
        buttonText: "Upgrade Now",
        buttonVariant: "default" as const
      },
      {
        name: "Enterprise",
        price: "Custom",
        description: "For large organizations",
        features: [
          "Unlimited applications",
          "Custom API call limits",
          "Dedicated support",
          "SLA guarantees",
          "Custom integrations",
          "On-premise deployment options"
        ],
        highlighted: false,
        buttonText: "Contact Sales",
        buttonVariant: "outline" as const
      }
    ],
    yearly: [
      {
        name: "Freemium",
        price: "$0",
        description: "For individuals and small projects",
        features: [
          "Unlimited applications",
          "10,000 API calls per month",
          "Basic analytics",
          "Email support"
        ],
        highlighted: false,
        buttonText: "Get Started",
        buttonVariant: "outline" as const
      },
      {
        name: "Premium",
        price: "$10",
        period: "/month",
        savings: "Save $120/year",
        description: "For professional developers",
        features: [
          "Unlimited applications",
          "100,000 API calls per month",
          "Advanced analytics",
          "Priority support",
          "Custom domain",
          "Team collaboration"
        ],
        highlighted: true,
        buttonText: "Upgrade Now",
        buttonVariant: "default" as const
      },
      {
        name: "Enterprise",
        price: "Custom",
        description: "For large organizations",
        features: [
          "Unlimited applications",
          "Custom API call limits",
          "Dedicated support",
          "SLA guarantees",
          "Custom integrations",
          "On-premise deployment options"
        ],
        highlighted: false,
        buttonText: "Contact Sales",
        buttonVariant: "outline" as const
      }
    ]
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      {/* Navigation */}
      <header className="fixed w-full top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="flex items-center">
            <span className="text-primary text-xl font-bold">Prismon</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#features" className="text-slate-300 hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="text-slate-300 hover:text-white transition-colors">Pricing</a>
            <a href="#testimonials" className="text-slate-300 hover:text-white transition-colors">Testimonials</a>
          </div>
          <div className="flex space-x-4">
            <Link href="/login">
              <Button variant="ghost" className="text-white">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="max-w-2xl"
            >
              <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
                Build, Deploy, and Scale Solana dApps with <span className="text-primary">Prismon</span>
              </h1>
              <p className="text-xl text-slate-400 mb-10">
                The complete developer platform for building high-performance decentralized applications 
                on the Solana blockchain. Simplify your development workflow.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto text-lg px-8">
                    Get Started <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <a href="#how-it-works">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8">
                    How It Works
                  </Button>
                </a>
              </div>
              <div className="flex items-center mt-8">
                <a href="#documentation" className="flex items-center text-primary hover:text-primary/80 transition-colors">
                  <BookOpen className="w-5 h-5 mr-2" />
                  <span>View Documentation</span>
                </a>
              </div>
            </motion.div>
            
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-semibold">Integrate in minutes</h3>
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
              </div>
              
              <div className="bg-slate-950 rounded-lg p-4 font-mono text-sm text-slate-300 mb-4 overflow-x-auto">
                <div className="text-slate-500 mb-2">// Initialize Prismon client</div>
                <div><span className="text-blue-400">const</span> prismon = <span className="text-yellow-400">new</span> <span className="text-green-400">CreatePrismonClient</span>{'({'}</div>
                <div className="ml-4"><span className="text-purple-400">apiKey</span>: <span className="text-green-400">"prs_dGRmNTY4M2JkZWY5MzQxYmZhOWU3YTY3NzFkYzA3NTE"</span>,</div>
                <div className="ml-4"><span className="text-purple-400">appId</span>: <span className="text-green-400">"app_7f4a1d25e6b74321c9b0"</span></div>
                <div>{'})'}</div>
                <div className="text-slate-500 mt-4 mb-2">// Make an API call</div>
                <div><span className="text-blue-400">const</span> result = <span className="text-blue-400">await</span> prismon.users.getAll();</div>
                <div>console.<span className="text-yellow-400">log</span>(result);</div>
              </div>
              
              <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
                <div className="flex justify-between mb-2 items-center">
                  <div className="text-slate-400 text-sm">Your API Details</div>
                  <div className="text-xs text-slate-500">Example Only</div>
                </div>
                <div className="mb-2">
                  <div className="text-xs text-slate-500 mb-1">API Key</div>
                  <div className="flex items-center bg-slate-950 rounded p-2 text-sm">
                    <code className="text-primary flex-1 overflow-x-auto">prs_dGRmNTY4M2JkZWY5MzQxYmZhOWU3YTY3NzFkYzA3NTE</code>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="text-xs text-slate-500 mb-1">App ID</div>
                  <div className="flex items-center bg-slate-950 rounded p-2 text-sm">
                    <code className="text-primary flex-1">app_7f4a1d25e6b74321c9b0</code>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-slate-900 px-4">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
              Get started with Prismon in three simple steps
            </p>
          </motion.div>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto"
          >
            <motion.div
              variants={fadeIn}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                <UserPlus className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Create an Account</h3>
              <p className="text-slate-400">
                Sign up for a free Prismon developer account to get started with our platform.
              </p>
            </motion.div>
            
            <motion.div
              variants={fadeIn}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                <FileCode className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Set Up Your App</h3>
              <p className="text-slate-400">
                Create a new app and get your API keys to integrate with our platform.
              </p>
            </motion.div>
            
            <motion.div
              variants={fadeIn}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                <TerminalSquare className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Start Building</h3>
              <p className="text-slate-400">
                Use our SDKs and tools to build powerful Solana applications with ease.
              </p>
            </motion.div>
          </motion.div>
          
          <div className="mt-12 text-center">
            <Button variant="outline" className="mt-8">
              <BookOpen className="mr-2 h-4 w-4" /> 
              Read the Documentation <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-900 px-4">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Powerful Features for Developers</h2>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
              Everything you need to build, deploy, and scale your Solana dApps efficiently.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-slate-800 rounded-xl p-6 transition-transform hover:scale-105"
              >
                <div className="bg-slate-700/50 p-3 rounded-lg w-fit mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
              Choose the plan that's right for you and your projects.
            </p>

            <div className="mt-8 flex justify-center">
              <Tabs defaultValue="monthly" value={activePricingTab} onValueChange={setActivePricingTab}>
                <TabsList className="bg-slate-800 border-slate-700 text-slate-400">
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="yearly">Yearly (20% off)</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans[activePricingTab as keyof typeof plans].map((plan, index) => (
              <Card key={index} 
                className={`relative overflow-hidden 
                  ${plan.highlighted 
                    ? 'bg-primary/10 border-primary' 
                    : 'bg-slate-900 border-slate-800'
                  }`}
              >
                {plan.highlighted && (
                  <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    MOST POPULAR
                  </div>
                )}
                
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-white">{plan.price}</span>
                  
                    {'period' in plan && <span className="text-slate-400">{plan.period}</span>}
                  </div>
              
                  {'savings' in plan && (
                     //@ts-ignore
                    <p className="text-primary font-medium text-sm mb-3">{plan.savings}</p>
                  )}
                  <p className="text-slate-400 mb-6">{plan.description}</p>
                  
                  <div className="mb-8">
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center text-slate-300">
                          <Check className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    variant={plan.buttonVariant}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-slate-900 px-4">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What Developers Are Saying</h2>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
              Join thousands of developers who trust Prismon for their Solana dApp needs.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {[
              {
                quote: "Prismon has drastically simplified our dApp development workflow. The dashboard provides all the insights we need to make informed decisions.",
                author: "Alex Johnson",
                role: "CTO, SolanaVerse"
              },
              {
                quote: "The analytics and user management features are top-notch. We've been able to scale our application much faster than expected.",
                author: "Sarah Chen",
                role: "Lead Developer, NFTLabs"
              },
              {
                quote: "As a solo developer, Prismon gives me enterprise-level tools at a fraction of the cost. Their support team is also incredibly responsive.",
                author: "Michael Rodriguez",
                role: "Independent Developer"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-slate-800 rounded-xl p-6"
              >
                <p className="text-slate-300 mb-6 italic">{testimonial.quote}</p>
                <div>
                  <p className="text-white font-medium">{testimonial.author}</p>
                  <p className="text-slate-400 text-sm">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="bg-gradient-to-r from-primary/20 to-primary/5 rounded-2xl p-8 md:p-12 max-w-5xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Build on Solana?</h2>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              Start building your decentralized applications today and join the future of blockchain development.
            </p>
            <Link href="/register">
              <Button size="lg" className="text-lg px-8">
                Start for Free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 border-t border-slate-800 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <span className="text-primary text-xl font-bold">Prismon</span>
                <span className="text-white text-xl font-medium">Dashboard</span>
              </div>
              <p className="text-slate-400 mb-4">
                Building the future of decentralized applications, one dApp at a time.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-slate-400 hover:text-primary">
                  <span className="sr-only">Twitter</span>
                  {/* Twitter icon */}
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="text-slate-400 hover:text-primary">
                  <span className="sr-only">GitHub</span>
                  {/* GitHub icon */}
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path>
                  </svg>
                </a>
                <a href="#" className="text-slate-400 hover:text-primary">
                  <span className="sr-only">Discord</span>
                  {/* Discord icon */}
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0
                    -.033-.1093.0757.0757 0 01.0776-.0049c3.9278 1.7933 8.18 1.7933 12.0614 0a.0758.0758 0 01.0785.0039.077.077 0 01-.0356.1099c-.598.3517-1.2202.6528-1.873.8932a.076.076 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.077.077 0 00.0841.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"></path>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-primary">Features</a></li>
                <li><a href="#" className="text-slate-400 hover:text-primary">Pricing</a></li>
                <li><a href="#" className="text-slate-400 hover:text-primary">Integrations</a></li>
                <li><a href="#" className="text-slate-400 hover:text-primary">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-primary">Documentation</a></li>
                <li><a href="#" className="text-slate-400 hover:text-primary">API Reference</a></li>
                <li><a href="#" className="text-slate-400 hover:text-primary">Tutorials</a></li>
                <li><a href="#" className="text-slate-400 hover:text-primary">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-primary">About</a></li>
                <li><a href="#" className="text-slate-400 hover:text-primary">Careers</a></li>
                <li><a href="#" className="text-slate-400 hover:text-primary">Contact</a></li>
                <li><a href="#" className="text-slate-400 hover:text-primary">Legal</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-800 text-center sm:text-left text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} Prismon, Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}