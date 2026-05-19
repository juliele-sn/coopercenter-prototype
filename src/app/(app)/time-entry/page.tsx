import TimeEntryView from './TimeEntryView';

export default function TimeEntryPage() {
  return <TimeEntryView serverNow={new Date().toISOString()} />;
}
