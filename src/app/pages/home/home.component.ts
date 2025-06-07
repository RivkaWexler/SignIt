import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateDirective } from '../../directives/translate.directive';
import { TranslationService } from '../../services/translation.service';
import { LanguageService } from '../../services/language.service';
import { translations } from '../../models/translations';
import { LanguageSwitcherComponent } from '../../components/language-switcher/language-switcher.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TranslateDirective, LanguageSwitcherComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  // Add translations object
  translations = translations;

  constructor(
    private router: Router,
    private translationService: TranslationService,
    public languageService: LanguageService
  ) {}

  navigateToSignFolder(): void {
    this.router.navigate(['/sign-folder']);
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }
}
