import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';
import { TranslateDirective } from './directives/translate.directive';
import { LanguageService } from './services/language.service';
import { translations } from './models/translations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, LanguageSwitcherComponent, TranslateDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'signit';
  translations = translations;

  constructor(public languageService: LanguageService) {}

  ngOnInit(): void {
    // The language service automatically initializes from localStorage
  }
}
