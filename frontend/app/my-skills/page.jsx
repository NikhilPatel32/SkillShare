"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import { getMySkills, isAuthenticated } from '../../utils/api';

export default function MySkills() {
  const router = useRouter();
  const [mySkills, setMySkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    fetchMySkills();
  }, []);

  const fetchMySkills = async () => {
    try {
      const data = await getMySkills();
      setMySkills(data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div>
          <h1 className="text-2xl font-bold mb-6 text-center">My Skills</h1>
          
          {mySkills.length === 0 ? (
            <p className="text-gray-600 text-center">You haven't posted any skills yet.</p>
          ) : (
            <div className="space-y-6">
              {mySkills.map((skill) => (
                <div key={skill._id} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-2">{skill.title}</h3>
                  <p className="text-gray-600 mb-4">{skill.description}</p>
                  
                  <div className="flex space-x-2 mb-4">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      {skill.category}
                    </span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                      {skill.level}
                    </span>
                  </div>
                  
                  {skill.requests && skill.requests.length > 0 && (
                    <div className="mt-4 border-t pt-4">
                      <h4 className="font-semibold mb-2">
                        Requests ({skill.requests.length})
                      </h4>
                      <div className="space-y-2">
                        {skill.requests.map((request, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded">
                            <p><strong>{request.user?.name}:</strong> {request.message}</p>
                            <p className="text-sm text-gray-500">
                              Status: {request.status} | 
                              {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
