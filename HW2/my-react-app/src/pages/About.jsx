import React from "react";
import { Link } from "react-router-dom";
import teamMembers from "../data/teamMembers";

const About = () => {
  return (
    <div className="min-h-screen pt-20 px-4 md:px-8 max-w-7xl mx-auto">
      <h1 className="text-4xl md:text-6xl font-bold text-center mb-8">
        About SoundScribe
      </h1>
      <div className="max-w-2xl mx-auto text-lg">
        <p className="mb-6">
          SoundScribe is your go-to solution for converting audio to text. Our
          platform uses state-of-the-art technology to provide accurate
          transcriptions quickly and efficiently.
        </p>
      </div>

      <h2 className="text-3xl font-bold text-center mb-6">Meet Our Team</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="section-card text-center hover:shadow-lg transition-shadow"
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-24 h-24 mx-auto rounded-full mb-4"
            />
            <h3 className="text-xl font-bold">
              <Link
                to={`/crew/${index}`}
                className="text-blue-500 hover:underline"
              >
                {member.name}
              </Link>
            </h3>
            <p className="text-gray-500">{member.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
