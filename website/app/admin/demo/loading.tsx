export default function Loading() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
        <p className="mt-4 text-slate-600">
          Loading Demo Center...
        </p>
      </div>
    </main>
  );
}