import DashboardView from './DashboardView';
import { WORKER_USER } from '@/lib/worker-mock';

export default function DashboardPage() {
  return <DashboardView userName={WORKER_USER.name} serverNow={new Date().toISOString()} />;
}
