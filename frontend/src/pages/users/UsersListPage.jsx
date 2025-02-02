import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import UsersCard from "../../components/common/UsersCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import toast from "react-hot-toast";

const UsersListPage = () => {
  const queryClient = useQueryClient();

  const {
    data: users,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      try {
        const token = localStorage.getItem("jwt"); // Retrieve the token from local storage
        if (!token) {
          throw new Error("You are not logged in");
        }

        const res = await fetch("http://localhost:8585/users/all", {
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

  const { mutate: followUnfollowUser } = useMutation({
    mutationFn: async (userId) => {
      try {
        const token = localStorage.getItem("jwt");
        if (!token) {
          throw new Error("You are not logged in");
        }

        const res = await fetch(
          `http://localhost:8585/users/follow/${userId}`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Followed/Unfollowed successfully");
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen pb-20">
      <div className="p-4 border-b border-gray-700"></div>

      {isLoading && (
        <div className="flex justify-center h-full items-center">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {isError && (
        <div className="text-center p-4 font-bold text-red-500">
          Failed to load users
        </div>
      )}

      {users?.length === 0 && (
        <div className="text-center p-4 font-bold">No users found</div>
      )}

      {users?.map((user) => (
        <UsersCard
          key={user.id}
          user={user}
          followUnfollowUser={followUnfollowUser}
        />
      ))}
    </div>
  );
};

export default UsersListPage;
