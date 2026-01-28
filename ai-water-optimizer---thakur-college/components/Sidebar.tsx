
import React from 'react';
import { UserInputs } from '../types';
import { Droplets, Settings2, Thermometer, Users, Database, Wind } from 'lucide-react';

interface SidebarProps {
  inputs: UserInputs;
  onInputChange: (name: keyof UserInputs, value: any) => void;
  onTrain: () => void;
  isTraining: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ inputs, onInputChange, onTrain, isTraining }) => {
  return (
    <aside className="w-80 h-screen overflow-y-auto bg-white border-r border-slate-200 p-6 flex flex-col fixed left-0 top-0">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
          <Droplets className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-800 leading-tight">AI Water Optimizer</h1>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Thakur College</p>
        </div>
      </div>

      <div className="space-y-6 flex-1">
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
            <Database className="w-4 h-4" /> Tank Capacity (L)
          </label>
          <input 
            type="range" min="500" max="5000" step="100"
            value={inputs.tankCapacity}
            onChange={(e) => onInputChange('tankCapacity', parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs font-medium text-slate-500 mt-2">
            <span>500L</span>
            <span className="text-blue-600 font-bold">{inputs.tankCapacity}L</span>
            <span>5000L</span>
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
            <Users className="w-4 h-4" /> Household Size
          </label>
          <input 
            type="range" min="1" max="10" step="1"
            value={inputs.householdSize}
            onChange={(e) => onInputChange('householdSize', parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs font-medium text-slate-500 mt-2">
            <span>1</span>
            <span className="text-blue-600 font-bold">{inputs.householdSize} Pers.</span>
            <span>10</span>
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
            <Thermometer className="w-4 h-4" /> Temperature (°C)
          </label>
          <input 
            type="range" min="20" max="45" step="1"
            value={inputs.temperature}
            onChange={(e) => onInputChange('temperature', parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs font-medium text-slate-500 mt-2">
            <span>20°C</span>
            <span className="text-blue-600 font-bold">{inputs.temperature}°C</span>
            <span>45°C</span>
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
            <Wind className="w-4 h-4" /> Environment Settings
          </label>
          <div className="space-y-3">
            <select 
              value={inputs.season}
              onChange={(e) => onInputChange('season', e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="Summer">Summer</option>
              <option value="Winter">Winter</option>
              <option value="Monsoon">Monsoon</option>
            </select>
            <select 
              value={inputs.usagePattern}
              onChange={(e) => onInputChange('usagePattern', e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="Low">Low Usage (Frugal)</option>
              <option value="Moderate">Moderate Usage</option>
              <option value="High">High Usage (Intensive)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
          <label className="text-sm font-semibold text-slate-700">Leak Detected?</label>
          <button 
            onClick={() => onInputChange('leakStatus', !inputs.leakStatus)}
            className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${inputs.leakStatus ? 'bg-red-500' : 'bg-slate-300'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full transform transition-transform duration-200 ${inputs.leakStatus ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      <button 
        onClick={onTrain}
        disabled={isTraining}
        className={`mt-8 w-full py-3 px-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
          isTraining ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200 active:scale-95'
        }`}
      >
        <Settings2 className={`w-5 h-5 ${isTraining ? 'animate-spin' : ''}`} />
        {isTraining ? 'Training Model...' : 'Train ML Model'}
      </button>

      <div className="mt-6 pt-6 border-t border-slate-100 text-center">
        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Powered by Gemini & Scikit-Learn (Sim)</p>
      </div>
    </aside>
  );
};

export default Sidebar;
