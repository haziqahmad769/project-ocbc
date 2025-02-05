import { useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { IoCloseSharp } from "react-icons/io5";
import { FaImage, FaTrash } from "react-icons/fa6";

const AdsManager = () => {
  const [text, setText] = useState("");
  const [adImg, setAdImg] = useState(null);
  const adImgRef = useRef(null);
  const [link, setLink] = useState("");

  //   const queryClient = useQueryClient();

  const { data: ads, refetch } = useQuery({
    queryKey: ["ads"],
    queryFn: async () => {
      try {
        const token = localStorage.getItem("jwt"); // Retrieve the token from local storage
        if (!token) {
          throw new Error("You are not logged in");
        }

        const res = await fetch("http://localhost:8585/ads/all", {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
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

  const {
    mutate: createAd,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ text, adImg, link }) => {
      try {
        const token = localStorage.getItem("jwt"); // Retrieve the token from local storage
        if (!token) {
          throw new Error("You are not logged in");
        }

        const formData = new FormData();
        formData.append("text", text);
        formData.append("link", link);
        if (adImg) {
          formData.append("adImg", adImg);
        }

        const res = await fetch("http://localhost:8585/ads/create", {
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
      setAdImg(null);
      setLink("");
      toast.success("Ad created successfully");
      //   queryClient.invalidateQueries({ queryKey: ["ads"] });
      refetch();
    },
  });

  const { mutate: deleteAd } = useMutation({
    mutationFn: async (id) => {
      try {
        const token = localStorage.getItem("jwt"); // Retrieve the token from local storage
        if (!token) {
          throw new Error("You are not logged in");
        }

        const res = await fetch(`http://localhost:8585/ads/${id}`, {
          method: "DELETE",
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
      } catch (error) {
        throw new Error(error);
      }
    },

    onSuccess: () => {
      toast.success("Ad deleted successfully");
      //   queryClient.invalidateQueries({ queryKey: ["ads"] });
      refetch();
    },
  });

  //   useEffect(() => {
  //     refetch();
  //   });

  const handleSubmit = (e) => {
    e.preventDefault();
    // alert("Post created successfully");
    createAd({ text, adImg, link });
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAdImg(file); // Store the file in state
    }
  };

  return (
    <div className="flex-[4_4_0] border-r border-gray-700 min-h-screen pb-20">
      <div>
        <form
          className="flex flex-col w-full border-b border-gray-700 p-4 gap-2"
          onSubmit={handleSubmit}
        >
          <textarea
            className="flex-1 textarea border border-gray-700 rounded p-2 input-md"
            placeholder="Ad Text"
            name="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div className="flex flex-col gap-2">
            <div className="flex-1 border border-gray-700 rounded p-2">
              <FaImage
                className="fill-primary w-6 h-6 cursor-pointer"
                onClick={() => adImgRef.current.click()}
              />
              {adImg && (
                <div className="relative w-72 mx-auto">
                  <IoCloseSharp
                    className="absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
                    onClick={() => {
                      setAdImg(null);
                      adImgRef.current.value = null;
                    }}
                  />
                  <img
                    src={URL.createObjectURL(adImg)}
                    className="w-full mx-auto h-72 object-contain rounded"
                  />
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              hidden
              ref={adImgRef}
              onChange={handleImgChange}
            />

            <input
              type="text"
              placeholder="Link"
              className="flex-1 input border border-gray-700 rounded p-2 input-md"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
            <div className="flex justify-end">
              <button className="btn btn-primary rounded-full btn-sm text-white px-4">
                {isPending ? "Loading..." : "Create ad"}
              </button>
            </div>
          </div>
          {isError && <div className="text-red-500">{error.message}</div>}
        </form>

        {/* Display existing ads */}
        <div className="flex flex-col gap-4">
          {ads?.map((ad) => (
            <div
              key={ad.id}
              className="flex flex-col border-b border-gray-700 p-3 m-3 gap-4 w-full max-w-full mx-auto shadow-lg"
            >
              <button className=" flex justify-end">
                <FaTrash
                  className="cursor-pointer hover:text-red-500"
                  onClick={() => deleteAd(ad.id)}
                />
              </button>

              {/* Ad Text */}
              <p className="text-white text-center break-words overflow-hidden">
                {ad.text}
              </p>

              {/* Ad Image (Responsive) */}
              <div className="flex justify-center">
                <img
                  src={ad.adImg}
                  className="h-80 object-cover rounded-lg border border-gray-700"
                  alt="Ad"
                />
              </div>

              {/* Ad Link */}
              <div className="text-center mt-2">
                <a
                  href={ad.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:underline break-words overflow-hidden"
                >
                  {ad.link}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdsManager;
