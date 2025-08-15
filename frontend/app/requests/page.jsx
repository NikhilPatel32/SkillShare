"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import {
  getMyRequests,
  updateRequestStatus,
  createConnection,
  isAuthenticated,
} from "../../utils/api";

export default function RequestsPage() {
  const router = useRouter();
  const [allRequests, setAllRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [connectionData, setConnectionData] = useState({
    skillOffered: "",
    skillReceived: "",
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    fetchAllRequests();
  }, []);

  const fetchAllRequests = async () => {
    try {
      const requests = await getMyRequests();
      setAllRequests(requests);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestUpdate = async (requestId, status) => {
    try {
      await updateRequestStatus(requestId, status);
      alert(`Request ${status} successfully!`);
      fetchAllRequests();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update request");
    }
  };

  const handleConnect = (request) => {
    setSelectedRequest(request);
    setConnectionData({
      skillOffered: request.skillTitle,
      skillReceived: request.offeredSkill?.title || "",
    });
    setShowConnectionModal(true);
  };

  const handleCreateConnection = async () => {
    try {
      await createConnection(
        selectedRequest._id,
        connectionData.skillOffered,
        connectionData.skillReceived,
      );
      alert(
        "Connection created successfully! You can now start skill sharing.",
      );
      setShowConnectionModal(false);
      fetchAllRequests();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create connection");
    }
  };

  const filteredRequests = allRequests.filter((request) => {
    if (filter === "all") return true;
    return request.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "connected":
        return "bg-blue-100 text-blue-800";
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
        <div className="left-2 right-5 w-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Incoming Requests
          </h1>

          <div className="mb-6">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-screen justify-around">
              {[
                { key: "all", label: "All" },
                { key: "pending", label: "Pending" },
                { key: "accepted", label: "Accepted" },
                { key: "connected", label: "Connected" },
                { key: "rejected", label: "Rejected" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`px-4 py-2 rounded-md transition-all ${
                    filter === tab.key
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  {tab.label} (
                  {
                    allRequests.filter(
                      (r) => tab.key === "all" || r.status === tab.key,
                    ).length
                  }
                  )
                </button>
              ))}
            </div>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No requests found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request, index) => (
                <div
                  key={index}
                  className="bg-white border rounded-lg p-6 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {request.skillTitle}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {request.skillCategory}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}
                    >
                      {request.status.charAt(0).toUpperCase() +
                        request.status.slice(1)}
                    </span>
                  </div>

                  <div className="mb-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        request.type === "exchange"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {request.type === "exchange"
                        ? " Skill Exchange"
                        : "Learn Request"}
                    </span>
                  </div>

                  <div className="mb-3">
                    <p className="font-medium">{request.user?.name}</p>
                    <p className="text-sm text-gray-600">
                      {request.user?.email}
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-700">
                      <strong>Message:</strong> {request.message}
                    </p>
                  </div>

                  {request.type === "exchange" && request.offeredSkill && (
                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                      <h4 className="font-semibold text-blue-800 mb-2">
                        Skill Offered in Return:
                      </h4>
                      <div className="text-sm">
                        <p>
                          <strong>{request.offeredSkill.title}</strong>
                        </p>
                        <p className="text-gray-600">
                          {request.offeredSkill.description}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <span className="bg-white px-2 py-1 rounded text-xs">
                            {request.offeredSkill.category}
                          </span>
                          <span className="bg-white px-2 py-1 rounded text-xs">
                            {request.offeredSkill.level}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t">
                    <p className="text-sm text-gray-500">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>

                    {request.status === "pending" && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            handleRequestUpdate(request._id, "accepted")
                          }
                          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() =>
                            handleRequestUpdate(request._id, "rejected")
                          }
                          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {request.status === "accepted" && (
                      <button
                        onClick={() => handleConnect(request)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                      >
                        Connect & Start Sharing
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showConnectionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
              <h2 className="text-xl font-bold mb-4">Create Connection</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skill You'll Teach:
                  </label>
                  <input
                    type="text"
                    value={connectionData.skillOffered}
                    onChange={(e) =>
                      setConnectionData({
                        ...connectionData,
                        skillOffered: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skill You'll Learn:
                  </label>
                  <input
                    type="text"
                    value={connectionData.skillReceived}
                    onChange={(e) =>
                      setConnectionData({
                        ...connectionData,
                        skillReceived: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleCreateConnection}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Create Connection
                </button>
                <button
                  onClick={() => setShowConnectionModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
