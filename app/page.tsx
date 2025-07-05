import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { BarChart3, Globe, Search, TrendingUp, Users, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
	return (
		<div className='min-h-screen bg-background'>
			<Navbar />

			{/* Enhanced Animated Background */}
			<div className='fixed inset-0 pointer-events-none z-[-1] overflow-hidden'>
				{/* Main gradient orbs */}
				<div className='absolute top-20 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-gradient-to-r from-primary/10 via-secondary/15 to-accent/10 rounded-full blur-3xl animate-breathe'></div>
				<div
					className='absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl animate-float'
					style={{ animationDelay: "2s" }}
				></div>
				<div
					className='absolute bottom-1/4 right-1/4 w-[800px] h-[800px] bg-gradient-to-tl from-secondary/15 to-transparent rounded-full blur-3xl animate-breathe'
					style={{ animationDelay: "4s" }}
				></div>

				{/* Grid pattern overlay */}
				<div className='absolute inset-0 bg-grid-pattern opacity-[0.02]'></div>
			</div>

			{/* Hero Section */}
			<section className='relative min-h-screen flex items-center justify-center px-4'>
				<div className='max-w-7xl mx-auto text-center'>
					<div className='max-w-4xl mx-auto space-y-8'>
						{/* Badge */}
						<div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/20 text-sm font-medium text-primary mb-8 backdrop-blur-sm'>
							<div className='w-2 h-2 bg-primary rounded-full animate-pulse'></div>
							100% Free Competitor Analysis Tool for Now ...
						</div>

						{/* Main heading with enhanced styling */}
						<div className='relative flex flex-col items-center'>
							<h1 className='text-6xl md:text-8xl lg:text-9xl font-black tracking-tight mb-8'>
								<span className='block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient'>
									Competition
								</span>
								<span
									className='block bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent animate-gradient'
									style={{ animationDelay: "0.5s" }}
								>
									Radar
								</span>
							</h1>
							{/* Glowing effect behind text */}
							<div className='absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl opacity-30 animate-pulse'></div>
						</div>

						{/* Tagline */}
						<div className='flex flex-col items-center space-y-6'>
							<p className='text-2xl md:text-3xl lg:text-4xl font-bold text-foreground'>
								Analyze. Discover. Dominate.
							</p>
							<p className='text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed text-center'>
								Unlock your competitive edge with AI-powered website analysis.
								Get deep insights into competitor strategies, content, and
								market positioning—completely free.
							</p>
						</div>

						{/* CTA Buttons with clean styling */}
						<div className='flex flex-col sm:flex-row gap-6 justify-center items-center pt-8 relative z-10'>
							<Button
								size='lg'
								className='text-lg px-10 py-6 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300'
								asChild
							>
								<Link href='/signup'>
									<span className='relative z-10'>Start Analyzing - Free</span>
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section
				id='features'
				className='py-20 px-4 scroll-mt-16 bg-gradient-to-b from-background to-muted/20'
			>
				<div className='max-w-7xl mx-auto'>
					<div className='flex flex-col items-center text-center mb-16'>
						<div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/20 text-sm font-medium text-primary mb-6'>
							<Zap className='w-4 h-4' />
							Powerful Features
						</div>
						<h2 className='text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent'>
							Everything You Need to Win
						</h2>
						<p className='text-xl text-muted-foreground max-w-3xl leading-relaxed'>
							Comprehensive competitor analysis tools designed to give you the
							competitive edge you need to dominate your market.
						</p>
					</div>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
						<Card className='group border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:scale-105'>
							<CardHeader className='flex flex-col items-center text-center p-8'>
								<div className='w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform'>
									<Globe className='h-10 w-10 text-primary' />
								</div>
								<CardTitle className='text-2xl mb-4'>
									Multi-Site Analysis
								</CardTitle>
								<CardDescription className='text-base leading-relaxed'>
									Analyze multiple competitor websites simultaneously for
									comprehensive insights across your entire competitive
									landscape.
								</CardDescription>
							</CardHeader>
						</Card>
						<Card className='group border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:scale-105'>
							<CardHeader className='flex flex-col items-center text-center p-8'>
								<div className='w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform'>
									<Search className='h-10 w-10 text-primary' />
								</div>
								<CardTitle className='text-2xl mb-4'>
									Deep Web Crawling
								</CardTitle>
								<CardDescription className='text-base leading-relaxed'>
									Advanced AI-powered website analysis that uncovers hidden
									opportunities and competitive advantages your rivals don't
									see.
								</CardDescription>
							</CardHeader>
						</Card>
						<Card className='group border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:scale-105'>
							<CardHeader className='flex flex-col items-center text-center p-8'>
								<div className='w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform'>
									<TrendingUp className='h-10 w-10 text-primary' />
								</div>
								<CardTitle className='text-2xl mb-4'>
									Sentiment Analysis
								</CardTitle>
								<CardDescription className='text-base leading-relaxed'>
									Real-time brand sentiment monitoring from social media and web
									mentions to understand public perception.
								</CardDescription>
							</CardHeader>
						</Card>
						<Card className='group border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:scale-105'>
							<CardHeader className='flex flex-col items-center text-center p-8'>
								<div className='w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform'>
									<BarChart3 className='h-10 w-10 text-primary' />
								</div>
								<CardTitle className='text-2xl mb-4'>
									Intuitive Dashboard
								</CardTitle>
								<CardDescription className='text-base leading-relaxed'>
									Beautiful, actionable insights presented in crystal-clear
									visualizations that make complex data easy to understand.
								</CardDescription>
							</CardHeader>
						</Card>
						<Card className='group border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:scale-105'>
							<CardHeader className='flex flex-col items-center text-center p-8'>
								<div className='w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform'>
									<Zap className='h-10 w-10 text-primary' />
								</div>
								<CardTitle className='text-2xl mb-4'>
									Real-Time Updates
								</CardTitle>
								<CardDescription className='text-base leading-relaxed'>
									Stay ahead with instant notifications about competitor
									changes, new launches, and market shifts as they happen.
								</CardDescription>
							</CardHeader>
						</Card>
						<Card className='border-2 hover:border-primary/30 transition-colors duration-200'>
							<CardHeader className='text-center p-8'>
								<div className='w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6'>
									<Users className='h-10 w-10 text-primary' />
								</div>
								<CardTitle className='text-2xl mb-4'>
									Team Collaboration
								</CardTitle>
								<CardDescription className='text-base leading-relaxed'>
									Share insights seamlessly with your team and collaborate on
									strategic decisions with built-in sharing tools.
								</CardDescription>
							</CardHeader>
						</Card>
					</div>
				</div>
			</section>

			{/* How It Works Section */}
			<section
				id='how-it-works'
				className='py-20 px-4 bg-gradient-to-b from-muted/20 to-background scroll-mt-16'
			>
				<div className='max-w-7xl mx-auto'>
					<div className='flex flex-col items-center text-center mb-16'>
						<div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/20 text-sm font-medium text-primary mb-6'>
							<BarChart3 className='w-4 h-4' />
							Simple Process
						</div>
						<h2 className='text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent'>
							How It Works
						</h2>
						<p className='text-xl text-muted-foreground max-w-3xl leading-relaxed'>
							Get powerful competitor insights in just three simple steps. No
							complex setup, no learning curve—just instant analysis.
						</p>
					</div>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-12'>
						<div className='text-center group relative'>
							<div className='relative mb-8'>
								<div className='w-24 h-24 bg-gradient-to-br from-primary via-primary/90 to-secondary rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto shadow-xl'>
									1
								</div>
							</div>
							<h3 className='text-2xl font-bold mb-4'>Enter URLs</h3>
							<p className='text-muted-foreground text-lg leading-relaxed'>
								Simply paste the competitor website URLs you want to analyze.
								Our system handles the rest automatically.
							</p>
						</div>
						<div className='text-center group relative'>
							<div className='relative mb-8'>
								<div className='w-24 h-24 bg-gradient-to-br from-primary via-primary/90 to-secondary rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto shadow-xl'>
									2
								</div>
							</div>
							<h3 className='text-2xl font-bold mb-4'>AI Analysis</h3>
							<p className='text-muted-foreground text-lg leading-relaxed'>
								Our advanced AI crawls and analyzes every aspect of your
								competitors' websites and strategies.
							</p>
						</div>
						<div className='text-center group relative'>
							<div className='relative mb-8'>
								<div className='w-24 h-24 bg-gradient-to-br from-primary via-primary/90 to-secondary rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto shadow-xl'>
									3
								</div>
							</div>
							<h3 className='text-2xl font-bold mb-4'>Get Insights</h3>
							<p className='text-muted-foreground text-lg leading-relaxed'>
								Receive comprehensive reports with actionable insights to
								dominate your competitive landscape.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Final CTA Section */}
			<section className='py-20 px-4 bg-gradient-to-br from-primary/5 to-secondary/5'>
				<div className='absolute inset-0 bg-grid-pattern opacity-[0.01]'></div>
				<div className='max-w-5xl mx-auto text-center relative z-10'>
					<div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-8'>
						<Globe className='w-4 h-4' />
						100% Free Forever. For now ...
					</div>
					<h2 className='text-4xl md:text-6xl font-bold mb-6 '>
						Ready to Dominate Your Market?
					</h2>
					<p className='text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed'>
						Join thousands of businesses using Competition Radar to gain the
						competitive edge. Start your first analysis in seconds—no credit
						card required, no hidden fees.
					</p>
					<div className='flex flex-col gap-6 justify-center items-center'>
						<Button
							size='lg'
							className='text-xl px-12 py-6 shadow-lg relative z-10'
							asChild
						>
							<Link href='/signup'>Start Free Analysis</Link>
						</Button>
						<div className='text-sm text-muted-foreground'>
							✓ No setup required ✓ Instant results ✓ Always free
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className='border-t border-border py-8 px-4'>
				<div className='max-w-7xl mx-auto text-center text-muted-foreground'>
					<p>&copy; 2024 Competition Radar. All rights reserved.</p>
				</div>
			</footer>
		</div>
	);
}
