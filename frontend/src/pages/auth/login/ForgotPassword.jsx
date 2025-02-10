import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import TubeLogo from "../../../components/svgs/TubeLogo";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const {
    mutate: forgotPassword,
    isError,
    isPending,
    error,
  } = useMutation({
    mutationFn: async ({ email }) => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/forgot-password`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message);
        }
      } catch (error) {
        throw new Error(error);
      }
    },

    onSuccess: () => {
      toast.success("Password reset email sent successfully");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    forgotPassword({ email });
  };

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen px-10">
      <div className="flex-1 flex flex-col justify-center items-center">
        <form
          className="lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col"
          onSubmit={handleSubmit}
        >
          <TubeLogo className="w-48 fill-white" />
          <label className="input input-bordered rounded flex items-center gap-2">
            <input
              type="email"
              className="grow"
              placeholder="Enter your email"
              onChange={handleInputChange}
              value={email}
              required
            />
          </label>

          <button className="btn rounded-full btn-primary text-white">
            {isPending ? "Loading..." : "Reset password"}
          </button>
          {isError && <p className="text-red-500">{error.message}</p>}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
