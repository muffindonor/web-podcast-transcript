import { useParams } from 'react-router-dom';

const CrewMember = () => {
  const { id } = useParams(); // Get the dynamic ID from the URL

  // Dummy data for the crew members (replace with real data or fetch from an API)
  const crewData = {
    1: { name: 'John Doe', role: 'PPC Team Lead', email: 'john@example.com', phone: '123-456-7890' },
    2: { name: 'Jane Smith', role: 'SEO Consultant', email: 'jane@example.com', phone: '987-654-3210' },
    3: { name: 'Sam Martin', role: 'Founder & MD', email: 'sam@example.com', phone: '555-123-4567' },
    4: { name: 'Alice Brown', role: 'Senior Web Developer', email: 'alice@example.com', phone: '444-567-8901' },
    5: { name: 'Bob Johnson', role: 'Digital PR Executive', email: 'bob@example.com', phone: '333-789-0123' },
  };

  const crewMember = crewData[id]; // Fetch crew member details by ID

  if (!crewMember) {
    return <div className="text-center mt-20">Crew Member Not Found</div>;
  }

  return (
    <div className="min-h-screen pt-20 px-4 md:px-8 max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-6xl font-bold text-center mb-8">{crewMember.name}</h1>
      <div className="bg-white p-6 shadow-md rounded-lg text-lg">
        <p><strong>Role:</strong> {crewMember.role}</p>
        <p><strong>Email:</strong> <a href={`mailto:${crewMember.email}`}>{crewMember.email}</a></p>
        <p><strong>Phone:</strong> {crewMember.phone}</p>
      </div>
    </div>
  );
};

export default CrewMember;
