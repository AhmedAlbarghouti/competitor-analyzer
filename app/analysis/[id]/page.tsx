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
	TrendingUp,
	Package,
	Compass,
	Rocket,
	BarChart,
	Shield,
	Search,
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

	console.log(analysis);

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
							<div className="space-y-6">
								{/* Summary Card */}
								{analysis.summary && (
									<Card>
										<CardHeader>
											<CardTitle className='text-lg'>Summary</CardTitle>
										</CardHeader>
										<CardContent>
											<p className='text-sm leading-relaxed'>{analysis.summary}</p>
										</CardContent>
									</Card>
								)}

								{/* Key Products & Direction */}
								<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
									{/* Flagship Products */}
									{analysis.flagship_product && (
										<Card>
											<CardHeader>
												<CardTitle className='text-lg'>Flagship Products</CardTitle>
											</CardHeader>
											<CardContent>
												<p className='text-sm leading-relaxed'>{analysis.flagship_product}</p>
											</CardContent>
										</Card>
									)}

									{/* Direction */}
									{analysis.direction && (
										<Card>
											<CardHeader>
												<CardTitle className='text-lg'>Direction</CardTitle>
											</CardHeader>
											<CardContent>
												<p className='text-sm leading-relaxed'>{analysis.direction}</p>
											</CardContent>
										</Card>
									)}
								</div>

								{/* New Launches & Sentiment */}
								<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
									{/* New Launches */}
									{analysis.new_launches && (
										<Card>
											<CardHeader>
												<CardTitle className='text-lg'>New Launches</CardTitle>
											</CardHeader>
											<CardContent>
												<p className='text-sm leading-relaxed'>{analysis.new_launches}</p>
											</CardContent>
										</Card>
									)}

									{/* Sentiment Summary */}
									{analysis.sentiment_summary && (
										<Card>
											<CardHeader>
												<CardTitle className='text-lg'>Sentiment Summary</CardTitle>
											</CardHeader>
											<CardContent>
												<p className='text-sm leading-relaxed'>{analysis.sentiment_summary}</p>
											</CardContent>
										</Card>
									)}
								</div>

								{/* Compliance */}
								{analysis.compliance && (
									<Card>
										<CardHeader>
											<CardTitle className='text-lg'>Compliance</CardTitle>
										</CardHeader>
										<CardContent>
											<p className='text-sm leading-relaxed'>{analysis.compliance}</p>
										</CardContent>
									</Card>
								)}

								{/* Unique Findings */}
								{analysis.unique_findings && (
									<Card>
										<CardHeader>
											<CardTitle className='text-lg'>Unique Findings</CardTitle>
										</CardHeader>
										<CardContent>
											<div className='text-sm leading-relaxed' 
												dangerouslySetInnerHTML={{ __html: analysis.unique_findings }}
											/>
										</CardContent>
									</Card>
								)}

								{/* Completed Date */}
								{analysis.completed_at && (
									<div className='flex items-center text-sm text-muted-foreground'>
										<Calendar className='h-3 w-3 mr-1' />
										<span>Completed on {formatDate(analysis.completed_at)}</span>
									</div>
								)}
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
}
