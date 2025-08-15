"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "../../../components/Navbar";
import {
  getSkillById,
  requestSkill,
  isAuthenticated,
} from "../../../utils/api";

export default function SkillDetail() {
  const params = useParams();
  const { id } = params;
  const [skill, setSkill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestMessage, setRequestMessage] = useState("");
  const [requestLoading, setRequestLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchSkill();
    }
  }, [id]);

  const fetchSkill = async () => {
    try {
      const data = await getSkillById(id);
      setSkill(data);
    } catch (error) {
      console.error("Error fetching skill:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (e) => {
    e.preventDefault();
    setRequestLoading(true);

    try {
      await requestSkill(id, requestMessage);
      alert("Request sent successfully!");
      setRequestMessage("");
      fetchSkill();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send request");
    } finally {
      setRequestLoading(false);
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

  if (!skill) {
    return (
      <div>
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Skill not found</div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold mb-4">{skill.title}</h1>

            <div className="flex space-x-4 mb-6">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded">
                {skill.category}
              </span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded">
                {skill.level}
              </span>
            </div>

            <p className="text-gray-700 mb-6">{skill.description}</p>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-2">Instructor</h3>
              <p className="text-gray-600">
                {skill.author?.name} ({skill.author?.email})
              </p>
            </div>

            {isAuthenticated() && (
              <div className="mt-8 border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Request to Learn</h3>
                <form onSubmit={handleRequest}>
                  <textarea
                    placeholder="Write a message to the instructor..."
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    className="w-full p-3 border rounded-md mb-4"
                    rows="3"
                    required
                  />
                  <button
                    type="submit"
                    disabled={requestLoading}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {requestLoading ? "Sending..." : "Send Request"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
