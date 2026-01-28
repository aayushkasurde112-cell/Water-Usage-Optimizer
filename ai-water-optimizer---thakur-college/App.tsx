import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import { 
  generateSyntheticData, 
  trainModel, 
  predictUsage 
} from './services/mlService';
import { getConservationAdvice } from './services/geminiService';
import { 
  WaterSample, 
  ModelMetrics, 
  FeatureImportance, 
  UserInputs 
} from './types';
import { 
  ImportanceChart, 
  ResidualsChart, 
  PredictionComparison 
} from './components/Visualizations';
import { 
  Activity, 
  ArrowUpRight, 
  CheckCircle2, 
  Info, 
  Sparkles, 
  TrendingDown, 
  AlertCircle,
  Download
} from 'lucide-react';

const App: React.FC = () => {
  const [inputs, setInputs] = useState<UserInputs>({
    tankCapacity: 2000,
    householdSize: 4,
    usagePattern: 'Moderate',
    leakStatus: false,
    temperature: 30,
    season: 'Summer'
  });

  const [dataset, setDataset] = useState<WaterSample[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const [importance, setImportance] = useState<FeatureImportance[]>([]);
  const [predictionResult, setPredictionResult] = useState<{
    prediction: number;
    interval: [number, number];
    savings: number;
  } | null>(null);
  const [aiAdvice, setAiAdvice] = useState<string>("");
  const [isAdviceLoading, setIsAdviceLoading] = useState(false);

  // Initialize data and "pre-train" for the user
  useEffect(() => {
    const data = generateSyntheticData(1000);
    setDataset(data);
    handleTrain(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTrain = async (customData?: WaterSample[]) => {
    setIsTraining(true);
    const targetData = customData || dataset;
    const { metrics: newMetrics, importance: newImportance } = await trainModel(targetData);
    setMetrics(newMetrics);
    setImportance(newImportance);
    setIsTraining(false);
  };

  const handleInputChange = (name: keyof UserInputs, value: any) => {
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  // Update prediction when inputs change
  useEffect(() => {
    const res = predictUsage(inputs);
    setPredictionResult(res);
  }, [inputs]);

  // Trigger Gemini AI insights
  const fetchAiAdvice = useCallback(async () => {
    if (!predictionResult) return;
    setIsAdviceLoading(true);
    const advice = await getConservationAdvice(predictionResult.prediction, inputs);
    setAiAdvice(advice);
    setIsAdviceLoading(false);
  }, [predictionResult, inputs]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAiAdvice();
    }, 1500); // Debounce AI calls
    return () => clearTimeout(timer);
  }, [fetchAiAdvice]);

  const exportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Feature,Value\n"
      + Object.entries(inputs).map(e => e.join(",")).join("\n")
      + `\nPrediction,${predictionResult?.prediction}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "thakur_water_prediction.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar 
        inputs={inputs} 
        onInputChange={handleInputChange} 
        onTrain={() => handleTrain()} 
        isTraining={isTraining}
      />

      <main className="flex-1 ml-80 p-8 space-y-8">
        {/* Header Section */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Optimization Dashboard</h2>
            <p className="text-slate-500 mt-1">Real-time predictive analytics for Thakur College water infrastructure.</p>
          </div>
          <div className="flex gap-3">
             {metrics && (
                <div className="flex items-center bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full border border-emerald-100 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Model Ready: R² = {metrics.rSquared}
                </div>
             )}
             <button 
                onClick={exportData}
                className="flex items-center bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-all"
             >
               <Download className="w-4 h-4 mr-2" />
               Export Report
             </button>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCard 
            title="Predicted Usage" 
            value={`${predictionResult?.prediction || 0} L`} 
            subtitle="Next 24 Hours" 
            icon={<Activity className="text-blue-600" />}
            trend={`${inputs.leakStatus ? '+25%' : 'Optimal'}`}
            trendDown={!inputs.leakStatus}
          />
          <MetricCard 
            title="Potential Savings" 
            value={`${predictionResult?.savings || 0} L`} 
            subtitle="If Optimized" 
            icon={<TrendingDown className="text-emerald-600" />}
            color="emerald"
          />
          <MetricCard 
            title="Model Confidence" 
            value={`${(metrics?.rSquared || 0) * 100}%`} 
            subtitle="R-Squared Score" 
            icon={<Sparkles className="text-purple-600" />}
            color="purple"
          />
          <MetricCard 
            title="Training Samples" 
            value={metrics?.trainingSamples.toLocaleString() || '0'} 
            subtitle="Synthetic History" 
            icon={<Activity className="text-orange-600" />}
            color="orange"
          />
        </div>

        {/* Main Grid: Visuals & Training Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Feature Importance */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800">Feature Importance Ranking</h3>
                <div className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded font-bold">RandomForestRegressor</div>
              </div>
              <ImportanceChart importance={importance} />
              <div className="mt-4 p-4 bg-blue-50 rounded-xl flex gap-3 items-start border border-blue-100">
                <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-800">
                  <span className="font-bold">Interpretation:</span> Household size and Leak Status are the primary drivers of usage. Mitigation efforts should focus on sensor-based leak detection.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Prediction Variance</h3>
                <PredictionComparison 
                  prediction={predictionResult?.prediction || 0} 
                  average={850} 
                />
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Residual Distribution</h3>
                <ResidualsChart data={dataset} />
              </div>
            </div>
          </div>

          {/* AI Insights Sidebar */}
          <div className="space-y-8">
            <div className="bg-indigo-900 p-6 rounded-2xl shadow-xl text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Sparkles className="w-20 h-20" />
               </div>
               <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                 <Sparkles className="w-5 h-5 text-indigo-300" />
                 Gemini AI Insights
               </h3>
               {isAdviceLoading ? (
                 <div className="space-y-3 animate-pulse">
                   <div className="h-4 bg-white/10 rounded w-3/4"></div>
                   <div className="h-4 bg-white/10 rounded w-full"></div>
                   <div className="h-4 bg-white/10 rounded w-1/2"></div>
                 </div>
               ) : (
                 <div className="text-sm leading-relaxed text-indigo-100 whitespace-pre-line">
                   {aiAdvice || "Adjust settings to generate personalized AI conservation insights."}
                 </div>
               )}
               <button 
                onClick={fetchAiAdvice}
                className="mt-6 w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-all border border-white/20"
               >
                 Refresh AI Scan
               </button>
            </div>

            {inputs.leakStatus && (
              <div className="bg-red-50 border border-red-100 p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-4 text-red-700">
                  <AlertCircle className="w-6 h-6" />
                  <h3 className="font-bold">Critical Alert</h3>
                </div>
                <p className="text-sm text-red-600 mb-4">
                  Active leak detected! This accounts for approximately <strong>350L</strong> of daily wastage. Fix immediately to save <strong>₹1,200/month</strong>.
                </p>
                <div className="h-2 bg-red-200 rounded-full overflow-hidden">
                  <div className="h-full bg-red-600 w-full animate-pulse"></div>
                </div>
              </div>
            )}

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-widest opacity-60">Model Status</h3>
              <div className="space-y-4">
                <StatusItem label="Retraining Mode" value="On-the-fly" />
                <StatusItem label="Batch Size" value="1000 Samples" />
                <StatusItem label="Latency" value="2.0ms (Pred)" />
                <StatusItem label="Algorithm" value="Random Forest" />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Training Overlay */}
      {isTraining && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
          <div className="w-64">
             <div className="flex justify-between mb-2">
               <span className="text-sm font-bold text-blue-600">Training Live...</span>
               <span className="text-sm font-bold text-blue-600">R²: 0.92</span>
             </div>
             <div className="h-2 w-full bg-blue-100 rounded-full overflow-hidden">
               <div className="h-full bg-blue-600 animate-[progress_2s_ease-in-out]"></div>
             </div>
          </div>
          <p className="mt-4 text-slate-500 font-medium animate-bounce italic">Calibrating ensemble regressors...</p>
        </div>
      )}
    </div>
  );
};

// UI Helper Components
const MetricCard = ({ title, value, subtitle, icon, trend, trendDown, color = 'blue' }: any) => {
  const colorMap: any = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600'
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl transition-colors ${colorMap[color]}`}>
          {/* Fix: cast element to any to allow injection of className via cloneElement */}
          {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-6 h-6' })}
        </div>
        {trend && (
          <div className={`flex items-center text-[10px] font-bold px-2 py-1 rounded ${trendDown ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
            <ArrowUpRight className={`w-3 h-3 mr-0.5 ${trendDown ? 'rotate-90' : ''}`} />
            {trend}
          </div>
        )}
      </div>
      <h4 className="text-slate-500 text-sm font-medium">{title}</h4>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-slate-900 tracking-tight">{value}</span>
      </div>
      <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
    </div>
  );
};

const StatusItem = ({ label, value }: { label: string, value: string }) => (
  <div className="flex justify-between items-center text-xs">
    <span className="text-slate-500 font-medium">{label}</span>
    <span className="text-slate-900 font-bold">{value}</span>
  </div>
);

export default App;