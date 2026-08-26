// ============================================
// Authenticated App Shell Layout — Mindfit
// ============================================
import type { ReactNode } from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { BottomNav } from '@/components/layout/BottomNav';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard requireAuth requireOnboarding>
      <div className="min-h-screen flex bg-[#f5faf7] text-[#12352f]">
        {/* Desktop & Drawer Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
          <Navbar />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
            {children}
          </main>
        </div>

        {/* Mobile Bottom Navigation */}
        <BottomNav />
      </div>
    </AuthGuard>
  );
}
