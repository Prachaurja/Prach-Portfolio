import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api",
});

export interface Repo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
}

export interface GithubStats {
  followers: number;
  public_repos: number;
  total_stars: number;
  top_repos: Repo[];
}

export const getGithubStats = (): Promise<GithubStats> =>
  api.get("/github/stats").then((r) => r.data);

export interface ContactPayload {
    name: string;
    email: string;
    message: string;
    website?: string; // honeypot
  }
  
  export const sendContact = (payload: ContactPayload) =>
    api.post("/contact/", payload).then((r) => r.data);