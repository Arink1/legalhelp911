import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The handoff cut the practice list from ten to five and renamed two of
  // the survivors. Redirect the retired slugs rather than leaving 404s.
  async redirects() {
    return [
      { source: "/practice/injury", destination: "/practice/personal-injury", permanent: true },
      { source: "/practice/family-divorce", destination: "/practice/family-law", permanent: true },
      { source: "/practice/immigration", destination: "/practice", permanent: true },
      { source: "/practice/employment", destination: "/practice", permanent: true },
      { source: "/practice/bankruptcy", destination: "/practice", permanent: true },
      { source: "/practice/workers-compensation", destination: "/practice", permanent: true },
      { source: "/practice/real-estate", destination: "/practice", permanent: true },
      { source: "/practice/wills-estates", destination: "/practice", permanent: true },
      { source: "/careers", destination: "/contact", permanent: true },
      { source: "/news/category/careers", destination: "/news", permanent: true },
    ];
  },
};

export default nextConfig;
