export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  open_issues_count: number;
  updated_at: string;
  language: string;
  default_branch: string;
}

export async function getUserRepos(accessToken: string): Promise<GitHubRepo[]> {
  const res = await fetch('https://api.github.com/user/repos?sort=updated&per_page=6&type=owner', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github.v3+json',
    },
    next: { revalidate: 60 } // Cache for 60 seconds
  });

  if (!res.ok) {
    throw new Error(`GitHub API Error: ${res.statusText}`);
  }

  return res.json();
}
