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

  if (!ads || ads.length === 0) return null; // Don't display if no ads exist

  const ad = ads.length > 0 ? ads[index % ads.length] : null;

  if (!ad) return null;

  return (
    <div className="bg-gray-800 border border-gray-700 p-4 rounded-md my-4 w-full max-w-lg mx-auto">
      <a href={ad?.link} target="_blank" rel="noreferrer" className="block">
        <img
          src={ad?.adImg}
          alt="Advertisement"
          className="w-full h-48 object-cover rounded-md"
        />
        <p className="text-white mt-2 font-bold text-center">{ad?.text}</p>
      </a>
    </div>
  );
};

export default AdsCard;
