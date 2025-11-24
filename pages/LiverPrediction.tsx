import React, { useState } from 'react';
import { analyzePatientData } from '../services/geminiService';
import { PatientData, PredictionResult } from '../types';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { AlertTriangle, FileText, Activity, ArrowRight, FlaskConical, Users } from 'lucide-react';
import { ChatAssistant } from '../components/ChatAssistant';

const initialData: PatientData = {
  age: '',
  gender: 'Male',
  totalBilirubin: '',
  directBilirubin: '',
  alkalinePhosphotase: '',
  alamineAminotransferase: '',
  aspartateAminotransferase: '',
  totalProteins: '',
  albumin: '',
  albuminGlobulinRatio: '',
};

const PERSONAS = {
  low: {
    label: "Low Risk - John Doe (Healthy)",
    data: {
      age: '32',
      gender: 'Male',
      totalBilirubin: '0.8',
      directBilirubin: '0.2',
      alkalinePhosphotase: '65',
      alamineAminotransferase: '22',
      aspartateAminotransferase: '24',
      totalProteins: '7.0',
      albumin: '4.2',
      albuminGlobulinRatio: '1.5',
    } as PatientData
  },
  medium: {
    label: "Medium Risk - Sarah Smith (Early Stage)",
    data: {
      age: '45',
      gender: 'Female',
      totalBilirubin: '1.4',
      directBilirubin: '0.5',
      alkalinePhosphotase: '180',
      alamineAminotransferase: '45',
      aspartateAminotransferase: '50',
      totalProteins: '6.5',
      albumin: '3.2',
      albuminGlobulinRatio: '0.9',
    } as PatientData
  },
  high: {
    label: "High Risk - Robert Johnson (Advanced)",
    data: {
      age: '58',
      gender: 'Male',
      totalBilirubin: '3.5',
      directBilirubin: '1.8',
      alkalinePhosphotase: '290',
      alamineAminotransferase: '120',
      aspartateAminotransferase: '145',
      totalProteins: '5.8',
      albumin: '2.4',
      albuminGlobulinRatio: '0.6',
    } as PatientData
  }
};

export const LiverPrediction: React.FC = () => {
  const [formData, setFormData] = useState<PatientData>(initialData);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePersonaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const key = e.target.value as keyof typeof PERSONAS;
    if (PERSONAS[key]) {
      setFormData(PERSONAS[key].data);
      setResult(null);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const prediction = await analyzePatientData(formData);
      setResult(prediction);
    } catch (err: any) {
      setError(err.message || 'An error occurred during analysis');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setFormData(initialData);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Patient Diagnostic Form</h1>
          <p className="mt-2 text-gray-600">Enter patient vitals and liver function test results for AI-assisted risk assessment.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Persona Selector */}
            <div className="bg-medical-50 border border-medical-200 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
               <div className="flex items-center gap-2 text-medical-700 font-medium">
                  <Users className="h-5 w-5" />
                  <span>Test Personas:</span>
               </div>
               <select 
                 className="block w-full sm:w-auto flex-grow rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-medical-500 focus:outline-none focus:ring-medical-500 sm:text-sm"
                 onChange={handlePersonaChange}
                 defaultValue=""
               >
                 <option value="" disabled>Select a dummy patient...</option>
                 <option value="low">{PERSONAS.low.label}</option>
                 <option value="medium">{PERSONAS.medium.label}</option>
                 <option value="high">{PERSONAS.high.label}</option>
               </select>
               <div className="text-xs text-medical-600 italic">
                 Select a persona to auto-populate clinical data.
               </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Demographics */}
                  <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900 border-b border-gray-100 pb-2 mb-4">
                      Demographics
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Age"
                        name="age"
                        type="number"
                        required
                        min="0"
                        max="120"
                        value={formData.age}
                        onChange={handleChange}
                        placeholder="e.g. 45"
                      />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className="block w-full rounded-md border-gray-300 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-medical-600 sm:text-sm sm:leading-6"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Clinical Data */}
                  <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900 border-b border-gray-100 pb-2 mb-4">
                      Clinical Chemistry
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input label="Total Bilirubin (mg/dL)" name="totalBilirubin" type="number" step="0.1" required value={formData.totalBilirubin} onChange={handleChange} />
                      <Input label="Direct Bilirubin (mg/dL)" name="directBilirubin" type="number" step="0.1" required value={formData.directBilirubin} onChange={handleChange} />
                      <Input label="Alkaline Phosphotase (IU/L)" name="alkalinePhosphotase" type="number" required value={formData.alkalinePhosphotase} onChange={handleChange} />
                      <Input label="Alamine Aminotransferase (IU/L)" name="alamineAminotransferase" type="number" required value={formData.alamineAminotransferase} onChange={handleChange} />
                      <Input label="Aspartate Aminotransferase (IU/L)" name="aspartateAminotransferase" type="number" required value={formData.aspartateAminotransferase} onChange={handleChange} />
                      <Input label="Total Proteins (g/dL)" name="totalProteins" type="number" step="0.1" required value={formData.totalProteins} onChange={handleChange} />
                      <Input label="Albumin (g/dL)" name="albumin" type="number" step="0.1" required value={formData.albumin} onChange={handleChange} />
                      <Input label="Albumin/Globulin Ratio" name="albuminGlobulinRatio" type="number" step="0.01" required value={formData.albuminGlobulinRatio} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="pt-4 flex flex-wrap items-center justify-end gap-3">
                    <Button type="button" variant="ghost" onClick={handleReset} disabled={isLoading}>
                      Reset Form
                    </Button>
                    <Button type="submit" isLoading={isLoading} className="w-full md:w-auto min-w-[160px]">
                      Analyze Data
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-1">
             <div className="bg-white shadow rounded-lg border border-gray-200 h-full flex flex-col">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-medical-600" />
                  Analysis Report
                </h2>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                {error && (
                   <div className="rounded-md bg-red-50 p-4 mb-4">
                    <div className="flex">
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Error</h3>
                        <div className="text-sm text-red-700 mt-1">{error}</div>
                      </div>
                    </div>
                  </div>
                )}

                {!result && !isLoading && !error && (
                  <div className="flex flex-col items-center justify-center text-center h-full text-gray-400 py-12">
                    <Activity className="h-16 w-16 mb-4 opacity-50" />
                    <p className="text-lg">Enter patient data to generate an AI risk assessment.</p>
                  </div>
                )}

                {isLoading && (
                  <div className="flex flex-col items-center justify-center h-full py-12">
                     <div className="relative">
                        <div className="w-16 h-16 border-4 border-medical-100 border-t-medical-600 rounded-full animate-spin"></div>
                     </div>
                     <p className="mt-4 text-sm text-gray-500 font-medium">Analyzing biological markers...</p>
                  </div>
                )}

                {result && (
                  <div className="space-y-6 animate-fade-in">
                    {/* Score Card */}
                    <div className={`rounded-xl p-6 text-center border ${
                      result.riskLevel === 'High' ? 'bg-red-50 border-red-200' :
                      result.riskLevel === 'Medium' ? 'bg-yellow-50 border-yellow-200' :
                      'bg-green-50 border-green-200'
                    }`}>
                      <p className="text-sm font-medium uppercase tracking-wider text-gray-600 mb-1">Risk Level</p>
                      <h3 className={`text-3xl font-black ${
                         result.riskLevel === 'High' ? 'text-red-700' :
                         result.riskLevel === 'Medium' ? 'text-yellow-700' :
                         'text-green-700'
                      }`}>
                        {result.riskLevel.toUpperCase()}
                      </h3>
                      <div className="mt-2 text-sm font-semibold">
                        Probability: {result.probability}%
                      </div>
                    </div>

                    {/* Detailed Analysis */}
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2">Clinical Analysis</h4>
                      <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg">
                        {result.analysis}
                      </p>
                    </div>

                    {/* Recommendations */}
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2">AI Recommendations</h4>
                      <ul className="space-y-2">
                        {result.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start text-sm text-gray-600">
                            <ArrowRight className="h-4 w-4 text-medical-500 mt-0.5 mr-2 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-gray-100">
                         <div className="flex items-start gap-2 text-xs text-gray-400">
                            <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                            <p>This is an AI-generated auxiliary tool. Results should not be considered a definitive medical diagnosis. Always verify with clinical judgment.</p>
                         </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ChatAssistant />
    </div>
  );
};