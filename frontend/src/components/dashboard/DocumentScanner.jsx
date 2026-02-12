import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, Upload, X, FileText, Check, AlertTriangle, ShieldAlert, ShieldCheck, ChevronRight } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { scanDocument } from '../../services/api';

export default function DocumentScanner() {
    const { t } = useTranslation();
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [extractedText, setExtractedText] = useState('');
    const [analysisResults, setAnalysisResults] = useState(null);
    const [isComplete, setIsComplete] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
            setIsComplete(false);
            setExtractedText('');
            setAnalysisResults(null);
            setError(null);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleScan = async () => {
        if (!selectedFile) return;

        setIsProcessing(true);
        setError(null);

        try {
            const response = await scanDocument(selectedFile);

            if (response.success) {
                setExtractedText(response.ocr_text_preview);
                setAnalysisResults(response.analysis);
                setIsComplete(true);
            } else {
                setError(response.error || "दस्तावेज़ स्कैन करने में विफल");
            }
        } catch (err) {
            console.error("Scan error:", err);
            setError("सर्वर से जुड़ने में समस्या हुई। कृपया पुनः प्रयास करें।");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReset = () => {
        setSelectedFile(null);
        setPreview(null);
        setExtractedText('');
        setAnalysisResults(null);
        setIsComplete(false);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const getRiskColor = (level) => {
        switch (level) {
            case 'HIGH': return 'text-error bg-error/10 border-error/20';
            case 'MEDIUM': return 'text-warning bg-warning/10 border-warning/20';
            case 'LOW': return 'text-success bg-success/10 border-success/20';
            default: return 'text-neutral-500 bg-neutral-100 border-neutral-200';
        }
    };

    const getRiskIcon = (level) => {
        switch (level) {
            case 'HIGH': return <ShieldAlert className="w-8 h-8 text-error" />;
            case 'MEDIUM': return <AlertTriangle className="w-8 h-8 text-warning" />;
            case 'LOW': return <ShieldCheck className="w-8 h-8 text-success" />;
            default: return <FileText className="w-8 h-8 text-neutral-400" />;
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 font-display">
                    {t('scannerTitle')}
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                    {t('scannerSubtitle')}
                </p>
            </div>

            {error && (
                <div className="p-4 bg-error/10 border border-error/20 rounded-xl flex items-center gap-3 text-error animate-shake">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                    <button onClick={() => setError(null)} className="ml-auto">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upload Section */}
                <Card className="h-full">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <Upload className="w-5 h-5 text-brand-green" />
                        {t('uploadTitle')}
                    </h3>

                    {!preview ? (
                        <div className="space-y-4">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                                id="file-upload"
                            />

                            <label
                                htmlFor="file-upload"
                                className="block border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-2xl p-12 text-center cursor-pointer hover:border-brand-green hover:bg-brand-green/5 transition-all group"
                            >
                                <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <Upload className="w-8 h-8 text-neutral-400 group-hover:text-brand-green" />
                                </div>
                                <p className="text-neutral-700 dark:text-neutral-300 font-semibold mb-2">
                                    {t('clickToUpload')}
                                </p>
                                <p className="text-sm text-neutral-500">
                                    {t('dragDrop')}
                                </p>
                                <p className="text-xs text-neutral-400 mt-4 px-4 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full inline-block">
                                    JPG, PNG, PDF (Max 10MB)
                                </p>
                            </label>

                            <div className="relative py-4">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-neutral-200 dark:border-neutral-700" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white dark:bg-neutral-900 text-neutral-500 font-medium">
                                        {t('or') || 'OR'}
                                    </span>
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                className="w-full h-12"
                                icon={<Camera className="w-5 h-5" />}
                                onClick={() => alert(t('cameraSoon'))}
                            >
                                {t('takePhoto')}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Preview */}
                            <div className="relative group">
                                <img
                                    src={preview}
                                    alt="Document preview"
                                    className="w-full h-80 object-contain bg-neutral-100 rounded-2xl border border-neutral-200 overflow-hidden shadow-inner"
                                />
                                <button
                                    onClick={handleReset}
                                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md text-error rounded-full shadow-lg flex items-center justify-center hover:bg-error hover:text-white transition-all active:scale-90"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center px-4 py-2 bg-black/60 backdrop-blur-md rounded-xl text-white text-xs">
                                    <span className="truncate max-w-[150px]">{selectedFile?.name}</span>
                                    <span>{(selectedFile?.size / 1024).toFixed(1)} KB</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4">
                                <Button
                                    variant="primary"
                                    className="flex-1 h-14 text-lg shadow-lg shadow-brand-green/20"
                                    onClick={handleScan}
                                    disabled={isProcessing || isComplete}
                                    loading={isProcessing}
                                >
                                    {isComplete ? t('analysisComplete') : t('checkingRisk')}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-14 px-8"
                                    onClick={handleReset}
                                    disabled={isProcessing}
                                >
                                    {t('reset')}
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>

                {/* Analysis/Results Section */}
                <Card className="h-full flex flex-col">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 text-brand-blue" />
                        जोखिम विश्लेषण परिणाम
                    </h3>

                    {isProcessing ? (
                        <div className="flex-1 flex flex-col items-center justify-center space-y-4 py-12">
                            <div className="relative">
                                <div className="w-20 h-20 border-4 border-brand-green/20 border-t-brand-green rounded-full animate-spin" />
                                <ShieldAlert className="w-8 h-8 text-brand-green absolute inset-0 m-auto animate-pulse" />
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-neutral-800 text-lg">अनुबंध का विश्लेषण कर रहे हैं...</p>
                                <p className="text-sm text-neutral-500">कृत्रिम बुद्धिमत्ता (AI) जोखिमों की पहचान कर रही है</p>
                            </div>
                        </div>
                    ) : !isComplete ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-neutral-400 bg-neutral-50/50 rounded-2xl border-2 border-dashed border-neutral-200">
                            <ShieldAlert className="w-16 h-16 mb-4 opacity-20" />
                            <p className="font-medium text-lg">विश्लेषण शुरू करने के लिए दस्तावेज़ अपलोड करें</p>
                            <p className="text-sm mt-2 max-w-[250px]">हमारा जोखिम इंजन आपके अनुबंध का विश्लेषण करेगा और संभावित खतरों की रिपोर्ट देगा</p>
                        </div>
                    ) : (
                        <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                            {/* Risk Overview Header */}
                            <div className={`p-6 rounded-2xl border-2 flex items-center gap-6 ${getRiskColor(analysisResults?.risk_level)}`}>
                                <div className="p-4 bg-white rounded-2xl shadow-sm">
                                    {getRiskIcon(analysisResults?.risk_level)}
                                </div>
                                <div>
                                    <p className="text-sm font-bold uppercase tracking-wider opacity-80">जोखिम स्तर</p>
                                    <h4 className="text-3xl font-black">{analysisResults?.risk_level === 'HIGH' ? 'उच्च' : analysisResults?.risk_level === 'MEDIUM' ? 'मध्यम' : 'न्यूनतम'}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="w-32 h-2 bg-black/10 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full bg-current transition-all duration-1000`}
                                                style={{ width: `${Math.min(100, (analysisResults?.risk_score || 0) * 10)}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-bold">स्कोर: {analysisResults?.risk_score}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Risky Clauses Section */}
                            {analysisResults?.risky_clauses && analysisResults.risky_clauses.length > 0 && (
                                <div className="space-y-4">
                                    <h5 className="font-semibold text-neutral-800 text-lg flex items-center gap-2">
                                        <ShieldAlert className="w-5 h-5 text-error" />
                                        संवेदनशील धाराएं (Risky Clauses)
                                    </h5>
                                    <div className="space-y-3">
                                        {analysisResults.risky_clauses.map((clause, index) => (
                                            <div key={index} className="p-4 rounded-xl border border-error/10 bg-error/5 space-y-2">
                                                <div className="flex justify-between items-start gap-3">
                                                    <p className="text-sm font-medium text-neutral-800 line-clamp-3">
                                                        "{clause.clause_text}..."
                                                    </p>
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold bg-error text-white uppercase`}>
                                                        स्कोर: {clause.clause_score}
                                                    </span>
                                                </div>
                                                {clause.explanations && (
                                                    <div className="pt-2 border-t border-error/10">
                                                        <p className="text-xs text-error font-semibold italic">समस्या: {clause.explanations}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Key Findings */}
                            {analysisResults?.key_findings && analysisResults.key_findings.length > 0 && (
                                <div className="space-y-3">
                                    <h5 className="font-semibold text-neutral-800 text-lg">मुख्य निष्कर्ष</h5>
                                    <ul className="space-y-2">
                                        {analysisResults.key_findings.map((finding, index) => (
                                            <li key={index} className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-100">
                                                <ChevronRight className="w-5 h-5 text-brand-blue flex-shrink-0 mt-0.5" />
                                                <p className="text-sm text-neutral-700">{finding}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Extracted Text Preview */}
                            {extractedText && (
                                <div className="space-y-3">
                                    <h5 className="font-semibold text-neutral-800 text-lg">निकाला गया टेक्स्ट (पूर्वावलोकन)</h5>
                                    <div className="bg-neutral-50 rounded-lg p-4 max-h-60 overflow-y-auto border border-neutral-100">
                                        <pre className="text-sm text-neutral-900 whitespace-pre-wrap font-hindi">
                                            {extractedText}
                                        </pre>
                                    </div>
                                    <div className="flex gap-3">
                                        <Button
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() => {
                                                navigator.clipboard.writeText(extractedText);
                                                alert('टेक्स्ट कॉपी किया गया!');
                                            }}
                                        >
                                            टेक्स्ट कॉपी करें
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                const blob = new Blob([extractedText], { type: 'text/plain' });
                                                const url = URL.createObjectURL(blob);
                                                const a = document.createElement('a');
                                                a.href = url;
                                                a.download = `document_ocr_${Date.now()}.txt`;
                                                a.click();
                                            }}
                                        >
                                            डाउनलोड करें
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </Card>
            </div>

            {/* Recent Scans */}
            <Card>
                <h3 className="font-semibold text-lg mb-4">हाल के स्कैन</h3>
                <div className="text-center py-8 text-neutral-400">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>अभी तक कोई स्कैन नहीं</p>
                </div>
            </Card>
        </div>
    );
}
