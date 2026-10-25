import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { User, Shield, LogOut, Key, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminAccountPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="p-6 sm:p-8 max-w-3xl mx-auto space-y-6">
      <div className="pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 font-serif flex items-center gap-2">
          <User className="w-6 h-6 text-crimson-800" />
          प्रशासक खाते (Administrator Account)
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          सध्या सक्रिय असलेले संपादकीय वापरकर्ता खाते व सत्र माहिती.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
          <div className="w-16 h-16 rounded-full bg-crimson-800 text-white flex items-center justify-center font-bold text-2xl font-serif">
            {user?.display_name?.charAt(0) || 'A'}
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">{user?.display_name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-crimson-50 text-crimson-800 border border-crimson-200 font-semibold uppercase">
                <Shield className="w-3 h-3" /> {user?.role}
              </span>
              <span className="text-xs text-gray-400">ID: {user?.id}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="font-semibold text-gray-500">प्रवेशाधिकार दर्जा:</span>
            <span className="font-bold text-gray-900">सर्वोच्च प्रशासक (Full Admin Privileges)</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="font-semibold text-gray-500">खाते तयार झाले:</span>
            <span>{new Date(user?.created_at || '').toLocaleDateString('mr-IN')}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="font-semibold text-gray-500">सत्र स्थिती:</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> सुरक्षित सत्र चालू आहे
            </span>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 uppercase tracking-wider"
          >
            <LogOut className="w-4 h-4" />
            सत्र समाप्त करा (Logout)
          </button>
        </div>
      </div>
    </div>
  );
};
