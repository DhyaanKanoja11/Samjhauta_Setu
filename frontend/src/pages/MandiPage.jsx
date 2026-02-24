import MandiPrices from '../components/dashboard/MandiPrices';
import VoiceAssistant from '../components/dashboard/VoiceAssistant';

export default function MandiPage() {
  return (
    <div className="min-h-screen bg-brand-cream/10 pb-24 md:pb-8">
      <div className="container-custom py-8 md:py-12">
        <MandiPrices compact={false} />
      </div>
      <VoiceAssistant />
    </div>
  );
}