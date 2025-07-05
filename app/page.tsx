import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Globe, Search, TrendingUp, Users, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl animate-breathe"></div>
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-accent/30 to-primary/30 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-secondary/25 to-accent/25 rounded-full blur-3xl animate-breathe" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-[400px] h-[400px] bg-gradient-to-r from-primary/15 to-accent/15 rounded-full blur-2xl animate-float" style={{ animationDelay: '6s' }}></div>
      </div>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Competitor Analyzer
            </h1>
            <p className="text-xl md:text-2xl text-primary font-medium mb-6">
              Analyze competitors. Discover insights. Stay ahead.
            </p>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Competitor Analyzer empowers you to analyze competitor websites and gain actionable insights. Streamline your competitive intelligence with deep web crawling, real-time brand, and sentiment analysis—all in one intuitive platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-3" asChild>
                <Link href="/signup">Get Started Free</Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to stay ahead of your competition with comprehensive analysis and actionable insights.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <Globe className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Multi-Site Analysis</CardTitle>
                <CardDescription>
                  Analyze up to three competitor websites simultaneously for comprehensive insights.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <Search className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Deep Web Crawling</CardTitle>
                <CardDescription>
                  Advanced website and content analysis to uncover hidden opportunities.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Sentiment Analysis</CardTitle>
                <CardDescription>
                  Real-time brand and sentiment insights from social media platforms.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Intuitive Dashboard</CardTitle>
                <CardDescription>
                  Beautiful, actionable results presented in an easy-to-understand format.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <Zap className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Real-Time Updates</CardTitle>
                <CardDescription>
                  Stay informed with live updates on competitor activities and market changes.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Team Collaboration</CardTitle>
                <CardDescription>
                  Share insights and collaborate with your team for better decision making.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started with competitor analysis in just three simple steps.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Enter Competitor URLs</h3>
              <p className="text-muted-foreground">
                Simply input up to three competitor website URLs that you want to analyze.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
              <p className="text-muted-foreground">
                Our advanced AI crawls and analyzes the websites, extracting key insights and data.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Insights</h3>
              <p className="text-muted-foreground">
                Receive comprehensive reports with actionable insights to improve your strategy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of businesses already using Competitor Analyzer to stay ahead of the competition.
          </p>
          <Button size="lg" className="text-lg px-8 py-3" asChild>
            <Link href="/signup">Start Your Free Trial</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 Competitor Analyzer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

