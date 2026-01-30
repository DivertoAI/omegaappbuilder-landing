import type { Metadata } from "next";
import AiBuilder from "@/components/ai/AiBuilder";

export const metadata: Metadata = {
  title: "Omega AI Builder",
  description: "Prompt to production code. Frontend + backend. Repo-ready.",
};

export default function AiPage() {
  return <AiBuilder />;
}
