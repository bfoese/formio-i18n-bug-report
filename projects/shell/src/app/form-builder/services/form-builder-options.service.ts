import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FormioFormBuilderOptions } from '../../types/formio/formio.types';

export type FormioFormBuilderTranslations = Pick<FormioFormBuilderOptions, 'i18n'>;

/**
 * This service provides options that should be applied to all form builder instances within the application. It caches
 * options that can be reused across form builder instances.
 */
@Injectable({
  providedIn: 'root'
})
export class FormBuilderOptionsService {
  private _cachedLanguagePack: FormioFormBuilderTranslations;

  /** Cache of URLs whose requests failed before. The cache can be used to prevent re-fetching invalid URLs consecutively. */
  private readonly _invalidUrls = [];

  public constructor(@Inject(LOCALE_ID) private _locale: string, private httpClient: HttpClient) {}

  /**
   * Get the i18n options that should be applied to all form builder instances. The form builders should use the
   * language that the user has configured.
   *
   * @returns A partial of form builder options containing the required settings for i18n.
   */
  public getI18nOptions(): Observable<Pick<FormioFormBuilderOptions, 'i18n' | 'language'>> {
    const result = {
      language: this.getLanguageCode(this._locale)
    };

    return this.getFormBuilderLanguagePack().pipe(
      map((i18nOptions) => {
        if (i18nOptions) {
          return Object.assign(result, i18nOptions);
        }
        return result;
      })
    );
  }

  /**
   * Check if an URL is valid. This relies on the cache of invalid URLs to prevent re-fetching previously failed
   * requests.
   * @param url URL to check
   * @returns The given URL will be returned unmodiefied in case it is valid, otherwise undefined will be returned.
   */
  private validateUrlOrNull(url: string | undefined): undefined | string {
    return url && this._invalidUrls.filter((invalidUrl) => invalidUrl === url).length === 0 ? url : undefined;
  }

  private getFormBuilderLanguagePack(): Observable<FormioFormBuilderTranslations> {
    if (this.containsLocale(this._cachedLanguagePack, this._locale, true)) {
      return of(this._cachedLanguagePack);
    }
    console.log('[FormBuilderOptionsService] Value of LOCALE_ID:', this._locale);

    return this.loadLanguagePack(this._locale).pipe(
      map((languagePack) => {
        const result = { i18n: {} };
        if (languagePack) {
          result.i18n = languagePack;
        }
        return (this._cachedLanguagePack = result);
      })
    );
  }

  private loadLanguagePack(
    locale: string | undefined
  ): Observable<{ [key: string]: { [key: string]: string } } | undefined> {
    if (!locale) {
      return of(undefined);
    }

    const languageCode = this.getLanguageCode(locale);

    const localeUrl = locale && languageCode !== locale ? this.getTranslationFileUrl(locale) : undefined;
    const languageCodeUrl = this.getTranslationFileUrl(languageCode);

    const url = this.validateUrlOrNull(localeUrl ?? languageCodeUrl);
    const fallbackUrl = this.validateUrlOrNull(languageCodeUrl);

    if (!url) {
      return of(undefined);
    }

    return this.httpClient.get(url).pipe(
      catchError(() => {
        this._invalidUrls.push(url);
        if (fallbackUrl) {
          return this.httpClient.get(fallbackUrl);
        }
        return of(undefined);
      }),
      catchError(() => {
        this._invalidUrls.push(fallbackUrl);
        return of(undefined);
      })
    );
  }

  /**
   * Checks if the language pack already contains the given locale (either the locale itself or )
   * @param translations Set of form builder translations
   * @param locale Locale to check if it is contained within the translations
   * @param satisfiedWithLanguageCode Whether the check result should be positive if just the language code of the
   * locale is contained in the translations.
   * @returns
   */
  private containsLocale(
    translations: FormioFormBuilderTranslations | undefined,
    locale: string | undefined,
    satisfiedWithLanguageCode: boolean
  ): boolean {
    if (locale && translations?.i18n) {
      if (translations.i18n[locale]) {
        return true;
      }
      if (satisfiedWithLanguageCode) {
        const languageCode = this.getLanguageCode(locale);
        return languageCode && !!translations.i18n[languageCode];
      }
    }
    return false;
  }

  private getTranslationFileUrl(localeOrLanguageCode: string | undefined): string | undefined {
    const baseUrl = `assets/formio/builder/i18n/`;
    return localeOrLanguageCode ? `${baseUrl}${localeOrLanguageCode}.json` : undefined;
  }

  /**
   * Extracts the language code from a given locale.
   * @param locale e.g. 'en', 'en-US', 'az-Cyrl-AZ', 'fil-PH'
   * @returns Extracted language code or undefined
   */
  private getLanguageCode(locale: string): string | undefined {
    if (locale) {
      const match = RegExp('^([a-z]{2,3})(?:-[A-Z]{2,3}(?:-[a-zA-Z]{4})?)?$').exec(locale);
      return match && match.length >= 2 ? match[1] : undefined;
    }
    return undefined;
  }
}
