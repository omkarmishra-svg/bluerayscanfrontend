import { useState } from 'react';
import { Upload, Search, Eye, MapPin, Smartphone, Calendar, AlertCircle, CheckCircle, Shield } from 'lucide-react';
import { API_ENDPOINTS } from '../config';

interface StegoResult {
    has_hidden_data: boolean;
    confidence_score: number;
    detection_methods: any;
    extracted_data: {
        text?: string;
        coordinates?: string;
        binary_data?: string;
        extraction_method?: string;
    };
    heatmap_url?: string;
    reverse_osint_correlation?: {
        matches_found: boolean;
        risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
        summary: string;
        matching_visitors: Array<{
            ip: string;
            timestamp: string;
            threat_level: string;
        }>;
    };
}

export function SteganographyAnalyzer() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<StegoResult | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            setResult(null);
        }
    };

    const handleAnalyze = async () => {
        if (!selectedFile) {
            alert('Please select an image first');
            return;
        }

        setAnalyzing(true);
        setResult(null);

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch(API_ENDPOINTS.STEGO_ANALYZE, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Analysis failed (Status ${response.status})`);
            }

            const data = await response.json();
            setResult(data);
        } catch (error: any) {
            console.error('Steganography analysis error:', error);
            alert(`Error: ${error.message}`);
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl mb-2">Steganography Detection</h2>
                <p className="text-slate-400">
                    Extract hidden information from images using LSB, DCT, and statistical analysis
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upload Section */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                    <h3 className="mb-4">Upload Image for Analysis</h3>

                    <div
                        className="border-2 border-dashed border-slate-700 rounded-lg p-12 text-center hover:border-slate-600 transition-colors cursor-pointer"
                        onClick={() => document.getElementById('stego-file-input')?.click()}
                    >
                        <input
                            id="stego-file-input"
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                            accept="image/*"
                        />
                        <Upload className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                        <p className="text-slate-300 mb-2">
                            {selectedFile ? `Selected: ${selectedFile.name}` : 'Drop image here or click to browse'}
                        </p>
                        <p className="text-sm text-slate-500">
                            Supports: PNG, JPEG, BMP (max 10MB)
                        </p>
                    </div>

                    <button
                        onClick={handleAnalyze}
                        disabled={analyzing || !selectedFile}
                        className="w-full mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg transition-colors font-medium"
                    >
                        {analyzing ? 'Analyzing...' : 'Analyze for Hidden Data'}
                    </button>

                    {/* Detection Methods Info */}
                    <div className="mt-6 space-y-2">
                        <h4 className="text-sm text-slate-400 mb-3">Detection Methods:</h4>
                        {[
                            { name: 'LSB Analysis', desc: 'Least Significant Bit detection' },
                            { name: 'DCT Analysis', desc: 'Frequency domain analysis' },
                            { name: 'Chi-Square', desc: 'Statistical pattern detection' },
                            { name: 'Visual Analysis', desc: 'Artifact visualization' }
                        ].map((method, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-sm">
                                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                                <div>
                                    <div className="text-slate-300">{method.name}</div>
                                    <div className="text-xs text-slate-500">{method.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Results Section */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                    <h3 className="mb-4">Analysis Results</h3>

                    {!result ? (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                            <Eye className="w-16 h-16 mb-4 opacity-50" />
                            <p>No analysis results yet</p>
                            <p className="text-sm mt-2">Upload an image to begin</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Detection Status */}
                            <div className={`p-6 rounded-lg border-2 ${result.has_hidden_data
                                ? 'bg-red-500/10 border-red-500/30'
                                : 'bg-green-500/10 border-green-500/30'
                                }`}>
                                <div className="flex items-center gap-3 mb-3">
                                    {result.has_hidden_data ? (
                                        <AlertCircle className="w-8 h-8 text-red-400" />
                                    ) : (
                                        <CheckCircle className="w-8 h-8 text-green-400" />
                                    )}
                                    <div>
                                        <div className={`text-xl ${result.has_hidden_data ? 'text-red-400' : 'text-green-400'
                                            }`}>
                                            {result.has_hidden_data ? 'Hidden Data Detected' : 'No Hidden Data'}
                                        </div>
                                        <div className="text-sm text-slate-400 mt-1">
                                            Confidence: {result.confidence_score}%
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Extracted Data */}
                            {result.extracted_data && result.has_hidden_data && (
                                <div className="space-y-4">
                                    <h4 className="text-sm text-slate-400">Extracted Information:</h4>

                                    {result.extracted_data.text && (
                                        <div className="p-4 bg-slate-800/50 rounded-lg">
                                            <div className="text-xs text-slate-500 mb-2">Hidden Text:</div>
                                            <div className="text-slate-200 font-mono text-sm break-all">
                                                {result.extracted_data.text}
                                            </div>
                                        </div>
                                    )}

                                    {result.extracted_data.coordinates && (
                                        <div className="p-4 bg-slate-800/50 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <MapPin className="w-4 h-4 text-red-400" />
                                                <div className="text-xs text-slate-500">GPS Coordinates:</div>
                                            </div>
                                            <div className="text-slate-200 font-mono text-sm">
                                                {result.extracted_data.coordinates}
                                            </div>
                                        </div>
                                    )}

                                    {result.extracted_data.binary_data && !result.extracted_data.text && (
                                        <div className="p-4 bg-slate-800/50 rounded-lg">
                                            <div className="text-xs text-slate-500 mb-2">Binary Data (Hex):</div>
                                            <div className="text-slate-200 font-mono text-xs break-all">
                                                {result.extracted_data.binary_data}
                                            </div>
                                        </div>
                                    )}

                                    {result.extracted_data.extraction_method && (
                                        <div className="text-xs text-slate-500">
                                            Method: {result.extracted_data.extraction_method}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Reverse OSINT Correlation */}
                            {result.reverse_osint_correlation && result.reverse_osint_correlation.matches_found && (
                                <div className={`p-4 rounded-lg border ${result.reverse_osint_correlation.risk_level === 'CRITICAL' || result.reverse_osint_correlation.risk_level === 'HIGH'
                                        ? 'bg-red-500/20 border-red-500/40'
                                        : 'bg-yellow-500/20 border-yellow-500/40'
                                    }`}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Shield className="w-5 h-5 text-red-400" />
                                        <h4 className="text-sm font-bold text-slate-100 italic">REVERSE OSINT CORRELATION</h4>
                                    </div>
                                    <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                                        {result.reverse_osint_correlation.summary}
                                    </p>

                                    {result.reverse_osint_correlation.matching_visitors.length > 0 && (
                                        <div className="space-y-2">
                                            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Matching Visitor Profiles:</div>
                                            {result.reverse_osint_correlation.matching_visitors.map((visitor, idx) => (
                                                <div key={idx} className="flex items-center justify-between text-xs p-2 bg-black/30 rounded border border-white/5">
                                                    <div className="flex flex-col">
                                                        <span className="text-blue-400 font-mono">{visitor.ip}</span>
                                                        <span className="text-[10px] text-slate-500">{new Date(visitor.timestamp).toLocaleString()}</span>
                                                    </div>
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${visitor.threat_level === 'CRITICAL' ? 'bg-red-900/40 text-red-300' :
                                                            visitor.threat_level === 'HIGH' ? 'bg-red-500/30 text-red-400' :
                                                                'bg-slate-700 text-slate-300'
                                                        }`}>
                                                        {visitor.threat_level}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Detection Method Results */}
                            {result.detection_methods && (
                                <div>
                                    <h4 className="text-sm text-slate-400 mb-3">Detection Analysis:</h4>
                                    <div className="space-y-2">
                                        {Object.entries(result.detection_methods).map(([method, data]: [string, any], idx) => {
                                            if (!data) return null;
                                            return (
                                                <div key={idx} className="p-3 bg-slate-800/50 rounded-lg">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-sm text-slate-300">{data.method}</span>
                                                        <span className={`text-xs px-2 py-1 rounded ${data.suspicious
                                                            ? 'bg-red-500/20 text-red-400'
                                                            : 'bg-green-500/20 text-green-400'
                                                            }`}>
                                                            {data.suspicious ? 'Suspicious' : 'Clean'}
                                                        </span>
                                                    </div>
                                                    {data.indicators && (
                                                        <div className="text-xs text-slate-500 space-y-1">
                                                            {data.indicators.map((indicator: string, i: number) => (
                                                                <div key={i}>• {indicator}</div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Heatmap Visualization */}
                            {result.heatmap_url && (
                                <div>
                                    <h4 className="text-sm text-slate-400 mb-3">Suspicious Region Heatmap:</h4>
                                    <div className="rounded-lg overflow-hidden border border-slate-800 bg-black/40">
                                        <img
                                            src={result.heatmap_url}
                                            alt="Steganography Heatmap"
                                            className="w-full h-auto object-contain"
                                        />
                                        <div className="p-3 text-xs text-slate-500 bg-slate-900/50">
                                            Red regions indicate areas where hidden data was detected
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Information Panel */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                <h3 className="mb-4">About Steganography</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="p-4 bg-slate-800/30 rounded-lg">
                        <div className="text-slate-300 mb-2 font-medium">What is Steganography?</div>
                        <div className="text-slate-500">
                            The practice of hiding secret information within ordinary images, often used by threat actors to communicate covertly or embed malicious payloads.
                        </div>
                    </div>
                    <div className="p-4 bg-slate-800/30 rounded-lg">
                        <div className="text-slate-300 mb-2 font-medium">Common Use Cases</div>
                        <div className="text-slate-500">
                            • Hidden coordinates for operations<br />
                            • Covert communication channels<br />
                            • Malware distribution<br />
                            • Data exfiltration
                        </div>
                    </div>
                    <div className="p-4 bg-slate-800/30 rounded-lg">
                        <div className="text-slate-300 mb-2 font-medium">How We Detect It</div>
                        <div className="text-slate-500">
                            Multiple algorithms analyze pixel patterns, statistical anomalies, and frequency distributions to identify hidden data with high accuracy.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
