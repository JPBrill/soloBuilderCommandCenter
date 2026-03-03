export interface VercelProject {
  id: string;
  name: string;
  framework: string | null;
  updatedAt: number;
  link: {
    type: string;
    repo: string;
    org: string;
  } | null;
  latestDeployments?: VercelDeployment[];
}

export interface VercelDeployment {
  uid: string;
  url: string;
  name: string;
  state: 'READY' | 'ERROR' | 'BUILDING' | 'CANCELED' | 'INITIALIZING';
  createdAt: number;
  creator: {
    uid: string;
    username: string;
  };
}

const VERCEL_API_URL = 'https://api.vercel.com';

export async function getVercelProjects() {
  const token = process.env.VERCEL_TOKEN;
  if (!token) {
    throw new Error('VERCEL_TOKEN is not configured');
  }

  const res = await fetch(`${VERCEL_API_URL}/v9/projects`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Vercel API Error: ${res.statusText}`);
  }

  const data = await res.json();
  return data.projects as VercelProject[];
}

export async function getVercelDeployments(projectId: string) {
  const token = process.env.VERCEL_TOKEN;
  if (!token) {
    throw new Error('VERCEL_TOKEN is not configured');
  }

  const res = await fetch(`${VERCEL_API_URL}/v6/deployments?projectId=${projectId}&limit=1`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Vercel API Error: ${res.statusText}`);
  }

  const data = await res.json();
  return data.deployments as VercelDeployment[];
}

export async function getEnrichedVercelProjects() {
  const projects = await getVercelProjects();
  
  const enrichedProjects = await Promise.all(
    projects.map(async (project) => {
      try {
        const deployments = await getVercelDeployments(project.id);
        return { ...project, latestDeployments: deployments };
      } catch (e) {
        console.error(`Failed to fetch deployments for project ${project.name}`, e);
        return { ...project, latestDeployments: [] };
      }
    })
  );

  return enrichedProjects;
}
