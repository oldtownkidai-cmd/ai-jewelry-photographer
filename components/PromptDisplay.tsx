import React, { useState } from 'react';
import { JewelryFormData, JewelryStyle } from '../types';
import { MASTER_TEMPLATE, STYLE_CONFIGS } from '../constants';
import { generatePreviewImage } from '../services/geminiService';

interface PromptDisplayProps {
  formData: JewelryFormData;
}

const PromptDisplay: React.FC<PromptDisplayProps> = ({ formData }) => {
  const [copied, setCopied] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  // Core Processing Logic (Section II)
  const constructPrompt = () => {
    const config = STYLE_CONFIGS[formData.style];
    const category = formData.category || '[CATEGORY]';
    const materials = formData.materialDetails || '[MATERIAL_DETAILS]';
    const dimensions = formData.dimensions || '[DIMENSIONS]';

    return `
${config.directives}

**SUBJECT:** A hyper-realistic photograph of a ${category}. The subject is ${materials}. The dimensions are ${dimensions}.

**PHOTOGRAPHY & LIGHTING:** ${config.focalPlane}, studio shot. ${config.lightingSetup}. Crisp focus on the ${category}. ${config.dofInstruction}. Minimal chromatic aberration. Shot on a ${config.cameraLens}.

**ENVIRONMENT & STYLING:** ${config.backgroundStaging}. The color grading should be ${config.colorGrading}. ${config.tone}.

**MODEL (If Applicable):** ${config.modelDescription}.

**FINAL TOUCHES:** ${MASTER_TEMPLATE.FINAL_TOUCHES}
    `.trim();
  };

  const finalPrompt = constructPrompt();

  const handleCopy = () => {
    navigator.clipboard.writeText(finalPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGeneratePreview = async () => {
    if (!process.env.API_KEY) {
        alert("Please provide an API_KEY in the environment variables to use the preview feature.");
        return;
    }
    setGeneratingImage(true);
    setGeneratedImageUrl(null);
    try {
        const url = await generatePreviewImage(finalPrompt, formData.referenceImage);
        setGeneratedImageUrl(url);
    } catch (e) {
        alert("Failed to generate preview image. Check console for details.");
    } finally {
        setGeneratingImage(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Prompt Output Card */}
      <div className="bg-gradient-to-br from-luxury-800 to-luxury-900 rounded-xl border border-gold-900/30 shadow-2xl overflow-hidden flex flex-col h-full">
        <div className="p-6 border-b border-luxury-700 flex justify-between items-center bg-luxury-900/50 backdrop-blur-sm">
          <div>
             <h2 className="text-2xl text-gold-400 font-serif mb-1">Generated Professional Prompt</h2>
             <p className="text-gray-400 text-xs font-mono uppercase tracking-wider">{formData.style.toUpperCase()}</p>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-luxury-800 hover:bg-luxury-700 border border-gold-600/30 rounded-lg text-gold-500 text-sm transition-all"
          >
            {copied ? (
               <>
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                 Copied
               </>
            ) : (
                <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                Copy Prompt
                </>
            )}
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-black/20 custom-scrollbar">
          <pre className="font-mono text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
            {finalPrompt}
          </pre>
        </div>
      </div>

      {/* AI Visualization Card */}
      <div className="bg-luxury-800 rounded-xl border border-luxury-700 shadow-xl p-6">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg text-gold-200 font-serif">AI Visualization Preview</h3>
            <span className="text-xs text-gray-500 bg-luxury-900 px-2 py-1 rounded">Gemini Powered</span>
        </div>
        
        {generatedImageUrl ? (
            <div className="relative w-full aspect-square md:aspect-video rounded-lg overflow-hidden border border-gold-900/50 group">
                <img src={generatedImageUrl} alt="Generated Visualization" className="w-full h-full object-cover" />
                <button 
                  onClick={() => setGeneratedImageUrl(null)}
                  className="absolute top-2 right-2 bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600/80"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent text-xs text-center text-gray-300">
                    Preview generated by Gemini Flash Image
                </div>
            </div>
        ) : (
            <div className="w-full h-32 md:h-40 border border-dashed border-luxury-600 rounded-lg flex flex-col items-center justify-center bg-luxury-900/30">
                <p className="text-sm text-gray-500 mb-3 text-center px-4">Generate a quick preview of this prompt using Gemini</p>
                <button 
                    onClick={handleGeneratePreview}
                    disabled={generatingImage}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 ${generatingImage ? 'bg-luxury-700 text-gray-500' : 'bg-gold-600 text-white hover:bg-gold-500'}`}
                >
                    {generatingImage ? (
                        <>
                           <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Visualizing...
                        </>
                    ) : (
                        'Generate Preview'
                    )}
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default PromptDisplay;
