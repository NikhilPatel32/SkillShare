"use client";

import Link from 'next/link';

export default function SkillCard({ skill }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold mb-2">{skill.title}</h3>
      <p className="text-gray-600 mb-4">{skill.description.substring(0, 100)}...</p>
      
      <div className="flex justify-between items-center mb-4">
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
          {skill.category}
        </span>
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
          {skill.level}
        </span>
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">by {skill.author?.name}</span>
        <Link 
          href={`/skills/${skill._id}`}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
