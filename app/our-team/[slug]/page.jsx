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


//  const response = await fetch(`http://localhost:1331/api/team-members?${query}`, {
//  headers: {
   // Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
//  },
//});

const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/team-members?${query}`, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
    },
  });

  const member = await response.json();

  if (!member || !member.data || member.data.length === 0) {
    console.error("No data returned from API for slug:", slug);
    console.log("smallimage:", JSON.stringify(data.smallimage, null, 2));
    return null;
  }

  return member.data[0];
}





function OurRenderer({ item, index }){
    if(item.__component === "features.testimonial"){
        return <Testimonial key={index} data={item} />
    }
    if(item.__component === "features.spoiler"){
        return <Spoiler key={index} data={item} />
    }
    if(item.__component === "features.rich-text"){
        return <BlocksRenderer key={index} data={item} content={item.content}/>
    }
    //if (item.__component === "features.slider") {
     // return <Slider key={index} data={item} />
    //}
    return null;
}



export default async function Page({ params }) {
    const member = await fetchTeamMember(params.slug);
    console.log('Fetched member:', member);
   

    if (!member) {
        return <div>No team member found.</div>;
    }
    return (
        <div>
            <h2>{member.Name}</h2>
            <p>{member.description}</p>
           <div className="prose max-w-none"> {member.bodyContent.map((item, index) => {
                // Kombinér komponentens type og dens ID som en unik nøgle
                const uniqueKey = `${item.__component}-${item.id || index}`;
                return <OurRenderer key={uniqueKey} item={item} index={index} />;
            })}
            </div>
        </div>
    );
}

