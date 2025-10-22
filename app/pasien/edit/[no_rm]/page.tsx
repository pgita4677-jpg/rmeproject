import ClientPage from "./ClientPage";

interface PageProps {
  params: { no_rm: string };
}

export default function Page({ params }: PageProps) {
  const { no_rm } = params;
  return <ClientPage no_rm={no_rm} />;
}