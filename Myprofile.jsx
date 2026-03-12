// eslint-disable-next-line no-unused-vars
import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";

export default function MyProfile() {
  const { token, userData, backendURL, loadUserData } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    gender: "Not Specified",
    dob: "",
    address: { line1: "", line2: "" },
  });

  // ✅ Load real user data from context into form
  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        phone: userData.phone || "",
        gender: userData.gender || "Not Specified",
        dob: userData.dob || "",
        address: {
          line1: userData.address?.line1 || "",
          line2: userData.address?.line2 || "",
        },
      });
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }));
  };

  // ✅ Real API call to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("phone", formData.phone);
      form.append("gender", formData.gender);
      form.append("dob", formData.dob);
      form.append("address", JSON.stringify(formData.address));
      if (image) form.append("image", image);

      const { data } = await axios.post(`${backendURL}/api/user/update`, form, {
        headers: { token },
      });

      if (data.success) {
        toast.success(data.message);
        await loadUserData(token); 
        setIsEdit(false);
        setImage(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!userData)
    return <div className="text-center mt-20">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
        {/* ── Header ── */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
          {!isEdit && (
            <button
              onClick={() => setIsEdit(true)}
              className="bg-indigo-600 hover:bg-indigo-800 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* ── Profile Image ── */}
        <div className="flex flex-col items-center mb-6">
          <img
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
            src={
              image
                ? URL.createObjectURL(image)
                : userData.image || assets.profile_pic
            }
            alt="Profile"
          />
          {isEdit && (
            <label className="mt-3 cursor-pointer text-indigo-600 text-sm hover:underline">
              Change Photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>
          )}
        </div>

        {/* ── View Mode ── */}
        {!isEdit ? (
          <div className="space-y-3 text-gray-700">
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <p>
                <span className="font-semibold text-gray-500 text-sm">
                  Name:
                </span>{" "}
                <span className="font-medium">{userData.name}</span>
              </p>
              <p>
                <span className="font-semibold text-gray-500 text-sm">
                  Email:
                </span>{" "}
                <span className="font-medium">{userData.email}</span>
              </p>
              <p>
                <span className="font-semibold text-gray-500 text-sm">
                  Phone:
                </span>{" "}
                <span className="font-medium">{userData.phone}</span>
              </p>
              <p>
                <span className="font-semibold text-gray-500 text-sm">
                  Gender:
                </span>{" "}
                <span className="font-medium">{userData.gender}</span>
              </p>
              <p>
                <span className="font-semibold text-gray-500 text-sm">
                  Date of Birth:
                </span>{" "}
                <span className="font-medium">{userData.dob}</span>
              </p>
              <p>
                <span className="font-semibold text-gray-500 text-sm">
                  Address:
                </span>{" "}
                <span className="font-medium">
                  {userData.address?.line1}
                  {userData.address?.line2 ? `, ${userData.address.line2}` : ""}
                </span>
              </p>
            </div>
          </div>
        ) : (
          /* ── Edit Mode ── */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="Not Specified">Not Specified</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address Line 1
              </label>
              <input
                name="line1"
                value={formData.address.line1}
                onChange={handleAddressChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address Line 2
              </label>
              <input
                name="line2"
                value={formData.address.line2}
                onChange={handleAddressChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-indigo-600 hover:bg-indigo-800 text-white py-2 rounded-lg disabled:opacity-60 transition-colors"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEdit(false);
                  setImage(null);
                }}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
