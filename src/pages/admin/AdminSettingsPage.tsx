import React, { useState } from 'react';
import { useSettings } from '@/context/SettingsContext';
import { Settings, Save, CheckCircle2, Globe, Share2, Mail, Phone, MapPin, Palette } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { settings, updateSettings } = useSettings();

  const [pubNameEn, setPubNameEn] = useState(settings.publication_name);
  const [pubNameMr, setPubNameMr] = useState(settings.publication_name_mr || 'जनवाणी न्यूज');
  const [pubNameHi, setPubNameHi] = useState(settings.publication_name_hi || 'जनवाणी न्यूज़');
  const [tagline, setTagline] = useState(settings.tagline);
  const [email, setEmail] = useState(settings.contact_email);
  const [phone, setPhone] = useState(settings.contact_phone);
  const [address, setAddress] = useState(settings.office_address);
  const [twitter, setTwitter] = useState(settings.social_links.twitter || '');
  const [facebook, setFacebook] = useState(settings.social_links.facebook || '');
  const [youtube, setYoutube] = useState(settings.social_links.youtube || '');
  const [telegram, setTelegram] = useState(settings.social_links.telegram || '');
  const [accentColor, setAccentColor] = useState(settings.theme_settings.accentColor || '#991b1b');
  const [enableBreaking, setEnableBreaking] = useState(settings.theme_settings.enableBreakingTicker ?? true);

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    try {
      await updateSettings({
        publication_name: pubNameEn.trim(),
        publication_name_mr: pubNameMr.trim(),
        publication_name_hi: pubNameHi.trim(),
        tagline: tagline.trim(),
        contact_email: email.trim(),
        contact_phone: phone.trim(),
        office_address: address.trim(),
        social_links: {
          twitter: twitter.trim(),
          facebook: facebook.trim(),
          youtube: youtube.trim(),
          telegram: telegram.trim(),
        },
        theme_settings: {
          accentColor,
          mastheadStyle: 'classic',
          enableBreakingTicker: enableBreaking,
        },
      });

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch {
      alert('सेटिंग्ज सेव्ह करताना त्रुटी आली.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto space-y-6">
      <div className="pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 font-serif flex items-center gap-2">
          <Settings className="w-6 h-6 text-crimson-800" />
          संपादकीय व संस्थात्मक सेटिंग्ज (Publication Site Settings)
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          वृत्तपत्राचे नाव, ध्येयवाक्य, संपर्क माहिती आणि थीम सेटिंग्ज केंद्रीय पातळीवरून बदला.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold rounded-lg flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>सर्व सेटिंग्ज यशस्वीरीत्या अद्ययावत झाल्या आहेत. संपूर्ण संकेतस्थळावर बदल लागू झाले.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Publication Name & Identity */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2 border-b pb-2">
            <Globe className="w-4 h-4 text-crimson-800" />
            वृत्तपत्राचे नाव व ओळख (Publication Identity)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                इंग्रजी नाव (English Name) *
              </label>
              <input
                type="text"
                required
                value={pubNameEn}
                onChange={(e) => setPubNameEn(e.target.value)}
                placeholder="JANVANI NEWS"
                className="w-full px-3 py-2 text-sm border rounded font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                मराठी नाव (Marathi Name) *
              </label>
              <input
                type="text"
                required
                value={pubNameMr}
                onChange={(e) => setPubNameMr(e.target.value)}
                placeholder="जनवाणी न्यूज"
                className="w-full px-3 py-2 text-sm border rounded font-serif font-bold text-gray-900"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                हिंदी नाव (Hindi Name) *
              </label>
              <input
                type="text"
                required
                value={pubNameHi}
                onChange={(e) => setPubNameHi(e.target.value)}
                placeholder="जनवाणी न्यूज़"
                className="w-full px-3 py-2 text-sm border rounded font-serif font-bold text-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              ध्येयवाक्य (Tagline) *
            </label>
            <input
              type="text"
              required
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="सत्य, निष्पक्ष आणि निर्भीक वृत्तपत्र"
              className="w-full px-3 py-2 text-sm border rounded font-serif italic text-gray-800"
            />
          </div>
        </div>

        {/* Section 2: Contact & Bureau Details */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2 border-b pb-2">
            <Mail className="w-4 h-4 text-crimson-800" />
            संपादकीय संपर्क तपशील (Contact Details)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                संपादकीय ईमेल (Contact Email) *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                कार्यालयीन दूरध्वनी (Phone)
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              कार्यालय पत्ता (Head Office Address)
            </label>
            <textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded"
            ></textarea>
          </div>
        </div>

        {/* Section 3: Social Links */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2 border-b pb-2">
            <Share2 className="w-4 h-4 text-crimson-800" />
            सोशल मीडिया लिंक्स (Social Media Handles)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-gray-700 block mb-1">Twitter / X URL</label>
              <input
                type="url"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="https://twitter.com/janvaninews"
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-1">Facebook URL</label>
              <input
                type="url"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                placeholder="https://facebook.com/janvaninews"
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-1">YouTube URL</label>
              <input
                type="url"
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                placeholder="https://youtube.com/@janvaninews"
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-1">Telegram URL</label>
              <input
                type="url"
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                placeholder="https://t.me/janvaninews"
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-crimson-800 hover:bg-crimson-900 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'सेव्ह होत आहे...' : 'सर्व सेटिंग्ज जतन करा (Save Settings)'}
          </button>
        </div>
      </form>
    </div>
  );
};
