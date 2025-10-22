import ClientPage from "./ClientPage";

interface PageProps {
  params: {
    no_rm: string;
  };
}

// ❗ WAJIB pakai async function untuk App Router dynamic route
export default async function Page({ params }: PageProps) {
  const { no_rm } = params;
  return <ClientPage no_rm={no_rm} />;
}
