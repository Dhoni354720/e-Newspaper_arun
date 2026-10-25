import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { repository } from '@/lib/repository';
import { generateSlug } from '@/lib/slug';
import { calculateReadingTime } from '@/lib/readingTime';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { MediaUploader } from '@/components/admin/MediaUploader';
import { LanguageIndicator } from '@/components/admin/StatusBadge';
import { Article, Category, SupportedLanguage, ArticleStatus } from '@/types/database';
import { 
  Save, 
  Send, 
  Clock, 
  Eye, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Globe, 
  Tag, 
  Layers, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const AdminArticleEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const groupQuery = searchParams.get('group');
  const langQuery = searchParams.get('lang') as SupportedLanguage | null;

  const [categories, setCategories] = useState<Category[]>([]);
  const [existingTranslations, setExistingTranslations] = useState<Array<{ id: string; language: SupportedLanguage }>>([]);

  // Form State
  const [headline, setHeadline] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [language, setLanguage] = useState<SupportedLanguage>(langQuery || 'mr');
  const [translationGroupId, setTranslationGroupId] = useState(groupQuery || `grp-${Date.now()}`);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [tagsInput, setTagsInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [excerpt, setExcerpt] = useState('');
  const [body, setBody] = useState('');
  const [featuredImagePath, setFeaturedImagePath] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [status, setStatus] = useState<ArticleStatus>('draft');
  const [isBreaking, setIsBreaking] = useState(false);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');

  // UI state
  const [isLoading, setIsLoading] = useState(Boolean(id));
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Load existing article if editing
  useEffect(() => {
    repository.getCategories().then(setCategories);

    if (id) {
      repository.getArticleById(id, { includePrivate: true }).then(async (art) => {
        if (!art) {
          navigate('/admin/articles');
          return;
        }

        setHeadline(art.headline);
        setSubtitle(art.subtitle || '');
        setSlug(art.slug);
        setSlugManuallyEdited(true);
        setLanguage(art.language);
        setTranslationGroupId(art.translation_group_id);
        setSelectedCategoryIds(art.category_ids || []);
        setTags(art.tags || []);
        setExcerpt(art.excerpt);
        setBody(art.body);
        setFeaturedImagePath(art.featured_image_path || '');
        setImageAlt(art.image_alt || '');
        setImageCaption(art.image_caption || '');
        setStatus(art.status);
        setIsBreaking(art.is_breaking);
        setSeoTitle(art.seo_title || '');
        setSeoDescription(art.seo_description || '');
        if (art.scheduled_at) {
          setScheduledAt(art.scheduled_at.slice(0, 16)); // format for datetime-local
        }

        // Fetch translations for indicator
        const trans = await repository.getAllTranslationsForGroup(art.translation_group_id);
        setExistingTranslations(trans.map((t) => ({ id: t.id, language: t.language })));
        setIsLoading(false);
      });
    } else if (groupQuery) {
      // If creating translation for existing group
      repository.getAllTranslationsForGroup(groupQuery).then((trans) => {
        setExistingTranslations(trans.map((t) => ({ id: t.id, language: t.language })));
      });
    }
  }, [id, groupQuery]);

  // Auto-generate slug from headline if not manually altered
  useEffect(() => {
    if (!slugManuallyEdited && headline) {
      setSlug(generateSlug(headline));
    }
  }, [headline, slugManuallyEdited]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!headline.trim()) errs.headline = 'मथळा (Headline) आवश्यक आहे.';
    if (!slug.trim()) errs.slug = 'URL Slug आवश्यक आहे.';
    if (!excerpt.trim()) errs.excerpt = 'संक्षिप्त सारांश (Excerpt) आवश्यक आहे.';
    if (!body.trim() || body === '<p></p>') errs.body = 'बातमीचा सविस्तर मजकूर आवश्यक आहे.';
    if (selectedCategoryIds.length === 0) errs.category = 'किमान एक विभाग निवडणे आवश्यक आहे.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async (targetStatus?: ArticleStatus, scheduleTime?: string) => {
    if (!validate()) {
      setFeedback({ type: 'error', message: 'कृपया सर्व आवश्यक रकाने तपासा आणि त्रुटी सुधारा.' });
      return;
    }

    setIsSaving(true);
    setFeedback(null);

    const calculatedTime = calculateReadingTime(body, language === 'mr' || language === 'hi');
    const finalStatus = targetStatus || status;

    const payload: Partial<Article> = {
      id: id || undefined,
      headline: headline.trim(),
      subtitle: subtitle.trim() || undefined,
      slug: slug.trim(),
      language,
      translation_group_id: translationGroupId,
      category_ids: selectedCategoryIds,
      tags,
      excerpt: excerpt.trim(),
      body,
      featured_image_path: featuredImagePath || undefined,
      image_alt: imageAlt.trim() || undefined,
      image_caption: imageCaption.trim() || undefined,
      status: finalStatus,
      is_breaking: isBreaking,
      seo_title: seoTitle.trim() || headline.trim(),
      seo_description: seoDescription.trim() || excerpt.trim(),
      reading_time_minutes: calculatedTime,
      scheduled_at: finalStatus === 'scheduled' ? (scheduleTime || new Date(scheduledAt).toISOString()) : null,
    };

    try {
      const saved = await repository.saveArticle(payload);
      setStatus(saved.status);
      setFeedback({
        type: 'success',
        message: finalStatus === 'published'
          ? 'बातमी यशस्वीपणे प्रकाशित झाली!'
          : finalStatus === 'scheduled'
          ? 'बातमी यशस्वीपणे नियोजित (Scheduled) केली!'
          : 'मसुदा सुरक्षितपणे सेव्ह झाला.',
      });

      // Update URL if new article was created
      if (!id) {
        navigate(`/admin/articles/${saved.id}/edit`, { replace: true });
      }
    } catch (e: unknown) {
      setFeedback({ type: 'error', message: 'सेव्ह करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.' });
    } finally {
      setIsSaving(false);
      setShowScheduleModal(false);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagsInput.trim().replace(/^#/, '');
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
        setTagsInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  if (isLoading) {
    return (
      <div className="p-16 text-center text-gray-500">
        <div className="w-8 h-8 border-4 border-crimson-800 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        बातमी लोड होत आहे...
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/articles"
            className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-600 transition-colors"
            title="सर्व बातम्यांकडे परत"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 font-serif">
              {id ? 'बातमी संपादित करा (Edit Article)' : 'नवीन बातमी लिहा (New Article)'}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5 font-mono">
              स्थिती: <span className="uppercase font-bold text-crimson-800">{status}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Save Draft */}
          <button
            type="button"
            onClick={() => handleSave('draft')}
            disabled={isSaving}
            className="px-3.5 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5 text-gray-500" />
            मसुदा सेव्ह करा (Save Draft)
          </button>

          {/* Schedule Button */}
          <button
            type="button"
            onClick={() => setShowScheduleModal(true)}
            disabled={isSaving}
            className="px-3.5 py-2 bg-blue-50 border border-blue-300 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            नियोजित करा (Schedule)
          </button>

          {/* Unpublish button if currently published */}
          {status === 'published' && (
            <button
              type="button"
              onClick={() => handleSave('draft')}
              disabled={isSaving}
              className="px-3.5 py-2 bg-amber-50 border border-amber-300 hover:bg-amber-100 text-amber-800 text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
              अप्रकाशित करा
            </button>
          )}

          {/* Publish Button */}
          <button
            type="button"
            onClick={() => handleSave('published')}
            disabled={isSaving}
            className="px-4 py-2 bg-crimson-800 hover:bg-crimson-900 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 uppercase tracking-wider"
          >
            <Send className="w-3.5 h-3.5" />
            थेट प्रकाशित करा (Publish Now)
          </button>

          {/* Preview Public Link */}
          {slug && (
            <Link
              to={`/article/${slug}`}
              target="_blank"
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-600"
              title="पूर्वदृश्य पहा (Preview in reader view)"
            >
              <Eye className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-lg text-xs font-semibold flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-300 text-emerald-800'
              : 'bg-red-50 border border-red-300 text-red-800'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Multilingual Translation Switcher Bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-crimson-800" />
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            अनुवाद गट (Translation Group):
          </span>
          <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
            {translationGroupId}
          </span>
        </div>

        <LanguageIndicator
          currentLanguage={language}
          translationGroupId={translationGroupId}
          existingTranslations={existingTranslations}
        />
      </div>

      {/* Main Form 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Headline, Excerpt, Body Editor (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Headline */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block mb-1">
                बातमीचा मथळा (Headline) *
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="उदा. पुणे-मुंबई दरम्यान नवीन ग्रीनफील्ड द्रुतगती कॉरिडोअरला मंजुरी"
                className={`w-full px-4 py-2.5 text-base sm:text-lg font-serif font-bold text-gray-950 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-crimson-800 focus:bg-white focus:outline-none ${
                  errors.headline ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.headline && (
                <p className="text-[11px] text-red-600 mt-1">{errors.headline}</p>
              )}
            </div>

            {/* Subtitle */}
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-1">
                उपमथळा (Optional Subtitle)
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="उदा. दळणवळण क्रांती : राज्य मंत्रिमंडळाचा महत्त्वपूर्ण निर्णय"
                className="w-full px-3 py-2 text-sm text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-crimson-800 focus:bg-white focus:outline-none"
              />
            </div>

            {/* URL Slug */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                  URL Slug (स्थायी वेब पत्ता) *
                </label>
                {!slugManuallyEdited && (
                  <span className="text-[10px] text-crimson-700 font-semibold">
                    (मथळ्यावरून आपोआप तयार होत आहे)
                  </span>
                )}
              </div>
              <div className="flex items-center">
                <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 text-gray-500 text-xs rounded-l-lg font-mono">
                  /article/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setSlugManuallyEdited(true);
                  }}
                  className={`w-full px-3 py-2 text-xs font-mono text-gray-800 bg-gray-50 border rounded-r-lg focus:ring-1 focus:ring-crimson-800 focus:bg-white focus:outline-none ${
                    errors.slug ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.slug && <p className="text-[11px] text-red-600 mt-1">{errors.slug}</p>}
            </div>
          </div>

          {/* 2. Excerpt */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
            <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block mb-1">
              संक्षिप्त सारांश (Excerpt) *
            </label>
            <p className="text-[11px] text-gray-500 mb-2">
              हा मजकूर मुख्य पानावर आणि सोशल मीडिया शेअरिंगवर दिसतो (१-२ ओळी).
            </p>
            <textarea
              rows={3}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="बातमीचा मुख्य मुद्दा थोडक्यात लिहा..."
              className={`w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 border rounded-lg focus:ring-1 focus:ring-crimson-800 focus:bg-white focus:outline-none ${
                errors.excerpt ? 'border-red-500' : 'border-gray-300'
              }`}
            ></textarea>
            {errors.excerpt && <p className="text-[11px] text-red-600 mt-1">{errors.excerpt}</p>}
          </div>

          {/* 3. Rich Text Body Editor */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-2">
            <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
              सविस्तर बातमी मजकूर (Rich Text Body) *
            </label>
            <RichTextEditor content={body} onChange={setBody} />
            {errors.body && <p className="text-[11px] text-red-600 mt-1">{errors.body}</p>}
          </div>

          {/* 4. SEO Metadata */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider border-b border-gray-200 pb-2">
              शोध इंजिन ऑप्टिमायझेशन (SEO Metadata)
            </h3>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">
                SEO Title (शीर्षक)
              </label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder={headline || 'Google वर दिसणारे शीर्षक'}
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded focus:ring-1 focus:ring-crimson-800"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">
                SEO Meta Description (वर्णन)
              </label>
              <textarea
                rows={2}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder={excerpt || 'Google शोध परिणामात दिसणारे २ ओळींचे वर्णन'}
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded focus:ring-1 focus:ring-crimson-800"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Right Column: Settings, Categories, Image, Tags (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Language and Breaking Toggle */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider border-b border-gray-200 pb-2">
              प्रकाशन पर्याय (Publishing Options)
            </h3>

            {/* Language Selection */}
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                बातमीची भाषा (Content Language) *
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="w-full py-2 px-3 text-xs bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-crimson-800 font-semibold"
              >
                <option value="mr">मराठी (Marathi)</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="en">English (English)</option>
              </select>
            </div>

            {/* Breaking News Toggle */}
            <div className="pt-2">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isBreaking}
                  onChange={(e) => setIsBreaking(e.target.checked)}
                  className="w-4 h-4 text-crimson-800 rounded border-gray-300 focus:ring-crimson-800"
                />
                <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-crimson-800" />
                  ब्रेकिंग न्यूज म्हणून दाखवा (Breaking Alert)
                </span>
              </label>
              <p className="text-[11px] text-gray-500 mt-1 pl-6">
                ही बातमी मुख्य पानावरील लाल ब्रेकिंग तिकरमध्ये थेट दर्शवली जाईल.
              </p>
            </div>
          </div>

          {/* Categories Selector */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-crimson-800" />
                विभाग निवडा (Categories) *
              </h3>
            </div>
            {errors.category && (
              <p className="text-[11px] text-red-600">{errors.category}</p>
            )}

            <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
              {categories.map((cat) => {
                const isSelected = selectedCategoryIds.includes(cat.id);
                return (
                  <label
                    key={cat.id}
                    className={`flex items-center justify-between p-2 rounded border cursor-pointer text-xs transition-colors ${
                      isSelected
                        ? 'bg-crimson-50 border-crimson-700 text-crimson-900 font-bold'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>{cat.translations?.[language]?.name || cat.translations?.mr?.name || cat.slug}</span>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {
                        if (isSelected) {
                          setSelectedCategoryIds(selectedCategoryIds.filter((cid) => cid !== cat.id));
                        } else {
                          setSelectedCategoryIds([...selectedCategoryIds, cat.id]);
                        }
                      }}
                      className="w-3.5 h-3.5 text-crimson-800 rounded"
                    />
                  </label>
                );
              })}
            </div>
          </div>

          {/* Featured Image Uploader */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
            <MediaUploader
              value={featuredImagePath}
              altText={imageAlt}
              caption={imageCaption}
              onChange={({ url, altText: at, caption: cap }) => {
                setFeaturedImagePath(url);
                setImageAlt(at);
                setImageCaption(cap);
              }}
            />
          </div>

          {/* Tags Management */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-200 pb-2">
              <Tag className="w-3.5 h-3.5 text-crimson-800" />
              विषय टॅग्स (Tags)
            </h3>
            <div className="flex flex-wrap gap-1.5 min-h-[30px]">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded border border-gray-200"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-700 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="टॅग लिहून Enter दाबा..."
              className="w-full px-3 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded focus:ring-1 focus:ring-crimson-800"
            />
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-serif font-bold text-lg text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              बातमी नियोजित करा (Schedule Publication)
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              ही बातमी निवडलेल्या वेळेपूर्वी सर्वसामान्य वाचकांना दिसणार नाही. वेळ होताच ती आपोआप मुख्य संकेतस्थळावर प्रकाशित होईल.
            </p>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                प्रकाशन वेळ (Asia/Kolkata IST) *
              </label>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                रद्द करा
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!scheduledAt) {
                    alert('कृपया तारीख व वेळ निवडा');
                    return;
                  }
                  handleSave('scheduled', new Date(scheduledAt).toISOString());
                }}
                className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                वेळ निश्चित करा
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
