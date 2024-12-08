import { BlocksRenderer } from "@strapi/blocks-react-renderer";

async function getContent() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/about`, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch data: ${res.statusText}`);
  }

  const data = await res.json();
  return data?.data?.textfield || [];
}


export default async function Page() {
  const content = await getContent();

  return (
    <div className="prose max-w-none">
      <BlocksRenderer content={content} />
    </div>
  );
}
