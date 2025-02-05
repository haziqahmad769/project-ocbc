import { useState } from "react";
import { FaLink } from "react-icons/fa";
// import { IoMailOutline } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";

import useFollow from "../../hooks/useFollow";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const UsersCard = ({ user }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const { follow, isPending } = useFollow();
  const amIFollowing = authUser?.following.includes(user?.id);

  return (
    <div className="border-b border-gray-700 p-4">
      <div className="flex justify-between items-center">
        {/* User Details */}
        <div className="flex items-center gap-3">
          <div className="avatar">
            <Link
              to={`/profile/${user.username}`}
              className="w-12 h-12 rounded-full overflow-hidden bg-gray-300"
            >
              <img
                src={user.profileImg || "/avatar-placeholder.png"}
                alt={user.username}
              />
            </Link>
          </div>
          <div>
            <Link to={`/profile/${user.username}`} className="font-bold">
              {user.fullName}
            </Link>
            <p className="text-sm text-gray-500">@{user.username}</p>
            <p className="text-sm">{user?.businessType}</p>
            <p className="text-sm">{user?.businessLocation}</p>
          </div>
        </div>

        {/* Expand Button */}
        <BsThreeDots
          className="cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        />
      </div>

      {/* Expanded Info Section */}
      {isExpanded && (
        <div className="mt-3 p-3 bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-400">{user?.bio}</p>

          <div className="flex flex-col mt-2 text-sm">
            {/* {user?.email && (
              <div className="flex gap-2 items-center ">
                <>
                  <IoMailOutline className="text-gray-400" />
                  <span>{user.email}</span>
                </>
              </div>
            )} */}

            {user?.link && (
              <div className="flex gap-2 items-center ">
                <>
                  <FaLink className=" text-gray-400" />
                  <a
                    href={user?.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    {user?.link}
                  </a>
                </>
              </div>
            )}
          </div>

          {/* Follow Button */}
          {authUser?.id !== user?.id && (
            <div className="flex justify-end">
              <button
                className="btn btn-primary rounded-full btn-sm text-white px-4"
                onClick={() => follow(user?.id)}
              >
                {isPending && "Loading..."}
                {!isPending && amIFollowing && "Unfollow"}
                {!isPending && !amIFollowing && "Follow"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UsersCard;
