import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

export function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-center px-6">
      <Compass className="h-12 w-12 text-primary" />
      <h1 className="text-3xl font-bold text-foreground">404</h1>
      <p className="text-muted max-w-sm">This page wandered off your statement somewhere. Let's get you back.</p>
      <Link to="/" className="rounded-xl bg-gradient-primary px-5 py-2.5 text-sm font-medium text-white">
        Back to Dashboard
      </Link>
    </div>
  );
}
