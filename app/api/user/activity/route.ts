import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getUserActivity } from "@/lib/github";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // @ts-ignore
    const accessToken = session.accessToken;
    // @ts-ignore
    const username = session.user.name; // In GitHub provider, name is often the login

    if (!accessToken) {
      return NextResponse.json({ error: "No access token found" }, { status: 401 });
    }

    // We need the actual login name. If session.user.name isn't it, we might need to fetch user profile first.
    // But usually with GitHub provider, it's available.
    const activity = await getUserActivity(accessToken, username);
    return NextResponse.json(activity);
  } catch (error: any) {
    console.error("Activity Fetch Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch activity" },
      { status: 500 }
    );
  }
}
