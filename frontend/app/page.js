"use client";

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import SkillCard from '../components/SkillCard';
import { getAllSkills, isAuthenticated } from '../utils/api';
import Link from 'next/link';

export default function Home() {
  const [skillList, setSkillList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const authenticated = isAuthenticated();
    setUser(authenticated);
    
    if (authenticated) {
      fetchSkills();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchSkills = async () => {
    try {
      const data = await getAllSkills();
      setSkillList(data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div>
        <Navbar />
        <main className="container mx-auto px-4 py-8">
       
          <div className="text-center py-16">
            <h1 className="text-5xl font-bold text-gray-800 mb-6">
              Welcome to <span className="text-blue-600">SkillShare</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Connect with people to exchange skills and learn from each other. 
              Share what you know, learn what you want.
            </p>
            
            <div className="flex gap-4 justify-center">
              <Link 
                href="/register" 
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700"
              >
                Get Started
              </Link>
              <Link 
                href="/login" 
                className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50"
              >
                Sign In
              </Link>
            </div>
          </div>

        
          <div className="py-16 bg-gray-50 -mx-4 px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Share Your Skills</h3>
                  <p className="text-gray-600">
                    Post skills you can teach others and help build a learning community.
                  </p>
                </div>
                
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Exchange Skills</h3>
                  <p className="text-gray-600">
                    Find people to exchange skills with. Teach what you know, learn what you want.
                  </p>
                </div>
                
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Connect & Learn</h3>
                  <p className="text-gray-600">
                    Build meaningful connections with other learners and grow together.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center py-16">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
            <p className="text-gray-600 mb-8">
              Join our community of skill sharers and start your learning journey today.
            </p>
            <Link 
              href="/register" 
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700"
            >
              Join SkillShare
            </Link>
          </div>
        </main>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold mb-8">Browse Skills</h1>
          
          {skillList.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No skills posted yet.</p>
              <Link 
                href="/post-skill" 
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Be the first to post a skill!
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skillList.map((skill) => (
                <SkillCard key={skill._id} skill={skill} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
