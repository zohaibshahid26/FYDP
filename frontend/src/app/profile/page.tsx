"use client";

import { useContext, useState } from "react";
import { AuthContext } from "@/app/context/AuthContext";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function ProfilePage() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("profile");

  // This page is protected - only authenticated users can access it
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-16">
            <div className="flex flex-col items-center">
              <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center text-blue-600 text-4xl font-bold mb-4 shadow-lg border-4 border-white">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <h1 className="text-2xl font-bold text-white mt-2">
                {user?.name}
              </h1>
              <p className="text-blue-200">{user?.email}</p>
              <div className="mt-4 text-sm bg-blue-700 bg-opacity-50 px-3 py-1 rounded-full text-white">
                {user?.role || "Patient"}
              </div>
            </div>
          </div>

          <div className="px-6 border-b">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab("profile")}
                className={`px-4 py-3 font-medium text-sm focus:outline-none ${
                  activeTab === "profile"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`px-4 py-3 font-medium text-sm focus:outline-none ${
                  activeTab === "history"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Health History
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`px-4 py-3 font-medium text-sm focus:outline-none ${
                  activeTab === "settings"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Settings
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Personal Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <div className="bg-gray-50 p-3 rounded-md border border-gray-200 text-gray-900">
                        {user?.name}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <div className="bg-gray-50 p-3 rounded-md border border-gray-200 text-gray-900">
                        {user?.email}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        User Role
                      </label>
                      <div className="bg-gray-50 p-3 rounded-md border border-gray-200 text-gray-900">
                        {user?.role || "Patient"}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Account Created
                      </label>
                      <div className="bg-gray-50 p-3 rounded-md border border-gray-200 text-gray-900">
                        {new Date().toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "history" && (
              <div className="space-y-6">
                <div className="text-center py-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 mx-auto text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    No health records yet
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Your health records and test results will appear here once
                    you use the diagnostic services.
                  </p>
                  <div className="mt-6">
                    <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      Try Disease Detection
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Account Settings
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md border border-gray-200">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          Change Password
                        </h3>
                        <p className="text-xs text-gray-500">
                          Update your account password
                        </p>
                      </div>
                      <button className="px-3 py-1 text-xs font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50">
                        Update
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md border border-gray-200">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          Email Notifications
                        </h3>
                        <p className="text-xs text-gray-500">
                          Receive updates about your health reports
                        </p>
                      </div>
                      <div className="relative inline-block w-10 align-middle select-none">
                        <input
                          type="checkbox"
                          name="notifications"
                          id="notifications"
                          className="opacity-0 absolute h-0 w-0"
                          defaultChecked
                        />
                        <label
                          htmlFor="notifications"
                          className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                        ></label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md border border-gray-200">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          Data Privacy
                        </h3>
                        <p className="text-xs text-gray-500">
                          Manage how your data is used
                        </p>
                      </div>
                      <button className="px-3 py-1 text-xs font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50">
                        Settings
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
