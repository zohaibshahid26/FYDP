"use client";

import { useContext } from "react";
import { AuthContext } from "@/app/context/AuthContext";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function ProfilePage() {
  const { user } = useContext(AuthContext);

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header section with gradient background */}
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

          {/* Profile Information Section */}
          <div className="p-6">
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
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
