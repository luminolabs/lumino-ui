// src/app/page.tsx (if you're using App Router)

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-black">
      <h1 className="text-3xl font-bold">Welcome to Lumino Dashboard</h1>
      <p className="mt-4 text-gray-600">
        This is your central dashboard for managing fine-tuning jobs, datasets, and usage.
      </p>
    </main>
  );
}