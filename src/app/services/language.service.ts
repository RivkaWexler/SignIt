import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Language = 'en' | 'he';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  // Get the current selected language value synchronously
  // getCurrentLanguage(): Language {
  //   let currentLang: Language = 'en';
  //   // Get the value synchronously from the BehaviorSubject
  //   this.selectedLanguage.subscribe(lang => {
  //     currentLang = lang;
  //   }).unsubscribe();
  //   return currentLang;
  // }
  private languageSubject = new BehaviorSubject<Language>('en');
  public selectedLanguage: Observable<Language> = this.languageSubject.asObservable();

  constructor() {
    // Load saved language preference on initialization
    this.loadSavedLanguage();
  }

  private loadSavedLanguage(): void {
    const savedLanguage = localStorage.getItem('preferred_language') as Language;
    if (savedLanguage) {
      this.setLanguage(savedLanguage);
    }
  }

  public setLanguage(language: Language): void {
    // Save to localStorage for persistence
    localStorage.setItem('preferred_language', language);

    // Update the observable
    this.languageSubject.next(language);

    // Set document direction based on language
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }

  public getCurrentLanguage(): Language {
    return this.languageSubject.getValue();
  }
}
