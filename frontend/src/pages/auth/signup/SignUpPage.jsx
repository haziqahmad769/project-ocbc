import { Link } from "react-router-dom";
import { useState } from "react";

import TLogo from "../../../components/svgs/TLogo";

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
        const res = await fetch("http://localhost:8585/signup", {
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
        console.log(data);
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
    <div className="max-w-screen-xl mx-auto flex h-screen px-10">
      <div className="flex-1 hidden lg:flex items-center  justify-center">
        <TLogo className=" lg:w-2/3 overflow-visible fill-white" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form
          className="lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col"
          onSubmit={handleSubmit}
        >
          <TLogo className="w-48 lg:hidden fill-white" />
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
                  <FaArrowLeft className="h-6 w-6"/>
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
                  className="grow bg-base-100 outline-none"
                  name="businessType"
                  onChange={handleInputChange}
                  value={formData.businessType}
                >
                  <option value="" disabled selected>
                    Business Type
                  </option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Food & Beverage">Food & Beverage</option>
                  <option value="Retail">Retail</option>
                </select>
              </label>
              <label className="input input-bordered rounded flex items-center gap-2">
                <FaLocationDot />
                <select
                  className="grow bg-base-100 outline-none"
                  name="businessLocation"
                  onChange={handleInputChange}
                  value={formData.businessLocation}
                >
                  <option value="" disabled selected>
                    Business Location
                  </option>
                  <option value="Selangor">Selangor</option>
                  <option value="Perlis">Perlis</option>
                  <option value="Johor">Johor</option>
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
