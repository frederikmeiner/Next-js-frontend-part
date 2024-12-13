import Link from "next/link";

export const dynamic = 'force-dynamic';

async function getAllTeamMembers() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/team-members?populate=*`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching team members:', error);
    return []; // Returner en tom liste for at undgå, at siden crasher
  }
}

export default async function Page() {
  const members = await getAllTeamMembers();

  if (!members || members.length === 0) {
    return (
      <div className="p-4">
        <h1 className="font-bold mb-6 text-gray-700">Mød Teamet.</h1>
        <p>Der er ingen medlemmer at vise lige nu. Prøv igen senere.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="font-bold mb-6 text-gray-700">Mød Teamet.</h1>
      <div className="grid grid-cols-3 gap-6">
        {members.map((member) => {
          const photo = member?.photo?.formats?.medium?.url || '/placeholder.jpg';
          return (
            <Link
              className="group bg-white shadow rounded-lg overflow-hidden"
              key={member.id}
              href={`/our-team/${member.slug}`}
            >
              <div className="overflow-hidden">
                <img
                  src={photo}
                  alt={member?.Name || 'Team member'}
                  className="transition-transform duration-300 ease-in-out transform group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl text-gray-500 font-bold group-hover:text-gray-700">
                  {member?.Name || 'Ukendt navn'}
                </h2>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
