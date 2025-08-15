"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import {
  getMyConnections,
  updateConnectionStatus,
  removeConnection,
  isAuthenticated,
} from "../../utils/api";

export default function ConnectionsPage() {
  const router = useRouter();
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      const data = await getMyConnections();
      setConnections(data);
    } catch (error) {
      console.error("Error fetching connections:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (connectionId, status) => {
    try {
      await updateConnectionStatus(connectionId, status);
      alert(`Connection status updated to ${status}`);
      fetchConnections();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update status");
    }
  };

  const handleRemoveConnection = async (connectionId) => {
    if (!confirm("Are you sure you want to remove this connection?")) return;

    try {
      await removeConnection(connectionId);
      alert("Connection removed successfully");
      fetchConnections();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to remove connection");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl text-center font-bold mb-6">
            My Skill Sharing Connections
          </h1>

          {connections.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">
                No connections yet. Accept some skill exchange requests to get
                started!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {connections.map((connection) => (
                <div
                  key={connection._id}
                  className="bg-white border rounded-lg p-6 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {connection.user?.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {connection.user?.email}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(connection.status)}`}
                    >
                      {connection.status.charAt(0).toUpperCase() +
                        connection.status.slice(1)}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">
                        I'm Teaching:
                      </h4>
                      <p className="text-green-700">
                        {connection.skillOffered}
                      </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">
                        {" "}
                        I'm Learning:
                      </h4>
                      <p className="text-blue-700">
                        {connection.skillReceived}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500">
                      Connected on:{" "}
                      {new Date(connection.connectedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-4 border-t">
                    {connection.status === "active" && (
                      <>
                        <button
                          onClick={() =>
                            handleStatusUpdate(connection._id, "completed")
                          }
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                        >
                          Mark as Completed
                        </button>
                        <button
                          onClick={() =>
                            handleStatusUpdate(connection._id, "paused")
                          }
                          className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-sm"
                        >
                          Pause Exchange
                        </button>
                      </>
                    )}

                    {connection.status === "paused" && (
                      <button
                        onClick={() =>
                          handleStatusUpdate(connection._id, "active")
                        }
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                      >
                        Resume Exchange
                      </button>
                    )}

                    <button
                      onClick={() => handleRemoveConnection(connection._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                    >
                      Remove Connection
                    </button>

                    <a
                      href={`mailto:${connection.user?.email}?subject=Skill Exchange - ${connection.skillOffered} for ${connection.skillReceived}`}
                      className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
                    >
                      Contact via Email
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
