import MandiPrices from "../components/dashboard/MandiPrices";

export default function MandiPage() {
  return (
    <div className="min-h-screen bg-brand-cream/10 dark:bg-[#0F110C] transition-colors duration-300">
      
      <div className="container-custom py-8 md:py-12 space-y-10">

        <MandiPrices compact={false} />

      </div>

    </div>
  );
}