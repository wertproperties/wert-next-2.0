import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-24">
      <div className="text-center">
        <p className="text-8xl font-black text-amber-500 mb-4">404</p>
        <h1 className="font-serif text-3xl font-bold text-slate-900 mb-4">Page Not Found</h1>
        <Link
          href="/de"
          className="bg-slate-900 text-white font-bold px-7 py-3 text-sm uppercase tracking-widest hover:bg-slate-700 transition-all inline-block"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
