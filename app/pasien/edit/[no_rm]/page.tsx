import ClientPage from "./ClientPage";

interface PageProps {
  params: {
    no_rm: string;
  };
}

export default function Page({ params }: PageProps) {
  return <ClientPage no_rm={params.no_rm} />;
}
