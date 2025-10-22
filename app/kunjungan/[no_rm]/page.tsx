import KunjunganPage from "./KunjunganClient";


export default async function Page({ params }: { params: Promise<{ no_rm: string }> }) {
  const { no_rm } = await params;
  return <KunjunganPage no_rm={no_rm} />;
}