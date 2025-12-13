
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import/Define translations
const resources = {
    en: {
        translation: {
            "Get Started Free": "Get Started Free",
            "Sign In": "Sign In",
            "Build Your": "Build Your",
            "Professional Portfolio": "Professional Portfolio",
            "Standard_Description": "Create stunning ATS-friendly resumes and showcase your work with a personalized portfolio website. Stand out. Get hired.",
            "Get Started": "Get Started",
            "Language": "Language",
            "Features": "Features",
            "Pricing": "Pricing",
            "About": "About",
            "Contact": "Contact",

            // Hero
            "AI_Powered_Tag": "AI-Powered Resume & Portfolio Builder",

            // Stats
            "Stat_Resumes_Label": "Resumes Created",
            "Stat_ATS_Pass_Label": "ATS Pass Rate",
            "Stat_Templates_Label": "Templates",
            "Stat_Rating_Label": "User Rating",

            // Features Headers
            "Features_Title_Pre": "Everything You Need to",
            "Features_Title_Highlight": "Land Your Dream Job",
            "Features_Subtitle": "Powerful features designed to help you create professional resumes and portfolios that get results.",

            // Features Items
            "Feature_ATS_Title": "ATS-Friendly Templates",
            "Feature_ATS_Desc": "Professionally designed resume templates that pass applicant tracking systems with flying colors.",
            "Feature_URL_Title": "Personal Portfolio URL",
            "Feature_URL_Desc": "Get your own yourname.portcv.com subdomain to showcase your work professionally.",
            "Feature_Multiple_Title": "Multiple Resumes",
            "Feature_Multiple_Desc": "Create and manage multiple resume versions tailored for different job applications.",
            "Feature_AI_Title": "AI-Powered Parsing",
            "Feature_AI_Desc": "Upload your existing resume or LinkedIn PDF and let AI extract all your details instantly.",
            "Feature_Custom_Title": "Full Customization",
            "Feature_Custom_Desc": "Choose colors, fonts, layouts, and animations to make your portfolio truly yours.",
            "Feature_PDF_Title": "Export to PDF",
            "Feature_PDF_Desc": "Download your perfectly formatted resume as a PDF ready to submit to employers.",

            // Benefits
            "Why_Choose_Title": "Why Choose",
            "Why_Choose_PortCV": "PortCV?",
            "Why_Choose_Desc": "We've helped thousands of professionals create impressive portfolios and land their dream jobs. Here's what makes us different.",

            "Benefit_NoCard": "No credit card required to start",
            "Benefit_FastSetup": "Takes less than 5 minutes to set up",
            "Benefit_RealTime": "Real-time preview as you edit",
            "Benefit_SEO": "SEO-optimized portfolio pages",
            "Benefit_Analytics": "Analytics to track profile views",
            "Benefit_Mobile": "Mobile-responsive designs",

            // CTA
            "Ready_Title": "Ready to Build Your Professional Presence?",
            "Ready_Desc": "Join thousands of professionals who have transformed their careers with PortCV. Start for free today.",
            "Create_Free_Account": "Create Free Account",
            "Learn_More": "Learn More",

            // Footer
            "Rights_Reserved": "All rights reserved.",
            "Privacy": "Privacy",
            "Terms": "Terms",
            "Contact_Us": "Contact",

            // Edit Resume
            "Resume_Editor_Title": "Resume Editor",
            "Back_To_Dashboard": "Dashboard",
            "Edit_Portfolio": "Edit Portfolio",
            "Develop_Skills": "Develop Skills",
            "ATS_Score_Button": "ATS Score",
            "Analyzing": "Analyzing...",
            "Upload": "Upload",
            "Parsing": "Parsing...",
            "Save": "Save",
            "Saving": "Saving...",
            "PDF_Button": "PDF",
            "Generating": "Generating...",
            "Fix_With_AI": "Fix with AI",
            "Fixing": "Fixing...",

            // Develop Skills
            "Career_Analysis_Title": "Career Analysis & Guidance",
            "Career_Analysis_Desc": "Get AI-powered insights on your strengths, areas to improve, and personalized career development path.",
            "Analyze_Your_Career": "Analyze Your Career",
            "Analyze_Career_Desc": "Select a resume to get personalized career insights and development recommendations",
            "Select_Resume": "Select Resume",
            "Choose_Resume": "Choose a resume",
            "Analyze_Career_Button": "Analyze Career",
            "Your_Strengths": "Your Strengths",
            "Areas_Improve": "Areas to Improve",
            "Red_Flags": "Red Flags & Mistakes",
            "Career_Path": "Your Career Path",
            "Skills_Develop": "Skills to Develop",
            "Actionable_Advice": "Actionable Advice",
            "Priority": "priority"
        }
    },
    ar: {
        translation: {
            "Get Started Free": "ابدأ مجاناً",
            "Sign In": "تسجيل الدخول",
            "Build Your": "ابنِ",
            "Professional Portfolio": "ملفك المهني الاحترافي",
            "Standard_Description": "أنشئ سير ذاتية احترافية متوافقة مع أنظمة التتبع (ATS) واعرض أعمالك عبر موقعك الشخصي. تميز عن الآخرين واحصل على وظيفة أحلامك.",
            "Get Started": "ابدأ الآن",
            "Language": "اللغة",
            "Features": "المميزات",
            "Pricing": "الأسعار",
            "About": "عنا",
            "Contact": "تواصل معنا",

            // Hero
            "AI_Powered_Tag": "منشئ السير الذاتية والمحافظ بالذكاء الاصطناعي",

            // Stats
            "Stat_Resumes_Label": "سيرة ذاتية تم إنشاؤها",
            "Stat_ATS_Pass_Label": "نسبة قبول ATS",
            "Stat_Templates_Label": "قالب احترافي",
            "Stat_Rating_Label": "تقييم المستخدمين",

            // Features Headers
            "Features_Title_Pre": "كل ما تحتاجه لـ",
            "Features_Title_Highlight": "الحصول على وظيفة أحلامك",
            "Features_Subtitle": "أدوات قوية صُممت خصيصاً لمساعدتك في إنشاء سير ذاتية ومحافظ احترافية تحقق النتائج.",

            // Features Items
            "Feature_ATS_Title": "قوالب متوافقة مع ATS",
            "Feature_ATS_Desc": "قوالب مصممة باحترافية لتجتاز أنظمة تتبع المتقدمين (ATS) بكفاءة عالية.",
            "Feature_URL_Title": "رابط محفظة خاص",
            "Feature_URL_Desc": "احصل على نطاق فرعي خاص بك (yourname.portcv.com) لعرض أعمالك بشكل احترافي.",
            "Feature_Multiple_Title": "سير ذاتية متعددة",
            "Feature_Multiple_Desc": "أنشئ وأدر نسخاً متعددة من سيرتك الذاتية مخصصة لكل وظيفة تتقدم لها.",
            "Feature_AI_Title": "تحليل ذكي بالذكاء الاصطناعي",
            "Feature_AI_Desc": "ارفع سيرتك الذاتية الحالية أو ملف LinkedIn، ودع الذكاء الاصطناعي يستخرج بياناتك فوراً.",
            "Feature_Custom_Title": "تخصيص كامل",
            "Feature_Custom_Desc": "اختر الألوان، الخطوط، والتخطيطات لتجعل محفظتك تعكس شخصيتك المهنية.",
            "Feature_PDF_Title": "تصدير بصيغة PDF",
            "Feature_PDF_Desc": "حمل سيرتك الذاتية بصيغة PDF جاهزة للتقديم فوراً لأصحاب العمل.",

            // Benefits
            "Why_Choose_Title": "لماذا تختار",
            "Why_Choose_PortCV": "PortCV؟",
            "Why_Choose_Desc": "لقد ساعدنا آلاف المحترفين في بناء حضورهم الرقمي والحصول على وظائف مميزة. إليك ما يميزنا.",

            "Benefit_NoCard": "لا تتطلب بطاقة ائتمان للبدء",
            "Benefit_FastSetup": "إعداد كامل في أقل من 5 دقائق",
            "Benefit_RealTime": "معاينة فورية أثناء التعديل",
            "Benefit_SEO": "صفحات مهيئة لمحركات البحث (SEO)",
            "Benefit_Analytics": "تحليلات لمتابعة زيارات ملفك",
            "Benefit_Mobile": "تصاميم متجاوبة مع جميع الأجهزة",

            // CTA
            "Ready_Title": "جهاز لبناء حضورك المهني؟",
            "Ready_Desc": "انضم إلى آلاف المحترفين الذين طوروا مسيرتهم المهنية مع PortCV. ابدأ مجاناً اليوم.",
            "Create_Free_Account": "أنشئ حساباً مجانياً",
            "Learn_More": "اعرف المزيد",

            // Footer
            "Rights_Reserved": "جميع الحقوق محفوظة.",
            "Privacy": "الخصوصية",
            "Terms": "الشروط",
            "Contact_Us": "اتصل بنا",

            // Edit Resume
            "Resume_Editor_Title": "محرر السيرة الذاتية",
            "Back_To_Dashboard": "لوحة التحكم",
            "Edit_Portfolio": "تعديل المحفظة",
            "Develop_Skills": "تطوير المهارات",
            "ATS_Score_Button": "تقييم ATS",
            "Analyzing": "جاري التحليل...",
            "Upload": "رفع ملف",
            "Parsing": "جاري المعالجة...",
            "Save": "حفظ",
            "Saving": "جاري الحفظ...",
            "PDF_Button": "PDF",
            "Generating": "جاري التوليد...",
            "Fix_With_AI": "تحسين بالذكاء الاصطناعي",
            "Fixing": "جاري التحسين...",

            // Develop Skills
            "Career_Analysis_Title": "التحليل والتوجيه المهني",
            "Career_Analysis_Desc": "احصل على رؤى مدعومة بالذكاء الاصطناعي حول نقاط قوتك والمجالات التي تحتاج إلى تحسين ومسار التطوير المهني المخصص.",
            "Analyze_Your_Career": "حلل مسارك المهني",
            "Analyze_Career_Desc": "اختر سيرة ذاتية للحصول على رؤى مهنية مخصصة وتوصيات بالتطوير",
            "Select_Resume": "اختر السيرة الذاتية",
            "Choose_Resume": "اختر سيرة ذاتية",
            "Analyze_Career_Button": "تحليل المسار المهني",
            "Your_Strengths": "نقاط قوتك",
            "Areas_Improve": "مجالات للتحسين",
            "Red_Flags": "أخطاء وتنبيهات",
            "Career_Path": "مسارك المهني",
            "Skills_Develop": "مهارات للتطوير",
            "Actionable_Advice": "نصائح عملية",
            "Priority": "أولوية"
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
                lng: "en", // Default language
                fallbackLng: "en",
                interpolation: {
                    escapeValue: false
                },
                detection: {
                    order: ['localStorage', 'navigator'],
                    caches: ['localStorage'],
                }
            });

        export default i18n;
