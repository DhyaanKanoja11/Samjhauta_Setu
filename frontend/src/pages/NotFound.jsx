import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#0F110C] px-6 text-center">
      
      <div className="mb-6">
        <AlertTriangle className="w-16 h-16 text-brand-green mx-auto" />
      </div>

      <h1 className="text-6xl font-extrabold mb-4 text-neutral-800 dark:text-white">
        404
      </h1>

      <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
        The page you’re looking for does not exist.
      </p>

      <Link
        to="/"
        className="px-6 py-3 bg-brand-green text-white rounded-xl shadow hover:scale-105 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
}