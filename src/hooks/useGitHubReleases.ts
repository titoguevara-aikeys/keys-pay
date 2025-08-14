import { useState, useEffect } from 'react';

interface GitHubRelease {
  id: number;
  tag_name: string;
  name: string;
  body: string;
  created_at: string;
  assets: {
    id: number;
    name: string;
    browser_download_url: string;
    size: number;
    content_type: string;
  }[];
}

export const useGitHubReleases = () => {
  const [releases, setReleases] = useState<GitHubRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        // Replace with your actual GitHub repo URL
        const response = await fetch('https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO_NAME/releases');
        
        if (!response.ok) {
          throw new Error('Failed to fetch releases');
        }
        
        const data = await response.json();
        setReleases(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchReleases();
  }, []);

  const getLatestAPK = () => {
    if (releases.length === 0) return null;
    
    const latestRelease = releases[0];
    const apkAsset = latestRelease.assets.find(asset => 
      asset.name.endsWith('.apk') && asset.name.includes('Release')
    ) || latestRelease.assets.find(asset => 
      asset.name.endsWith('.apk')
    );
    
    return apkAsset ? {
      name: apkAsset.name,
      url: apkAsset.browser_download_url,
      size: apkAsset.size,
      releaseDate: latestRelease.created_at,
      version: latestRelease.name
    } : null;
  };

  return {
    releases,
    loading,
    error,
    latestAPK: getLatestAPK()
  };
};