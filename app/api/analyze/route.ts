import { createAdminClient, createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		// Use regular client for authentication
		const supabase = await createClient();

		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const { domain } = body;

		if (!domain) {
			return NextResponse.json(
				{ error: "Domain is required" },
				{ status: 400 }
			);
		}

		console.log("Authenticated user:", user.email);
		console.log("Domain to analyze:", domain);

		// Get admin client to bypass RLS policies
		const adminClient = await createAdminClient();

		// Use the table name from your SQL schema: 'analyses' not 'analysis'
		const { data: analysisData, error: insertError } = await adminClient
			.from("analysis")
			.insert({
				user_id: user.id,
				url: domain, // Using the domain as the URL
				status: "pending",
			})
			.select()
			.single();

		console.log("Analysis record inserted:", insertError);
		if (insertError) {
			console.error("Error inserting analysis record:", insertError);
			return NextResponse.json(
				{ error: "Failed to create analysis record" },
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{
				message: "Analysis started successfully",
				domain,
				analysisId: analysisData.id,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error in /api/analyze:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
