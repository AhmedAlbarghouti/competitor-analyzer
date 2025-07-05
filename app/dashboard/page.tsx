"use client";

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Globe, Plus, TrendingUp } from 'lucide-react';
import { AddDomainDialog } from '@/components/add-domain-dialog';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/5 to-secondary/5 rounded-full blur-3xl animate-breathe"></div>
        <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Header */}
      <div className="border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground mt-1">Welcome back, {user.email}</p>
            </div>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Analysis
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">No analyses yet</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Competitors Tracked</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Start tracking competitors</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Insights Generated</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Run your first analysis</p>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started */}
        <Card>
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Start analyzing your competitors in just a few clicks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">1. Add Competitor URLs</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Enter up to 3 competitor websites you want to analyze
                </p>
                <Button variant="outline" size="sm">
                  Add Competitors
                </Button>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">2. Run Analysis</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Let our AI analyze their content, pricing, and strategies
                </p>
                <Button variant="outline" size="sm" disabled>
                  Run Analysis
                </Button>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">3. View Insights</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get actionable insights to improve your competitive position
                </p>
                <Button variant="outline" size="sm" disabled>
                  View Reports
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <AddDomainDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
      />
    </div>
  );
}