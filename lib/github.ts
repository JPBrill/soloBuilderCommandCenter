export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  open_issues_count: number;
  open_prs_count?: number;
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
    next: { revalidate: 60 }
  });

  if (!res.ok) {
    throw new Error(`GitHub API Error: ${res.statusText}`);
  }

  const repos = await res.json();

  // Enrich with PR counts using Search API (parallel requests)
  // Note: Search API has lower rate limits (30/min), so we limit this to the top 6 repos
  const enrichedRepos = await Promise.all(
    repos.map(async (repo: GitHubRepo) => {
      try {
        const prRes = await fetch(
          `https://api.github.com/search/issues?q=repo:${repo.full_name}+is:pr+is:open`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: 'application/vnd.github.v3+json',
            },
            next: { revalidate: 60 }
          }
        );
        
        if (prRes.ok) {
          const prData = await prRes.json();
          return { ...repo, open_prs_count: prData.total_count };
        }
        return { ...repo, open_prs_count: 0 };
      } catch (e) {
        console.error(`Failed to fetch PRs for ${repo.name}`, e);
        return { ...repo, open_prs_count: 0 };
      }
    })
  );

  return enrichedRepos;
}
