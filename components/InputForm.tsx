import React, { useRef, useState } from 'react';
import { JewelryFormData, JewelryStyle } from '../types';
import { analyzeJewelryImage } from '../services/geminiService';

interface InputFormProps {
  formData: JewelryFormData;
  setFormData: React.Dispatch<React.SetStateAction<JewelryFormData>>;
}

const InputForm: React.FC<InputFormProps> = ({ formData, setFormData }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      
      setFormData(prev => ({
        ...prev,
        referenceImage: file,
        referenceImagePreview: previewUrl
      }));
      setAnalysisError(null);
    }
  };

  const handleAutoAnalyze = async () => {
    if (!formData.referenceImage) return;

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const result = await analyzeJewelryImage(formData.referenceImage);
      setFormData(prev => ({
        ...prev,
        category: result.category || prev.category,
        materialDetails: result.materialDetails || prev.materialDetails,
        dimensions: result.dimensions || prev.dimensions,
      }));
    } catch (err) {
      setAnalysisError("Failed to analyze image. Please try again or enter details manually.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-luxury-800 p-6 rounded-xl border border-luxury-700 shadow-2xl h-full flex flex-col gap-6">
      <div className="border-b border-luxury-700 pb-4">
        <h2 className="text-2xl text-gold-400 font-serif mb-1">Input Collection</h2>
        <p className="text-gray-400 text-sm">Define the core variables for your prompt.</p>
      </div>

      <div className="space-y-5 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        
        {/* Style Selection */}
        <div>
          <label className="block text-gold-200 text-sm font-medium mb-2">Desired Style</label>
          <select
            name="style"
            value={formData.style}
            onChange={handleInputChange}
            className="w-full bg-luxury-900 border border-luxury-700 text-gold-50 rounded-lg p-3 focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all"
          >
            {Object.values(JewelryStyle).map((style) => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-gold-200 text-sm font-medium mb-2">Product Image / Reference</label>
          <div className="flex flex-col gap-3">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-luxury-600 rounded-lg p-6 text-center cursor-pointer hover:border-gold-500 transition-colors bg-luxury-900/50"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
              {formData.referenceImagePreview ? (
                <div className="relative h-48 w-full">
                  <img 
                    src={formData.referenceImagePreview} 
                    alt="Preview" 
                    className="h-full w-full object-contain rounded" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded">
                    <span className="text-white text-sm">Change Image</span>
                  </div>
                </div>
              ) : (
                <div className="text-gray-400">
                  <svg className="mx-auto h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm">Click to upload product image</p>
                </div>
              )}
            </div>

            {formData.referenceImage && (
              <button
                type="button"
                onClick={handleAutoAnalyze}
                disabled={isAnalyzing}
                className={`w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all ${
                  isAnalyzing 
                    ? 'bg-luxury-700 text-gray-400 cursor-not-allowed' 
                    : 'bg-gold-600 hover:bg-gold-500 text-white shadow-lg shadow-gold-900/20'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing with Gemini Vision...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Auto-Fill from Image
                  </>
                )}
              </button>
            )}
            {analysisError && <p className="text-red-400 text-xs mt-1">{analysisError}</p>}
          </div>
        </div>

        {/* Text Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-gold-200 text-sm font-medium mb-1">Product Subject [CATEGORY]</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              placeholder="e.g. Ring, Necklace, Earrings"
              className="w-full bg-luxury-900 border border-luxury-700 text-gold-50 rounded-lg p-3 focus:ring-2 focus:ring-gold-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-gold-200 text-sm font-medium mb-1">Material / Details</label>
            <textarea
              name="materialDetails"
              value={formData.materialDetails}
              onChange={handleInputChange}
              rows={3}
              placeholder="e.g. 18K Yellow Gold, Emerald Cut Diamond, Pavé setting"
              className="w-full bg-luxury-900 border border-luxury-700 text-gold-50 rounded-lg p-3 focus:ring-2 focus:ring-gold-500 outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-gold-200 text-sm font-medium mb-1">Size / Scale</label>
            <input
              type="text"
              name="dimensions"
              value={formData.dimensions}
              onChange={handleInputChange}
              placeholder="e.g. 18mm diameter, 1.5ct main stone"
              className="w-full bg-luxury-900 border border-luxury-700 text-gold-50 rounded-lg p-3 focus:ring-2 focus:ring-gold-500 outline-none"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default InputForm;
