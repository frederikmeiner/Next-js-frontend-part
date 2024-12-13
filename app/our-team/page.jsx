
import Link from "next/link"

async function getAllTeamMembers() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/team-members?populate=*`, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data;
}


export default async function Page() {
  const members = await getAllTeamMembers();
  return (
    <div className="p-4">
      <h1 className="font-bold mb-6 text-gray-700">Mød Teamet.</h1>
      <div className="grid grid-cols-3 gap-6">
        {members.map((member) => {
          const photo = member?.photo?.formats?.medium?.url;
          return (
            <Link
              className="group bg-white shadow rounded-lg overflow-hidden"
              key={member.id}
              href={`/our-team/${member.slug}`}
            >
              <div className="overflow-hidden">
                <img
                  src={photo}
                  className="transition-transform duration-300 ease-in-out transform group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl text-gray-500 font-bold group-hover:text-gray-700">
                  {member.Name}
                </h2>
                <p>{member.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
