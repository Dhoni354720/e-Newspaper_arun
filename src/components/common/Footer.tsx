import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Twitter, Facebook, Youtube, Send, ShieldCheck, Heart } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useSettings } from '@/context/SettingsContext';
import { repository } from '@/lib/repository';
import { Category } from '@/types/database';

export const Footer: React.FC = () => {
  const { language, t, getCategoryName } = useLanguage();
  const { settings, publicationName } = useSettings();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    repository.getCategories().then(setCategories);
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-editorial-950 text-editorial-300 border-t-4 border-crimson-800 pt-12 pb-8 mt-16 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Grid: Masthead, Categories, Quick Links, Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-12 border-b border-editorial-800">
          {/* Column 1: Brand & Editorial Mission (4 cols) */}
          <div className="lg:col-span-4">
            <h2 className="font-masthead text-3xl font-black text-white tracking-tight mb-2">
              {publicationName}
            </h2>
            <p className="text-crimson-400 font-serif italic text-sm mb-4">
              {settings.tagline}
            </p>
            <p className="text-xs sm:text-sm text-editorial-400 leading-relaxed mb-6">
              {language === 'mr' 
                ? 'महाराष्ट्र, देश आणि जागतिक पातळीवरील सत्य, निष्पक्ष आणि निर्भीक वृत्तपत्र. आधुनिक पत्रकारितेची नवी परंपरा.'
                : language === 'hi'
                ? 'महाराष्ट्र, राष्ट्रीय और अंतरराष्ट्रीय घटनाक्रम पर आधारित निष्पक्ष, सटीक और विश्वसनीय समाचार पत्र।'
                : 'Credible, independent and fearless digital journalism covering Maharashtra, national policies and global perspectives.'}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {settings.social_links.twitter && (
                <a
                  href={settings.social_links.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-editorial-900 border border-editorial-800 flex items-center justify-center text-editorial-400 hover:text-white hover:bg-crimson-800 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {settings.social_links.facebook && (
                <a
                  href={settings.social_links.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-editorial-900 border border-editorial-800 flex items-center justify-center text-editorial-400 hover:text-white hover:bg-crimson-800 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {settings.social_links.youtube && (
                <a
                  href={settings.social_links.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-editorial-900 border border-editorial-800 flex items-center justify-center text-editorial-400 hover:text-white hover:bg-crimson-800 transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Categories (4 cols) */}
          <div className="lg:col-span-4">
            <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-4 border-l-2 border-crimson-800 pl-2">
              {t('categories')}
            </h3>
            <ul className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
              <li>
                <Link to="/" className="text-editorial-400 hover:text-white transition-colors">
                  {t('allNews')}
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/category/${cat.slug}`}
                    className="text-editorial-400 hover:text-white transition-colors"
                  >
                    {getCategoryName(cat)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact & Institutional Info (4 cols) */}
          <div className="lg:col-span-4">
            <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-4 border-l-2 border-crimson-800 pl-2">
              {t('contactUs')}
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-editorial-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-crimson-500 flex-shrink-0 mt-0.5" />
                <span>{settings.office_address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-crimson-500 flex-shrink-0" />
                <a href={`tel:${settings.contact_phone}`} className="hover:text-white transition-colors">
                  {settings.contact_phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-crimson-500 flex-shrink-0" />
                <a href={`mailto:${settings.contact_email}`} className="hover:text-white transition-colors">
                  {settings.contact_email}
                </a>
              </li>
            </ul>

            <div className="mt-6 pt-4 border-t border-editorial-900">
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-2 text-xs text-editorial-400 hover:text-white bg-editorial-900/80 px-3 py-1.5 rounded border border-editorial-800 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-crimson-400" />
                {t('adminPortal')}
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Legal Pages, Notice, Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-editorial-500">
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/about" className="hover:text-editorial-300 transition-colors">
              {t('aboutUs')}
            </Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-editorial-300 transition-colors">
              {t('contactUs')}
            </Link>
            <span>•</span>
            <Link to="/privacy-policy" className="hover:text-editorial-300 transition-colors">
              {t('privacyPolicy')}
            </Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-editorial-300 transition-colors">
              {t('termsOfService')}
            </Link>
          </div>

          <div className="text-center md:text-right">
            <p>© {currentYear} {publicationName}. {t('allRightsReserved')}.</p>
            <p className="text-[11px] text-editorial-600 mt-1">
              {t('demoContentNotice')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
