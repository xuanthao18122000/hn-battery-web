import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Ắc Quy HN Sài Gòn',
    short_name: 'Ắc Quy HN',
    description: 'Ắc Quy HN Sài Gòn - Chuyên ắc quy ô tô, xe máy chính hãng tại TP.HCM',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#142846',
    icons: [
      {
        src: '/logo-final-1.svg',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
  }
}

