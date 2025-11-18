import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold mb-6 text-primary">
          Welcome to EmeraldRx HRM
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Comprehensive HR Management System for Compounding Pharmacy
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/dashboard"
            className="bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-colors"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/employee-management"
            className="bg-secondary text-secondary-foreground px-6 py-3 rounded-md hover:bg-secondary/90 transition-colors"
          >
            View Employees
          </Link>
        </div>
      </div>
    </div>
  );
}

