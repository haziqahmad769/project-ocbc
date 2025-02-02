import { Link, useLocation } from "react-router-dom";
import { FaImage, FaSatelliteDish } from "react-icons/fa6";
import { PiUsersThreeFill } from "react-icons/pi";
import { MdNotifications } from "react-icons/md";
import { FaArrowCircleUp } from "react-icons/fa";
import { FaUserAstronaut } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";

const BottomNavbar = () => {
  const location = useLocation();
  const queryClient = useQueryClient();

  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const imgRef = useRef(null);

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const isProfilePage = location.pathname.startsWith("/profile");
  const isHomePage = location.pathname === "/";

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("http://localhost:8585/logout", {
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

  const {
    mutate: createPost,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ text, img }) => {
      try {
        const token = localStorage.getItem("jwt"); // Retrieve the token from local storage
        if (!token) {
          throw new Error("You are not logged in");
        }

        const formData = new FormData();
        formData.append("text", text);
        if (img) {
          formData.append("img", img);
        }

        const res = await fetch("http://localhost:8585/posts/create", {
          method: "POST",
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
      setText("");
      setImg(null);
      toast.success("Post created successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // alert("Post created successfully");
    createPost({ text, img });
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImg(file); // Store the file in state
    }
  };

  return (
    <>
      <div className="md:hidden btm-nav fixed bottom-0 left-0 w-full bg-gray-900 text-white border-t border-gray-700 flex justify-around py-3">
        <Link to="/users" className="flex flex-col items-center">
          <PiUsersThreeFill className="w-6 h-6" />
          <span className="text-xs">Tubepreneurs</span>
        </Link>

        {/* <Link to="/" className="flex flex-col items-center">
        <FaSatelliteDish className="w-6 h-6" />
        <span className="text-xs">Forum</span>
      </Link> */}

        {!isHomePage ? (
          <Link to="/" className="flex flex-col items-center">
            <FaSatelliteDish className="w-6 h-6" />
            <span className="text-xs">Forum</span>
          </Link>
        ) : (
          <button
            onClick={() => document.getElementById("post_modal").showModal()}
            className="flex flex-col items-center"
          >
            <FaArrowCircleUp className="w-6 h-6" />
            <span className="text-xs">Post</span>
          </button>
        )}

        {!isHomePage ? (
          <Link to="/notifications" className="flex flex-col items-center">
            <MdNotifications className="w-6 h-6" />
            <span className="text-xs">Notifications</span>
          </Link>
        ) : (
          ""
        )}

        {/* {authUser && (
        <Link to={`/profile/${authUser?.username}`} className="flex flex-col items-center">
          <FaUserAstronaut className="w-6 h-6" />
          <span className="text-xs">Profile</span>
        </Link>
        
      )} */}

        {!isProfilePage && authUser ? (
          <Link
            to={`/profile/${authUser?.username}`}
            className="flex flex-col items-center"
          >
            <FaUserAstronaut className="w-6 h-6" />
            <span className="text-xs">Profile</span>
          </Link>
        ) : (
          <button
            onClick={() => logout()}
            className="flex flex-col items-center"
          >
            <BiLogOut className="w-6 h-6" />
            <span className="text-xs">Logout</span>
          </button>
        )}
      </div>

      <dialog id="post_modal" className="modal border-none outline-none">
        <div className="modal-box rounded border border-gray-600">
          <textarea
            className="textarea w-full p-0 text-lg resize-none border-none focus:outline-none  border-gray-800"
            placeholder="Share with everyone"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {img && (
            <div className="relative w-72 mx-auto">
              <IoCloseSharp
                className="absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
                onClick={() => {
                  setImg(null);
                  imgRef.current.value = null;
                }}
              />
              <img
                src={URL.createObjectURL(img)}
                className="w-full mx-auto h-72 object-contain rounded"
              />
            </div>
          )}

          <div className="flex justify-between border-t py-2 border-t-gray-700">
            <div className="flex gap-1 items-center">
              <FaImage
                className="fill-primary w-6 h-6 cursor-pointer"
                onClick={() => imgRef.current.click()}
              />
            </div>
            <input
              type="file"
              accept="image/*"
              hidden
              ref={imgRef}
              onChange={handleImgChange}
            />
            <button
              className="btn btn-primary rounded-full btn-sm text-white px-4"
              onClick={handleSubmit}
            >
              {isPending ? "Posting..." : "Post"}
            </button>
          </div>
          {isError && <div className="text-red-500">{error.message}</div>}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button className="outline-none">close</button>
        </form>
      </dialog>
    </>
  );
};

export default BottomNavbar;
