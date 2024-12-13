import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import qs from "qs";
import Slider from "@/components/Slider";
import Spoiler from "@/components/Spoiler";
import Testimonial from "@/components/Testimonial";

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
    next: { revalidate: 60 } // Cacher i 60 sekunder, herefter opdateres data
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

export const dynamic = 'force-dynamic'; // Gør at siden hentes dynamisk

export default async function Page({ params }) {
  const member = await fetchTeamMember(params.slug);

  if (!member) {
    notFound(); // Next.js indbygget metode til 404
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