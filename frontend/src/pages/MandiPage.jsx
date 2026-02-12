import MandiPrices from '../components/dashboard/MandiPrices';
import VoiceAssistant from '../components/dashboard/VoiceAssistant';

export default function MandiPage() {
    return (
        <div className="min-h-screen bg-neutral-50 pb-24 md:pb-8">
            <div className="container-custom py-6 md:py-8">
                <MandiPrices />
            </div>
            <VoiceAssistant />
        </div>
    );
}
