import createNextIntlPlugin from 'next-intl/plugin';

// Dil yapılandırmasını yüklüyoruz
const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Server Actions Ayarları (Hata Çözümü Burada!)
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Dosya yükleme limiti
      // GÜVENLİK AYARI: Buraya bilgisayarının IP adreslerini ekliyoruz.
      // Next.js güvenlik gereği "localhost" dışındaki istekleri reddeder.
      // Biz "Bu IP'lere güven" diyoruz.
      allowedOrigins: [
        'localhost:3000',
        '127.0.0.1:3000',
        '192.168.1.100:3000', // Tahmini IP 1
        '192.168.1.35:3000',  // Tahmini IP 2
        '172.20.10.2:3000',   // Telefonun Hotspot IP'si genelde bu olur
        '172.20.10.12:3000',  // Senin loglarda gördüğümüz IP buydu!
        '192.168.0.20:3000'   // Diğer ihtimaller
      ],
    },
  },
  
  // 2. Resim Ayarları
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Her yerden gelen resme izin ver
      },
    ],
  },
};

// Hem dil desteğini hem de bizim ayarları dışarı aktarıyoruz
export default withNextIntl(nextConfig);