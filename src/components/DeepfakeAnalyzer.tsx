import { useState } from 'react';
import { Upload, Image as ImageIcon, Video, Mic, AlertTriangle, CheckCircle, Info } from 'lucide-react';

type AnalysisType = 'image' | 'video' | 'audio';
type AnalysisResult = {
  confidence: number;
  verdict: 'authentic' | 'suspicious' | 'deepfake';
  indicators: {
    name: string;
    status: 'pass' | 'warning' | 'fail';
    description: string;
  }[];
  metadata: {
    label: string;
    value: string;
  }[];
  heatmap?: string;
};

export function DeepfakeAnalyzer() {
  const [selectedType, setSelectedType] = useState<AnalysisType>('image');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      alert("Please select a file first");
      return;
    }

    setAnalyzing(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('https://bluerayscanbackend.onrender.com/api/scan', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();

      // Map backend response to AnalysisResult
      const baseUrl = 'https://bluerayscanbackend.onrender.com';
      const mappedResult: AnalysisResult = {
        confidence: data.confidence,
        verdict: data.prediction === 'FAKE' ? 'deepfake' : 'authentic',
        indicators: [
          {
            name: 'ML Model Analysis',
            status: data.prediction === 'FAKE' ? 'fail' : 'pass',
            description: data.explanation || 'No detailed explanation provided'
          }
        ],
        metadata: [
          { label: 'Filename', value: data.file_info?.filename || 'Unknown' },
          { label: 'Mode', value: data.analysis?.mode || 'Normal' }
        ],
        heatmap: data.heatmap ? `${baseUrl}${data.heatmap}` : undefined
      };

      setResult(mappedResult);
    } catch (error) {
      console.error('Error analyzing media:', error);
      alert("Failed to analyze media. Please ensure the backend is running.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-2">Deepfake Analysis</h2>
        <p className="text-slate-400">
          Multi-modal deepfake detection using advanced ML models for images, videos, and audio
        </p>
      </div>

      {/* Analysis Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TypeCard
          type="image"
          icon={ImageIcon}
          label="Image Analysis"
          description="GAN artifacts, facial inconsistencies, metadata"
          selected={selectedType === 'image'}
          onClick={() => setSelectedType('image')}
        />
        <TypeCard
          type="video"
          icon={Video}
          label="Video Analysis"
          description="Frame consistency, temporal artifacts, lip-sync"
          selected={selectedType === 'video'}
          onClick={() => setSelectedType('video')}
        />
        <TypeCard
          type="audio"
          icon={Mic}
          label="Audio Analysis"
          description="Voice cloning, spectral anomalies, patterns"
          selected={selectedType === 'audio'}
          onClick={() => setSelectedType('audio')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <h3 className="mb-4">Upload for Analysis</h3>
          <div
            className="border-2 border-dashed border-slate-700 rounded-lg p-12 text-center hover:border-slate-600 transition-colors cursor-pointer relative"
            onClick={() => document.getElementById('file-upload-input')?.click()}
          >
            <input
              id="file-upload-input"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept={selectedType === 'image' ? 'image/*' : selectedType === 'video' ? 'video/*' : 'audio/*'}
            />
            <Upload className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-300 mb-2">
              {selectedFile ? `Selected: ${selectedFile.name}` : `Drop ${selectedType} file here or click to browse`}
            </p>
            <p className="text-sm text-slate-500">
              {selectedType === 'image' && 'Supports: JPG, PNG, WebP (max 10MB)'}
              {selectedType === 'video' && 'Supports: MP4, WebM, MOV (max 100MB)'}
              {selectedType === 'audio' && 'Supports: MP3, WAV, OGG (max 25MB)'}
            </p>
          </div>

          <div className="mt-6">
            <label className="block text-sm text-slate-400 mb-2">Or paste URL</label>
            <input
              type="text"
              placeholder={`https://example.com/${selectedType === 'image' ? 'image.jpg' : selectedType === 'video' ? 'video.mp4' : 'audio.mp3'}`}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="w-full mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg transition-colors"
          >
            {analyzing ? 'Analyzing...' : 'Start Analysis'}
          </button>

          {analyzing && (
            <div className="mt-6 space-y-3">
              <ProgressStep label="Preprocessing media..." progress={100} />
              <ProgressStep label="Running ML models..." progress={65} />
              <ProgressStep label="Analyzing artifacts..." progress={30} />
              <ProgressStep label="Generating report..." progress={0} />
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <h3 className="mb-4">Analysis Results</h3>

          {!result ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-500">
              <Info className="w-16 h-16 mb-4 opacity-50" />
              <p>No analysis results yet</p>
              <p className="text-sm mt-2">Upload a file to begin</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Verdict */}
              <div className={`p-6 rounded-lg border-2 ${result.verdict === 'authentic' ? 'bg-green-500/10 border-green-500/30' :
                result.verdict === 'suspicious' ? 'bg-yellow-500/10 border-yellow-500/30' :
                  'bg-red-500/10 border-red-500/30'
                }`}>
                <div className="flex items-center gap-3 mb-3">
                  {result.verdict === 'authentic' && <CheckCircle className="w-8 h-8 text-green-400" />}
                  {result.verdict === 'suspicious' && <AlertTriangle className="w-8 h-8 text-yellow-400" />}
                  {result.verdict === 'deepfake' && <AlertTriangle className="w-8 h-8 text-red-400" />}
                  <div>
                    <div className={`text-xl ${result.verdict === 'authentic' ? 'text-green-400' :
                      result.verdict === 'suspicious' ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                      {result.verdict === 'authentic' && 'Likely Authentic'}
                      {result.verdict === 'suspicious' && 'Suspicious'}
                      {result.verdict === 'deepfake' && 'Deepfake Detected'}
                    </div>
                    <div className="text-sm text-slate-400 mt-1">
                      Confidence: {result.confidence}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Indicators */}
              <div>
                <h4 className="text-sm text-slate-400 mb-3">Detection Indicators</h4>
                <div className="space-y-2">
                  {result.indicators.map((indicator: any, idx: number) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg">
                      <div className={`mt-0.5 w-2 h-2 rounded-full ${indicator.status === 'pass' ? 'bg-green-500' :
                        indicator.status === 'warning' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`} />
                      <div className="flex-1">
                        <div className="text-sm text-slate-200">{indicator.name}</div>
                        <div className="text-xs text-slate-500 mt-1">{indicator.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Heatmap Visualization */}
              {result.heatmap && (
                <div>
                  <h4 className="text-sm text-slate-400 mb-3">Explainable AI (Heatmap)</h4>
                  <div className="rounded-lg overflow-hidden border border-slate-800 bg-black/40">
                    <img
                      src={result.heatmap}
                      alt="AI Analysis Heatmap"
                      className="w-full h-auto object-contain"
                    />
                    <div className="p-3 text-xs text-slate-500 bg-slate-900/50">
                      Vibrant regions highlight areas where the model detected manipulation artifacts.
                    </div>
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div>
                <h4 className="text-sm text-slate-400 mb-3">Technical Metadata</h4>
                <div className="grid grid-cols-2 gap-3">
                  {result.metadata.map((item: any, idx: number) => (
                    <div key={idx} className="p-3 bg-slate-800/50 rounded-lg">
                      <div className="text-xs text-slate-500">{item.label}</div>
                      <div className="text-sm text-slate-200 mt-1">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ML Models Info */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <h3 className="mb-4">Active ML Models</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ModelCard name="FaceForensics++" accuracy="96.7%" type="Face manipulation detection" />
          <ModelCard name="XceptionNet" accuracy="94.2%" type="DeepFake classification" />
          <ModelCard name="MesoNet" accuracy="93.8%" type="GAN-generated detection" />
        </div>
      </div>
    </div>
  );
}

function TypeCard({ type, icon: Icon, label, description, selected, onClick }: {
  type: string;
  icon: any;
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`p-6 rounded-xl border-2 transition-all text-left ${selected
        ? 'bg-blue-500/20 border-blue-500/50'
        : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
        }`}
    >
      <Icon className={`w-8 h-8 mb-3 ${selected ? 'text-blue-400' : 'text-slate-500'}`} />
      <h3 className="text-slate-100 mb-2">{label}</h3>
      <p className="text-sm text-slate-400">{description}</p>
    </button>
  );
}

function ProgressStep({ label, progress }: { label: string; progress: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-400">{label}</span>
        <span className="text-slate-500">{progress}%</span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function ModelCard({ name, accuracy, type }: { name: string; accuracy: string; type: string }) {
  return (
    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-slate-200">{name}</h4>
        <div className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded border border-green-500/20">
          Active
        </div>
      </div>
      <div className="text-sm text-slate-400">{type}</div>
      <div className="mt-3 text-sm">
        <span className="text-slate-500">Accuracy: </span>
        <span className="text-blue-400">{accuracy}</span>
      </div>
    </div>
  );
}

function getMockAnalysisResult(type: AnalysisType): AnalysisResult {
  if (type === 'image') {
    return {
      confidence: 87,
      verdict: 'authentic',
      indicators: [
        { name: 'EXIF Metadata', status: 'pass', description: 'Valid camera metadata present' },
        { name: 'Noise Analysis', status: 'pass', description: 'Consistent noise patterns across image' },
        { name: 'Edge Detection', status: 'warning', description: 'Minor inconsistencies in facial boundaries' },
        { name: 'Compression Artifacts', status: 'pass', description: 'Natural JPEG compression detected' },
        { name: 'GAN Fingerprint', status: 'pass', description: 'No AI generation patterns detected' },
      ],
      metadata: [
        { label: 'Resolution', value: '1920x1080' },
        { label: 'Format', value: 'JPEG' },
        { label: 'Camera', value: 'Canon EOS R5' },
        { label: 'Created', value: '2024-12-15' },
      ],
    };
  } else if (type === 'video') {
    return {
      confidence: 73,
      verdict: 'suspicious',
      indicators: [
        { name: 'Facial Consistency', status: 'warning', description: 'Face geometry changes across frames' },
        { name: 'Lip Sync Analysis', status: 'fail', description: 'Audio-visual mismatch detected' },
        { name: 'Frame Interpolation', status: 'warning', description: 'Unusual frame blending patterns' },
        { name: 'Lighting Analysis', status: 'pass', description: 'Consistent lighting across scene' },
        { name: 'Eye Blink Rate', status: 'fail', description: 'Abnormal blinking frequency' },
      ],
      metadata: [
        { label: 'Duration', value: '2:34 min' },
        { label: 'Format', value: 'MP4/H.264' },
        { label: 'FPS', value: '30' },
        { label: 'Resolution', value: '1080p' },
      ],
    };
  } else {
    return {
      confidence: 92,
      verdict: 'deepfake',
      indicators: [
        { name: 'Voice Print Match', status: 'fail', description: 'Voice characteristics do not match baseline' },
        { name: 'Spectral Analysis', status: 'fail', description: 'Artificial frequency patterns detected' },
        { name: 'Prosody Analysis', status: 'warning', description: 'Unnatural speech rhythm' },
        { name: 'Background Noise', status: 'fail', description: 'Inconsistent ambient noise' },
        { name: 'Compression Artifacts', status: 'warning', description: 'Multiple re-encoding detected' },
      ],
      metadata: [
        { label: 'Duration', value: '45 sec' },
        { label: 'Format', value: 'MP3' },
        { label: 'Sample Rate', value: '44.1 kHz' },
        { label: 'Bitrate', value: '320 kbps' },
      ],
    };
  }
}
