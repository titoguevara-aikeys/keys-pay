import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      admin: {
        title: "Taglines Admin",
        add: "Add",
        save: "Save", 
        signIn: "Sign in",
        signOut: "Sign out",
        publish: "Publish",
        draft: "Move to Draft",
        delete: "Delete",
        saveOrder: "Save Order",
        publishAll: "Publish All",
        locale: "Locale",
        status: "Status", 
        position: "Position",
        active: "Active",
        text: "Text",
        actions: "Actions",
        published: "published",
        drafted: "draft",
        schedule: "Publish at",
        allowlist: "Allowlist",
        dashboard: "Dashboard",
        role: "Role",
        email: "Email",
        created: "Created",
        systemStatus: "System Status",
        managingTaglines: "Create, edit, reorder, and publish scrolling taglines.",
        managingUsers: "Manage admin users & roles. (Admins only)",
        supabaseRunning: "Supabase + i18n running. More widgets can go here.",
        adminOnly: "Admins only",
        notAllowlisted: "You're not on the allowlist. Please contact an admin to grant access.",
        checkEmail: "Check your email for a sign-in link."
      }
    }
  },
  ar: {
    translation: {
      admin: {
        title: "لوحة إدارة الشعارات",
        add: "إضافة",
        save: "حفظ",
        signIn: "تسجيل الدخول", 
        signOut: "تسجيل الخروج",
        publish: "نشر",
        draft: "تحويل لمسودة",
        delete: "حذف",
        saveOrder: "حفظ الترتيب",
        publishAll: "نشر الكل",
        locale: "اللغة",
        status: "الحالة",
        position: "الترتيب", 
        active: "مفعل",
        text: "النص",
        actions: "الإجراءات",
        published: "منشور",
        drafted: "مسودة", 
        schedule: "وقت النشر",
        allowlist: "قائمة المصرح لهم",
        dashboard: "لوحة التحكم",
        role: "الدور",
        email: "البريد الإلكتروني",
        created: "تاريخ الإنشاء",
        systemStatus: "حالة النظام",
        managingTaglines: "إنشاء وتحرير وترتيب ونشر الشعارات المتحركة.",
        managingUsers: "إدارة المستخدمين الإداريين والأدوار. (للإداريين فقط)",
        supabaseRunning: "Supabase + i18n يعمل. يمكن إضافة المزيد من الأدوات هنا.",
        adminOnly: "للإداريين فقط",
        notAllowlisted: "لست في قائمة المصرح لهم. يرجى الاتصال بالإدارة لمنح الصلاحية.",
        checkEmail: "تحقق من بريدك الإلكتروني للحصول على رابط تسجيل الدخول."
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;