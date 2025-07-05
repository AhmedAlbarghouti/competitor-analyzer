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
import { Github } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function LoginPage() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const { signInWithProvider, user } = useAuth();
	const router = useRouter();

	// Redirect if already logged in
	React.useEffect(() => {
		if (user) {
			router.push('/dashboard');
		}
	}, [user, router]);



	const handleProviderSignIn = async (provider: "github") => {
		setLoading(true);
		setError("");

		const { error } = await signInWithProvider(provider);

		if (error) {
			setError(error.message);
		}

		setLoading(false);
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-background px-4'>
			<div className='fixed inset-0 pointer-events-none z-[-1] overflow-hidden'>
				<div className='absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-3xl animate-breathe'></div>
				<div
					className='absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-accent/15 to-primary/15 rounded-full blur-2xl animate-float'
					style={{ animationDelay: "3s" }}
				></div>
			</div>

			<Card className='w-full max-w-md'>
				<CardHeader className='text-center'>
					<CardTitle className='text-2xl font-bold'>Welcome Back</CardTitle>
					<CardDescription>
						Sign in to your Competition Radar account
					</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4'>
					<Button
						variant='outline'
						onClick={() => handleProviderSignIn("github")}
						disabled={loading}
						className='w-full'
					>
						<Github className='mr-2 h-4 w-4' />
						Continue with GitHub
					</Button>

					{error && (
						<div className='text-sm text-red-500 text-center'>{error}</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
