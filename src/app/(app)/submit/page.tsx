import SubmitView from './SubmitView';

export default function SubmitPage() {
  return <SubmitView serverNow={new Date().toISOString()} />;
}
