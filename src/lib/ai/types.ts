export type WebsiteType =
  | "Landing page"
  | "Marketing site"
  | "Web app dashboard"
  | "Blog"
  | "Ecommerce (basic)"
  | "Other";

export type RenderingPref = "Static" | "SPA" | "SSR";
export type FrontendStack = "Next.js + TypeScript" | "React + Vite" | "Other";
export type BackendStack = "None" | "Next API routes" | "Node (Express)" | "Python (FastAPI)";
export type DatabaseChoice = "None" | "Postgres" | "SQLite";
export type AuthChoice = "None" | "Email+Password" | "OAuth";
export type StylingChoice = "Tailwind" | "CSS Modules";
export type DeploymentChoice = "Vercel" | "Netlify" | "Docker" | "Other";

export type BuildConfig = {
  websiteType: WebsiteType | string;
  rendering: RenderingPref | string;
  frontendStack: FrontendStack | string;
  backendStack: BackendStack | string;
  database: DatabaseChoice | string;
  auth: AuthChoice | string;
  styling: StylingChoice | string;
  deployment: DeploymentChoice | string;
  appName: string;
};
