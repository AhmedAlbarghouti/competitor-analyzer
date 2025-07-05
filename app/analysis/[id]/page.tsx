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
	Calendar,
	Check,
	Globe,
	Loader2,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Analysis {
	id: string;
	url: string;
	status: string;
	created_at: string;
	results: any; // We'll use any for now, but you might want to define a proper type
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
		<div className='min-h-screen bg-background p-6'>
			<div className='max-w-4xl mx-auto'>
				<Link href='/dashboard'>
					<Button variant='ghost' className='mb-6'>
						<ArrowLeft className='h-4 w-4 mr-2' />
						Back to Dashboard
					</Button>
				</Link>

				{analysis && (
					<>
						<div className='mb-6'>
							<h1 className='text-2xl font-semibold mb-2'>Analysis Details</h1>
							<div className='flex items-center gap-2'>
								<Globe className='h-4 w-4 text-muted-foreground' />
								<a
									href={
										analysis.url.startsWith("http")
											? analysis.url
											: `https://${analysis.url}`
									}
									target='_blank'
									rel='noopener noreferrer'
									className='text-blue-600 hover:underline'
								>
									{analysis.url}
								</a>
								<span
									className={`ml-2 px-2 py-1 rounded-full gap-2 text-xs font-medium flex items-center ${getStatusColor(
										analysis.status
									)}`}
								>
									<span className='ml-1'>{analysis.status}</span>
									{getStatusIcon(analysis.status)}
								</span>
							</div>
							<div className='flex items-center text-sm text-muted-foreground mt-1'>
								<Calendar className='h-3 w-3 mr-1' />
								<span>Created on {formatDate(analysis.created_at)}</span>
							</div>
						</div>

						{/* Conditional content based on status */}
						{analysis.status === "pending" && (
							<Card>
								<CardHeader>
									<CardTitle className='text-lg'>
										Analysis in Progress
									</CardTitle>
									<CardDescription>
										Your competitor analysis is being processed
									</CardDescription>
								</CardHeader>
								<CardContent className='flex flex-col items-center py-8'>
									<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4'></div>
									<p className='text-center text-muted-foreground'>
										This may take a few minutes. The page will automatically
										update when completed.
									</p>
									<Button
										onClick={() => fetchAnalysis()}
										variant='outline'
										className='mt-4'
									>
										Refresh Status
									</Button>
								</CardContent>
							</Card>
						)}

						{analysis.status === "failed" && (
							<Card className='border-red-200'>
								<CardHeader>
									<CardTitle className='text-lg text-red-600'>
										Analysis Failed
									</CardTitle>
									<CardDescription>
										We couldn't complete the analysis for this URL
									</CardDescription>
								</CardHeader>
								<CardContent>
									<p className='mb-4'>
										There was an issue processing your analysis request. This
										might be due to:
									</p>
									<ul className='list-disc pl-5 space-y-1 mb-6'>
										<li>The URL is invalid or inaccessible</li>
										<li>The website blocked our analysis tools</li>
										<li>A temporary system error occurred</li>
									</ul>
									<Button onClick={() => fetchAnalysis()}>
										Retry Analysis
									</Button>
								</CardContent>
							</Card>
						)}

						{analysis.status === "completed" && (
							<>
								<Card className='mb-6'>
									<CardHeader>
										<CardTitle className='text-lg'>Analysis Summary</CardTitle>
										<CardDescription>
											Overview of competitor website analysis
										</CardDescription>
									</CardHeader>
									<CardContent>
										{analysis.results ? (
											<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
												{/* This is a placeholder for actual analysis results */}
												<div className='p-4 border rounded-lg'>
													<h3 className='font-medium mb-2'>SEO Score</h3>
													<div className='text-2xl font-bold'>
														{analysis.results.seo_score || "N/A"}
													</div>
												</div>
												<div className='p-4 border rounded-lg'>
													<h3 className='font-medium mb-2'>Performance</h3>
													<div className='text-2xl font-bold'>
														{analysis.results.performance_score || "N/A"}
													</div>
												</div>
												<div className='p-4 border rounded-lg'>
													<h3 className='font-medium mb-2'>Keywords</h3>
													<div className='text-sm'>
														{analysis.results.top_keywords
															? analysis.results.top_keywords.join(", ")
															: "No keywords found"}
													</div>
												</div>
												<div className='p-4 border rounded-lg'>
													<h3 className='font-medium mb-2'>Technologies</h3>
													<div className='text-sm'>
														{analysis.results.technologies
															? analysis.results.technologies.join(", ")
															: "No technologies detected"}
													</div>
												</div>
											</div>
										) : (
											<p className='text-muted-foreground text-center py-4'>
												No detailed results available
											</p>
										)}
									</CardContent>
								</Card>

								{/* Additional detailed sections could go here */}
								<Card>
									<CardHeader>
										<CardTitle className='text-lg'>Detailed Analysis</CardTitle>
										<CardDescription>
											Comprehensive breakdown of competitor data
										</CardDescription>
									</CardHeader>
									<CardContent>
										{analysis.results ? (
											<div className='space-y-6'>
												{/* This section would be expanded with actual data */}
												<div>
													<h3 className='font-medium mb-2'>Content Analysis</h3>
													<p className='text-sm text-muted-foreground'>
														This would contain detailed content analysis from
														the competitor site.
													</p>
												</div>
												<div>
													<h3 className='font-medium mb-2'>Technical SEO</h3>
													<p className='text-sm text-muted-foreground'>
														This would contain technical SEO analysis details.
													</p>
												</div>
												<div>
													<h3 className='font-medium mb-2'>User Experience</h3>
													<p className='text-sm text-muted-foreground'>
														This would contain UX analysis details.
													</p>
												</div>
											</div>
										) : (
											<p className='text-muted-foreground text-center py-4'>
												Detailed analysis data is not available for this report.
											</p>
										)}
									</CardContent>
								</Card>
							</>
						)}
					</>
				)}
			</div>
		</div>
	);
}
