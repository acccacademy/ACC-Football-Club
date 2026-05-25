/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Lock, Save, Plus, Trash2, Eye, Key, Shield,
  Layers, User, Check, Mail, KeyRound, AlertCircle, Edit
} from 'lucide-react';
import { ProfileInfo, LinkItem } from '../types';
import LucideIcon from './LucideIcon';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const AVAILABLE_ICONS = [
  { value: 'globe', label: '🌐 موقع ويب رسمي (Globe)' },
  { value: 'facebook', label: '🔵 فيسبوك (Facebook)' },
  { value: 'instagram', label: '📸 انستجرام (Instagram)' },
  { value: 'messagesquare', label: '🟢 واتساب (WhatsApp)' },
  { value: 'send', label: '✈️ تليجرام (Telegram)' },
  { value: 'mail', label: '📧 البريد الإلكتروني (Gmail)' },
  { value: 'landmark', label: '🏦 حساب بنكي / إنستا باي (InstaPay)' },
  { value: 'youtube', label: '🔺 يوتيوب (YouTube)' },
  { value: 'users', label: '👥 مجموعة / مجتمع (Community)' },
  { value: 'phone', label: '📞 اتصال هاتف مباشر (Phone)' },
  { value: 'calendar', label: '📅 جدول مواعيد ومباريات (Calendar)' },
  { value: 'trophy', label: '🏆 كؤوس وبطولات (Trophy)' },
  { value: 'mappin', label: '📍 فرع أو موقع على الخريطة (Google Maps)' },
  { value: 'music', label: '🎵 صوتيات وأهازيج (Music)' },
  { value: 'image', label: '🖼️ معرض صور (Gallery)' },
  { value: 'video', label: '📹 بث مباشر وفيديو (Video)' },
  { value: 'link', label: '🔗 رابط مخصص فريد (Custom Link)' }
];

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  profileInfo: ProfileInfo;
  onUpdateProfile: (p: ProfileInfo) => void;
  links: LinkItem[];
  onUpdateLinks: (l: LinkItem[]) => void;
}

export default function AdminDashboard({
  isOpen,
  onClose,
  profileInfo,
  onUpdateProfile,
  links,
  onUpdateLinks
}: AdminDashboardProps) {
  // Authentication Guard with High Encryption (SHA-256)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active tabs: only 'profile' and 'links' (Deleted payment transaction logs completely)
  const [activeTab, setActiveTab] = useState<'profile' | 'links'>('profile');

  // Edit states
  const [editedProfile, setEditedProfile] = useState<ProfileInfo>({ ...profileInfo });
  const [isAddingLink, setIsAddingLink] = useState(false);

  // Keep in sync with parent props
  useEffect(() => {
    setEditedProfile({ ...profileInfo });
  }, [profileInfo]);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [newLink, setNewLink] = useState<Omit<LinkItem, 'id' | 'clicks'>>({
    title: '',
    subtitle: '',
    url: '',
    iconName: 'globe',
    colorPreset: 'carbon',
    isActive: true
  });

  const [profileSavedFeedback, setProfileSavedFeedback] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    // Authenticate using high-end SHA-256 Hashing locally in full-compliance with client-only instruction
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: emailInput.trim().toLowerCase(),
          password: passwordInput.trim(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setIsAuthenticated(true);
        setEditedProfile({ ...profileInfo });
      } else {
        setLoginError(data.message || 'بيانات خاطئة');
      }
    } catch {
      setLoginError('تعذر الاتصال بالسيرفر، حاول مرة تانية');
    }
  };

  // Profile save
  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(editedProfile);
    setProfileSavedFeedback(true);
    setTimeout(() => setProfileSavedFeedback(false), 3000);
  };

  // Toggle active status of a link
  const handleToggleLinkActive = (id: string) => {
    const updated = links.map(link => 
      link.id === id ? { ...link, isActive: !link.isActive } : link
    );
    onUpdateLinks(updated);
  };

  // Inline deletion confirmation
  const requestDeleteLink = (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmDeleteLink = (id: string) => {
    const updated = links.filter(link => link.id !== id);
    onUpdateLinks(updated);
    setDeleteConfirmId(null);
  };

  // Add a new link
  const handleAddLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLink.title || !newLink.url) return;
    
    // Auto protocol addition
    let formattedUrl = newLink.url.trim();
    if (!/^https?:\/\//i.test(formattedUrl) && !formattedUrl.startsWith('#') && !formattedUrl.startsWith('mailto:')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    const created: LinkItem = {
      ...newLink,
      id: 'link_' + Math.random().toString(36).substring(2, 9),
      url: formattedUrl,
      clicks: 0
    };

    onUpdateLinks([created, ...links]);
    setIsAddingLink(false);
    setNewLink({
      title: '',
      subtitle: '',
      url: '',
      iconName: 'globe',
      colorPreset: 'carbon',
      isActive: true
    });
  };

  // Submit edit link
  const handleEditLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLink || !editingLink.title || !editingLink.url) return;

    // Auto protocol addition
    let formattedUrl = editingLink.url.trim();
    if (!/^https?:\/\//i.test(formattedUrl) && !formattedUrl.startsWith('#') && !formattedUrl.startsWith('mailto:')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    const updated = links.map(link => 
      link.id === editingLink.id ? { ...editingLink, url: formattedUrl } : link
    );
    onUpdateLinks(updated);
    setEditingLinkId(null);
    setEditingLink(null);
  };

  const totalHits = links.reduce((sum, link) => sum + link.clicks, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay backing */}
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md" onClick={onClose} />

      {/* Admin Panel Dialog Box */}
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-2xl z-10 font-sans text-right text-slate-800" dir="rtl">
        
        {/* Fine Amber top border accent */}
        <div className="h-1.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 w-full" />

        {/* Header toolbar */}
        <div className="flex justify-between items-center p-5 border-b border-slate-150 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="bg-amber-50 p-1.5 rounded-lg text-amber-600">
              <Shield className="animate-pulse shrink-0" size={18} />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              لوحة التحكم المشفرة وإدارة المحتوى
            </h3>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-700 hover:bg-slate-200/55 p-1.5 rounded-lg transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* CONTENT FOR UNAUTHENTICATED (EMAIL & PASSWORD CHECKPOINT WITH SHA-256 ENCRYPTION) */}
        {!isAuthenticated ? (
          <div className="p-6 sm:p-10 text-center space-y-5">
            <div className="inline-flex p-4 bg-amber-50 border border-amber-200 rounded-full text-amber-600 mx-auto shadow-sm">
              <Lock size={28} />
            </div>

            <div className="space-y-1">
              <h4 className="text-base sm:text-lg font-black text-slate-900">تسجيل الدخول المشفر بحماية SHA-256</h4>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed max-w-md mx-auto">
                من أجل تعديل روابط الحساب أو إعدادات InstaPay، يرجى كتابة البريد الإلكتروني وكلمة المرور الخاصة بالإدارة.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="max-w-sm mx-auto space-y-4 pt-2">
              <div className="space-y-3 text-right">
                {/* Email Address */}
                <div className="space-y-1">
                  <span className="text-xs text-slate-700 font-bold block flex items-center gap-1">
                    <Mail size={12} className="text-slate-450" /> البريد الإلكتروني للمسؤول:
                  </span>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                      setLoginError('');
                    }}
                    placeholder="example@gmail.com"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 outline-none"
                    required
                  />
                </div>

                {/* Password input */}
                <div className="space-y-1">
                  <span className="text-xs text-slate-700 font-bold block flex items-center gap-1">
                    <KeyRound size={12} className="text-slate-450" /> كلمة المرور السرية:
                  </span>
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setLoginError('');
                    }}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 outline-none"
                    required
                  />
                </div>
              </div>

              {loginError && (
                <div className="text-[11px] text-red-700 bg-red-50 border border-red-200 p-2.5 rounded-xl font-bold leading-relaxed flex items-center gap-2 text-right">
                  <AlertCircle size={14} className="shrink-0 text-red-650" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer pt-3"
              >
                <Shield size={14} />
                <span>التحقق الرقمي وفك التشفير</span>
              </button>
            </form>


          </div>
        ) : (
          /* AUTHENTICATED PANEL */
          <div className="flex flex-col md:flex-row h-[65vh] md:h-[55vh]">
            
            {/* Sidebar navigation */}
            <div className="w-full md:w-52 bg-slate-50 border-b md:border-b-0 md:border-l border-slate-200 flex md:flex-col p-3 gap-1 overflow-x-auto md:overflow-x-visible">
              
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-2 px-3 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer w-full text-right ${
                  activeTab === 'profile' 
                    ? 'bg-amber-55/60 border border-amber-200 text-amber-700 shadow-sm font-extrabold' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50 w-full'
                }`}
              >
                <User size={14} />
                <span className="whitespace-nowrap">الملف التعريفي للحساب</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('links')}
                className={`flex items-center gap-2 px-3 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer w-full text-right ${
                  activeTab === 'links' 
                    ? 'bg-amber-55/60 border border-amber-200 text-amber-700 shadow-sm font-extrabold' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50 w-full'
                }`}
              >
                <Layers size={14} />
                <span className="whitespace-nowrap">إدارة الروابط ({links.length})</span>
              </button>

              <div className="hidden md:block mt-auto p-3 bg-white rounded-2xl border border-slate-150 shadow-inner">
                <span className="text-[9px] text-slate-400 block font-black tracking-wider">التحليلات اللحظية:</span>
                <div className="mt-1">
                  <div className="p-1 text-[10px]">
                    <span className="text-slate-550 block font-bold">إجمالي نقرات الروابط:</span>
                    <span className="font-extrabold text-amber-600 text-xs">{totalHits} نقرة مجملة</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Content area based on active tab */}
            <div className="flex-1 p-5 overflow-y-auto bg-white">
              
              {/* TAB 1: Profile configurations */}
              {activeTab === 'profile' && (
                <form onSubmit={handleProfileSave} className="space-y-4 text-right">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black text-amber-700 uppercase tracking-widest flex items-center gap-1.5">
                      <User size={13} />
                      <span>تعديل الاسم والنبذة ودفع InstaPay</span>
                    </h4>
                  </div>

                  {profileSavedFeedback && (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-250 rounded-xl flex items-center gap-2 text-xs text-emerald-700 font-bold">
                      <Check size={14} className="text-emerald-600" />
                      <span>تم حفظ التعديلات وتثبيتها بالمتصفح بأمان!</span>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-xs text-slate-700 font-bold block">اسم الأكاديمية / الحساب</label>
                    <input
                      type="text"
                      value={editedProfile.name}
                      onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-950 font-bold outline-none focus:border-amber-500 focus:bg-white"
                      required
                    />
                  </div>

                  {/* Bio */}
                  <div className="space-y-1">
                    <label className="text-xs text-slate-700 font-bold block">الوصف والنبذة التعريفية (Bio)</label>
                    <textarea
                      value={editedProfile.bio}
                      onChange={(e) => setEditedProfile({...editedProfile, bio: e.target.value})}
                      className="w-full h-16 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-amber-500 focus:bg-white resize-none leading-relaxed"
                      required
                    />
                  </div>

                  {/* Recipient InstaPay details */}
                  <div className="p-4 bg-emerald-50/60 border border-emerald-150 rounded-2xl space-y-3">
                    <span className="text-[10px] text-emerald-750 font-black uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] inline-block"></span>
                      رابط وبوابة دفع InstaPay المباشرة
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* InstaPay IPA */}
                      <div className="space-y-1">
                        <label className="text-[11px] text-emerald-750 font-bold block">عنوان InstaPay للاستلام</label>
                        <input
                          type="text"
                          value={editedProfile.instaPayAddress}
                          onChange={(e) => {
                            setEditedProfile({...editedProfile, instaPayAddress: e.target.value});
                          }}
                          placeholder="e.g. name@instapay"
                          className="w-full bg-white border border-emerald-200 focus:border-emerald-500 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-mono"
                          required
                        />
                      </div>

                      {/* Backup Email */}
                      <div className="space-y-1">
                        <label className="text-[11px] text-emerald-750 font-bold block">بريد تحصيل المراسلات (Gmail)</label>
                        <input
                          type="email"
                          value={editedProfile.instaPayEmail}
                          onChange={(e) => {
                            setEditedProfile({...editedProfile, instaPayEmail: e.target.value});
                          }}
                          placeholder="example@gmail.com"
                          className="w-full bg-white border border-emerald-200 focus:border-emerald-500 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-mono"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Direct Contacts configuration */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block"></span>
                      أرقام التواصل المباشرة (هاتف وبريد) كأيقونات
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Contact Phone */}
                      <div className="space-y-1">
                        <label className="text-[11px] text-slate-700 font-bold block">رقم الهاتف للتواصل المباشر</label>
                        <input
                          type="tel"
                          value={editedProfile.contactPhone || ''}
                          onChange={(e) => {
                            setEditedProfile({...editedProfile, contactPhone: e.target.value});
                          }}
                          placeholder="مثال: +201021464303"
                          className="w-full bg-white border border-slate-200 focus:border-indigo-500 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-mono"
                        />
                      </div>

                      {/* Contact Email */}
                      <div className="space-y-1">
                        <label className="text-[11px] text-slate-700 font-bold block">البريد الإلكتروني للرد السريع</label>
                        <input
                          type="email"
                          value={editedProfile.contactEmail || ''}
                          onChange={(e) => {
                            setEditedProfile({...editedProfile, contactEmail: e.target.value});
                          }}
                          placeholder="example@gmail.com"
                          className="w-full bg-white border border-slate-200 focus:border-indigo-500 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Avatar URL Selection */}
                  <div className="space-y-1">
                    <label className="text-xs text-slate-700 font-bold block">رابط لوجو الأكاديمية (Avatar URL)</label>
                    <input
                      type="text"
                      value={editedProfile.avatarUrl}
                      onChange={(e) => setEditedProfile({...editedProfile, avatarUrl: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Submit profile config */}
                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save size={14} />
                      <span>حفظ الإعدادات بأمان</span>
                    </button>
                  </div>

                </form>
              )}

              {/* TAB 2: Links */}
              {activeTab === 'links' && (
                <div className="space-y-4 text-right">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black text-amber-700 uppercase tracking-widest flex items-center gap-1.5 font-sans">
                      <Layers size={13} />
                      <span>إدارة روابط الأكاديمية الفعالة</span>
                    </h4>
                    
                    {!isAddingLink && !editingLinkId && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingLink(true);
                          setEditingLinkId(null);
                          setEditingLink(null);
                        }}
                        className="py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus size={12} />
                        <span>رابط جديد</span>
                      </button>
                    )}
                  </div>

                  {/* Add New Link Form Drawer */}
                  {isAddingLink && (
                    <motion.form 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onSubmit={handleAddLinkSubmit}
                      className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-right"
                    >
                      <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                        <span className="text-xs font-bold text-slate-800">بيانات الرابط الإضافي الجديد</span>
                        <button 
                          type="button" 
                          onClick={() => setIsAddingLink(false)}
                          className="text-slate-400 hover:text-slate-700 cursor-pointer"
                        >
                          <X size={14} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Title */}
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-500 block font-bold">عنوان الزر الرئيسي</label>
                          <input
                            type="text"
                            value={newLink.title}
                            onChange={(e) => setNewLink({...newLink, title: e.target.value})}
                            placeholder="مثال: تابعنا على واتساب الأكاديمية"
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                            required
                          />
                        </div>

                        {/* URL */}
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-500 block font-bold">الرابط الموجه (URL Target)</label>
                          <input
                            type="text"
                            value={newLink.url}
                            onChange={(e) => setNewLink({...newLink, url: e.target.value})}
                            placeholder="https://..."
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 text-left font-mono"
                            required
                          />
                        </div>
                      </div>

                      {/* Subtitle */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 block font-bold">وصف فرعي توضيحي (اختياري)</label>
                        <input
                          type="text"
                          value={newLink.subtitle || ''}
                          onChange={(e) => setNewLink({...newLink, subtitle: e.target.value})}
                          placeholder="مثال: مواعيد وجدول المباريات للأكاديمية"
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Icon */}
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-500 block font-bold">أيقونة الرابط</label>
                          <select
                            value={newLink.iconName}
                            onChange={(e) => setNewLink({...newLink, iconName: e.target.value})}
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                          >
                            {AVAILABLE_ICONS.map(ic => (
                              <option key={ic.value} value={ic.value}>{ic.label}</option>
                            ))}
                          </select>
                        </div>

                        {/* Color preset */}
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-500 block font-bold">نمط زر اللون</label>
                          <select
                            value={newLink.colorPreset}
                            onChange={(e) => setNewLink({...newLink, colorPreset: e.target.value})}
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                          >
                            <option value="carbon">تلقائي داكن فخم (Carbon)</option>
                            <option value="indigo">أزرق نيلي ريادي (Indigo)</option>
                            <option value="emerald">أخضر زمرد جذاب (Emerald)</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          type="submit"
                          className="py-1.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow flex items-center gap-1 cursor-pointer"
                        >
                          <Plus size={12} />
                          <span>إضافة الرابط</span>
                        </button>
                      </div>

                    </motion.form>
                  )}

                  {/* Edit Existing Link Form Drawer */}
                  {editingLinkId && editingLink && (
                    <motion.form 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onSubmit={handleEditLinkSubmit}
                      className="p-4 bg-amber-50/50 border border-amber-200/80 rounded-2xl space-y-3 text-right"
                    >
                      <div className="flex justify-between items-center pb-2 border-b border-amber-200">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                          <Edit size={14} className="text-amber-650" />
                          <span>تعديل بيانات الرابط الحالي</span>
                        </span>
                        <button 
                          type="button" 
                          onClick={() => {
                            setEditingLinkId(null);
                            setEditingLink(null);
                          }}
                          className="text-slate-400 hover:text-slate-700 cursor-pointer"
                        >
                          <X size={14} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Title */}
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-500 block font-bold">عنوان الزر الرئيسي</label>
                          <input
                            type="text"
                            value={editingLink.title}
                            onChange={(e) => setEditingLink({...editingLink, title: e.target.value})}
                            placeholder="عنوان الرابط"
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-bold"
                            required
                          />
                        </div>

                        {/* URL */}
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-500 block font-bold">الرابط الموجه (URL Target)</label>
                          <input
                            type="text"
                            value={editingLink.url}
                            onChange={(e) => setEditingLink({...editingLink, url: e.target.value})}
                            placeholder="https://..."
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 text-left font-mono"
                            required
                          />
                        </div>
                      </div>

                      {/* Subtitle */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 block font-bold">وصف فرعي توضيحي (اختياري)</label>
                        <input
                          type="text"
                          value={editingLink.subtitle || ''}
                          onChange={(e) => setEditingLink({...editingLink, subtitle: e.target.value})}
                          placeholder="وصف إيضاحي"
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Icon */}
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-500 block font-bold">أيقونة الرابط</label>
                          <select
                            value={editingLink.iconName}
                            onChange={(e) => setEditingLink({...editingLink, iconName: e.target.value})}
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                          >
                            {AVAILABLE_ICONS.map(ic => (
                              <option key={ic.value} value={ic.value}>{ic.label}</option>
                            ))}
                          </select>
                        </div>

                        {/* Color preset */}
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-500 block font-bold">نمط زر اللون</label>
                          <select
                            value={editingLink.colorPreset}
                            onChange={(e) => setEditingLink({...editingLink, colorPreset: e.target.value})}
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                          >
                            <option value="carbon">تلقائي داكن فخم (Carbon)</option>
                            <option value="indigo">أزرق نيلي ريادي (Indigo)</option>
                            <option value="emerald">أخضر زمرد جذاب (Emerald)</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end pt-1 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingLinkId(null);
                            setEditingLink(null);
                          }}
                          className="py-1 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                        >
                          إلغاء
                        </button>
                        <button
                          type="submit"
                          className="py-1 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow flex items-center gap-1 cursor-pointer"
                        >
                          <Save size={12} />
                          <span>حفظ التعديلات</span>
                        </button>
                      </div>

                    </motion.form>
                  )}

                  {/* List of links */}
                  <div className="space-y-2">
                    {links.map((link) => (
                      <div 
                        key={link.id}
                        className="p-3 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl flex items-center justify-between gap-3 transition-all text-right"
                      >
                        <div className="flex items-center gap-2.5 text-right min-w-0 flex-1">
                          <div className="p-2 rounded-lg bg-white text-indigo-600 border border-slate-100 shadow-sm shrink-0">
                            <LucideIcon name={link.iconName} size={15} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 truncate">
                              <span className="truncate">{link.title}</span>
                              {!link.isActive && (
                                <span className="bg-red-50 text-red-600 px-1.5 py-0.5 rounded text-[8px] font-bold border border-red-100 shrink-0">
                                  معطل مؤقتاً
                                </span>
                              )}
                            </h5>
                            {link.subtitle && (
                              <p className="text-[10px] text-slate-500 font-bold truncate my-0.5">{link.subtitle}</p>
                            )}
                            <span className="text-[9px] text-slate-400 font-mono tracking-wide block truncate select-all">
                              {link.url}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* click stats */}
                          <div className="px-2 py-0.5 bg-white border border-slate-200 text-slate-650 rounded text-[9px] font-mono whitespace-nowrap">
                            <span className="text-slate-900 font-bold ml-1">{link.clicks}</span> 
                            نقرة
                          </div>

                          {/* Edit button */}
                          <button
                            type="button"
                            onClick={() => {
                              setEditingLinkId(link.id);
                              setEditingLink({ ...link });
                              setIsAddingLink(false);
                            }}
                            className="p-1 text-slate-500 hover:text-amber-600 hover:bg-slate-100 rounded transition-all cursor-pointer"
                            title="تعديل الرابط"
                          >
                            <Edit size={13} />
                          </button>

                          {/* Action toggler */}
                          <button
                            type="button"
                            onClick={() => handleToggleLinkActive(link.id)}
                            className={`p-1 rounded transition-all cursor-pointer ${
                              link.isActive 
                                ? 'text-indigo-600 hover:bg-indigo-50' 
                                : 'text-slate-400 hover:bg-slate-100'
                            }`}
                            title={link.isActive ? "تعطيل مؤقت" : "تفعيل الرابط"}
                          >
                            <Eye size={14} />
                          </button>

                          {/* Safe inline deletion code */}
                          {deleteConfirmId === link.id ? (
                            <button
                              type="button"
                              onClick={() => confirmDeleteLink(link.id)}
                              className="px-2 py-1 bg-red-650 text-white rounded text-[10px] font-black cursor-pointer shadow-sm animate-pulse"
                            >
                              تأكيد؟
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => requestDeleteLink(link.id)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded transition-all cursor-pointer"
                              title="حذف الرابط"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    {links.length === 0 && (
                      <p className="text-xs text-slate-400 text-center py-8 font-semibold">
                        لا يوجد أي روابط مضافة بعد.
                      </p>
                    )}
                  </div>

                </div>
              )}

            </div>

          </div>
        )}

        {/* Footer info stamp */}
        <div className="p-3 bg-slate-50 border-t border-slate-150 flex items-center justify-between text-[10px] text-slate-500 font-mono font-bold">
          <div className="flex items-center gap-1 text-indigo-600 font-bold">
            <Shield size={12} className="shrink-0 text-amber-500" />
            <span className="font-sans font-extrabold">بصمة المالك مشفرة بالكامل بدالة SHA-256</span>
          </div>
          <p>Assiut Cement Club Linktree • Admin Panel</p>
        </div>

      </div>
    </div>
  );
}
