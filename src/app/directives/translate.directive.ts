// import { Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
// import { TranslationService } from '../services/translation.service';
// import { Subscription } from 'rxjs';
//
// @Directive({
//   selector: '[appTranslate]',
//   standalone: true
// })
// export class TranslateDirective implements OnInit, OnDestroy {
//   @Input('appTranslate') key: string = '';
//   private langSubscription: Subscription | undefined;
//
//   constructor(
//     private el: ElementRef,
//     private translationService: TranslationService
//   ) {}
import { Directive, ElementRef, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { LanguageService } from '../services/language.service';
import { translations } from '../models/translations';
import { Subscription } from 'rxjs';

/**
 * Directive to simplify the use of translations.
 * Usage: <element appTranslate="translation_key"></element>
 * The element's text content will be automatically updated when the language changes.
 */
@Directive({
  selector: '[appTranslate]',
  standalone: true
})
export class TranslateDirective implements OnInit, OnDestroy, OnChanges {
  @Input('appTranslate') key: string = '';

  // Track when the key changes for dynamic translation keys
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['key'] && !changes['key'].firstChange) {
      this.updateTranslation(this.key);
    }
  }
  private subscription: Subscription | null = null;

  constructor(
    private el: ElementRef,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    if (!this.key) {
      console.warn('Translation key not provided for appTranslate directive');
      return;
    }

    this.subscription = this.languageService.selectedLanguage.subscribe(lang => {
      this.updateTranslation(this.key, lang);
    });
      }

      // Extract translation update logic to a separate method
      private updateTranslation(key: string, lang?: string): void {
    if (!key) return;

    // If lang is not provided, get it from the service
    const currentLang = lang || this.languageService.getCurrentLanguage();
    let translatedText = translations[currentLang]?.[key];

    // If translation is not found in current language, try English as fallback
    if (!translatedText && currentLang !== 'en') {
      translatedText = translations['en']?.[key];
    }

    // If still not found, use the key itself
    if (!translatedText) {
      translatedText = key;
      // Log missing translation in development mode
      console.warn(`Translation missing for key: '${key}' in language: '${currentLang}'`);
    }

    // Check if the element has child nodes that are not text nodes
    const hasNonTextChildren = Array.from(this.el.nativeElement.childNodes).some(
      (node: any) => node.nodeType !== Node.TEXT_NODE
    );

    if (hasNonTextChildren) {
      // If the element has non-text children, find or create a text node for translation
      let textNode = Array.from(this.el.nativeElement.childNodes).find(
        (node: any) => node.nodeType === Node.TEXT_NODE
      ) as Text | undefined;

      if (!textNode) {
        textNode = document.createTextNode('');
        this.el.nativeElement.insertBefore(textNode, this.el.nativeElement.firstChild);
      }

      textNode.textContent = translatedText;
    } else {
      // If there are no non-text children, we can safely set the textContent
      this.el.nativeElement.textContent = translatedText;
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
//   ngOnInit(): void {
//     // Set initial translation
//     this.updateTranslation();
//
//     // Subscribe to language changes
//     this.langSubscription = this.translationService.currentLang$.subscribe(() => {
//       this.updateTranslation();
//     });
//   }
//
//   ngOnDestroy(): void {
//     if (this.langSubscription) {
//       this.langSubscription.unsubscribe();
//     }
//   }
//
//   private updateTranslation(): void {
//     if (this.key) {
//       this.el.nativeElement.textContent = this.translationService.translate(this.key);
//     }
//   }
// }
