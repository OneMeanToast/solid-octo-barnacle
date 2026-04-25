import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'T-72 Tank Explorer',
  description:
    'An interactive 3D exploration of the T-72 main battle tank. Inspired by the Artemis II Mission Explorer, built with React Three Fiber.',
  applicationName: 'T-72 Tank Explorer',
  keywords: ['T-72', '3D', 'react-three-fiber', 'museum', 'explorer'],
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
