"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase/client";
import {
	AlertCircle,
	ArrowLeft,
	Award,
	Calendar,
	Check,
	Clock,
	Compass,
	ExternalLink,
	Eye,
	Globe,
	Loader2,
	Package,
	Rocket,
	Search,
	Shield,
	TrendingUp,
	Zap,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Analysis {
	id: string;
	url: string;
	status: string;
	created_at: string;
	completed_at?: string;
	summary?: string;
	flagship_product?: string;
	direction?: string;
	new_launches?: string;
	sentiment_summary?: string;
	compliance?: string;
	unique_findings?: string;
	user_id?: string;
}

export default function AnalysisPage() {
	const { user, loading: authLoading } = useAuth();
	const router = useRouter();
	const params = useParams();
	const id = params.id as string;

	const [analysis, setAnalysis] = useState<Analysis | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!authLoading && !user) {
			router.push("/login");
		}
	}, [user, authLoading, router]);

	useEffect(() => {
		if (user && id) {
			fetchAnalysis();
		}
	}, [user, id]);

	const fetchAnalysis = async () => {
		try {
			setLoading(true);
			// First, get the basic analysis data
			const { data, error } = await supabase
				.from("analysis")
				.select("*")
				.eq("id", id)
				.single();

			if (error) {
				throw error;
			}

			if (!data) {
				throw new Error("Analysis not found");
			}

			setAnalysis(data);
		} catch (err: any) {
			console.error("Error fetching analysis:", err);
			setError(err.message || "An error occurred while fetching the analysis");
		} finally {
			setLoading(false);
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString();
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "completed":
				return <Check className='h-5 w-5 text-green-600' />;
			case "pending":
				return <Loader2 className='h-5 w-5 text-yellow-600 animate-spin' />;
			case "failed":
				return <AlertCircle className='h-5 w-5 text-red-600' />;
			default:
				return null;
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "completed":
				return "text-green-600 bg-green-100";
			case "pending":
				return "text-yellow-600 bg-yellow-100";
			case "failed":
				return "text-red-600 bg-red-100";
			default:
				return "text-gray-600 bg-gray-100";
		}
	};

	if (authLoading || loading) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-background'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4'></div>
					<p className='text-muted-foreground'>Loading analysis...</p>
				</div>
			</div>
		);
	}

	if (!user) {
		return null;
	}

	if (error) {
		return (
			<div className='min-h-screen bg-background p-6'>
				<div className='max-w-4xl mx-auto'>
					<Link href='/dashboard'>
						<Button variant='ghost' className='mb-6'>
							<ArrowLeft className='h-4 w-4 mr-2' />
							Back to Dashboard
						</Button>
					</Link>

					<Card className='border-red-200'>
						<CardHeader>
							<CardTitle className='text-lg text-red-600'>Error</CardTitle>
						</CardHeader>
						<CardContent>
							<p>{error}</p>
							<Button onClick={() => fetchAnalysis()} className='mt-4'>
								Retry
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gradient-to-br from-background via-background to-muted/20'>
			{/* Background Effect */}
			<div className='fixed inset-0 pointer-events-none z-0 overflow-hidden'>
				<div className='absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl'></div>
				<div className='absolute bottom-40 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl'></div>
			</div>

			<div className='relative z-10 p-4 sm:p-6 lg:p-8'>
				<div className='max-w-7xl mx-auto'>
					{/* Header */}
					<div className='flex flex-col sm:flex-row sm:items-center justify-between mb-8'>
						<Link href='/dashboard'>
							<Button
								variant='ghost'
								className='mb-4 sm:mb-0 hover:bg-primary/5 transition-colors'
							>
								<ArrowLeft className='h-4 w-4 mr-2' />
								Back to Dashboard
							</Button>
						</Link>
					</div>

					{analysis?.status !== "completed" && (
						<Card>
							<CardContent className='text-center'>
								<p>Analysis is not completed yet</p>
								<p>It can take a bit....</p>
							</CardContent>
						</Card>
					)}
					{analysis?.status === "completed" && (
						<>
							{/* Hero Section */}
							<div className='mb-12'>
								<div className='text-center max-w-4xl mx-auto'>
									<div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-6'>
										<Search className='w-4 h-4' />
										Competitor Analysis Report
									</div>

									<h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent'>
										Analysis Results
									</h1>

									<div className='flex flex-col sm:flex-row items-center justify-center gap-4 mb-6'>
										<div className='flex items-center gap-2 px-4 py-2 bg-card rounded-full border shadow-sm'>
											<Globe className='h-4 w-4 text-muted-foreground' />
											<a
												href={
													analysis.url.startsWith("http")
														? analysis.url
														: `https://${analysis.url}`
												}
												target='_blank'
												rel='noopener noreferrer'
												className='text-blue-600 hover:underline font-medium flex items-center gap-1'
											>
												{analysis.url}
												<ExternalLink className='w-3 h-3' />
											</a>
										</div>

										<div
											className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(
												analysis.status
											)}`}
										>
											{getStatusIcon(analysis.status)}
											{analysis.status.charAt(0).toUpperCase() +
												analysis.status.slice(1)}
										</div>
									</div>

									<div className='flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground'>
										<div className='flex items-center gap-1'>
											<Calendar className='h-3 w-3' />
											Created {formatDate(analysis.created_at)}
										</div>
										{analysis.completed_at && (
											<div className='flex items-center gap-1'>
												<Clock className='h-3 w-3' />
												Completed {formatDate(analysis.completed_at)}
											</div>
										)}
									</div>
								</div>
							</div>

							{/* Conditional content based on status */}
							{analysis.status === "pending" && (
								<div className='max-w-2xl mx-auto'>
									<Card className='border-2 border-dashed border-yellow-200 bg-yellow-50/50'>
										<CardContent className='flex flex-col items-center py-12 text-center'>
											<div className='w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6'>
												<Loader2 className='h-8 w-8 text-yellow-600 animate-spin' />
											</div>
											<h3 className='text-xl font-semibold mb-2'>
												Analysis in Progress
											</h3>
											<p className='text-muted-foreground mb-6 max-w-md'>
												Our AI is analyzing the competitor website. This
												typically takes 2-5 minutes depending on the site
												complexity.
											</p>
											<Button
												onClick={() => fetchAnalysis()}
												variant='outline'
												className='hover:bg-yellow-50'
											>
												<Clock className='w-4 h-4 mr-2' />
												Check Status
											</Button>
										</CardContent>
									</Card>
								</div>
							)}

							{analysis.status === "failed" && (
								<div className='max-w-2xl mx-auto'>
									<Card className='border-2 border-red-200 bg-red-50/50'>
										<CardContent className='text-center py-12'>
											<div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6'>
												<AlertCircle className='h-8 w-8 text-red-600' />
											</div>
											<h3 className='text-xl font-semibold text-red-900 mb-2'>
												Analysis Failed
											</h3>
											<p className='text-red-700 mb-6'>
												We encountered an issue analyzing this website. This
												could be due to access restrictions or technical issues.
											</p>
											<Button
												onClick={() => fetchAnalysis()}
												className='bg-red-600 hover:bg-red-700'
											>
												<Zap className='w-4 h-4 mr-2' />
												Retry Analysis
											</Button>
										</CardContent>
									</Card>
								</div>
							)}

							{analysis.status === "completed" && (
								<div className='space-y-8'>
									{/* Summary Hero Card */}
									{analysis.summary && (
										<Card className='border-2 hover:border-primary/30 transition-colors overflow-hidden'>
											<div className='bg-gradient-to-r from-primary/5 to-secondary/5 p-6'>
												<CardHeader className='p-0'>
													<div className='flex items-center gap-3 mb-3'>
														<div className='w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center'>
															<Eye className='w-5 h-5 text-primary' />
														</div>
														<div>
															<CardTitle className='text-2xl'>
																Executive Summary
															</CardTitle>
															<CardDescription className='text-base'>
																Key insights about this competitor
															</CardDescription>
														</div>
													</div>
												</CardHeader>
											</div>
											<CardContent className='p-6'>
												<p className='text-base leading-relaxed text-foreground/90'>
													{analysis.summary}
												</p>
											</CardContent>
										</Card>
									)}

									{/* Key Insights Grid */}
									<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
										{/* Flagship Products */}
										{analysis.flagship_product && (
											<Card className='group border-2 hover:border-primary/30 transition-all duration-200'>
												<CardHeader>
													<div className='flex items-center gap-3'>
														<div className='w-10 h-10 bg-gradient-to-br from-blue-500/10 to-blue-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform'>
															<Package className='w-5 h-5 text-blue-600' />
														</div>
														<div>
															<CardTitle className='text-xl'>
																Flagship Products
															</CardTitle>
															<CardDescription>
																Main offerings and services
															</CardDescription>
														</div>
													</div>
												</CardHeader>
												<CardContent>
													<p className='text-base leading-relaxed'>
														{analysis.flagship_product}
													</p>
												</CardContent>
											</Card>
										)}

										{/* Strategic Direction */}
										{analysis.direction && (
											<Card className='group border-2 hover:border-primary/30 transition-all duration-200'>
												<CardHeader>
													<div className='flex items-center gap-3'>
														<div className='w-10 h-10 bg-gradient-to-br from-purple-500/10 to-purple-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform'>
															<Compass className='w-5 h-5 text-purple-600' />
														</div>
														<div>
															<CardTitle className='text-xl'>
																Strategic Direction
															</CardTitle>
															<CardDescription>
																Company focus and positioning
															</CardDescription>
														</div>
													</div>
												</CardHeader>
												<CardContent>
													<p className='text-base leading-relaxed'>
														{analysis.direction}
													</p>
												</CardContent>
											</Card>
										)}
									</div>

									{/* Innovation & Market Grid */}
									<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
										{/* New Launches */}
										{analysis.new_launches && (
											<Card className='group border-2 hover:border-primary/30 transition-all duration-200'>
												<CardHeader>
													<div className='flex items-center gap-3'>
														<div className='w-10 h-10 bg-gradient-to-br from-green-500/10 to-green-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform'>
															<Rocket className='w-5 h-5 text-green-600' />
														</div>
														<div>
															<CardTitle className='text-xl'>
																Recent Launches
															</CardTitle>
															<CardDescription>
																New products and initiatives
															</CardDescription>
														</div>
													</div>
												</CardHeader>
												<CardContent>
													<p className='text-base leading-relaxed'>
														{analysis.new_launches}
													</p>
												</CardContent>
											</Card>
										)}

										{/* Market Sentiment */}
										{analysis.sentiment_summary && (
											<Card className='group border-2 hover:border-primary/30 transition-all duration-200'>
												<CardHeader>
													<div className='flex items-center gap-3'>
														<div className='w-10 h-10 bg-gradient-to-br from-orange-500/10 to-orange-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform'>
															<TrendingUp className='w-5 h-5 text-orange-600' />
														</div>
														<div>
															<CardTitle className='text-xl'>
																Market Sentiment
															</CardTitle>
															<CardDescription>
																Brand perception and tone
															</CardDescription>
														</div>
													</div>
												</CardHeader>
												<CardContent>
													<p className='text-base leading-relaxed'>
														{analysis.sentiment_summary}
													</p>
												</CardContent>
											</Card>
										)}
									</div>

									{/* Additional Insights */}
									<div className='space-y-6'>
										{/* Compliance */}
										{analysis.compliance && (
											<Card className='border-2 hover:border-primary/30 transition-colors'>
												<CardHeader>
													<div className='flex items-center gap-3'>
														<div className='w-10 h-10 bg-gradient-to-br from-red-500/10 to-red-600/20 rounded-xl flex items-center justify-center'>
															<Shield className='w-5 h-5 text-red-600' />
														</div>
														<div>
															<CardTitle className='text-xl'>
																Regulatory & Compliance
															</CardTitle>
															<CardDescription>
																Legal positioning and compliance posture
															</CardDescription>
														</div>
													</div>
												</CardHeader>
												<CardContent>
													<p className='text-base leading-relaxed'>
														{analysis.compliance}
													</p>
												</CardContent>
											</Card>
										)}

										{/* Unique Findings */}
										{analysis.unique_findings && (
											<Card className='border-2 hover:border-primary/30 transition-colors'>
												<CardHeader>
													<div className='flex items-center gap-3'>
														<div className='w-10 h-10 bg-gradient-to-br from-indigo-500/10 to-indigo-600/20 rounded-xl flex items-center justify-center'>
															<Award className='w-5 h-5 text-indigo-600' />
														</div>
														<div>
															<CardTitle className='text-xl'>
																Unique Insights
															</CardTitle>
															<CardDescription>
																Special findings and competitive advantages
															</CardDescription>
														</div>
													</div>
												</CardHeader>
												<CardContent>
													<div
														className='text-base leading-relaxed prose prose-sm max-w-none'
														dangerouslySetInnerHTML={{
															__html: analysis.unique_findings,
														}}
													/>
												</CardContent>
											</Card>
										)}
									</div>

									{/* Footer */}
									<div className='text-center pt-8 border-t border-border'>
										<p className='text-sm text-muted-foreground'>
											Analysis powered by AI • Generated on{" "}
											{formatDate(analysis.completed_at || analysis.created_at)}
										</p>
									</div>
								</div>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	);
}
