import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Language, TranslationService} from '../../services/translation.service';
import {LanguageService} from '../../services/language.service';
import {translations} from '../../models/translations';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.css'
})
export class LanguageSwitcherComponent {
  translations = translations;

  constructor(public languageService: LanguageService) {
  }

  toggleLanguage(): void {
    const currentLang = this.languageService.getCurrentLanguage();
    const newLang: Language = currentLang === 'en' ? 'he' : 'en';
    this.languageService.setLanguage(newLang);
  }
}
