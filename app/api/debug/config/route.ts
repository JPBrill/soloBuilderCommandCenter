import { NextResponse } from "next/server";

export async function GET() {
  const hasGithubId = !!process.env.GITHUB_ID;
  const hasGithubSecret = !!process.env.GITHUB_SECRET;
  const hasNextAuthSecret = !!process.env.NEXTAUTH_SECRET;
  const appUrl = process.env.APP_URL;

  return NextResponse.json({
    hasGithubId,
    hasGithubSecret,
    hasNextAuthSecret,
    appUrl,
    callbackUrl: `${appUrl}/api/auth/callback/github`
  });
}
