import i18n from 'i18n';
import path from 'path';
import { fileURLToPath } from 'url';


const __dirname = path.dirname(fileURLToPath(import.meta.url));
i18n.configure({
  locales: ['en', 'fr', 'ar'], 
  defaultLocale: 'en',
  queryParameter: 'lang', 
  directory: path.join(__dirname, './locales'), 
  autoReload: true,
  updateFiles: false,
  api: {
    __: 'translate', 
    __n: 'translateN'
  }
});

export default i18n;
