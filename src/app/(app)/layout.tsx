import TopBar from '@/components/worker/TopBar';
import WorkerSidebar from '@/components/worker/Sidebar';
import { WORKER_USER } from '@/lib/worker-mock';
import { C } from '@/lib/design';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: C.bg }}>
      <TopBar initials={WORKER_USER.initials} />
      <div className="flex flex-1">
        <WorkerSidebar />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
