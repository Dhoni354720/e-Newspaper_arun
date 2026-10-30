import React from 'react';
import { ArticleStatus, SupportedLanguage } from '@/types/database';
import { FileEdit, Clock, CheckCircle2, Archive, Globe, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StatusBadgeProps {
  status: ArticleStatus;
  scheduledAt?: string | null;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, scheduledAt }) => {
  switch (status) {
    case 'published':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5" />
          प्रकाशित (Published)
        </span>
      );
    case 'submitted':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
          <Clock className="w-3.5 h-3.5" />
          पुनरावलोकन प्रलंबित (Submitted)
        </span>
      );
    case 'scheduled':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <Clock className="w-3.5 h-3.5" />
          नियोजित (Scheduled)
        </span>
      );
    case 'draft':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <FileEdit className="w-3.5 h-3.5" />
          मसुदा (Draft)
        </span>
      );
    case 'archived':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
          <Archive className="w-3.5 h-3.5" />
          संग्रहित (Archived)
        </span>
      );
    default:
      return null;
  }
};

interface LanguageIndicatorProps {
  currentLanguage: SupportedLanguage;
  translationGroupId: string;
  existingTranslations: Array<{ id: string; language: SupportedLanguage }>;
}

export const LanguageIndicator: React.FC<LanguageIndicatorProps> = ({
  currentLanguage,
  translationGroupId,
  existingTranslations,
}) => {
  const languages: Array<{ code: SupportedLanguage; label: string }> = [
    { code: 'mr', label: 'मराठी (MR)' },
    { code: 'hi', label: 'हिन्दी (HI)' },
    { code: 'en', label: 'English (EN)' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {languages.map((lang) => {
        const found = existingTranslations.find((t) => t.language === lang.code);
        const isCurrent = lang.code === currentLanguage;

        if (found) {
          return (
            <Link
              key={lang.code}
              to={`/admin/articles/${found.id}/edit`}
              className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded border font-medium transition-colors ${
                isCurrent
                  ? 'bg-crimson-800 text-white border-crimson-800'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
              }`}
              title={isCurrent ? 'सध्या संपादित करत असलेली भाषा' : 'या भाषेतील आवृत्ती उघडा'}
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              {lang.label}
            </Link>
          );
        }

        return (
          <Link
            key={lang.code}
            to={`/admin/articles/new?group=${translationGroupId}&lang=${lang.code}`}
            className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded border border-dashed border-gray-300 text-gray-600 hover:border-crimson-800 hover:text-crimson-800 hover:bg-gray-50 transition-colors"
            title={`${lang.label} आवृत्ती जोडा`}
          >
            <Plus className="w-3 h-3" />
            + {lang.label}
          </Link>
        );
      })}
    </div>
  );
};
