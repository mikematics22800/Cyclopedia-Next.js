import "./globals.css";
import ServiceWorkerRegister from "./components/ServiceWorkerRegister";
import InstallPrompt from "./components/InstallPrompt";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#1e3a8a" />
        <link rel="manifest" href="/manifest.json" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('screen' in window && 'orientation' in screen && screen.orientation && 'lock' in screen.orientation) {
                try {
                  screen.orientation.lock('current');
                } catch (e) {
                  console.log('Orientation lock not supported or failed');
                }
              }
            `,
          }}
        />
      </head>
      <body>
        <ServiceWorkerRegister />
        <InstallPrompt />
        {children}
      </body>
    </html>
  );
}
