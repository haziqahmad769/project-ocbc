import TubeLogo from "../svgs/TubeLogo";

import { FaComments } from "react-icons/fa6";
import { PiUsersThreeFill } from "react-icons/pi";
import { MdNotifications } from "react-icons/md";
import { FaUser } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { RiAdvertisementFill } from "react-icons/ri";

const Sidebar = () => {
  const queryClient = useQueryClient();

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
          method: "POST",
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok) {
          localStorage.removeItem("jwt");
        } else {
          throw new Error(data.message || "Failed to create account");
        }

        // if (!res.ok) {
        //   throw new Error(data.message || "Something went wrong");
        // }
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      // toast.success("Logged out successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: () => {
      toast.error("Logout failed");
    },
  });

  // const data = {
  //   fullName: "John Doe",
  //   username: "johndoe",
  //   profileImg: "/avatars/boy1.png",
  // };

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  return (
    <div className="hidden md:flex md:flex-[2_2_0] w-18 max-w-52">
      <div className="sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full">
        <Link to="/" className="flex justify-center md:justify-start">
          <TubeLogo className="px-2 w-36 mt-4 rounded-full fill-white" />
        </Link>
        <ul className="flex flex-col gap-3 mt-4">
          <li className="flex justify-center md:justify-start">
            <Link
              to="/"
              className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <FaComments className="w-8 h-8" />
              <span className="text-lg hidden md:block">Forum</span>
            </Link>
          </li>
          <li className="flex justify-center md:justify-start">
            <Link
              to="/users"
              className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <PiUsersThreeFill className="w-8 h-8" />
              <span className="text-lg hidden md:block">Tubepreneurs</span>
            </Link>
          </li>
          <li className="flex justify-center md:justify-start">
            <Link
              to="/notifications"
              className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <MdNotifications className="w-6 h-6" />
              <span className="text-lg hidden md:block">Notifications</span>
            </Link>
          </li>
          <li className="flex justify-center md:justify-start">
            <Link
              to={`/profile/${authUser?.username}`}
              className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <FaUser className="w-6 h-6" />
              <span className="text-lg hidden md:block">Profile</span>
            </Link>
          </li>
          {authUser.isAdmin === true && (<li className="flex justify-center md:justify-start">
            <Link
              to="/ads-manager"
              className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <RiAdvertisementFill className="w-6 h-6" />
              <span className="text-lg hidden md:block">Ads</span>
            </Link>
          </li>)}
        </ul>
        {authUser && (
          <Link
            to={`/profile/${authUser.username}`}
            className="mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-[#181818] py-2 px-4 rounded-full"
          >
            <div className="avatar hidden md:inline-flex">
              <div className="w-8 h-8 rounded-full">
                <img src={authUser?.profileImg || "/avatar-placeholder.png"} />
              </div>
            </div>
            <div className="flex justify-between flex-1">
              <div className="hidden md:block">
                <p className="text-white font-bold text-sm w-20 truncate">
                  {authUser?.fullName}
                </p>
                <p className="text-slate-500 text-sm">@{authUser?.username}</p>
              </div>
              <BiLogOut
                className="w-5 h-5 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  logout();
                }}
              />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};
export default Sidebar;
