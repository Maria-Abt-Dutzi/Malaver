import { TranslocoGlobalConfig } from '@jsverse/transloco-utils'

export enum AvaliableLanguages {
  ES = 'es',
  EN = 'en',
  DE = 'de'
}


export const AvaliablesLanguages = [
  AvaliableLanguages.ES,
  AvaliableLanguages.EN,
  AvaliableLanguages.DE
];

const config: TranslocoGlobalConfig = {
  langs: AvaliablesLanguages,
  defaultLang: AvaliableLanguages.DE,
  rootTranslationsPath: 'assets/i18n',
};

export default config;
