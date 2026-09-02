import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-16rem)] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-extrabold font-serif text-primary mb-4">404</h1>
      <h2 className="text-2xl font-bold text-foreground mb-4">Page Not Found</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        The page you are looking for does not exist, has been removed, or is temporarily unavailable.
      </p>
      <div className="flex gap-4">
        <Link href="/">
          <Button variant="default">Return Home</Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="outline">Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
