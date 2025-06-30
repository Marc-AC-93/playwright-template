import { Language } from '../../data/Languages';

type TranslationMap =
  | {
      [key in Language]: string;
    }
  | string;

type EnumTranslationMap<T extends string | number | symbol> = {
  [key in T]: TranslationMap | string;
};

/**
 * Type-safe language manager that handles translations
 */
export class LanguageManager {
  private static instance: LanguageManager;
  private currentLanguage: Language;

  private constructor(defaultLanguage: Language = Language.EN) {
    this.currentLanguage = defaultLanguage;
  }

  /**
   * Get the singleton instance of LanguageManager
   */
  public static getInstance(): LanguageManager {
    if (!LanguageManager.instance) {
      LanguageManager.instance = new LanguageManager();
    }
    return LanguageManager.instance;
  }

  /**
   * Get the current language for translations
   * @returns The current language
   */
  public getLanguage(): Language {
    return this.currentLanguage;
  }

  /**
   * Set the current language for translations
   * @param language - The language to set as current
   */
  public setLanguage(language: Language): void {
    this.currentLanguage = language;
  }

  /**
   * Get translation for the current language
   * @param translation - Translation map or direct string
   * @returns The translated string or the original string if it's a direct string
   */
  public getTranslation(translation: TranslationMap): string {
    if (typeof translation === 'string') {
      return translation;
    }
    return translation[this.currentLanguage] || Object.values(translation)[0];
  }

  /**
   * Get translation for an enum value
   * @param enumValue - The enum value to translate
   * @param translations - The translation map for the enum
   * @returns The translated string
   */
  public translateEnum<T extends string | number | symbol>(
    enumValue: T,
    translations: EnumTranslationMap<T>
  ): string {
    const translation = translations[enumValue];

    if (!translation) {
      console.warn(`No translation found for enum value: ${String(enumValue)}`);
      return String(enumValue);
    }

    // Handle both string and TranslationMap types
    return typeof translation === 'string' ? translation : this.getTranslation(translation);
  }
}
