import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { requireAdmin } from '@/actions/auth.actions';
import { AdminToaster } from '@/components/admin/AdminForm';
import { AdminHeader } from '@/components/admin-shell/AdminHeader';
import { AdminSidebar } from '@/components/admin-shell/AdminSidebar';
import { SidebarInset, SidebarProvider } from '@/components/admin-ui/sidebar';
import { TooltipProvider } from '@/components/admin-ui/tooltip';
import './globals.css';
import './admin-ui.css';
import './legacy.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: { default: 'Admin | JustAclick', template: '%s | JustAclick Admin' },
  robots: { index: false, follow: false }
};

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  const sidebarOpen = (await cookies()).get('sidebar_state')?.value !== 'false';

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/assets/images/Logo/favicon/favicon.ico" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <TooltipProvider>
            <SidebarProvider defaultOpen={sidebarOpen}>
              <AdminSidebar />
              <SidebarInset className="min-w-0">
                <AdminHeader user={{ name: user.name, email: user.email }} />
                <main className="admin-shell admin-main mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 sm:px-6">{children}</main>
                <footer className="text-muted-foreground mx-auto w-full max-w-[1440px] border-t px-4 py-4 text-sm sm:px-6">
                  © {new Date().getFullYear()} JustAclick Commerce CRM
                </footer>
              </SidebarInset>
            </SidebarProvider>
            <AdminToaster />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
