import MandiPrices from "../components/dashboard/MandiPrices";

export default function MandiPage() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="py-8">
        <MandiPrices compact={false} />
      </div>
    </div>
  );
}