import { ReactNode } from 'react';
import { Providers } from "./providers";

export const metadata = {
  title: 'Lumino Dashboard',
  description: 'A dashboard for managing fine-tuning jobs and datasets',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
