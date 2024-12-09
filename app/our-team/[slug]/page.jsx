import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import qs from "qs";
import Slider from "@/components/Slider";
import Spoiler from "@/components/Spoiler";
import Testimonial from "@/components/Testimonial";

async function fetchTeamMember(slug) {
  console.log(`🔍 Starting fetch for team member with slug: "${slug}"`);

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

  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/team-members?${query}`;
  console.log(`🌐 Full API URL: ${apiUrl}`);

  let response;
  try {
    response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      },
    });
  } catch (error) {
    console.error('❌ Error during fetch request:', error);
    return null;
  }

  console.log('📡 Response status:', response.status);

  if (!response.ok) {
    const errorData = await response.json();
    console.error('❌ Failed to fetch team member. API response:', errorData);
    return null;
  }

  let member;
  try {
    member = await response.json();
  } catch (error) {
    console.error('❌ Error parsing JSON response:', error);
    return null;
  }

  console.log('📦 Raw member data received from API:', member);

  if (!member || !member.data || member.data.length === 0) {
    console.warn(`⚠️ No data returned from API for slug: "${slug}"`);
    return null;
  }

  console.log('✅ Successfully fetched member:', member.data[0]);
  return member.data[0];
}

function OurRenderer({ item, index }) {
  console.log(`🎨 Rendering component: ${item.__component} at index ${index}`);

  if (item.__component === "features.testimonial") {
    console.log('🧩 Rendering Testimonial component', item);
    return <Testimonial key={index} data={item} />;
  }
  if (item.__component === "features.spoiler") {
    console.log('🧩 Rendering Spoiler component', item);
    return <Spoiler key={index} data={item} />;
  }
  if (item.__component === "features.rich-text") {
    console.log('🧩 Rendering Rich Text component', item);
    return <BlocksRenderer key={index} data={item} content={item.content} />;
  }
  if (item.__component === "features.slider") {
    console.log('🧩 Rendering Slider component', item);
    return <Slider key={index} data={item} />;
  }

  console.warn(`⚠️ Unknown component type: "${item.__component}" at index ${index}`);
  return null;
}

export default async function Page({ params }) {
  console.log('🚀 Page is loading with params:', params);

  const member = await fetchTeamMember(params.slug);
  
  console.log('🗂️ Fetched team member data for page:', member);

  if (!member) {
    console.warn('⚠️ No team member found for page');
    return <div>No team member found.</div>;
  }

  console.log('📝 Rendering page content for member:', member.Name);

  return (
    <div>
      <h2>{member.Name}</h2>
      <p>{member.description}</p>
      <div className="prose max-w-none">
        {Array.isArray(member.bodyContent) && member.bodyContent.length > 0 ? (
          member.bodyContent.map((item, index) => {
            // Kombinér komponentens type og dens ID som en unik nøgle
            const uniqueKey = `${item.__component}-${item.id || index}`;
            console.log(`🔗 Rendering body content item with key: ${uniqueKey}`);
            return <OurRenderer key={uniqueKey} item={item} index={index} />;
          })
        ) : (
          <p>⚠️ No body content available for this team member.</p>
        )}
      </div>
    </div>
  );
}
