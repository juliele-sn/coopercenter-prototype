import TimecardDetailView from './TimecardDetailView';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function TimecardDetailPage({ params }: Props) {
  const { id } = await params;
  return <TimecardDetailView id={id} serverNow={new Date().toISOString()} />;
}
