export default function AuthCallbackPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900 flex items-center justify-center">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-fuchsia-600">
          Omega Auth
        </p>
        <h1 className="mt-3 text-2xl font-bold text-slate-900">Authentication complete</h1>
        <p className="mt-2 text-sm text-slate-600">
          You can close this tab and return to Omega.
        </p>
      </div>
    </main>
  );
}
