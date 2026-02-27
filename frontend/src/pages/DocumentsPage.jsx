import { useTranslation } from 'react-i18next';
import { FileText, Plus, Search, Folder, ShieldCheck, Download, Trash2, Eye } from 'lucide-react';
import Card from '../components/common/Card';
import DocumentScanner from '../components/dashboard/DocumentScanner';
import VoiceAssistant from '../components/dashboard/VoiceAssistant';

export default function DocumentsPage() {
    const { t } = useTranslation();

    // Added proper fallback text with spaces to fix casing errors
    const categories = [
        { name: t('landRecords', 'Land Records'), count: 12, icon: Folder, color: 'text-brand-green' },
        { name: t('idProofs', 'ID Proofs'), count: 4, icon: ShieldCheck, color: 'text-brand-brown' },
        { name: t('contracts', 'Contracts'), count: 8, icon: FileText, color: 'text-blue-500' },
        { name: t('other', 'Other'), count: 3, icon: Plus, color: 'text-neutral-400' },
    ];

    return (
        <div className="min-h-screen bg-brand-cream/10 dark:bg-[#0F110C] pb-24 md:pb-8 transition-colors duration-300">
            <div className="container-custom py-12 space-y-12">
                
                {/* Header Section */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-green/10 text-brand-green rounded-full text-[10px] font-black uppercase tracking-widest">
                            <ShieldCheck className="w-3 h-3" />
                            SECURE STORAGE
                        </div>
                        
                        {/* Fixed the missing spaces in the heading */}
                        <h1 className="text-5xl font-black text-brand-green dark:text-brand-tan tracking-tighter uppercase">
                            {t('legalPaperChecker', 'Legal Paper Checker')}
                        </h1>
                        
                        <p className="text-neutral-500 font-medium max-w-xl">
                            {t('docsSubtitle', 'Securely scan, analyze, and store your agricultural documents.')}
                        </p>

                        {/* Added the gray, italicized demo disclaimer */}
                        <p className="text-neutral-400 italic text-sm max-w-xl">
                            Some functions may not work, as this is just a demo. After the app is officially deployed, you can use those functions as you log in.
                        </p>
                    </div>
                    
                    {/* The Green "Upload Doc" Button was removed from here */}
                </header>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    
                    {/* Sidebar: Categories */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="grid grid-cols-1 gap-4">
                            {categories.map((cat) => (
                                <button key={cat.name} className="flex items-center justify-between p-6 bg-white dark:bg-neutral-800/50 rounded-3xl border border-neutral-100 dark:border-neutral-700 hover:border-brand-green transition-all group shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <cat.icon className={`w-6 h-6 ${cat.color}`} />
                                        <span className="font-bold text-neutral-800 dark:text-neutral-200">{cat.name}</span>
                                    </div>
                                    <span className="text-xs font-black text-neutral-400 group-hover:text-brand-green transition-colors">{cat.count} Files</span>
                                </button>
                            ))}
                        </div>

                        <Card variant="glass" className="p-8 space-y-4 bg-brand-brown/5 border-dashed border-2 border-brand-brown/20 text-center">
                            <div className="w-16 h-16 bg-brand-brown/10 rounded-full flex items-center justify-center mx-auto">
                                <ShieldCheck className="w-8 h-8 text-brand-brown" />
                            </div>
                            <h3 className="font-black text-brand-brown uppercase tracking-widest text-xs">Security Check</h3>
                            <p className="text-[10px] font-bold text-neutral-500">All documents are encrypted and protected by SamjhautaSetu.</p>
                        </Card>
                    </div>

                    {/* Main Content: Document Scanner & List */}
                    <div className="lg:col-span-8 space-y-8">
                        <DocumentScanner />

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-black text-brand-green dark:text-brand-tan uppercase tracking-tighter">{t('myFiles', 'My Files')}</h2>
                                <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-4">
                                    <span className="cursor-pointer hover:text-brand-green">{t('shared', 'Shared')}</span>
                                    <span className="cursor-pointer hover:text-brand-green">{t('trash', 'Trash')}</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {[
                                    { name: 'Khasra_Report_2024.pdf', size: '2.4 MB', type: 'Land' },
                                    { name: 'Aadhar_Card_Rajesh.jpg', size: '1.1 MB', type: 'ID' },
                                    { name: 'Contract_Rice_Mill.pdf', size: '4.5 MB', type: 'Contract' }
                                ].map((doc, i) => (
                                    <div key={i} className="group flex items-center justify-between p-5 bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-800/80 transition-all shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-brand-green/10 rounded-xl">
                                                <FileText className="w-6 h-6 text-brand-green" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-neutral-800 dark:text-neutral-200">{doc.name}</p>
                                                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{doc.size} • {doc.type}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 hover:bg-brand-green/10 text-brand-green rounded-lg" title={t('view', 'View')}><Eye className="w-5 h-5" /></button>
                                            <button className="p-2 hover:bg-brand-green/10 text-brand-green rounded-lg" title={t('download', 'Download')}><Download className="w-5 h-5" /></button>
                                            <button className="p-2 hover:bg-red-50 text-red-500 rounded-lg" title={t('delete', 'Delete')}><Trash2 className="w-5 h-5" /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <VoiceAssistant />
        </div>
    );
}
