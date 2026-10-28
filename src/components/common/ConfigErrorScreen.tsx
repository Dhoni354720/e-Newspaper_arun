import React from 'react';
import { AlertTriangle, ShieldAlert, Server, ExternalLink } from 'lucide-react';

export const ConfigErrorScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4 font-sans text-stone-900">
      <div className="max-w-xl w-full bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden">
        {/* Top Masthead Warning Banner */}
        <div className="bg-red-700 text-white px-6 py-5 flex items-center space-x-3">
          <ShieldAlert className="w-8 h-8 text-amber-300 flex-shrink-0" />
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              दैनिक जगत समीक्षा — विन्यास त्रुटि (Configuration Error)
            </h1>
            <p className="text-xs text-red-100 mt-0.5">
              Production Backend Missing / उत्पादन सर्वर अनुपलब्ध
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r text-sm text-amber-900 flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">
                उत्पादन वातावरण में Supabase डेटाबेस विन्यास अनुपस्थित है।
              </p>
              <p className="text-xs text-amber-800 leading-relaxed">
                सुरक्षा नियमों के अनुसार, वास्तविक पाठकों को स्थानीय ब्राउज़र स्टोरेज (LocalStorage) में सुरक्षित समाचार नहीं दिखाया जा सकता। वेबसाइट को चालू करने के लिए मान्य Supabase वातावरण चर (Environment Variables) आवश्यक हैं।
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-bold text-stone-800 flex items-center gap-2">
              <Server className="w-4 h-4 text-stone-600" />
              आवश्यक वातावरण चर (Required Environment Variables):
            </h2>
            <div className="bg-stone-900 text-emerald-400 p-4 rounded-lg font-mono text-xs space-y-2 overflow-x-auto">
              <div>VITE_SUPABASE_URL=https://your-project-id.supabase.co</div>
              <div>VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</div>
            </div>
          </div>

          <div className="text-xs text-stone-600 space-y-2 bg-stone-50 p-4 rounded-lg border border-stone-200">
            <p className="font-semibold text-stone-800">समाधान के चरण (Next Steps for Webmaster):</p>
            <ol className="list-decimal pl-4 space-y-1">
              <li>Vercel या होस्टिंग डैशबोर्ड में <strong>Project Settings → Environment Variables</strong> पर जाएं।</li>
              <li><code>VITE_SUPABASE_URL</code> तथा <code>VITE_SUPABASE_ANON_KEY</code> को Production और Preview के लिए दर्ज करें।</li>
              <li>परियोजना को पुनः डिप्लॉय (Redeploy) करें।</li>
            </ol>
          </div>

          <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>दैनिक जगत समीक्षा · सुरक्षा प्रणाली</span>
            <a
              href="https://supabase.com/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-red-700 hover:text-red-800 font-medium"
            >
              Supabase Docs <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
