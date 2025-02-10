import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useFollow = () => {
  const queryClient = useQueryClient();

  const { mutate: follow, isPending } = useMutation({
    mutationFn: async (userId) => {
      try {
        const token = localStorage.getItem("jwt"); // Retrieve the token from local storage
        if (!token) {
          throw new Error("You are not logged in");
        }

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/users/${userId}/follow`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the Authorization header
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        return;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      Promise.all([queryClient.invalidateQueries({ queryKey: ["authUser"] })]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { follow, isPending };
};

export default useFollow;
