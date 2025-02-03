// import { Link } from "react-router-dom";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import TLogo from "../../../components/svgs/TLogo";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  const {
    mutate: resetPassword,
    isError,
    isPending,
    error,
  } = useMutation({
    mutationFn: async ({ newPassword }) => {
      try {
        const res = await fetch(
          `http://localhost:8585/reset-password/${token}`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ newPassword }),
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message);
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Password reset successfully");
      setTimeout(() => {
        navigate("/login"); // Redirect user to login page after success
      }, 2000); // Optional: Add delay before redirecting
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    resetPassword({ newPassword });
  };

  const handleInputChange = (e) => {
    setNewPassword(e.target.value);
  };
  return (
    <div className="max-w-screen-xl mx-auto flex h-screen px-10">
      <div className="flex-1 flex flex-col justify-center items-center">
        <form
          className="lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col"
          onSubmit={handleSubmit}
        >
          <TLogo className="w-48 fill-white" />
          <label className="input input-bordered rounded flex items-center gap-2">
            <input
              type="password"
              className="grow"
              placeholder="Enter new password"
              onChange={handleInputChange}
              value={newPassword}
              required
            />
          </label>

          <button className="btn rounded-full btn-primary text-white">
            {isPending ? "Loading..." : "Reset password"}
          </button>
          {isError && <p className="text-red-500">{error.message}</p>}
        </form>
        {/* <div className="flex flex-col lg:w-2/3 gap-2 mt-4">
          <Link to="/login">
            <button className="btn rounded-full btn-primary text-white btn-outline w-full">
              Sign in
            </button>
          </Link>
        </div> */}
      </div>
    </div>
  );
};

export default ResetPassword;
