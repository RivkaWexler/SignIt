import { Directive, OnInit, OnDestroy, TemplateRef, ViewContainerRef, Input } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { Language } from '../../services/language.service';
import { Subscription } from 'rxjs';
import { translations } from '../../models/translations';

/**
 * A directive that provides the current language and translations to child components
 * Usage: <div *appLanguageContext="let lang; let t = translations">
 *           {{ t[lang].some_key }}
 *        </div>
 */
@Directive({
  selector: '[appLanguageContext]',
  standalone: true
})
export class LanguageContextDirective implements OnInit, OnDestroy {
  private subscription: Subscription | null = null;
  private currentLanguage: Language = 'en';

  @Input('appLanguageContext') appLanguageContext: any;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.subscription = this.languageService.selectedLanguage.subscribe(lang => {
      this.currentLanguage = lang;
      this.updateView();
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private updateView(): void {
    this.viewContainer.clear();

    this.viewContainer.createEmbeddedView(this.templateRef, {
      $implicit: this.currentLanguage,
      translations: translations
    });
  }
}
