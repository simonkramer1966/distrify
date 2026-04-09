import Link from 'next/link';
import { Film, LayoutDashboard, Users, FileText, Wallet, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/films', label: 'Films', icon: Film },
  { href: '/distributors', label: 'Distributors', icon: Users },
  { href: '/statements', label: 'Statements', icon: FileText },
  { href: '/collections', label: 'Collections', icon: Wallet },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="flex h-screen w-60 flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-6">
        <Link href="/" className="text-lg font-semibold">
          Distrify
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
