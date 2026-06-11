import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-9xl font-serif text-primary mb-4">404</h1>
        <h2 className="text-2xl font-serif text-textPrimary mb-6">Page Not Found</h2>
        <p className="text-textMuted mb-8 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link href="/">
          <button className="btn-primary">Back to Shop</button>
        </Link>
      </div>
    </div>
  );
}
