import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import qs from "qs";
import Slider from "@/components/Slider";
import Spoiler from "@/components/Spoiler";
import Testimonial from "@/components/Testimonial";
import { notFound } from 'next/navigation'; // Brug Next.js' indbyggede 404-funktion

export const revalidate = 60; // Gør, at data revalidates hvert 60. sekund

async function fetchTeamMember(slug) {
  const query = qs.stringify(
    {
      filters: {
        slug: slug,
      },
      populate: {
        photo: true, 
        bodyContent: {
          on: {
            "features.rich-text": true,
            "features.spoiler": true,
            "features.testimonial": {
              populate: {
                smallimage: true, 
              },
            },
            "features.slider": {
              populate: {
                slide_image: true, 
              },
            },
          },
        },
      }
    },
    { encodeValuesOnly: true }
  );

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/team-members?${query}`, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
    },
    next: { revalidate: 60 } // Dette aktiverer ISR for API-kaldet
  });

  const member = await response.json();

  if (!member || !member.data || member.data.length === 0) {
    console.error("No data returned from API for slug:", slug);
    return null;
  }

  return member.data[0];
}

function OurRenderer({ item, index }) {
  if (item.__component === "features.testimonial") {
    return <Testimonial key={index} data={item} />;
  }
  if (item.__component === "features.spoiler") {
    return <Spoiler key={index} data={item} />;
  }
  if (item.__component === "features.rich-text") {
    return <BlocksRenderer key={index} data={item} content={item.content} />;
  }
  if (item.__component === "features.slider") {
    return <Slider key={index} data={item} />;
  }
  return null;
}

export default async function Page({ params }) {
  const member = await fetchTeamMember(params.slug);

  if (!member) {
    notFound(); // Viser 404, hvis teammedlem ikke findes
  }

  return (
    <div>
      <h2>{member.Name}</h2>
      <p>{member.description}</p>
      <div className="prose max-w-none">
        {member.bodyContent.map((item, index) => {
          const uniqueKey = `${item.__component}-${item.id || index}`;
          return <OurRenderer key={uniqueKey} item={item} index={index} />;
        })}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/team-members`, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
    },
  });

  const data = await response.json();

  if (!data || !data.data) {
    return [];
  }

  return data.data.map((member) => ({
    slug: member.attributes.slug, // Brug sluggen til at generere dynamiske ruter
  }));
}
