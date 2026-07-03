export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-cyan-600 border-t-transparent"></div>

        <p className="mt-4 text-slate-600">
          Loading dashboard...
        </p>
      </div>
    </main>
  );
}