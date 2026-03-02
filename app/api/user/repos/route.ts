import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getUserRepos } from "@/lib/github";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // @ts-ignore
    const accessToken = session.accessToken;

    if (!accessToken) {
      return NextResponse.json({ error: "No access token found" }, { status: 401 });
    }

    const repos = await getUserRepos(accessToken);
    return NextResponse.json(repos);
  } catch (error: any) {
    console.error("Repo Fetch Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch repositories" },
      { status: 500 }
    );
  }
}
