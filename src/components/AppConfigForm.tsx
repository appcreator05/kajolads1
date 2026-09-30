import React, { useRef } from 'react';
import {
  Globe,
  Smartphone,
  Image as ImageIcon,
  Upload,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  Clock,
  Palette,
  ExternalLink,
  Info,
  CheckSquare,
  Square,
  Sliders,
  Zap,
  Shield,
  ShieldCheck,
  RefreshCw,
  Compass,
  Link2,
  MousePointer,
  Database,
  Timer,
  RotateCw,
  Monitor,
  Camera,
  Bell,
  Volume2,
  FileText,
  Loader,
  Hash,
  Tag,
  CreditCard,
  Wallet,
  Sun,
  Cookie,
  Code2,
  Cpu,
  HardDrive,
  DownloadCloud,
  Check,
} from 'lucide-react';
import {
  AppConfig,
  AdNetwork,
  CacheMode,
  AppOrientation,
  AppPermissions,
} from '../types';
import { resizeLogoTo512, resizeSplashTo1080x1920 } from '../utils/imageResizer';
import { KeystoreSection } from './KeystoreSection';
import { GoogleServicesSection } from './GoogleServicesSection';

interface AppConfigFormProps {
  config: AppConfig;
  onChange: (updated: Partial<AppConfig>) => void;
  onAdMobChange: (updated: Partial<AppConfig['admob']>) => void;
  onStartIoChange: (updated: Partial<AppConfig['startio']>) => void;
  onKeystoreChange: (updated: Partial<AppConfig['keystore']>) => void;
  onOkAndSave?: () => void;
  highlightMissing?: {
    websiteUrl?: boolean;
    appName?: boolean;
    packageName?: boolean;
  };
}

const PRESET_LOGOS = [
  { label: 'AppCreator05 Official', url: '/logo.png' },
  { label: 'Gradient Sphere', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80' },
  { label: 'Neon Cyber', url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=300&auto=format&fit=crop&q=80' },
  { label: 'Minimal Geo', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=300&auto=format&fit=crop&q=80' },
];

const PRESET_SPLASHES = [
  { label: 'AppCreator05 Official', url: '/splash.png', color: '#070b19' },
  { label: 'Deep Blue Nebula', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80', color: '#0f172a' },
  { label: 'Dark Violet Glow', url: 'https://images.unsplash.com/photo-1550684847-75bdda21cc95?w=800&auto=format&fit=crop&q=80', color: '#1e1035' },
  { label: 'Emerald Abstract', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80', color: '#064e3b' },
];

export const AppConfigForm: React.FC<AppConfigFormProps> = ({
  config,
  onChange,
  onAdMobChange,
  onStartIoChange,
  onKeystoreChange,
  onOkAndSave,
  highlightMissing,
}) => {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const splashInputRef = useRef<HTMLInputElement>(null);

  // File Upload Handlers (converts image to Data URL with auto-resizing: 512x512 for Logo, 1080x1920 for Splash)
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const resized512 = await resizeLogoTo512(file);
        onChange({ appLogoUrl: resized512 });
      } catch (err) {
        // Fallback to raw FileReader if canvas resize fails
        const reader = new FileReader();
        reader.onload = (uploadEvent) => {
          if (uploadEvent.target?.result) {
            onChange({ appLogoUrl: uploadEvent.target.result as string });
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSplashUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const resized1080 = await resizeSplashTo1080x1920(file, config.splashBgColor);
        onChange({ splashImageUrl: resized1080 });
      } catch (err) {
        // Fallback to raw FileReader if canvas resize fails
        const reader = new FileReader();
        reader.onload = (uploadEvent) => {
          if (uploadEvent.target?.result) {
            onChange({ splashImageUrl: uploadEvent.target.result as string });
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Derive package name automatically from app name
  const handleAutoDerivePackage = () => {
    const cleanName = config.appName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
    onChange({ packageName: cleanName ? `com.${cleanName}.app` : 'com.appcreator05.app' });
  };

  // Permission toggle handlers
  const handlePermissionToggle = (key: keyof AppPermissions) => {
    const current = config.permissions || {
      internet: true,
      accessNetworkState: true,
      accessCoarseLocation: false,
      accessFineLocation: false,
      camera: false,
      readExternalStorage: true,
      writeExternalStorage: true,
      recordAudio: false,
      modifyAudioSettings: false,
      vibrate: true,
      postNotifications: true,
    };
    onChange({
      permissions: {
        ...current,
        [key]: !current[key],
      },
    });
  };

  const handleSelectAllPermissions = () => {
    onChange({
      permissions: {
        internet: true,
        accessNetworkState: true,
        accessCoarseLocation: true,
        accessFineLocation: true,
        camera: true,
        readExternalStorage: true,
        writeExternalStorage: true,
        recordAudio: true,
        modifyAudioSettings: true,
        vibrate: true,
        postNotifications: true,
      },
    });
  };

  const handleSelectRecommendedPermissions = () => {
    onChange({
      permissions: {
        internet: true,
        accessNetworkState: true,
        accessCoarseLocation: false,
        accessFineLocation: false,
        camera: false,
        readExternalStorage: true,
        writeExternalStorage: true,
        recordAudio: false,
        modifyAudioSettings: false,
        vibrate: true,
        postNotifications: true,
      },
    });
  };

  const handleClearAllPermissions = () => {
    onChange({
      permissions: {
        internet: false,
        accessNetworkState: false,
        accessCoarseLocation: false,
        accessFineLocation: false,
        camera: false,
        readExternalStorage: false,
        writeExternalStorage: false,
        recordAudio: false,
        modifyAudioSettings: false,
        vibrate: false,
        postNotifications: false,
      },
    });
  };

  const isValidUrl =
    config.websiteUrl.startsWith('http://') || config.websiteUrl.startsWith('https://');

  // Custom Feature tickmark options requested by user
  const featureCheckboxes = [
    {
      id: 'textSelection',
      title: 'Text Selection',
      desc: 'Allow users to select, highlight, and copy text inside the webview',
      checked: !!config.textSelection,
      toggle: () => onChange({ textSelection: !config.textSelection }),
      icon: MousePointer,
    },
    {
      id: 'saveFormData',
      title: 'Save Form Data',
      desc: 'Remember input field data, form submissions, and login cookies',
      checked: !!config.saveFormData,
      toggle: () => onChange({ saveFormData: !config.saveFormData }),
      icon: FileText,
    },
    {
      id: 'fullscreenMode',
      title: 'Full Screen',
      desc: 'Pure fullscreen edge-to-edge mode hiding top status bar and bottom navigation',
      checked: !!config.fullscreenMode,
      toggle: () => onChange({ fullscreenMode: !config.fullscreenMode }),
      icon: Monitor,
    },
    {
      id: 'confirmOnExit',
      title: 'Confirm on Exit',
      desc: 'Show a prompt dialog when user presses back button to prevent accidental exit',
      checked: !!config.confirmOnExit,
      toggle: () => onChange({ confirmOnExit: !config.confirmOnExit }),
      icon: AlertCircle,
    },
    {
      id: 'enableGpsPrompt',
      title: 'Enable GPS Prompt',
      desc: 'Prompts users for location permission whenever website requests geolocation',
      checked: !!config.enableGpsPrompt,
      toggle: () => onChange({ enableGpsPrompt: !config.enableGpsPrompt }),
      icon: Compass,
    },
    {
      id: 'pullToRefresh',
      title: 'Pull to Refresh',
      desc: 'Swipe down from the top of the screen to quickly reload the webpage',
      checked: !!config.pullToRefresh,
      toggle: () => onChange({ pullToRefresh: !config.pullToRefresh }),
      icon: RefreshCw,
    },
    {
      id: 'deepLinking',
      title: 'Deep Linking',
      desc: 'Open web links directly in the application with Android intent filters',
      checked: !!config.deepLinking,
      toggle: () => onChange({ deepLinking: !config.deepLinking }),
      icon: Link2,
    },
    {
      id: 'showProgressWheel',
      title: 'Progress Wheel on Loading',
      desc: 'Shows a circular loading spinner while webpage is loading and hides when ready',
      checked: config.showProgressWheel !== false,
      toggle: () => onChange({ showProgressWheel: !config.showProgressWheel }),
      icon: Loader,
    },
    {
      id: 'useCustomTabs',
      title: 'Chrome Custom Tabs',
      desc: 'Opens external links smoothly inside Chrome Custom Tabs without breaking webview navigation',
      checked: config.useCustomTabs !== false,
      toggle: () => onChange({ useCustomTabs: !config.useCustomTabs }),
      icon: ExternalLink,
    },
    {
      id: 'enablePaymentRedirects',
      title: 'Popup & Wallet Payment Support',
      desc: 'Enables popups, payment gateways, subscriptions, and wallet apps (bKash, Nagad, UPI, Paytm, GPay) with auto-return to app upon success',
      checked: config.enablePaymentRedirects !== false,
      toggle: () => onChange({ enablePaymentRedirects: !config.enablePaymentRedirects }),
      icon: CreditCard,
    },
    {
      id: 'keepScreenOn',
      title: 'Keep Screen Always On',
      desc: 'Prevents the phone display from turning off, dimming, or sleeping while using the app',
      checked: config.keepScreenOn !== false,
      toggle: () => onChange({ keepScreenOn: config.keepScreenOn === false }),
      icon: Sun,
    },
  ];

  // User-requested 12 Advanced Browser & WebView Allowed Features
  const advancedBrowserFeatures = [
    {
      id: 'thirdPartyCookies' as const,
      title: 'Third Party Cookies',
      bengali: 'থার্ড-পার্টি কুকিজ এলাউড',
      desc: 'Allow cross-domain cookies, social login sessions (Google, Facebook), tracking, and embedded widget cookies.',
      tag: 'Cookies & Auth',
      icon: Cookie,
      checked: config.thirdPartyCookies !== false,
      toggle: () => onChange({ thirdPartyCookies: config.thirdPartyCookies === false }),
    },
    {
      id: 'javascriptEnabled' as const,
      title: 'JavaScript Engine',
      bengali: 'জাভাস্ক্রিপ্ট স্ক্রিপ্ট এক্সেকিউশন',
      desc: 'Full high-performance JavaScript execution, ES6+ modules, dynamic DOM manipulation, and interactive web elements.',
      tag: 'V8 Engine',
      icon: Code2,
      checked: config.javascriptEnabled !== false,
      toggle: () => onChange({ javascriptEnabled: config.javascriptEnabled === false }),
    },
    {
      id: 'popupAndRedirects' as const,
      title: 'Pop-up & Redirects',
      bengali: 'পপ-আপ ও রিডাইরেক্ট সাপোর্ট',
      desc: 'Enable window.open(), multi-window popups, payment gateways, authentication dialogs, and automated page redirects.',
      tag: 'Multi-Window',
      icon: ExternalLink,
      checked: config.popupAndRedirects !== false,
      toggle: () => onChange({ popupAndRedirects: config.popupAndRedirects === false }),
    },
    {
      id: 'soundAutoplay' as const,
      title: 'Sound & Audio Playback',
      bengali: 'সাউন্ড ও অডিও অটো-প্লে',
      desc: 'Enable unmuted media audio, background sounds, notifications, and HTML5 audio elements without requiring prior user touch.',
      tag: 'Audio Autoplay',
      icon: Volume2,
      checked: config.soundAutoplay !== false,
      toggle: () => onChange({ soundAutoplay: config.soundAutoplay === false }),
    },
    {
      id: 'intrusiveAds' as const,
      title: 'Intrusive Ads & Popunders',
      bengali: 'ইন্ট্রুসিভ অ্যাড ও পপ-আন্ডার ব্যানার',
      desc: 'Allow all ad networks (AdSense, AdMob, PropellerAds, PopAds, interstitial/overlay ads, redirect ads) without blocking.',
      tag: 'Ads Allowed',
      icon: Sparkles,
      checked: config.intrusiveAds !== false,
      toggle: () => onChange({ intrusiveAds: config.intrusiveAds === false }),
    },
    {
      id: 'protectedContent' as const,
      title: 'Protected Content (DRM Widevine)',
      bengali: 'প্রোটেক্টেড কন্টেন্ট ও ডিআরএম',
      desc: 'Grant protected media ID permission for DRM streams, Widevine EME, OTT platforms, Spotify, and encrypted media.',
      tag: 'DRM / Widevine',
      icon: ShieldCheck,
      checked: config.protectedContent !== false,
      toggle: () => onChange({ protectedContent: config.protectedContent === false }),
    },
    {
      id: 'autoVerify' as const,
      title: 'Auto Verify & Anti-Bot Bypass',
      bengali: 'অটো ভেরিফাই ও ক্যাপচা বাইপাস',
      desc: 'Optimized browser fingerprint to seamlessly pass Cloudflare Turnstile, Google reCAPTCHA, and SSL verification.',
      tag: 'Turnstile / Captcha',
      icon: Zap,
      checked: config.autoVerify !== false,
      toggle: () => onChange({ autoVerify: config.autoVerify === false }),
    },
    {
      id: 'onDeviceSiteData' as const,
      title: 'On-Device Site Data',
      bengali: 'অন-ডিভাইস সাইট ডাটা',
      desc: 'Full on-device storage for localStorage, sessionStorage, IndexedDB, and persistent app database files.',
      tag: 'Local Storage',
      icon: Database,
      checked: config.onDeviceSiteData !== false,
      toggle: () => onChange({ onDeviceSiteData: config.onDeviceSiteData === false }),
    },
    {
      id: 'automaticDownload' as const,
      title: 'Automatic Download',
      bengali: 'অটোমেটিক ডাউনলোড ও ডিরেক্ট সেভ',
      desc: 'Seamless automatic downloads for APKs, PDFs, and media files directly into device Downloads with system notifications.',
      tag: 'Direct Download',
      icon: DownloadCloud,
      checked: config.automaticDownload !== false,
      toggle: () => onChange({ automaticDownload: config.automaticDownload === false }),
    },
    {
      id: 'jsOptimizationAndSecurity' as const,
      title: 'JavaScript Optimisation & Security',
      bengali: 'জাভাস্ক্রিপ্ট অপ্টিমাইজেশন ও সিকিউরিটি',
      desc: 'Hardware-accelerated GPU rendering, V8 turbo compilation, normal layout algorithm, and flexible mixed-content security.',
      tag: 'GPU Turbo & JIT',
      icon: Cpu,
      checked: config.jsOptimizationAndSecurity !== false,
      toggle: () => onChange({ jsOptimizationAndSecurity: config.jsOptimizationAndSecurity === false }),
    },
    {
      id: 'dataStore' as const,
      title: 'Data Store & Local Database',
      bengali: 'ডাটা স্টোর ও লোকাল ডাটাবেস',
      desc: 'Persistent offline data store, SQLite web SQL, ServiceWorker caching, and immediate cookie cache flushing.',
      tag: 'Offline Store',
      icon: HardDrive,
      checked: config.dataStore !== false,
      toggle: () => onChange({ dataStore: config.dataStore === false }),
    },
    {
      id: 'embeddedContent' as const,
      title: 'Embedded Content & Iframes',
      bengali: 'এমবেডেড কন্টেন্ট ও আইফ্রেম',
      desc: 'Full support for embedded iframes, YouTube, Vimeo, HTML5 video with native fullscreen landscape expansion.',
      tag: 'Iframes & Video',
      icon: Layers,
      checked: config.embeddedContent !== false,
      toggle: () => onChange({ embeddedContent: config.embeddedContent === false }),
    },
  ];

  const handleAllowAllAdvancedFeatures = () => {
    onChange({
      thirdPartyCookies: true,
      javascriptEnabled: true,
      popupAndRedirects: true,
      soundAutoplay: true,
      intrusiveAds: true,
      protectedContent: true,
      autoVerify: true,
      onDeviceSiteData: true,
      automaticDownload: true,
      jsOptimizationAndSecurity: true,
      dataStore: true,
      embeddedContent: true,
    });
  };

  const allowedFeaturesCount = [
    config.thirdPartyCookies !== false,
    config.javascriptEnabled !== false,
    config.popupAndRedirects !== false,
    config.soundAutoplay !== false,
    config.intrusiveAds !== false,
    config.protectedContent !== false,
    config.autoVerify !== false,
    config.onDeviceSiteData !== false,
    config.automaticDownload !== false,
    config.jsOptimizationAndSecurity !== false,
    config.dataStore !== false,
    config.embeddedContent !== false,
  ].filter(Boolean).length;

  // Permissions list requested by user
  const permissionsList: {
    key: keyof AppPermissions;
    name: string;
    manifestTag: string;
    desc: string;
  }[] = [
    {
      key: 'internet',
      name: 'Internet',
      manifestTag: 'android.permission.INTERNET',
      desc: 'Required to load web content and online assets',
    },
    {
      key: 'accessNetworkState',
      name: 'Access Network State',
      manifestTag: 'android.permission.ACCESS_NETWORK_STATE',
      desc: 'Detect Wi-Fi, cellular connectivity, and offline state',
    },
    {
      key: 'accessCoarseLocation',
      name: 'Access Coarse Location',
      manifestTag: 'android.permission.ACCESS_COARSE_LOCATION',
      desc: 'Approximate city-level location',
    },
    {
      key: 'accessFineLocation',
      name: 'Access Fine Location',
      manifestTag: 'android.permission.ACCESS_FINE_LOCATION',
      desc: 'Precise satellite GPS coordinates for maps and navigation',
    },
    {
      key: 'camera',
      name: 'Camera',
      manifestTag: 'android.permission.CAMERA',
      desc: 'QR scanner, photo capture, and live camera feed for forms',
    },
    {
      key: 'readExternalStorage',
      name: 'Read External Storage',
      manifestTag: 'android.permission.READ_EXTERNAL_STORAGE',
      desc: 'Select and upload documents, photos, or audio',
    },
    {
      key: 'writeExternalStorage',
      name: 'Write External Storage',
      manifestTag: 'android.permission.WRITE_EXTERNAL_STORAGE',
      desc: 'Save downloaded files and receipts to phone memory',
    },
    {
      key: 'recordAudio',
      name: 'Record Audio & Modify Audio',
      manifestTag: 'android.permission.RECORD_AUDIO & MODIFY_AUDIO_SETTINGS',
      desc: 'Voice search, microphone access, and audio volume control',
    },
    {
      key: 'vibrate',
      name: 'Vibrate',
      manifestTag: 'android.permission.VIBRATE',
      desc: 'Haptic feedback on clicks, alerts, and notifications',
    },
    {
      key: 'wakeLock' as keyof AppPermissions,
      name: 'Wake Lock (Screen Always On)',
      manifestTag: 'android.permission.WAKE_LOCK',
      desc: 'Keeps device screen awake and active without dimming or turning off',
    },
    {
      key: 'postNotifications',
      name: 'Push Notifications',
      manifestTag: 'android.permission.POST_NOTIFICATIONS',
      desc: 'Push alerts, background download progress, and local notification popups',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Basic Web App Info */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
            1
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Website & App Details</h2>
            <p className="text-xs text-slate-400">
              Configure your website URL, application name, and package name
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Website URL */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                Website URL
              </span>
              {isValidUrl ? (
                <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Valid URL
                </span>
              ) : (
                <span className="text-[11px] text-amber-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Include https://
                </span>
              )}
            </label>
            <div className="relative">
              <input
                id="input-website-url"
                type="url"
                value={config.websiteUrl}
                onChange={(e) => onChange({ websiteUrl: e.target.value })}
                placeholder="https://yourwebsite.com"
                className={`w-full bg-slate-950/80 border rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition outline-none ${
                  highlightMissing?.websiteUrl
                    ? 'border-amber-500 ring-2 ring-amber-500/30 bg-amber-950/10'
                    : 'border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                }`}
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              The APK will load this website inside an edge-to-edge fullscreen WebView.
            </p>
          </div>

          {/* App Name & Package Name grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                App Name
              </label>
              <input
                id="input-app-name"
                type="text"
                value={config.appName}
                onChange={(e) => onChange({ appName: e.target.value })}
                placeholder="e.g. AppCreator05"
                className={`w-full bg-slate-950/80 border rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition outline-none ${
                  highlightMissing?.appName
                    ? 'border-amber-500 ring-2 ring-amber-500/30 bg-amber-950/10'
                    : 'border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Package Name</span>
                <button
                  type="button"
                  onClick={handleAutoDerivePackage}
                  className="text-[11px] text-emerald-400 hover:underline"
                >
                  Auto-generate
                </button>
              </label>
              <input
                id="input-package-name"
                type="text"
                value={config.packageName}
                onChange={(e) => onChange({ packageName: e.target.value })}
                placeholder="com.appcreator05.app"
                className={`w-full bg-slate-950/80 border rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 font-mono transition outline-none ${
                  highlightMissing?.packageName
                    ? 'border-amber-500 ring-2 ring-amber-500/30 bg-amber-950/10'
                    : 'border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Versioning & Screen Orientation */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
            2
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">App Version & Orientation</h2>
            <p className="text-xs text-slate-400">
              Set application version code, version name, and display orientation
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Version Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-blue-400" />
                Version Name
              </label>
              <input
                type="text"
                value={config.versionName || '1.0.0'}
                onChange={(e) => onChange({ versionName: e.target.value })}
                placeholder="1.0.0"
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono placeholder-slate-500 transition outline-none"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Visible to users in Google Play or Settings (e.g. 1.0.0, 2.1.4)
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-blue-400" />
                Version Code
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={config.versionCode || 1}
                onChange={(e) => onChange({ versionCode: parseInt(e.target.value, 10) || 1 })}
                placeholder="1"
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono placeholder-slate-500 transition outline-none"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Internal integer code (increment by 1 for each Play Store update)
              </p>
            </div>
          </div>

          {/* Android Target SDK & Signature Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-slate-950/70 border border-slate-800/80 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Minimum SDK</span>
                <span className="text-xs font-bold text-white font-mono">SDK 21 (Android 5.0+)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Target & Compile SDK</span>
                <span className="text-xs font-bold text-white font-mono">SDK 37 (Android 17 Cinnamon Bun)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400 shrink-0" />
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Signature Schemes</span>
                <span className="text-xs font-bold text-white font-mono">v1 + v2 + v3 + v4</span>
              </div>
            </div>
          </div>

          {/* Screen Orientation Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">
              Screen Orientation
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: 'auto_rotate' as AppOrientation,
                  label: 'Auto Rotate',
                  desc: 'Rotates with device sensor dynamically',
                  icon: RotateCw,
                },
                {
                  id: 'portrait' as AppOrientation,
                  label: 'Portrait',
                  desc: 'Fixed vertical orientation for phones',
                  icon: Smartphone,
                },
                {
                  id: 'landscape' as AppOrientation,
                  label: 'Landscape',
                  desc: 'Fixed horizontal orientation for media',
                  icon: Monitor,
                },
              ].map((opt) => {
                const IconComponent = opt.icon;
                const isSelected = (config.orientation || 'auto_rotate') === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onChange({ orientation: opt.id })}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition ${
                      isSelected
                        ? 'bg-blue-500/15 border-blue-500/50 ring-1 ring-blue-500/30'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg mt-0.5 shrink-0 ${
                        isSelected ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <span className={`text-xs font-semibold block ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {opt.label}
                      </span>
                      <span className="text-[11px] text-slate-400 leading-tight block mt-0.5">
                        {opt.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 3. App Logo & Splash Screen */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold">
            3
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">App Logo & Splash Screen</h2>
            <p className="text-xs text-slate-400">
              Upload custom app icon and splash screen image
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* App Logo */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-300">
                App Launcher Icon
              </label>
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="text-[11px] text-teal-400 hover:text-teal-300 flex items-center gap-1"
              >
                <Upload className="w-3 h-3" /> Upload Custom Logo
              </button>
              <input
                type="file"
                ref={logoInputRef}
                onChange={handleLogoUpload}
                accept="image/*"
                className="hidden"
              />
            </div>

            <div className="flex items-center gap-4 p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-800 shrink-0 border border-slate-700 shadow-md">
                <img
                  src={config.appLogoUrl}
                  alt="App Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={config.appLogoUrl}
                  onChange={(e) => onChange({ appLogoUrl: e.target.value })}
                  placeholder="https://... image URL"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 outline-none"
                />
                <p className="text-[10px] text-teal-400/90 mt-1 flex items-center gap-1 font-mono">
                  <Sparkles className="w-3 h-3 text-teal-400" />
                  Auto-resizes to exact 512x512px (Android icon standard)
                </p>
              </div>
            </div>

            {/* Presets */}
            <div>
              <span className="text-[11px] text-slate-400 block mb-1.5">Or choose a preset:</span>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_LOGOS.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => onChange({ appLogoUrl: item.url })}
                    className={`h-12 rounded-xl overflow-hidden border-2 transition ${
                      config.appLogoUrl === item.url
                        ? 'border-teal-500 ring-2 ring-teal-500/30'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <img src={item.url} alt={item.label} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Splash Screen */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-300">
                Splash Screen Image
              </label>
              <button
                type="button"
                onClick={() => splashInputRef.current?.click()}
                className="text-[11px] text-teal-400 hover:text-teal-300 flex items-center gap-1"
              >
                <Upload className="w-3 h-3" /> Upload Splash
              </button>
              <input
                type="file"
                ref={splashInputRef}
                onChange={handleSplashUpload}
                accept="image/*"
                className="hidden"
              />
            </div>

            <div className="flex items-center gap-4 p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
              <div
                className="w-16 h-20 rounded-xl overflow-hidden shrink-0 border border-slate-700 shadow-md relative"
                style={{ backgroundColor: config.splashBgColor }}
              >
                <img
                  src={config.splashImageUrl}
                  alt="Splash Preview"
                  className="w-full h-full object-cover opacity-90"
                />
              </div>
              <div className="flex-1 min-w-0 space-y-2">
                <input
                  type="text"
                  value={config.splashImageUrl}
                  onChange={(e) => onChange({ splashImageUrl: e.target.value })}
                  placeholder="https://... splash URL"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-500 outline-none"
                />
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-teal-400/90 flex items-center gap-1 font-mono">
                    <Sparkles className="w-3 h-3 text-teal-400" />
                    Auto-resizes to 1080x1920px (9:16 HD)
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400">Duration:</span>
                    <select
                      value={config.splashDuration}
                      onChange={(e) => onChange({ splashDuration: Number(e.target.value) })}
                      className="bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-xs text-white"
                    >
                      <option value={1000}>1.0s (Fast)</option>
                      <option value={2000}>2.0s (Normal)</option>
                      <option value={3000}>3.0s (Relaxed)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Presets */}
            <div>
              <span className="text-[11px] text-slate-400 block mb-1.5">Or choose a backdrop:</span>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_SPLASHES.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() =>
                      onChange({ splashImageUrl: item.url, splashBgColor: item.color })
                    }
                    className={`h-9 rounded-lg overflow-hidden border-2 transition ${
                      config.splashImageUrl === item.url
                        ? 'border-teal-500 ring-2 ring-teal-500/30'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <img src={item.url} alt={item.label} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Feature Tickmark Options (Users can toggle features they want in their app) */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
            4
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">
              App Features Selection
            </h2>
            <p className="text-xs text-slate-400">
              Toggle essential WebView and native features on or off
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {featureCheckboxes.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.id}
                onClick={item.toggle}
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition select-none ${
                  item.checked
                    ? 'bg-emerald-500/10 border-emerald-500/40'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center mt-0.5 shrink-0 border transition ${
                    item.checked
                      ? 'bg-emerald-500 border-emerald-400 text-black font-bold'
                      : 'border-slate-700 bg-slate-800/80 text-transparent'
                  }`}
                >
                  <CheckSquare className="w-3.5 h-3.5 text-black" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <IconComponent
                      className={`w-3.5 h-3.5 ${item.checked ? 'text-emerald-400' : 'text-slate-500'}`}
                    />
                    <span
                      className={`text-xs font-semibold ${item.checked ? 'text-white' : 'text-slate-300'}`}
                    >
                      {item.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Advanced Browser & WebView Permissions (User Requested 12 Allowed Features) */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900/80 to-teal-950/40 border border-emerald-500/30 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-emerald-500/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm border border-emerald-500/30">
              5
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-semibold text-white">
                  Advanced Browser &amp; WebView Permissions
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {allowedFeaturesCount} / 12 Allowed (সব সক্রিয়)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                ওয়েবভিউ ও ব্রাউজার সেটিংস: তৃতীয় পক্ষের কুকিজ, জাভাস্ক্রিপ্ট, রিডাইরেক্ট, সাউন্ড, অ্যাডস, ডাউনলোড ও এমবেড কন্টেন্ট
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              type="button"
              onClick={handleAllowAllAdvancedFeatures}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Allow All 12 (সব সক্রিয়)</span>
            </button>
          </div>
        </div>

        {/* 12 Features Responsive Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {advancedBrowserFeatures.map((item) => {
            const IconComp = item.icon;
            return (
              <div
                key={item.id}
                onClick={item.toggle}
                className={`p-3.5 rounded-xl border cursor-pointer transition select-none flex flex-col justify-between ${
                  item.checked
                    ? 'bg-emerald-950/30 border-emerald-500/40 ring-1 ring-emerald-500/20 hover:border-emerald-400'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                          item.checked
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : 'bg-slate-800 text-slate-500 border-slate-700'
                        }`}
                      >
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span
                          className={`text-xs font-bold block truncate ${
                            item.checked ? 'text-white' : 'text-slate-400'
                          }`}
                        >
                          {item.title}
                        </span>
                        <span className="text-[10px] text-emerald-400/80 block font-medium">
                          {item.bengali}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider shrink-0 border ${
                        item.checked
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-slate-800 text-slate-500 border-slate-700'
                      }`}
                    >
                      {item.checked ? 'Allowed' : 'Blocked'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                    {item.desc}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[10px]">
                  <span className="text-slate-500 font-mono">#{item.tag}</span>
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition ${
                        item.checked
                          ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold'
                          : 'border-slate-700 bg-slate-800/80 text-transparent'
                      }`}
                    >
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className={item.checked ? 'text-emerald-400 font-semibold' : 'text-slate-500'}>
                      {item.checked ? 'Active & Allowed' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Cache Mode Options */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
            6
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Cache Mode Options</h2>
            <p className="text-xs text-slate-400">
              Select web browsing cache strategy and offline performance mode
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              id: 'no_cache' as CacheMode,
              title: 'No Cache',
              desc: 'LOAD_NO_CACHE: Always fetches live online data directly. Never uses cache.',
              badge: 'Live Data',
            },
            {
              id: 'default_cache' as CacheMode,
              title: 'Default Cache',
              desc: 'LOAD_DEFAULT: Standard browser caching with normal asset revalidation.',
              badge: 'Recommended',
            },
            {
              id: 'highly_cached' as CacheMode,
              title: 'Highly Cached',
              desc: 'LOAD_CACHE_ELSE_NETWORK: Fast offline loading, uses cache if available.',
              badge: 'Fast & Offline',
            },
          ].map((mode) => {
            const isSelected = (config.cacheMode || 'default_cache') === mode.id;
            return (
              <div
                key={mode.id}
                onClick={() => onChange({ cacheMode: mode.id })}
                className={`p-4 rounded-xl border cursor-pointer transition select-none flex flex-col justify-between ${
                  isSelected
                    ? 'bg-purple-500/15 border-purple-500/50 ring-1 ring-purple-500/30'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-xs font-semibold ${isSelected ? 'text-purple-300 font-bold' : 'text-slate-300'}`}
                    >
                      {mode.title}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                        isSelected
                          ? 'bg-purple-500/30 text-purple-200 border border-purple-500/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {mode.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{mode.desc}</p>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-[11px]">
                  <div
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-purple-400 bg-purple-500' : 'border-slate-700'
                    }`}
                  >
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <span className={isSelected ? 'text-purple-300 font-medium' : 'text-slate-500'}>
                    {isSelected ? 'Active Mode' : 'Select Mode'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7. Ads Section (AdMob vs Start.io) */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              7
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">
                Ads Monetization & Interstitial Frequency
              </h2>
              <p className="text-xs text-slate-400">
                Configure Google AdMob or Start.io ads and interstitial ad interval
              </p>
            </div>
          </div>
        </div>

        {/* Network Selector Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1 bg-slate-950/80 rounded-xl border border-slate-800 mb-5">
          <button
            type="button"
            onClick={() => onChange({ adNetwork: 'admob' })}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-medium transition ${
              config.adNetwork === 'admob'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span>Google AdMob</span>
          </button>

          <button
            type="button"
            onClick={() => onChange({ adNetwork: 'startio' })}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-medium transition ${
              config.adNetwork === 'startio'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span>Start.io</span>
          </button>

          <button
            type="button"
            onClick={() => onChange({ adNetwork: 'none' })}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-medium transition ${
              config.adNetwork === 'none'
                ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
            <span>No Ads (Clean)</span>
          </button>
        </div>

        {/* Interstitial Interval Frequency */}
        {config.adNetwork !== 'none' && (
          <div className="bg-slate-950/80 border border-amber-500/30 rounded-xl p-4 mb-5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                Interstitial Ad Interval (Frequency):
              </label>
              <span className="px-2.5 py-1 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold">
                Every {config.interstitialIntervalMinutes || 3} Minutes
              </span>
            </div>

            <div className="space-y-1.5">
              <input
                type="range"
                min="1"
                max="15"
                step="1"
                value={config.interstitialIntervalMinutes || 3}
                onChange={(e) =>
                  onChange({ interstitialIntervalMinutes: parseInt(e.target.value, 10) || 3 })
                }
                className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>1 min</span>
                <span>5 min</span>
                <span>10 min</span>
                <span>15 min</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              The app automatically loads and displays the interstitial ad every {config.interstitialIntervalMinutes || 3} minute(s) in the background without interrupting navigation.
            </p>
          </div>
        )}

        {/* Case A: Google AdMob Selected */}
        {config.adNetwork === 'admob' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-start gap-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 text-xs text-emerald-300">
              <Zap className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-semibold text-emerald-200 text-sm">
                    100% Real Live Ads Mode (No Demo / Test Ads)
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-mono font-semibold border border-emerald-500/40">
                    GMA Next-Gen SDK
                  </span>
                  <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded text-[10px] font-mono font-semibold border border-blue-500/40">
                    Target SDK 37 (Android 17)
                  </span>
                </div>
                <p className="text-[11px] text-emerald-300/80 leading-relaxed">
                  Configured with Google Mobile Ads (GMA) Next-Gen SDK. Demo / test mode is disabled — enter your official AdMob App ID and Unit IDs below for live ad impressions.
                </p>
                {((config.admob.appId && config.admob.appId.includes('3940256099942544')) ||
                  (config.admob.bannerId && config.admob.bannerId.includes('3940256099942544')) ||
                  (config.admob.interstitialId && config.admob.interstitialId.includes('3940256099942544'))) && (
                  <div className="mt-2 p-2 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-200 text-[11px]">
                    ⚠️ <strong>Notice:</strong> You have entered Google's sample test ID (3940256099942544). To show 100% real live production ads, please replace it with your official AdMob ID from your Google AdMob console.
                  </div>
                )}
              </div>
            </div>

            {/* 1. App ID */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                1. AdMob App ID
              </label>
              <input
                type="text"
                value={config.admob.appId}
                onChange={(e) => onAdMobChange({ appId: e.target.value })}
                placeholder="ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy"
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white font-mono placeholder-slate-600 outline-none transition"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Required in AndroidManifest.xml: `com.google.android.gms.ads.APPLICATION_ID`
              </p>
            </div>

            {/* 2. Banner Ad ID */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                2. Banner Ad ID
              </label>
              <input
                type="text"
                value={config.admob.bannerId}
                onChange={(e) => onAdMobChange({ bannerId: e.target.value })}
                placeholder="ca-app-pub-xxxxxxxxxxxxxxxx/zzzzzzzzzz"
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white font-mono placeholder-slate-600 outline-none transition"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Displayed as a 320x50 smart banner at the bottom of the fullscreen app.
              </p>
            </div>

            {/* 3. Interstitial Ad ID */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                3. Interstitial Ad ID
              </label>
              <input
                type="text"
                value={config.admob.interstitialId}
                onChange={(e) => onAdMobChange({ interstitialId: e.target.value })}
                placeholder="ca-app-pub-xxxxxxxxxxxxxxxx/wwwwwwwwww"
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white font-mono placeholder-slate-600 outline-none transition"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Full-screen interstitial ad loaded according to the timer interval above.
              </p>
            </div>

            {/* 4. Rewarded Ad ID */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                4. Rewarded Ad ID
              </label>
              <input
                type="text"
                value={config.admob.rewardedId}
                onChange={(e) => onAdMobChange({ rewardedId: e.target.value })}
                placeholder="ca-app-pub-xxxxxxxxxxxxxxxx/vvvvvvvvvv"
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white font-mono placeholder-slate-600 outline-none transition"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                High-CPM rewarded video ad shown when user requests bonus/unlock features.
              </p>
            </div>
          </div>
        )}

        {/* Case B: Start.io Selected */}
        {config.adNetwork === 'startio' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex items-start gap-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-xl px-4 py-3 text-xs text-cyan-300">
              <Zap className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-semibold text-cyan-200 text-sm">
                    100% Real Live Ads Mode (Start.io Enabled)
                  </span>
                  <span className="bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded text-[10px] font-mono font-semibold border border-cyan-500/40">
                    SDK 5.1.0
                  </span>
                  <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded text-[10px] font-mono font-semibold border border-blue-500/40">
                    Android 6.0 – 16
                  </span>
                </div>
                <p className="text-[11px] text-cyan-300/80 leading-relaxed">
                  Configured with Start.io In-App SDK 5.1.0 (<code className="font-mono text-cyan-200">com.startapp:inapp-sdk:5.1.0</code>). Test mode is disabled — enter your official Start.io App ID and choose the formats below.
                </p>
              </div>
            </div>

            {/* Start.io App ID */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Start.io App ID
              </label>
              <input
                type="text"
                value={config.startio.appId}
                onChange={(e) => onStartIoChange({ appId: e.target.value })}
                placeholder="e.g. 208765432"
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white font-mono placeholder-slate-600 outline-none transition"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                StartAppSDK.init(this, "{config.startio.appId || 'APP_ID'}", false)
              </p>
            </div>

            {/* 3 Tick Marks for Start.io Ad Formats */}
            <div className="bg-slate-950/90 border border-slate-800/80 rounded-xl p-4 space-y-3">
              <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider">
                Select Active Ads:
              </label>

              {/* Tick 1: Banner */}
              <label className="flex items-center justify-between p-3 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/40 cursor-pointer transition">
                <div className="flex items-center gap-3">
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      onStartIoChange({ showBanner: !config.startio.showBanner });
                    }}
                    className={`w-5 h-5 rounded flex items-center justify-center border transition ${
                      config.startio.showBanner
                        ? 'bg-cyan-600 border-cyan-500 text-white'
                        : 'border-slate-700 bg-slate-800'
                    }`}
                  >
                    {config.startio.showBanner && <CheckSquare className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-white block">
                      1. Banner Ad
                    </span>
                    <span className="text-xs text-slate-400">
                      Shows bottom sticky banner advertisement
                    </span>
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    config.startio.showBanner
                      ? 'bg-cyan-500/20 text-cyan-300'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {config.startio.showBanner ? 'Active' : 'Off'}
                </span>
              </label>

              {/* Tick 2: Interstitial */}
              <label className="flex items-center justify-between p-3 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/40 cursor-pointer transition">
                <div className="flex items-center gap-3">
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      onStartIoChange({ showInterstitial: !config.startio.showInterstitial });
                    }}
                    className={`w-5 h-5 rounded flex items-center justify-center border transition ${
                      config.startio.showInterstitial
                        ? 'bg-cyan-600 border-cyan-500 text-white'
                        : 'border-slate-700 bg-slate-800'
                    }`}
                  >
                    {config.startio.showInterstitial && <CheckSquare className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-white block">
                      2. Interstitial Ad
                    </span>
                    <span className="text-xs text-slate-400">
                      Shows full-screen automatic interstitial
                    </span>
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    config.startio.showInterstitial
                      ? 'bg-cyan-500/20 text-cyan-300'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {config.startio.showInterstitial ? 'Active' : 'Off'}
                </span>
              </label>

              {/* Tick 3: Rewarded */}
              <label className="flex items-center justify-between p-3 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/40 cursor-pointer transition">
                <div className="flex items-center gap-3">
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      onStartIoChange({ showRewarded: !config.startio.showRewarded });
                    }}
                    className={`w-5 h-5 rounded flex items-center justify-center border transition ${
                      config.startio.showRewarded
                        ? 'bg-cyan-600 border-cyan-500 text-white'
                        : 'border-slate-700 bg-slate-800'
                    }`}
                  >
                    {config.startio.showRewarded && <CheckSquare className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-white block">
                      3. Rewarded Ad
                    </span>
                    <span className="text-xs text-slate-400">
                      Shows rewarded video ad with user bonus callback
                    </span>
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    config.startio.showRewarded
                      ? 'bg-cyan-500/20 text-cyan-300'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {config.startio.showRewarded ? 'Active' : 'Off'}
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Case C: No Ads Selected */}
        {config.adNetwork === 'none' && (
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 text-center text-slate-400 text-xs">
            No advertisements configured. The resulting APK will be 100% ad-free and distraction-free.
          </div>
        )}
      </div>

      {/* 8. Customizable Android Permissions */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold">
              8
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">
                Customize Permissions
              </h2>
              <p className="text-xs text-slate-400">
                Select required Android permissions (applied directly to both APK and AAB builds)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-[11px] font-medium text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-md">
              {permissionsList.filter((p) => !!config.permissions?.[p.key]).length} of {permissionsList.length} Selected
            </span>
            <span className="text-[11px] text-slate-400 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800 font-mono">
              AndroidManifest.xml
            </span>
          </div>
        </div>

        {/* Quick Selection Presets */}
        <div className="flex flex-wrap items-center gap-2 mb-4 p-2 bg-slate-950/60 rounded-xl border border-slate-800/80">
          <span className="text-[11px] text-slate-400 px-1 font-medium">Quick Presets:</span>
          <button
            type="button"
            onClick={handleSelectRecommendedPermissions}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            Recommended
          </button>
          <button
            type="button"
            onClick={handleSelectAllPermissions}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition"
          >
            Select All
          </button>
          <button
            type="button"
            onClick={handleClearAllPermissions}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {permissionsList.map((perm) => {
            const isChecked = !!config.permissions?.[perm.key];
            return (
              <div
                key={perm.key}
                onClick={() => handlePermissionToggle(perm.key)}
                className={`p-3.5 rounded-xl border cursor-pointer select-none transition flex items-start gap-3 ${
                  isChecked
                    ? 'bg-rose-500/10 border-rose-500/40 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center mt-0.5 shrink-0 border transition ${
                    isChecked
                      ? 'bg-rose-500 border-rose-400 text-white font-bold'
                      : 'border-slate-700 bg-slate-800'
                  }`}
                >
                  {isChecked && <CheckSquare className="w-3.5 h-3.5 text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`text-xs font-semibold ${isChecked ? 'text-white' : 'text-slate-300'}`}
                    >
                      {perm.name}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded ${
                        isChecked ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {isChecked ? 'ON' : 'OFF'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 leading-tight">{perm.desc}</p>
                  <code className="text-[9px] text-slate-500 block mt-1.5 font-mono truncate">
                    {perm.manifestTag}
                  </code>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 p-3 bg-slate-950/40 border border-slate-800/80 rounded-xl flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Selected permissions will be included directly in AndroidManifest.xml for both APK and AAB builds and remain active at runtime.
          </span>
        </div>
      </div>

      {/* 8. Google Services & Firebase Configuration (google-services.json) */}
      <GoogleServicesSection
        googleServicesJson={config.googleServicesJson}
        googleServicesFileName={config.googleServicesFileName}
        currentPackageName={config.packageName}
        onUpdate={({ googleServicesJson, googleServicesFileName }) =>
          onChange({ googleServicesJson, googleServicesFileName })
        }
        onSyncPackageName={(newPackageName) =>
          onChange({ packageName: newPackageName })
        }
      />

      {/* 9. Custom Keystore & Signing Section */}
      <KeystoreSection
        keystore={config.keystore}
        appName={config.appName}
        onChange={onKeystoreChange}
      />
    </div>
  );
};
