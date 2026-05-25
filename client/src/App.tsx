/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Share2, Check, BadgeCheck, Lock, Sparkles, 
  Landmark, MoreVertical, Facebook, Instagram, MessageSquare,
  Mail, Phone
} from 'lucide-react';
import { ProfileInfo, LinkItem } from './types';
import LucideIcon from './components/LucideIcon';
import AdminDashboard from './components/AdminDashboard';

// Newly generated high-fidelity asset logos 
const accLogo = '/src/assets/images/acc_club_logo_1779671916156.png';
const instapayLogo = '/src/assets/images/instapay_logo_1779671889542.png';

// Custom initial presets loaded to look EXACTLY like the user's uploaded ACC Football Club mock image
const INITIAL_PROFILE: ProfileInfo = {
  name: "ACC Football Club",
  role: "ACC Football Club",
  bio: "الصفحة الرسمية لأكاديمية نادي أسمنت أسيوط الرياضي (فرع الجامعة) • يسعدنا تواصلكم ومتابعتكم لمنصاتنا الرسمية.",
  avatarUrl: accLogo,
  avatarPreset: "carbon",
  instaPayAddress: "cemex_2026@instapay", // Recipient address
  instaPayEmail: "acccacademy@gmail.com", // Recipient backup email
  contactPhone: "+201022228017", // Direct phone contact
  contactEmail: "acccacademy@gmail.com" // Direct email contact
};

const INITIAL_LINKS: LinkItem[] = [
  {
    id: "link_1",
    title: "Assiut Cement Company FC WhatsApp group",
    subtitle: "المجتمع الرسمي للأكاديمية • مواعيد وتطور التدريبات والأنشطة المشتركة",
    url: "https://chat.whatsapp.com/L17VgHz8f14IXxnzZU24sr",
    iconName: "messagesquare",
    clicks: 1482,
    colorPreset: "carbon",
    isActive: true
  },
  {
    id: "link_2",
    title: "Explore Assiut Cement Company FC on Facebook",
    subtitle: "الصفحة الرسمية على فيسبوك • أخبار وتغطية شاملة للمباريات والفعاليات",
    url: "https://www.facebook.com/ACCFootballClub",
    iconName: "facebook",
    clicks: 2981,
    colorPreset: "carbon",
    isActive: true
  },
  {
    id: "link_3",
    title: "Explore Assiut Cement Company FC Instagram",
    subtitle: "حساب الإنستجرام الرسمي • كواليس وصور الأكاديمية واللاعبين اليومية",
    url: "https://www.instagram.com/assiutcementfc",
    iconName: "instagram",
    clicks: 1845,
    colorPreset: "carbon",
    isActive: true
  },
  {
    id: "link_gmail",
    title: "البريد الإلكتروني للأكاديمية (Gmail)",
    subtitle: "تواصل معنا مباشرة عبر البريد للاستفسارات الرسمية: acccacademy@gmail.com",
    url: "mailto:acccacademy@gmail.com",
    iconName: "mail",
    clicks: 412,
    colorPreset: "carbon",
    isActive: true
  },
  {
    id: "link_instapay",
    title: "بوابة دفع واشتراكات الأكاديمية الآمنة - InstaPay",
    subtitle: "خط الدفع الإلكتروني المباشر لتحصيل الاشتراكات الرسمية المؤمنة للهواتف",
    url: "https://ipn.eg/S/cemex_2026/instapay/4L6Qx3",
    iconName: "landmark",
    clicks: 954,
    colorPreset: "indigo",
    isActive: true
  }
];

// Helper to determine brand colors dynamcially per platform to make them premium-grade colorful ("ملونين")
const getLinkStyleClasses = (iconName: string, id: string, url: string) => {
  const normalizedIcon = (iconName || '').toLowerCase();
  const normalizedUrl = (url || '').toLowerCase();
  
  if (id === 'link_instapay' || normalizedIcon === 'landmark' || normalizedUrl.includes('instapay') || normalizedUrl.includes('ipn.eg')) {
    return {
      container: 'bg-gradient-to-r from-violet-950/70 via-indigo-950/75 to-slate-950/90 border-indigo-500/40 hover:border-indigo-400 shadow-[0_0_15px_-3px_rgba(99,102,241,0.25)]',
      iconBg: 'bg-white text-indigo-650 border-indigo-200 p-0.5',
      titleColor: 'text-indigo-200 font-extrabold',
      subtitleColor: 'text-indigo-300/80',
    };
  }
  
  if (normalizedIcon === 'messagesquare' || normalizedIcon === 'whatsapp' || normalizedUrl.includes('wa.me') || normalizedUrl.includes('whatsapp')) {
    return {
      container: 'bg-gradient-to-r from-[#012a14]/90 via-[#013519]/80 to-[#020d06]/95 border-emerald-500/30 hover:border-emerald-400 shadow-[0_0_15px_-3px_rgba(16,185,129,0.22)]',
      iconBg: 'bg-emerald-500 text-white border-emerald-400/30',
      titleColor: 'text-emerald-100 font-bold',
      subtitleColor: 'text-emerald-300/60',
    };
  }
  
  if (normalizedIcon === 'facebook' || normalizedUrl.includes('facebook.com')) {
    return {
      container: 'bg-gradient-to-r from-[#07214a]/90 via-[#0a2f64]/80 to-[#020b18]/95 border-blue-500/30 hover:border-blue-400 shadow-[0_0_15px_-3px_rgba(37,99,235,0.22)]',
      iconBg: 'bg-blue-600 text-white border-blue-400/30',
      titleColor: 'text-blue-100 font-bold',
      subtitleColor: 'text-blue-300/60',
    };
  }
  
  if (normalizedIcon === 'instagram' || normalizedUrl.includes('instagram.com')) {
    return {
      container: 'bg-gradient-to-r from-[#310816]/90 via-[#3d0322]/80 to-[#0f0007]/95 border-pink-500/35 hover:border-pink-400 shadow-[0_0_15px_-3px_rgba(236,72,153,0.22)]',
      iconBg: 'bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white border-pink-400/20',
      titleColor: 'text-pink-100 font-bold',
      subtitleColor: 'text-pink-300/60',
    };
  }
  
  if (normalizedIcon === 'mail' || normalizedUrl.includes('mailto:') || normalizedUrl.includes('gmail.com')) {
    return {
      container: 'bg-gradient-to-r from-[#370d0d]/90 via-[#400e12]/80 to-[#120103]/95 border-rose-500/30 hover:border-rose-400 shadow-[0_0_15px_-3px_rgba(244,63,94,0.2)]',
      iconBg: 'bg-rose-500 text-white border-rose-400/30',
      titleColor: 'text-rose-100 font-bold',
      subtitleColor: 'text-rose-300/60',
    };
  }
  
  if (normalizedIcon === 'phone' || normalizedUrl.includes('tel:')) {
    return {
      container: 'bg-gradient-to-r from-[#052b27]/90 via-[#073832]/80 to-[#010c0b]/95 border-teal-500/30 hover:border-teal-400 shadow-[0_0_15px_-3px_rgba(20,184,166,0.2)]',
      iconBg: 'bg-teal-500 text-white border-teal-400/30',
      titleColor: 'text-teal-100 font-bold',
      subtitleColor: 'text-teal-300/60',
    };
  }
  
  if (normalizedIcon === 'send' || normalizedUrl.includes('t.me') || normalizedUrl.includes('telegram')) {
    return {
      container: 'bg-gradient-to-r from-[#02213d]/90 via-[#032a4e]/80 to-[#000a14]/95 border-sky-500/30 hover:border-sky-400 shadow-[0_0_15px_-3px_rgba(56,189,248,0.2)]',
      iconBg: 'bg-sky-550 text-white border-sky-400/30',
      titleColor: 'text-sky-100 font-bold',
      subtitleColor: 'text-sky-300/60',
    };
  }
  
  if (normalizedIcon === 'youtube' || normalizedUrl.includes('youtube.com')) {
    return {
      container: 'bg-gradient-to-r from-[#3b0202]/90 via-[#4a0303]/80 to-[#120000]/95 border-red-500/35 hover:border-red-400 shadow-[0_0_15px_-3px_rgba(220,38,38,0.22)]',
      iconBg: 'bg-red-650 text-white border-red-500/30',
      titleColor: 'text-red-100 font-bold',
      subtitleColor: 'text-[#fca5a5]/60',
    };
  }

  return {
    container: 'bg-neutral-950/85 hover:bg-[#12141a]/95 border-[#1e2330] hover:border-[#333d52] shadow-[0_8px_30px_rgb(0,0,0,0.12)]',
    iconBg: 'bg-white text-slate-900 border-neutral-800',
    titleColor: 'text-white font-bold',
    subtitleColor: 'text-neutral-400',
  };
};

export default function App() {
  // State initialization with localStorage persistence support and merging defaults
  const [profile, setProfile] = useState<ProfileInfo>(() => {
    const saved = localStorage.getItem('instalink_profile');
    try {
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_PROFILE,
          ...parsed
        };
      }
    } catch (e) { /* ignore */ }
    return INITIAL_PROFILE;
  });

  const [links, setLinks] = useState<LinkItem[]>(() => {
    const saved = localStorage.getItem('instalink_links');
    try {
      if (saved) return JSON.parse(saved);
    } catch (e) { /* ignore */ }
    return INITIAL_LINKS;
  });

  // Admin Panel Control Center toggle trigger
  const [adminOpen, setAdminOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  // Routing logic to detect standing in '/admin' or '#admin'
  const [isAdminRoute, setIsAdminRoute] = useState(() => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    const search = window.location.search;
    return path.includes('/Dictator') || hash === '#Dictator' || hash === '#/Dictator' || search.includes('Dictator=true');
  });

  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      const search = window.location.search;
      setIsAdminRoute(path.includes('/Dictator') || hash === '#Dictator' || hash === '#/Dictator' || search.includes('Dictator=true'));
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  const handleCloseAdmin = () => {
    setAdminOpen(false);
    // Remove /Dictator from path or hash to navigate back to viewer mode smoothly
    if (window.location.pathname.includes('/Dictator')) {
      window.history.pushState({}, '', '/');
    }
    if (window.location.hash.includes('Dictator')) {
      window.location.hash = '';
    }
    // Dispatch popstate event or hashchange event to trigger URL updates locally
    window.dispatchEvent(new Event('popstate'));
  };

  // Micro layout helpers feedback
  const [copiedProfileAddress, setCopiedProfileAddress] = useState(false);
  const [shareFeedback, setShareFeedback] = useState(false);
  const [copiedLinkFeedback, setCopiedLinkFeedback] = useState<string | null>(null);

  // Sync up states dynamically to local storage on edits
  useEffect(() => {
    localStorage.setItem('instalink_profile', JSON.stringify(profile));
    setAvatarError(false);
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('instalink_links', JSON.stringify(links));
  }, [links]);

  // Handle standard link clicking and secure redirect
  const handleLinkItemClick = (e: React.MouseEvent, link: LinkItem) => {
    // Increment click count safely
    const updated = links.map(item => 
      item.id === link.id ? { ...item, clicks: item.clicks + 1 } : item
    );
    setLinks(updated);
  };

  const handleCopyProfileAddress = () => {
    navigator.clipboard.writeText(profile.instaPayAddress);
    setCopiedProfileAddress(true);
    setTimeout(() => setCopiedProfileAddress(false), 2000);
  };

  const handleCopySpecificLink = (e: React.MouseEvent, targetUrl: string, linkId: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(targetUrl);
    setCopiedLinkFeedback(linkId);
    setTimeout(() => setCopiedLinkFeedback(null), 2000);
  };

  const handleShareProfile = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareFeedback(true);
    setTimeout(() => setShareFeedback(false), 2000);
  };

  return (
    <div className="min-h-screen text-[#f3f4f6] relative font-sans p-4 sm:p-6 lg:p-8 overflow-y-auto w-full select-none flex flex-col items-center justify-between" dir="rtl">
      
      {/* EXQUISITE SLATE/VIOLET/BLACK COSMIC GLOW CIRCLES IN BACKGROUND */}
      <div className="absolute top-[12%] left-[50%] -translate-x-[50%] w-[380px] h-[380px] bg-sky-500/10 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute top-[40%] left-[50%] -translate-x-[50%] w-[280px] h-[280px] bg-slate-400/5 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[50%] -translate-x-[50%] w-[320px] h-[320px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* CORE WRAPPER: THE MOBILE COMPACT LUXURY DEVICE INNER STREAM */}
      <div className="w-full max-w-[480px] mx-auto flex-1 flex flex-col justify-start py-8">
        
        {/* TOP COMPACT BRAND NAVIGATION BUTTONS */}
        <div className="flex justify-end items-center w-full mb-8">
          
          {/* Top-Right: Share Capsule button */}
          <button
            onClick={handleShareProfile}
            className="w-11 h-11 bg-black/40 hover:bg-black/60 border border-neutral-800 rounded-full flex items-center justify-center text-white transition-all cursor-pointer shadow-lg"
            title="مشاركة الصفحة"
            id="btn-share-profile"
          >
            {shareFeedback ? (
              <Check size={16} className="text-emerald-500 animate-pulse" />
            ) : (
              <Share2 size={16} />
            )}
          </button>
        </div>

        {/* PROFILE IDENTIFIER BLOCK */}
        <div className="flex flex-col items-center text-center space-y-3 mb-8">
          
          {/* Centered Circular Avatar */}
          <div className="relative">
            <div className="absolute -inset-1.5 rounded-full border border-dashed border-white/10 animate-spin duration-15000 pointer-events-none" />
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/20 shadow-2xl bg-neutral-900 flex items-center justify-center">
              {avatarError || !profile.avatarUrl ? (
                <div className="w-full h-full bg-slate-950 flex items-center justify-center text-neutral-200">
                  <Shield size={38} className="text-amber-500 stroke-[2]" />
                </div>
              ) : (
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover select-none"
                  referrerPolicy="no-referrer"
                  onError={() => setAvatarError(true)}
                />
              )}
            </div>
          </div>

          {/* Heading title (Job Role code excluded as requested) */}
          <div className="space-y-1.5 pt-1">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#ffffff] tracking-wide flex items-center justify-center gap-2 leading-tight">
              <span>{profile.name}</span>
              <BadgeCheck className="text-blue-400 fill-blue-500/20 shrink-0" size={20} />
            </h1>
          </div>

          {/* Bio sentence */}
          <p className="text-xs text-neutral-350 leading-relaxed max-w-[340px] px-1 font-sans font-medium">
            {profile.bio}
          </p>

          {/* Custom row of social buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            
            <a 
              href="https://chat.whatsapp.com/L17VgHz8f14IXxnzZU24sr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 bg-neutral-900/40 hover:bg-emerald-500/10 border border-neutral-800 hover:border-emerald-500/40 text-neutral-200 hover:text-emerald-400 rounded-full flex items-center justify-center transition-all shadow"
              title="انضم لمجتمع الواتساب"
              id="social-chat-whatsapp"
            >
              <MessageSquare size={16} />
            </a>

            <a 
              href="https://www.facebook.com/ACCFootballClub" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 bg-neutral-900/40 hover:bg-blue-600/10 border border-neutral-800 hover:border-blue-600/40 text-neutral-200 hover:text-blue-400 rounded-full flex items-center justify-center transition-all shadow"
              title="صفحة الفيسبوك"
              id="social-facebook"
            >
              <LucideIcon name="facebook" size={16} />
            </a>

            <a 
              href="https://www.instagram.com/assiutcementfc" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 bg-neutral-900/40 hover:bg-pink-650/10 border border-neutral-800 hover:border-pink-500/40 text-neutral-200 hover:text-pink-400 rounded-full flex items-center justify-center transition-all shadow"
              title="حساب الإنستجرام"
              id="social-instagram"
            >
              <LucideIcon name="instagram" size={16} />
            </a>

            {/* Direct Phone Call Icon */}
            {profile.contactPhone && (
              <a 
                href={`tel:${profile.contactPhone}`}
                className="w-10 h-10 bg-neutral-900/40 hover:bg-teal-500/10 border border-neutral-800 hover:border-teal-500/40 text-neutral-200 hover:text-teal-400 rounded-full flex items-center justify-center transition-all shadow"
                title="اتصال هاتف مباشر ورقم تواصل"
                id="social-contact-phone"
              >
                <Phone size={16} />
              </a>
            )}

            {/* Direct Email Contact Icon */}
            {profile.contactEmail && (
              <a 
                href={`mailto:${profile.contactEmail}`}
                className="w-10 h-10 bg-neutral-900/40 hover:bg-rose-500/10 border border-neutral-800 hover:border-rose-500/40 text-neutral-200 hover:text-rose-400 rounded-full flex items-center justify-center transition-all shadow"
                title="مراسلة سريعة للمسؤول"
                id="social-contact-email"
              >
                <Mail size={16} />
              </a>
            )}

            <button 
              onClick={handleCopyProfileAddress}
              className="w-10 h-10 bg-neutral-900/40 hover:bg-amber-500/10 border border-neutral-800 hover:border-amber-500/40 text-neutral-200 hover:text-amber-400 rounded-full flex items-center justify-center transition-all shadow cursor-pointer relative"
              title="نسخ عنوان InstaPay"
              id="social-instapay-copy"
            >
              {copiedProfileAddress ? <Check size={16} className="text-emerald-500" /> : <Landmark size={15} />}
            </button>
          </div>

          {/* Email alert showing active address */}
          <AnimatePresence>
            {copiedProfileAddress && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="text-[9px] text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-900/50 px-3 py-1 rounded-md mt-1 font-mono"
              >
                تم نسخ معرّف InstaPay للاستلام المباشر: {profile.instaPayAddress}
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* CORE CAPSULE INSTALINK TILES LIST */}
        <div className="space-y-4 px-1 flex-1">
          {links
            .filter(link => link.isActive)
            .map((link) => {
              const isInstaPay = link.id === 'link_instapay' || link.url.includes('instapay') || link.url.includes('ipn.eg');
              const styling = getLinkStyleClasses(link.iconName, link.id, link.url);
              
              return (
                <motion.a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => handleLinkItemClick(e, link)}
                  className={`w-full p-4 block rounded-2xl flex items-center justify-between transition-all duration-300 border shadow-md relative group select-none min-h-[76px] ${styling.container}`}
                  id={`link-capsule-${link.id}`}
                >
                  
                  {/* Left Side: Thumbnail icon and details */}
                  <div className="flex items-center gap-3.5 text-right flex-1 min-w-0">
                    
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm border overflow-hidden ${styling.iconBg}`}>
                      {isInstaPay ? (
                        <img 
                          src={instapayLogo} 
                          alt="InstaPay" 
                          className="w-full h-full object-cover shrink-0 hover:scale-110 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="p-1 flex items-center justify-center">
                          <LucideIcon name={link.iconName || 'link'} size={18} />
                        </div>
                      )}
                    </div>

                    {/* Middle info */}
                    <div className="space-y-0.5 leading-snug flex-1 min-w-0 pr-0.5">
                      <h3 className={`text-xs sm:text-[13px] font-bold tracking-tight truncate ${styling.titleColor}`}>
                        {link.title}
                      </h3>
                      
                      {link.subtitle ? (
                        <p className={`text-[10px] truncate leading-tight font-medium ${styling.subtitleColor}`}>
                          {link.subtitle}
                        </p>
                      ) : (
                        <p className="text-[9px] text-neutral-500 truncate leading-tight">
                          {link.url.replace(/^https?:\/\/(www\.)?/i, '')}
                        </p>
                      )}
                    </div>

                  </div>

                  {/* Right side element: Copy button */}
                  <div className="flex items-center gap-1.5 shrink-0 pl-1">
                    
                    <button
                      type="button"
                      onClick={(e) => handleCopySpecificLink(e, link.url, link.id)}
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      title="نسخ الرابط"
                      id={`btn-copy-${link.id}`}
                    >
                      {copiedLinkFeedback === link.id ? (
                        <Check size={13} className="text-emerald-400" />
                      ) : (
                        <MoreVertical size={14} />
                      )}
                    </button>

                  </div>

                </motion.a>
              );
            })}

          {links.filter(link => link.isActive).length === 0 && (
            <p className="text-xs text-neutral-500 text-center py-8 font-bold">
              لا توجد روابط مفعلة حالياً.
            </p>
          )}
        </div>

      </div>

      {/* FOOTER CONTAINER: AUTHENTIC LICENSE AND SECURED BANK SHIELD */}
      <div className="w-full max-w-[480px] mx-auto text-center space-y-4 pt-6 pb-2 border-t border-neutral-900/50">
        
        {/* Small privacy/legal list */}
        <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1.5 text-[10px] text-neutral-500 font-semibold" dir="rtl">
          <span className="hover:text-neutral-350 cursor-pointer transition-colors">تفضيلات ملفات تعريف الارتباط</span>
          <span className="w-1 h-1 rounded-full bg-neutral-800" />
          <span className="hover:text-neutral-350 cursor-pointer transition-colors">الإبلاغ عن إساءة استخدام</span>
          <span className="w-1 h-1 rounded-full bg-neutral-800" />
          <span className="hover:text-neutral-350 cursor-pointer transition-colors">سياسة الخصوصية</span>
        </div>

        {/* Encrypted network indicator */}
        <div className="flex justify-center items-center gap-1.5 text-[8px] tracking-wider text-indigo-400/60 uppercase font-mono font-bold leading-none">
          <Shield size={10} className="text-emerald-500 animate-pulse" />
          <span>INSTALINK FINANCIAL SHIELD PROTECTED • E2EE IP-TUNNEL</span>
        </div>
      </div>

      <AdminDashboard
        isOpen={adminOpen || isAdminRoute}
        onClose={handleCloseAdmin}
        profileInfo={profile}
        onUpdateProfile={setProfile}
        links={links}
        onUpdateLinks={setLinks}
      />

    </div>
  );
}
