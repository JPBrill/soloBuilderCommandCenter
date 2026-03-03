import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getEnrichedVercelProjects } from "@/lib/vercel";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projects = await getEnrichedVercelProjects();
    return NextResponse.json(projects);
  } catch (error: any) {
    console.error("Vercel Projects Fetch Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch Vercel projects" },
      { status: 500 }
    );
  }
}
