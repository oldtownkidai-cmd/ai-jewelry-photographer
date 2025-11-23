import React, { useState } from 'react';
import { JewelryFormData, JewelryStyle } from './types';
import InputForm from './components/InputForm';
import PromptDisplay from './components/PromptDisplay';

const App: React.FC = () => {
  const [formData, setFormData] = useState<JewelryFormData>({
    category: '',
    materialDetails: '',
    dimensions: '',
    style: JewelryStyle.INDIAN_COMMERCIAL,
    referenceImage: null,
    referenceImagePreview: null,
  });

  return (
    <div className="min-h-screen bg-luxury-900 text-gray-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-luxury-700 bg-luxury-900/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-tr from-gold-600 to-gold-300 rounded-full flex items-center justify-center shadow-lg shadow-gold-900/50">
                <svg className="w-6 h-6 text-luxury-900" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-serif font-bold text-gold-400 tracking-wide">LUMINA</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Jewelry Prompt Canvas</p>
            </div>
          </div>
          <a href="#" className="hidden sm:block text-sm text-gold-500/80 hover:text-gold-400 transition-colors">Documentation</a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full lg:h-[calc(100vh-10rem)]">
          
          {/* Left Column: Input (5 cols) */}
          <div className="lg:col-span-5 h-full">
            <InputForm formData={formData} setFormData={setFormData} />
          </div>

          {/* Right Column: Output (7 cols) */}
          <div className="lg:col-span-7 h-full">
            <PromptDisplay formData={formData} />
          </div>
          
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-luxury-800 py-6 text-center text-luxury-700 text-sm">
        <p>&copy; {new Date().getFullYear()} Lumina. Powered by Google Gemini 2.5</p>
      </footer>
    </div>
  );
};

export default App;
