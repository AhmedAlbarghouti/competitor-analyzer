"use client";

import { AddDomainDialog } from "@/components/add-domain-dialog";
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
import { Calendar, ExternalLink, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Analysis {
	id: string;
	url: string;
	status: string;
	created_at: string;
}

export default function Dashboard() {
	const { user, loading } = useAuth();
	const router = useRouter();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [analyses, setAnalysis] = useState<Analysis[]>([]);
	const [loadingAnalysis, setLoadingAnalysis] = useState(true);

	useEffect(() => {
		if (!loading && !user) {
			router.push("/login");
		}
	}, [user, loading, router]);

	// Fetch user's analyses
	useEffect(() => {
		if (user) {
			fetchAnalysis();
		}
	}, [user]);

	const fetchAnalysis = async () => {
		try {
			const { data, error } = await supabase
				.from("analysis")
				.select("id, url, status, created_at")
				.order("created_at", { ascending: false });

			if (error) {
				console.error("Error fetching analyses:", error);
			} else {
				setAnalysis(data || []);
			}
		} catch (error) {
			console.error("Error:", error);
		} finally {
			setLoadingAnalysis(false);
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString();
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

	if (loading) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-background'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4'></div>
					<p className='text-muted-foreground'>Loading...</p>
				</div>
			</div>
		);
	}

	if (!user) {
		return null;
	}

	return (
		<div className='min-h-screen bg-background'>
			{/* Header */}
			<div className='border-b border-border'>
				<div className='max-w-4xl mx-auto px-4 py-6'>
					<div className='flex items-center justify-between'>
						<div>
							<h1 className='text-2xl font-semibold'>Dashboard</h1>
							<p className='text-muted-foreground text-sm'>
								Welcome back, {user.email}
							</p>
						</div>
						<Button
							onClick={() => setIsDialogOpen(true)}
							className='flex items-center'
						>
							New Analysis
							<Plus className='h-4 w-4 mr-2' />
						</Button>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className='max-w-4xl mx-auto px-4 py-8'>
				{/* Stats */}
				<div className='mb-8'>
					<Card>
						<CardHeader>
							<CardTitle className='text-lg'>Your Analysis</CardTitle>
							<CardDescription>
								Total analyses completed: {analyses.length}
							</CardDescription>
						</CardHeader>
					</Card>
				</div>

				{/* Analysis List */}
				<Card>
					<CardHeader>
						<CardTitle className='text-lg'>Recent Analysis</CardTitle>
						<CardDescription>
							View and manage your competitor analyses
						</CardDescription>
					</CardHeader>
					<CardContent>
						{loadingAnalysis ? (
							<div className='text-center py-8'>
								<div className='animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2'></div>
								<p className='text-sm text-muted-foreground'>
									Loading analyses...
								</p>
							</div>
						) : analyses.length === 0 ? (
							<div className='text-center py-8'>
								<p className='text-muted-foreground mb-4'>No analyses yet</p>
								<Button
									onClick={() => setIsDialogOpen(true)}
									variant='outline'
									className='flex items-center'
								>
									<Plus className='h-4 w-4 mr-2' />
									Create your first analysis
								</Button>
							</div>
						) : (
							<div className='space-y-4'>
								{analyses.map((analysis) => (
									<div
										key={analysis.id}
										className='flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors'
									>
										<div className='flex items-center space-x-4'>
											<Link href={`/analysis/${analysis.id}`}>
												<ExternalLink className='h-4 w-4 text-muted-foreground' />
											</Link>
											<div>
												<p className='font-medium'>{analysis.url}</p>
												<div className='flex items-center space-x-2 text-sm text-muted-foreground'>
													<Calendar className='h-3 w-3' />
													<span>{formatDate(analysis.created_at)}</span>
												</div>
											</div>
										</div>
										<div className='flex items-center space-x-2'>
											<span
												className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
													analysis.status
												)}`}
											>
												{analysis.status}
											</span>
										</div>
									</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			<AddDomainDialog
				open={isDialogOpen}
				onOpenChange={setIsDialogOpen}
				onSuccess={fetchAnalysis}
			/>
		</div>
	);
}
