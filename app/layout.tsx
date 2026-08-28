import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "./components/LanguageProvider";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  applicationName: "Dev Nexus Academy",
  title: {
    default: "Dev Nexus Academy | تعلّم البرمجة والتكنولوجيا",
    template: "%s | Dev Nexus Academy",
  },
  description:
    "منصة تقنية ثنائية اللغة تجمع الكورسات والكتب العامة والمقالات وخرائط الطريق التفاعلية. A bilingual technology learning platform.",
  keywords: [
    "تعلم البرمجة",
    "كورسات برمجة",
    "كتب برمجة مجانية",
    "خرائط طريق للمطورين",
    "technology courses",
    "programming roadmaps",
  ],
  authors: [{ name: "Jamal Abu Attaya" }],
  creator: "Jamal Abu Attaya",
  publisher: "Dev Nexus Academy",
  category: "education",
  alternates: { canonical: "/" },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "Dev Nexus Academy",
    description:
      "حيث يتحول الكود إلى مستقبل — برمجة وأمن وبيانات في تجربة نابضة بالحياة",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Dev Nexus Academy — Code, Learn, Build, Evolve",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dev Nexus Academy",
    description: "Code. Learn. Build. Evolve.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <LanguageProvider>
          <a className="skip-link" href="#main-content">
            Skip to content
          </a>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
