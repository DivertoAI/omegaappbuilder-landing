"use client";

import { useEffect, useMemo, useState } from "react";
import type { AiTab } from "@/components/ai/AiBuilder";
import FileTree from "@/components/ai/FileTree";
import CodeViewer from "@/components/ai/CodeViewer";
import type { FileNode } from "@/lib/ai/workspace";

const tabs: { id: AiTab; label: string }[] = [
  { id: "preview", label: "Preview" },
  { id: "files", label: "Files" },
  { id: "logs", label: "Logs" },
  { id: "notes", label: "Notes" },
];

type BuildData = {
  id: string;
  status: string;
  logs: string;
  files: string[];
  tree: FileNode[];
  readme: string;
  envVars: string[];
  previewPort?: number | null;
};

type Props = {
  activeTab: AiTab;
  onTabChange: (tab: AiTab) => void;
  buildId?: string | null;
  buildData?: BuildData | null;
  onRestartPreview?: () => void;
  accessToken?: string | null;
};

export default function BuildOutputPanel({
  activeTab,
  onTabChange,
  buildId,
  buildData,
  onRestartPreview,
  accessToken,
}: Props) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [search, setSearch] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!buildId || !selectedFile) return;
    const loadFile = async () => {
      const res = await fetch(`/api/ai/build/${buildId}/file?path=${encodeURIComponent(selectedFile)}`, {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
      });
      if (!res.ok) return;
      const data = await res.json();
      setFileContent(data.content || "");
    };
    loadFile();
  }, [buildId, selectedFile, accessToken]);

  const filteredFiles = useMemo(() => {
    if (!buildData?.files) return [];
    if (!search.trim()) return buildData.files;
    const needle = search.toLowerCase();
    return buildData.files.filter((file) => file.toLowerCase().includes(needle));
  }, [buildData?.files, search]);

  const previewUrl = buildId
    ? `/api/ai/build/${buildId}/preview${accessToken ? `?token=${encodeURIComponent(accessToken)}` : ""}`
    : "";

  const handleDownload = async () => {
    if (!buildId) return;
    setDownloading(true);
    try {
      const res = await fetch(`/api/ai/build/${buildId}/download`, {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
      });
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `omega-build-${buildId}.zip`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section className="flex min-h-[560px] flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-lg font-semibold">Build Output</h2>
          <p className="text-xs text-slate-500">Preview, files, and logs from your build.</p>
        </div>
        <button
          type="button"
          onClick={handleDownload}
          disabled={!buildId || downloading}
          className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-600 disabled:opacity-60"
        >
          {downloading ? "Downloading..." : "Download ZIP"}
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
              activeTab === tab.id ? "bg-slate-900 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {!buildId && (
        <div className="mt-6 flex-1 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
          Start a build to see preview, files, and logs here.
        </div>
      )}

      {buildId && (
        <div className="mt-6 flex-1 space-y-4">
          {activeTab === "preview" && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                <span>Preview is dev mode. Core Web Vitals may differ.</span>
                <div className="flex gap-2">
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-slate-200 px-3 py-1 text-slate-600"
                  >
                    Open in new tab
                  </a>
                  <button
                    type="button"
                    onClick={onRestartPreview}
                    className="rounded-lg border border-slate-200 px-3 py-1 text-slate-600"
                  >
                    Restart preview
                  </button>
                </div>
              </div>
              <div className="h-[420px] overflow-hidden rounded-xl border border-slate-200 bg-white">
                <iframe title="Preview" src={previewUrl} className="h-full w-full" />
              </div>
              {buildData?.status === "preview_failed" && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                  Preview failed to start. Check logs or restart preview.
                </div>
              )}
            </div>
          )}

          {activeTab === "files" && (
            <div className="grid gap-4 lg:grid-cols-[minmax(0,0.45fr)_minmax(0,0.55fr)]">
              <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search files..."
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 placeholder:text-slate-400"
                />
                {search.trim() ? (
                  <div className="space-y-2 text-xs text-slate-600">
                    {filteredFiles.map((file) => (
                      <button
                        key={file}
                        type="button"
                        onClick={() => setSelectedFile(file)}
                        className={`flex w-full items-center gap-2 rounded px-2 py-1 text-left transition ${
                          selectedFile === file ? "bg-slate-900 text-white" : "hover:bg-slate-100 text-slate-600"
                        }`}
                      >
                        <span className="text-slate-400">FILE</span>
                        <span>{file}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <FileTree tree={buildData?.tree || []} selectedPath={selectedFile} onSelect={setSelectedFile} />
                )}
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3">
                <CodeViewer content={fileContent} filePath={selectedFile} />
              </div>
            </div>
          )}

          {activeTab === "logs" && (
            <pre className="max-h-[520px] overflow-auto rounded-xl border border-slate-200 bg-slate-900 p-4 text-xs text-slate-100">
              {buildData?.logs || "Waiting for logs..."}
            </pre>
          )}

          {activeTab === "notes" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 whitespace-pre-wrap">
                {buildData?.readme || "README will appear here once the build completes."}
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-600">
                <p className="text-xs font-semibold text-slate-900">Environment variables</p>
                <div className="mt-2 space-y-1">
                  {(buildData?.envVars || []).map((env) => (
                    <div key={env} className="rounded bg-slate-100 px-2 py-1">
                      {env}=DUMMY_VALUE
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
                <p className="text-xs font-semibold text-slate-900">What is next</p>
                <pre className="mt-2 whitespace-pre-wrap rounded-lg bg-slate-900 p-3 text-xs text-slate-100">
{`npm install
npm run dev`}
                </pre>
                <p className="mt-2 text-slate-500">Deploy with your selected target once ready.</p>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
