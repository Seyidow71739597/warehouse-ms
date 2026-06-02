import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async (params: any) => {
  // Hem eski hem yeni versiyon ihtimalini deniyoruz
  let locale = params?.locale || 'tk';

  // Güvenlik çemberi (Bazen nesne olarak gelebiliyor)
  if (typeof locale === 'object') {
     locale = 'tk'; 
  }

  return {
    locale: locale, // <--- TYPESCRIPT'İN İSTEDİĞİ VE KIRMIZI ÇİZGİYİ YOK EDEN KOD BU
    messages: (await import(`../messages/${locale}.json`)).default
  };
});