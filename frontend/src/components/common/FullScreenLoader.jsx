export default function FullScreenLoader() {
  return (
    <div className="fixed inset-0 bg-white dark:bg-[#0F110C] flex items-center justify-center z-[9999]">
      <div className="flex flex-col items-center gap-6">
        <div className="w-14 h-14 border-4 border-brand-green border-t-transparent rounded-full animate-spin"></div>
        <p className="text-neutral-600 dark:text-neutral-400">
          Loading Samjhauta Setu...
        </p>
      </div>
    </div>
  );
}