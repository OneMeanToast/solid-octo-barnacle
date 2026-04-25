import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vehicle Explorer · T-72 / Su-57',
  description:
    'An interactive 3D vehicle explorer (T-72 main battle tank, Su-57 fighter). Inspired by the Artemis II Mission Explorer, built with React Three Fiber.',
  applicationName: 'Vehicle Explorer',
  keywords: ['T-72', 'Su-57', '3D', 'react-three-fiber', 'museum', 'explorer'],
};

export const viewport: Viewport = {
  themeColor: '#07090c',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-bg text-slate-200 antialiased overflow-hidden select-none">
        {children}
      </body>
    </html>
  );
}
