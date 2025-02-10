import { Link } from "react-router-dom";
import { useState } from "react";

import TubeLogo from "../../../components/svgs/TubeLogo";

import { MdOutlineMail } from "react-icons/md";
import { FaUserLarge } from "react-icons/fa6";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { MdOutlinePhoneAndroid } from "react-icons/md";
import { MdBusinessCenter } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { FaArrowLeft } from "react-icons/fa6";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [page, setPage] = useState(1);

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
  });

  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: async ({
      email,
      username,
      fullName,
      password,
      phoneNumber,
      businessType,
      businessLocation,
    }) => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            username,
            fullName,
            password,
            phoneNumber,
            businessType,
            businessLocation,
          }),
        });

        const data = await res.json();
        if (!res.ok)
          throw new Error(data.message || "Failed to create account");
        // console.log(data);
      } catch (error) {
        console.log(error);
        // toast.error(error.message);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Account created successfully");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(formData);
    mutate(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const isError = false;

  return (
    <div className="max-w-screen-xl mx-auto flex lg:h-screen px-10">
      <div className="flex-1 hidden lg:flex items-center  justify-center">
        <TubeLogo className=" lg:w-2/3 overflow-visible fill-white" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form
          className="lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col"
          onSubmit={handleSubmit}
        >
          <TubeLogo className="w-48 lg:hidden fill-white" />
          <h1 className="text-4xl font-extrabold text-white">
            Hi, Tubepreneurs!
          </h1>

          {page === 1 && (
            <>
              <label className="input input-bordered rounded flex items-center gap-2">
                <MdOutlineMail />
                <input
                  type="email"
                  className="grow"
                  placeholder="Email"
                  name="email"
                  onChange={handleInputChange}
                  value={formData.email}
                />
              </label>
              <div className="flex gap-4 flex-wrap">
                <label className="input input-bordered rounded flex items-center gap-2 flex-1">
                  <FaUserLarge />
                  <input
                    type="text"
                    className="grow"
                    placeholder="Username"
                    name="username"
                    onChange={handleInputChange}
                    value={formData.username}
                  />
                </label>
                <label className="input input-bordered rounded flex items-center gap-2 flex-1">
                  <MdDriveFileRenameOutline />
                  <input
                    type="text"
                    className="grow"
                    placeholder="Name"
                    name="fullName"
                    onChange={handleInputChange}
                    value={formData.fullName}
                  />
                </label>
              </div>
              <label className="input input-bordered rounded flex items-center gap-2">
                <MdPassword />
                <input
                  type="password"
                  className="grow"
                  placeholder="Password"
                  name="password"
                  onChange={handleInputChange}
                  value={formData.password}
                />
              </label>
              {/* Next Button */}
              <button
                type="button"
                className="btn btn-primary text-white rounded-full"
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

              <label className="input input-bordered rounded flex items-center gap-2">
                <MdOutlinePhoneAndroid />
                <input
                  type="text"
                  className="grow"
                  placeholder="Phone Number"
                  name="phoneNumber"
                  onChange={handleInputChange}
                  value={formData.phoneNumber}
                />
              </label>
              <label className="input input-bordered rounded flex items-center gap-2">
                <MdBusinessCenter />
                <select
                  className="grow bg-base-100 outline-none max-h-40 overflow-y-auto"
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
                  <option value="Fashion & Apparel">Fashion & Apparel</option>
                  <option value="Fashion Accessories">
                    Fashion Accessories
                  </option>
                  <option value="Education & Training">
                    Education & Training
                  </option>
                  <option value="Digital Marketing">Digital Marketing</option>
                  <option value="Graphic Design Services">
                    Graphic Design Services
                  </option>
                  <option value="Printing Services">Printing Services</option>
                  <option value="Art & Craft">Art & Craft</option>
                  <option value="Health & Wellness">Health & Wellness</option>
                  <option value="Beauty & Skincare">Beauty & Skincare</option>
                  <option value="Technology & Innovation">
                    Technology & Innovation
                  </option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Repairs & Services">Repairs & Services</option>
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
              <label className="input input-bordered rounded flex items-center gap-2">
                <FaLocationDot />
                <select
                  className="grow bg-base-100 outline-none max-h-40 overflow-y-auto"
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
                  <option value="W.P. Kuala Lumpur">W.P. Kuala Lumpur</option>
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

              {/* Back & Submit Buttons */}
              <button className="btn rounded-full btn-primary text-white">
                {isPending ? "Loading..." : "Sign up"}
              </button>
            </>
          )}

          {isError && <p className="text-red-500">{error.message}</p>}
        </form>

        <div className="flex flex-col lg:w-2/3 gap-2 mt-4">
          <p className="text-white text-lg">Already have an account?</p>
          <Link to="/login">
            <button className="btn rounded-full btn-primary text-white btn-outline w-full">
              Sign in
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default SignUpPage;
