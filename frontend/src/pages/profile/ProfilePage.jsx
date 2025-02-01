import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Posts from "../../components/common/Posts";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "./EditProfileModal";

// import { POSTS } from "../../utils/db/dummy";

import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatMemberSinceDate } from "../../utils/date";

import useFollow from "../../hooks/useFollow";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const [profileImg, setProfileImg] = useState(null);
  const [feedType, setFeedType] = useState("posts");

  const profileImgRef = useRef(null);

  const { username } = useParams();
  const { follow, isPending } = useFollow();
  const queryClient = useQueryClient();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const {
    data: user,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      try {
        const token = localStorage.getItem("jwt"); // Retrieve the token from local storage
        if (!token) {
          throw new Error("You are not logged in");
        }

        const res = await fetch(`http://localhost:8585/users/${username}`, {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation({
    mutationFn: async ({ profileImg }) => {
      try {
        const token = localStorage.getItem("jwt"); // Retrieve the token from local storage
        if (!token) {
          throw new Error("You are not logged in");
        }

        const formData = new FormData();
        if (profileImg) {
          formData.append("profileImg", profileImg);
        }

        const res = await fetch("http://localhost:8585/users/update", {
          method: "PUT",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
          body: formData,
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
      } catch (error) {
        throw new Error(error);
      }
    },

    onSuccess: () => {
      setProfileImg(null);
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

  const isMyProfile = authUser.id === user?.id;
  const memberSinceDate = formatMemberSinceDate(user?.createdAt);
  const amIFollowing = authUser?.following.includes(user?.id);

  const handleImgChange = (e, state) => {
    const file = e.target.files[0];
    if (file) {
      state === "profileImg" && setProfileImg(file);
    }
  };

  useEffect(() => {
    refetch();
  }, [username, refetch]);

  return (
    <>
      <div className="flex-[4_4_0]  border-r border-gray-700 min-h-screen ">
        {/* HEADER */}
        {(isLoading || isRefetching) && <ProfileHeaderSkeleton />}
        {!isLoading && !isRefetching && !user && (
          <p className="text-center text-lg mt-4">User not found</p>
        )}
        <div className="flex flex-col">
          {!isLoading && !isRefetching && user && (
            <>
              <div className="flex gap-10 px-4 py-2 items-center">
                <Link to="/">
                  <FaArrowLeft className="w-4 h-4" />
                </Link>
                <div className="flex flex-col">
                  {/* <p className="font-bold text-lg">{user?.fullName}</p>
                  <span className="text-sm text-slate-500">
                    {POSTS?.length} posts
                  </span> */}
                </div>
              </div>

              {/* USER AVATAR */}
              <div className="avatar flex justify-center">
                <div className="w-32 rounded-full relative group/avatar">
                  <img
                    src={
                      profileImg
                        ? URL.createObjectURL(profileImg)
                        : user?.profileImg || "/avatar-placeholder.png"
                    }
                  />
                  <div className="absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer">
                    {isMyProfile && (
                      <MdEdit
                        className="w-4 h-4 text-white"
                        onClick={() => profileImgRef.current.click()}
                      />
                    )}
                  </div>
                </div>
              </div>

              <input
                type="file"
                hidden
                accept="image/*"
                ref={profileImgRef}
                onChange={(e) => handleImgChange(e, "profileImg")}
              />

              <div className="flex justify-center px-4 mt-5">
                {isMyProfile && <EditProfileModal authUser={authUser} />}
                {!isMyProfile && (
                  <button
                    className="btn btn-outline rounded-full btn-sm"
                    onClick={() => follow(user?.id)}
                  >
                    {isPending && "Loading..."}
                    {!isPending && amIFollowing && "Unfollow"}
                    {!isPending && !amIFollowing && "Follow"}
                  </button>
                )}
                {profileImg && (
                  <button
                    className="btn btn-primary rounded-full btn-sm text-white px-4 ml-2"
                    onClick={() => updateProfile({ profileImg })}
                  >
                    {isUpdatingProfile ? "Updating..." : "Update"}
                  </button>
                )}
              </div>

              <div className="flex flex-col items-center gap-4 mt-4 px-4">
                <div className="flex flex-col">
                  <span className="font-bold text-lg">{user?.fullName}</span>
                  <span className="text-sm text-slate-500">
                    @{user?.username}
                  </span>
                  <span className="text-sm my-1">{user?.bio}</span>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {user?.link && (
                    <div className="flex gap-1 items-center ">
                      <>
                        <FaLink className="w-3 h-3 text-slate-500" />
                        <a
                          href={user?.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-blue-500 hover:underline"
                        >
                          {user?.link}
                        </a>
                      </>
                    </div>
                  )}
                  <div className="flex gap-2 items-center">
                    <IoCalendarOutline className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-500">
                      {memberSinceDate}
                    </span>
                  </div>
                </div>

                {/* Phone number, business type & business location */}
                <div className="flex gap-2 flex-wrap">
                  <div className="flex gap-2 items-center">
                    {user?.businessType && (
                      <div className="flex gap-1 items-center ">
                        <>
                          <FaLink className="w-3 h-3 text-slate-500" />
                          <span className="text-sm text-slate-500">
                            {user?.businessType}
                          </span>
                        </>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 items-center">
                    {user?.businessLocation && (
                      <div className="flex gap-1 items-center ">
                        <>
                          <FaLink className="w-3 h-3 text-slate-500" />
                          <span className="text-sm text-slate-500">
                            {user?.businessLocation}
                          </span>
                        </>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  {user?.phoneNumber && (
                    <div className="flex gap-2 items-center ">
                      <>
                        <FaLink className="w-3 h-3 text-slate-500" />
                        <span className="text-sm text-slate-500">
                          {user?.phoneNumber}
                        </span>
                      </>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <div className="flex gap-1 items-center">
                    <span className="font-bold text-xs">
                      {user?.following.length}
                    </span>
                    <span className="text-slate-500 text-xs">Following</span>
                  </div>
                  <div className="flex gap-1 items-center">
                    <span className="font-bold text-xs">
                      {user?.followers.length}
                    </span>
                    <span className="text-slate-500 text-xs">Followers</span>
                  </div>
                </div>
              </div>
              <div className="flex w-full border-b border-gray-700 mt-4">
                <div
                  className="flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 relative cursor-pointer"
                  onClick={() => setFeedType("posts")}
                >
                  Posts
                  {feedType === "posts" && (
                    <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary" />
                  )}
                </div>
                <div
                  className="flex justify-center flex-1 p-3 text-slate-500 hover:bg-secondary transition duration-300 relative cursor-pointer"
                  onClick={() => setFeedType("likes")}
                >
                  Likes
                  {feedType === "likes" && (
                    <div className="absolute bottom-0 w-10  h-1 rounded-full bg-primary" />
                  )}
                </div>
              </div>
            </>
          )}

          <Posts feedType={feedType} username={username} userId={user?.id} />
        </div>
      </div>
    </>
  );
};
export default ProfilePage;
