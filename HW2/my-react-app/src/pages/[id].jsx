import React from "react";
import { useParams } from "react-router-dom";
import teamMembers from "../data/teamMembers";

const CrewDetails = () => {
  const { id } = useParams();
  const member = teamMembers[id];

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold text-gray-500">Member not found.</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4 md:px-8 max-w-4xl mx-auto">
      <div className="section-card text-center">
        <img
          src={member.image}
          alt={member.name}
          className="w-40 h-40 mx-auto rounded-full mb-4"
        />
        <h1 className="text-3xl font-bold">{member.name}</h1>
        <p className="text-lg text-gray-500">{member.role}</p>
        <p className="mt-4">{member.bio}</p>
        <p className="mt-2 text-blue-500">
          <a href={`mailto:${member.contact}`}>{member.contact}</a>
        </p>
      </div>
    </div>
  );
};

export default CrewDetails;
