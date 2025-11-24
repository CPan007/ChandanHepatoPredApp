import React, { useState } from 'react';
import { analyzeClaimFraud } from '../services/geminiService';
import { ClaimData, ClaimPredictionResult } from '../types';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { AlertTriangle, ShieldAlert, ShieldCheck, FileText, Activity, ArrowRight, DollarSign, MapPin, Briefcase, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const initialData: ClaimData = {
  claimAmount: '',
  patientAge: '',
  patientGender: 'Male',
  providerSpecialty: '',
  claimStatus: 'Submitted',
  patientIncome: '',
  patientMaritalStatus: 'Single',
  patientEmploymentStatus: 'Employed',
  providerLocation: '',
  claimType: 'Medical',
  claimSubmissionMethod: 'Electronic',
  diseaseSeverity: 'Medium',
};

const PERSONAS = {
  low: {
    label: "Low Risk - Alice Brown (Legitimate)",
    data: {
        claimAmount: '250',
        patientAge: '34',
        patientGender: 'Female',
        providerSpecialty: 'General Practice',
        claimStatus: 'Submitted',
        patientIncome: '65000',
        patientMaritalStatus: 'Married',
        patientEmploymentStatus: 'Employed',
        providerLocation: 'Boston, MA',
        claimType: 'Medical',
        claimSubmissionMethod: 'Electronic',
        diseaseSeverity: 'Low',
    } as ClaimData
  },
  medium: {
    label: "Medium Risk - Michael Wilson (Suspicious)",
    data: {
        claimAmount: '4500',
        patientAge: '29',
        patientGender: 'Male',
        providerSpecialty: 'Chiropractor',
        claimStatus: 'Pending Review',
        patientIncome: '35000',
        patientMaritalStatus: 'Single',
        patientEmploymentStatus: 'Unemployed',
        providerLocation: 'Miami, FL',
        claimType: 'Medical',
        claimSubmissionMethod: 'Portal',
        diseaseSeverity: 'Medium',
    } as ClaimData
  },
  high: {
    label: "High Risk - David Miller (Fraudulent)",
    data: {
        claimAmount: '85000',
        patientAge: '45',
        patientGender: 'Male',
        providerSpecialty: 'Dermatology',
        claimStatus: 'Submitted',
        patientIncome: '120000',
        patientMaritalStatus: 'Divorced',
        patientEmploymentStatus: 'Self-Employed',
        providerLocation: 'Los Angeles, CA',
        claimType: 'Pharmacy', // Suspiciously high amount for pharmacy
        claimSubmissionMethod: 'Paper', // Manual submission to potentially hide digital tracks
        diseaseSeverity: 'Critical', // Mismatch with Dermatology
    } as ClaimData
  }
};

export const ClaimFraud: React.FC = () => {
  const [formData, setFormData] = useState<ClaimData>(initialData);
  const [result, setResult] = useState<ClaimPredictionResult | null>(null);
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
      const prediction = await analyzeClaimFraud(formData);
      setResult(prediction);
    } catch (err: any) {
      setError(err.message || 'An error occurred during analysis');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Claim Fraud Detection</h1>
            <p className="mt-2 text-gray-600">AI-powered analysis to detect potential insurance claim anomalies.</p>
          </div>
          <Link to="/">
             <Button variant="outline">Back to Home</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-6">

            {/* Persona Selector */}
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
               <div className="flex items-center gap-2 text-teal-700 font-medium">
                  <Users className="h-5 w-5" />
                  <span>Test Scenarios:</span>
               </div>
               <select 
                 className="block w-full sm:w-auto flex-grow rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm"
                 onChange={handlePersonaChange}
                 defaultValue=""
               >
                 <option value="" disabled>Select a scenario...</option>
                 <option value="low">{PERSONAS.low.label}</option>
                 <option value="medium">{PERSONAS.medium.label}</option>
                 <option value="high">{PERSONAS.high.label}</option>
               </select>
               <div className="text-xs text-teal-600 italic">
                 Populate fields with predefined risk patterns.
               </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Claim Details */}
                  <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900 border-b border-gray-100 pb-2 mb-4">
                      Claim Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Claim Amount ($)"
                        name="claimAmount"
                        type="number"
                        required
                        icon={<DollarSign className="h-4 w-4 text-gray-400" />}
                        value={formData.claimAmount}
                        onChange={handleChange}
                      />
                       <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Claim Status</label>
                        <select
                          name="claimStatus"
                          value={formData.claimStatus}
                          onChange={handleChange}
                          className="block w-full rounded-md border-gray-300 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-medical-600 sm:text-sm"
                        >
                          <option>Submitted</option>
                          <option>Pending Review</option>
                          <option>Approved</option>
                          <option>Rejected</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Claim Type</label>
                        <select
                          name="claimType"
                          value={formData.claimType}
                          onChange={handleChange}
                          className="block w-full rounded-md border-gray-300 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-medical-600 sm:text-sm"
                        >
                          <option>Medical</option>
                          <option>Dental</option>
                          <option>Vision</option>
                          <option>Pharmacy</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Submission Method</label>
                        <select
                          name="claimSubmissionMethod"
                          value={formData.claimSubmissionMethod}
                          onChange={handleChange}
                          className="block w-full rounded-md border-gray-300 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-medical-600 sm:text-sm"
                        >
                          <option>Electronic</option>
                          <option>Paper</option>
                          <option>Portal</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Patient & Provider Info */}
                  <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900 border-b border-gray-100 pb-2 mb-4">
                      Patient & Provider
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input label="Patient Age" name="patientAge" type="number" required value={formData.patientAge} onChange={handleChange} />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Patient Gender</label>
                        <select name="patientGender" value={formData.patientGender} onChange={handleChange} className="block w-full rounded-md border-gray-300 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-medical-600 sm:text-sm">
                          <option>Male</option>
                          <option>Female</option>
                        </select>
                      </div>
                      <Input label="Provider Specialty" name="providerSpecialty" required value={formData.providerSpecialty} onChange={handleChange} placeholder="e.g. Cardiology" icon={<Briefcase className="h-4 w-4 text-gray-400" />} />
                      <Input label="Provider Location" name="providerLocation" required value={formData.providerLocation} onChange={handleChange} placeholder="City, State" icon={<MapPin className="h-4 w-4 text-gray-400" />} />
                      
                      <Input label="Annual Income ($)" name="patientIncome" type="number" required value={formData.patientIncome} onChange={handleChange} />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                        <select name="patientMaritalStatus" value={formData.patientMaritalStatus} onChange={handleChange} className="block w-full rounded-md border-gray-300 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-medical-600 sm:text-sm">
                          <option>Single</option>
                          <option>Married</option>
                          <option>Divorced</option>
                          <option>Widowed</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Employment</label>
                        <select name="patientEmploymentStatus" value={formData.patientEmploymentStatus} onChange={handleChange} className="block w-full rounded-md border-gray-300 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-medical-600 sm:text-sm">
                          <option>Employed</option>
                          <option>Unemployed</option>
                          <option>Retired</option>
                          <option>Student</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Disease Severity</label>
                        <select name="diseaseSeverity" value={formData.diseaseSeverity} onChange={handleChange} className="block w-full rounded-md border-gray-300 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-medical-600 sm:text-sm">
                          <option>Low</option>
                          <option>Medium</option>
                          <option>High</option>
                          <option>Critical</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button type="submit" isLoading={isLoading} className="w-full md:w-auto min-w-[200px]">
                      Analyze For Fraud
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
                  <ShieldAlert className="h-5 w-5 text-gray-700" />
                  Fraud Analysis
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
                    <ShieldCheck className="h-16 w-16 mb-4 opacity-50" />
                    <p className="text-lg">Submit claim details to check for potential fraud.</p>
                  </div>
                )}

                {isLoading && (
                  <div className="flex flex-col items-center justify-center h-full py-12">
                     <div className="relative">
                        <div className="w-16 h-16 border-4 border-medical-100 border-t-medical-600 rounded-full animate-spin"></div>
                     </div>
                     <p className="mt-4 text-sm text-gray-500 font-medium">Analyzing patterns...</p>
                  </div>
                )}

                {result && (
                  <div className="space-y-6 animate-fade-in">
                    {/* Score Card */}
                    <div className={`rounded-xl p-6 text-center border ${
                      result.isFraud ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
                    }`}>
                      <p className="text-sm font-medium uppercase tracking-wider text-gray-600 mb-1">
                        Fraud Prediction
                      </p>
                      <h3 className={`text-3xl font-black ${
                         result.isFraud ? 'text-red-700' : 'text-green-700'
                      }`}>
                        {result.isFraud ? "FRAUD LIKELY" : "LEGITIMATE"}
                      </h3>
                      <div className="mt-2 text-sm font-semibold">
                        Risk Score: {result.riskScore}/100
                      </div>
                    </div>

                    {/* Reasoning */}
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2">Reasoning</h4>
                      <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
                        {result.reasoning}
                      </p>
                    </div>

                    {/* Flagged Fields */}
                    {result.flaggedFields.length > 0 && (
                        <div>
                        <h4 className="text-sm font-bold text-red-700 uppercase tracking-wide mb-2">Flagged Anomalies</h4>
                        <ul className="space-y-2">
                            {result.flaggedFields.map((field, idx) => (
                            <li key={idx} className="flex items-center text-sm text-red-600 bg-red-50 px-3 py-1.5 rounded-full w-fit">
                                <AlertTriangle className="h-3 w-3 mr-2" />
                                {field}
                            </li>
                            ))}
                        </ul>
                        </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};