import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Ắc quy Trung Nguyên',
    short_name: 'Ắc quy Trung Nguyên',
    description: 'Ắc quy Trung Nguyên - Đối tác tin cậy cho các dự án xây dựng tại TP.HCM',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#142846',
    icons: [
      {
        src: '/logo-web-1.png',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
  }
}

