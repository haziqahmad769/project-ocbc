import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { FaArrowLeft } from "react-icons/fa6";

const EditProfileModal = ({ authUser }) => {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    bio: "",
    link: "",
    phoneNumber: "",
    businessType: "",
    businessLocation: "",
    newPassword: "",
    currentPassword: "",
  });

  const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation({
    mutationFn: async (formData) => {
      try {
        const token = localStorage.getItem("jwt"); // Retrieve the token from local storage
        if (!token) {
          throw new Error("You are not logged in");
        }

        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/update`, {
          method: "PUT",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
          body: formData,
        });
        const data = formData;

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
      } catch (error) {
        throw new Error(error);
      }
    },

    onSuccess: () => {
      toast.success("Profile updated successfully");
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
        queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
      ]);
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (authUser) {
      setFormData({
        fullName: authUser?.fullName || "",
        username: authUser?.username || "",
        email: authUser?.email || "",
        bio: authUser?.bio || "",
        link: authUser?.link || "",
        phoneNumber: authUser?.phoneNumber || "",
        businessType: authUser?.businessType || "",
        businessLocation: authUser?.businessLocation || "",
        newPassword: "",
        currentPassword: "",
      });
    }
  }, [authUser]);

  return (
    <>
      <button
        className="btn btn-outline rounded-full btn-sm"
        onClick={() =>
          document.getElementById("edit_profile_modal").showModal()
        }
      >
        Edit profile
      </button>
      <dialog id="edit_profile_modal" className="modal">
        <div className="modal-box border rounded-md border-gray-700 shadow-md">
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();

              const updatedFormData = new FormData();
              updatedFormData.append("fullName", formData.fullName);
              updatedFormData.append("username", formData.username);
              updatedFormData.append("email", formData.email);
              updatedFormData.append("bio", formData.bio);
              updatedFormData.append("link", formData.link);
              updatedFormData.append("phoneNumber", formData.phoneNumber);
              updatedFormData.append("businessType", formData.businessType);
              updatedFormData.append(
                "businessLocation",
                formData.businessLocation
              );
              updatedFormData.append("newPassword", formData.newPassword);
              updatedFormData.append(
                "currentPassword",
                formData.currentPassword
              );
              updateProfile(updatedFormData);
            }}
          >
            {page === 1 && (
              <>
                <div className="flex flex-wrap gap-2">
                  <input
                    type="text"
                    placeholder="Name"
                    className="flex-1 input border border-gray-700 rounded p-2 input-md"
                    value={formData.fullName}
                    name="fullName"
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    placeholder="Username"
                    className="flex-1 input border border-gray-700 rounded p-2 input-md"
                    value={formData.username}
                    name="username"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <input
                    type="email"
                    placeholder="Email"
                    className="flex-1 input border border-gray-700 rounded p-2 input-md"
                    value={formData.email}
                    name="email"
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    className="flex-1 input border border-gray-700 rounded p-2 input-md"
                    placeholder="Phone Number"
                    name="phoneNumber"
                    onChange={handleInputChange}
                    value={formData.phoneNumber}
                  />
                </div>

                {/* Business type & business location */}
                <div className="flex flex-wrap gap-2">
                  <label className="flex flex-1 input border border-gray-700 rounded p-2 input-md">
                    <select
                      className="grow bg-base-100 outline-none"
                      name="businessType"
                      onChange={handleInputChange}
                      value={formData.businessType}
                    >
                      <option value="" disabled selected>
                        Business Type
                      </option>
                      <option value="Food & Beverages">Food & Beverages</option>
                      <option value="Event Space">Event Space</option>
                      <option value="Event Management/ Planning">
                        Event Management/ Planning
                      </option>
                      <option value="Photographer/ Videographer">
                        Photographer/ Videographer
                      </option>
                      <option value="Fashion & Apparel">
                        Fashion & Apparel
                      </option>
                      <option value="Fashion Accessories">
                        Fashion Accessories
                      </option>
                      <option value="Education & Training">
                        Education & Training
                      </option>
                      <option value="Digital Marketing">
                        Digital Marketing
                      </option>
                      <option value="Graphic Design Services">
                        Graphic Design Services
                      </option>
                      <option value="Printing Services">
                        Printing Services
                      </option>
                      <option value="Art & Craft">Art & Craft</option>
                      <option value="Health & Wellness">
                        Health & Wellness
                      </option>
                      <option value="Beauty & Skincare">
                        Beauty & Skincare
                      </option>
                      <option value="Technology & Innovation">
                        Technology & Innovation
                      </option>
                      <option value="Agriculture">Agriculture</option>
                      <option value="Repairs & Services">
                        Repairs & Services
                      </option>
                      <option value="Construction & Renovation">
                        Construction & Renovation
                      </option>
                      <option value="Automotive Services">
                        Automotive Services
                      </option>
                      <option value="Transportation & Logistics">
                        Transportation & Logistics
                      </option>
                    </select>
                  </label>
                  <label className="flex flex-1 input border border-gray-700 rounded p-2 input-md">
                    <select
                      className="grow bg-base-100 outline-none"
                      name="businessLocation"
                      onChange={handleInputChange}
                      value={formData.businessLocation}
                    >
                      <option value="" disabled selected>
                        Business Location
                      </option>
                      <option value="Perlis">Perlis</option>
                      <option value="Kedah">Kedah</option>
                      <option value="P. Pinang">P. Pinang</option>
                      <option value="Perak">Perak</option>
                      <option value="Selangor">Selangor</option>
                      <option value="W.P. Kuala Lumpur">
                        W.P. Kuala Lumpur
                      </option>
                      <option value="W.P. Putrajaya">W.P. Putrajaya</option>
                      <option value="Kelantan">Kelantan</option>
                      <option value="Terengganu">Terengganu</option>
                      <option value="Pahang">Pahang</option>
                      <option value="N. Sembilan">N. Sembilan</option>
                      <option value="Melaka">Melaka</option>
                      <option value="Johor">Johor</option>
                      <option value="Sabah">Sabah</option>
                      <option value="W.P. Labuan">W.P. Labuan</option>
                      <option value="Sarawak">Sarawak</option>
                    </select>
                  </label>
                </div>

                <button
                  type="button"
                  className="btn btn-primary rounded-full btn-sm text-white"
                  onClick={() => setPage(2)}
                >
                  Next
                </button>
              </>
            )}

            {page === 2 && (
              <>
                <button
                  type="button"
                  className="btn btn-circle btn-ghost"
                  onClick={() => setPage(1)}
                >
                  <FaArrowLeft className="h-6 w-6" />
                </button>
                <div className="flex flex-wrap gap-2">
                  <input
                    type="password"
                    placeholder="Current Password"
                    className="flex-1 input border border-gray-700 rounded p-2 input-md"
                    value={formData.currentPassword}
                    name="currentPassword"
                    onChange={handleInputChange}
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    className="flex-1 input border border-gray-700 rounded p-2 input-md"
                    value={formData.newPassword}
                    name="newPassword"
                    onChange={handleInputChange}
                  />
                </div>

                <textarea
                  placeholder="Bio"
                  className="textarea flex-1 input border border-gray-700 rounded p-2 input-md"
                  value={formData.bio}
                  name="bio"
                  onChange={handleInputChange}
                />

                <input
                  type="text"
                  placeholder="Link"
                  className="flex-1 input border border-gray-700 rounded p-2 input-md"
                  value={formData.link}
                  name="link"
                  onChange={handleInputChange}
                />
                <button className="btn btn-primary rounded-full btn-sm text-white">
                  {isUpdatingProfile ? "Updating..." : "Update"}
                </button>
              </>
            )}
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button className="outline-none">close</button>
        </form>
      </dialog>
    </>
  );
};
export default EditProfileModal;
