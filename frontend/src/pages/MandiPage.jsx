import MandiPrices from "../components/dashboard/MandiPrices";

export default function MandiPage() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 px-4 md:px-8">
      <div className="py-10 max-w-7xl mx-auto">
        <MandiPrices compact={false} />
      </div>
    </div>
  );
}