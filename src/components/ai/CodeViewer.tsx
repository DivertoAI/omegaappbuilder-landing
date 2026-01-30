"use client";

import { useMemo } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-json";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-tsx";

function detectLanguage(path?: string) {
  if (!path) return "markup";
  if (path.endsWith(".ts") || path.endsWith(".tsx")) return "tsx";
  if (path.endsWith(".js") || path.endsWith(".jsx")) return "jsx";
  if (path.endsWith(".json")) return "json";
  if (path.endsWith(".css")) return "css";
  if (path.endsWith(".md")) return "markdown";
  if (path.endsWith(".sh") || path.endsWith(".bash")) return "bash";
  if (path.endsWith(".html")) return "markup";
  return "markup";
}

type Props = {
  content?: string;
  filePath?: string | null;
};

export default function CodeViewer({ content, filePath }: Props) {
  const language = detectLanguage(filePath || undefined);
  const highlighted = useMemo(() => {
    if (!content) return "";
    const grammar = Prism.languages[language] || Prism.languages.markup;
    return Prism.highlight(content, grammar, language);
  }, [content, language]);

  if (!content) {
    return <div className="text-xs text-slate-400">Select a file to preview its contents.</div>;
  }

  return (
    <pre className="max-h-[520px] overflow-auto rounded-xl border border-slate-200 bg-slate-900 p-4 text-xs text-slate-100">
      <code dangerouslySetInnerHTML={{ __html: highlighted }} />
    </pre>
  );
}
