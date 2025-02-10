import { useQuery } from "@tanstack/react-query";

const AdsCard = ({ index }) => {
  // Fetch ads from backend
  const { data: ads } = useQuery({
    queryKey: ["ads"],
    queryFn: async () => {
      try {
        const token = localStorage.getItem("jwt"); // Retrieve the token from local storage
        if (!token) {
          throw new Error("You are not logged in");
        }

        const res = await fetch(`${import.meta.env.VITE_API_URL}/ads/all`, {
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

  if (!ads || ads.length === 0) return null; // Don't display if no ads exist

  const ad = ads.length > 0 ? ads[index % ads.length] : null;

  if (!ad) return null;

  return (
    <div className=" border-b border-gray-700 p-4 w-full">
      <div className="flex bg-gray-800 p-4 rounded-md">
        <a
          href={ad?.link}
          target="_blank"
          rel="noreferrer"
          className="flex flex-col justify-center items-center"
        >
          <img
            src={ad?.adImg}
            alt="Advertisement"
            className="w-48 object-cover rounded-md"
          />
          <p className="text-white mt-2 font-bold  whitespace-pre-wrap">
            {ad?.text}
          </p>

          <button
            className="btn btn-primary rounded-full btn-sm text-white px-4 m-4"
            href={ad?.link}
          >
            KLIK SINI
          </button>
        </a>
      </div>
    </div>
  );
};

export default AdsCard;
