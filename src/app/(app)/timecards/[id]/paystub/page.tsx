import PaystubDetailView from './PaystubDetailView';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PayStubDetailPage({ params }: Props) {
  const { id } = await params;
  return <PaystubDetailView id={id} />;
}
