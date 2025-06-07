import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Language = 'en' | 'he';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private translations: Record<Language, Record<string, string>> = {
    en: {},
    he: {}
  };

  private currentLangSubject = new BehaviorSubject<Language>('en');
  public currentLang$: Observable<Language> = this.currentLangSubject.asObservable();

  constructor() {
    // Load translations
    this.loadTranslations();

    // Check for saved language preference
    const savedLang = localStorage.getItem('preferred_language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'he')) {
      this.setLanguage(savedLang);
    }
  }

  // Load all translations
  private loadTranslations(): void {
    // English translations (default values)
    this.translations.en = {
      // Home page
      'welcome': 'Welcome to Signit',
      'welcome_subtitle': 'A simple and efficient solution for signing your documents',
      'sign_documents': 'Sign Documents',
      'upload_sign': 'Upload and sign your documents',
      'get_started': 'Get Started',

      // Navigation
      'language': 'Language',

      // Sign Folder page
      'sign_multiple_documents': 'Sign Multiple Documents',
      'upload_docs_subtitle': 'Upload multiple documents and add your signature to sign them all',
      'drag_drop_files': 'Drag & Drop your PDF or image files here or select files/folder',
      'upload_files': 'Upload Files',
      'upload_folder': 'Upload Folder',
      'selected_documents': 'Selected Documents',
      'clear_all': 'Clear All',
      'document_name': 'Document Name',
      'remove': 'Remove',
      'add_more': 'Add More Documents',
      'add_more_files': 'Add More Files',
      'add_more_folder': 'Add More Folder',
      'add_your_signature': 'Add Your Signature',
      'signature_section': 'Signature Section',
      'upload_image': 'Upload Image',
      'draw_signature': 'Draw Signature',
      'signature_settings': 'Signature Settings',
      'signature_position': 'Signature Position',
      'page_selection': 'Page Selection',
      'all_pages': 'All Pages',
      'first_page_only': 'First Page Only',
      'last_page_only': 'Last Page Only',
      'custom_range': 'Custom Range',
      'from_page': 'From Page',
      'to_page': 'To Page',
      'sign_documents_btn': 'Sign Documents',
      'or': 'or',
      'type_pages': 'Type pages',
      'processing': 'Processing',
      'please_wait': 'Please wait while your documents are being processed',
      'pdf': 'PDF',
      'image': 'Image',
      'signed': 'Signed',
      'pages': 'Pages',

      // Error messages
      'select_docs_signature': 'Please select both documents and a signature.',
      'error_signing': 'An error occurred while signing the documents. Please try again.',
      'browser_not_supported': 'Your browser does not support the File System Access API. Please use Chrome, Edge, or another compatible browser.',
      'secure_context_required': 'File System Access API requires a secure context (HTTPS or localhost). Please run the app using HTTPS or on localhost.',
      'no_documents_saved': 'No documents were saved. Please try again.',

      // Result page
      'documents_signed': 'Documents Successfully Signed!',
      'documents_signed_subtitle': 'Your documents have been digitally signed with your signature and are ready to download',
      'pdf_signed': 'PDF documents have been signed with embedded signature images',
      'image_signed': 'Image documents have been signed with your signature overlay',
      'signed_documents': 'Signed Documents',
      'signature': 'Signature',
      'top_center': 'Top Center',
      'bottom_center': 'Bottom Center',
      'download': 'Download',
      'signature_used': 'Signature Used',
      'save_document': 'Save Document',
      'specify_save': 'Specify where to save your signed document',
      'save_location': 'Save Location',
      'click_save': 'Click \'Save to Location\' to select a folder on your device',
      'browser_compat': 'Works in Chrome and Edge browsers on secure connections (HTTPS or localhost)',
      'save_to_location': 'Save to Location',
      'bulk_actions': 'Bulk Actions',
      'download_all': 'Download All Documents',
      'click_below': 'Click below to select a folder on your device',
      'save_all': 'Save All to Location',
      'sign_new': 'Sign New Documents',
      'documents_saved': '{0} document(s) saved successfully to the selected location.',
      'documents_saved_failed': '{0} document(s) saved successfully to the selected location.\n\nFailed to save: {1}'
    };

    // Hebrew translations
    this.translations.he = {
      // Home page
      'welcome': 'ברוכים הבאים ל-Signit',
      'welcome_subtitle': 'פתרון פשוט ויעיל לחתימה על המסמכים שלך',
      'sign_documents': 'חתום על מסמכים',
      'upload_sign': 'העלה וחתום על המסמכים שלך',
      'get_started': 'בוא נתחיל',

      // Navigation
      'language': 'שפה',

      // Sign Folder page
      'sign_multiple_documents': 'חתום על מסמכים מרובים',
      'upload_docs_subtitle': 'העלה מסמכים מרובים והוסף את חתימתך כדי לחתום על כולם',
      'drag_drop_files': 'גרור ושחרר את קבצי ה-PDF או התמונות שלך כאן או בחר קבצים/תיקייה',
      'upload_files': 'העלה קבצים',
      'upload_folder': 'העלה תיקייה',
      'selected_documents': 'מסמכים שנבחרו',
      'clear_all': 'נקה הכל',
      'document_name': 'שם המסמך',
      'remove': 'הסר',
      'add_more': 'הוסף עוד מסמכים',
      'add_more_files': 'הוסף עוד קבצים',
      'add_more_folder': 'הוסף עוד תיקייה',
      'add_your_signature': 'הוסף את חתימתך',
      'signature_section': 'אזור החתימה',
      'upload_image': 'העלה תמונה',
      'draw_signature': 'צייר חתימה',
      'signature_settings': 'הגדרות חתימה',
      'signature_position': 'מיקום חתימה',
      'page_selection': 'בחירת עמוד',
      'all_pages': 'כל העמודים',
      'first_page_only': 'עמוד ראשון בלבד',
      'last_page_only': 'עמוד אחרון בלבד',
      'custom_range': 'טווח מותאם אישית',
      'from_page': 'מעמוד',
      'to_page': 'לעמוד',
      'sign_documents_btn': 'חתום על מסמכים',
      'or': 'או',
      'type_pages': 'הקלד עמודים',
      'processing': 'מעבד',
      'please_wait': 'אנא המתן בזמן שהמסמכים שלך מעובדים',
      'pdf': 'PDF',
      'image': 'תמונה',
      'signed': 'חתום',
      'pages': 'עמודים',

      // Error messages
      'select_docs_signature': 'אנא בחר גם מסמכים וגם חתימה.',
      'error_signing': 'אירעה שגיאה בחתימת המסמכים. אנא נסה שוב.',
      'browser_not_supported': 'הדפדפן שלך אינו תומך ב-File System Access API. אנא השתמש ב-Chrome, Edge או דפדפן תואם אחר.',
      'secure_context_required': 'File System Access API דורש הקשר מאובטח (HTTPS או localhost). אנא הפעל את האפליקציה באמצעות HTTPS או localhost.',
      'no_documents_saved': 'לא נשמרו מסמכים. אנא נסה שוב.',

      // Result page
      'documents_signed': 'המסמכים נחתמו בהצלחה!',
      'documents_signed_subtitle': 'המסמכים שלך נחתמו דיגיטלית עם החתימה שלך ומוכנים להורדה',
      'pdf_signed': 'מסמכי PDF נחתמו עם תמונות חתימה מוטמעות',
      'image_signed': 'מסמכי תמונה נחתמו עם שכבת חתימה',
      'signed_documents': 'מסמכים חתומים',
      'signature': 'חתימה',
      'top_center': 'למעלה במרכז',
      'bottom_center': 'למטה במרכז',
      'download': 'הורדה',
      'signature_used': 'חתימה בשימוש',
      'save_document': 'שמור מסמך',
      'specify_save': 'בחר היכן לשמור את המסמך החתום שלך',
      'save_location': 'מיקום שמירה',
      'click_save': 'לחץ על \'שמור למיקום\' כדי לבחור תיקייה במכשיר שלך',
      'browser_compat': 'עובד בדפדפני Chrome ו-Edge בחיבורים מאובטחים (HTTPS או localhost)',
      'save_to_location': 'שמור למיקום',
      'bulk_actions': 'פעולות מרובות',
      'download_all': 'הורד את כל המסמכים',
      'click_below': 'לחץ למטה כדי לבחור תיקייה במכשיר שלך',
      'save_all': 'שמור הכל למיקום',
      'sign_new': 'חתום על מסמכים חדשים',
      'documents_saved': '{0} מסמך/ים נשמרו בהצלחה למיקום שנבחר.',
      'documents_saved_failed': '{0} מסמך/ים נשמרו בהצלחה למיקום שנבחר.\n\nנכשל בשמירת: {1}'
    };
  }

  // Get current language
  public getCurrentLang(): Language {
    return this.currentLangSubject.value;
  }

  // Set active language
  public setLanguage(lang: Language): void {
    this.currentLangSubject.next(lang);
    localStorage.setItem('preferred_language', lang);

    // Set document direction
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }

  // Toggle between languages
  public toggleLanguage(): void {
    const newLang = this.getCurrentLang() === 'en' ? 'he' : 'en';
    this.setLanguage(newLang);
  }

  // Get translation with optional parameters for formatting
  public translate(key: string, ...params: any[]): string {
    const lang = this.getCurrentLang();
    let translation = this.translations[lang][key] || key;

    // Replace placeholders {0}, {1}, etc. with provided parameters
    if (params && params.length > 0) {
      params.forEach((param, index) => {
        translation = translation.replace(new RegExp(`\\{${index}\\}`, 'g'), param);
      });
    }

    return translation;
  }
}
