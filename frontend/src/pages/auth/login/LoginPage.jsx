import { useState } from "react";
import { Link } from "react-router-dom";

import TubeLogo from "../../../components/svgs/TubeLogo";

import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";

import { useMutation, useQueryClient } from "@tanstack/react-query";
// import toast from "react-hot-toast";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const queryClient = useQueryClient();

  const {
    mutate: loginMutation,
    isError,
    isPending,
    error,
  } = useMutation({
    mutationFn: async ({ email, password }) => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (res.ok) {
          localStorage.setItem("jwt", data.token); // Store the JWT token in localStorage
        } else {
          throw new Error(data.message || "Failed to create account");
        }

        // if (!res.ok) {
        //   throw new Error(data.message || "Failed to create account");
        // }
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      // toast.success("Login successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const isError = false;

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen">
      <div className="flex-1 hidden lg:flex items-center  justify-center">
        <TubeLogo className="lg:w-2/3 fill-white" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form className="flex gap-4 flex-col" onSubmit={handleSubmit}>
          <TubeLogo className="w-48 lg:hidden fill-white" />
          <h1 className="text-4xl font-extrabold text-white">
            {"Get"} updated!
          </h1>
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdOutlineMail />
            <input
              type="text"
              className="grow"
              placeholder="Email"
              name="email"
              onChange={handleInputChange}
              value={formData.email}
            />
          </label>

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
          <button className="btn rounded-full btn-primary text-white">
            {/* Login */}
            {isPending ? "Loading..." : "Sign in"}
          </button>
          {isError && <p className="text-red-500">{error.message}</p>}
        </form>
        <div className="flex flex-col gap-2 mt-4">
          <p className="text-white text-lg">{"Don't"} have an account?</p>
          <Link to="/signup">
            <button className="btn rounded-full btn-primary text-white btn-outline w-full">
              Sign up
            </button>
          </Link>
          <Link to="/forgot-password">
            <button className="btn btn-link w-full text-slate-700">
              Forgot password
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
