import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import AdsCard from "../../pages/ad/AdsCard";

const Posts = ({ feedType, username, userId }) => {
  const getPostEndpoint = () => {
    switch (feedType) {
      case "forYou":
        return "http://localhost:8585/posts/all";
      case "posts":
        return `http://localhost:8585/posts/user/${username}`;
      case "likes":
        return `http://localhost:8585/posts/liked/${userId}`;
      default:
        return "http://localhost:8585/posts/all";
    }
  };

  const POST_ENDPOINT = getPostEndpoint();

  const {
    data: posts,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        const token = localStorage.getItem("jwt"); // Retrieve the token from local storage
        if (!token) {
          throw new Error("You are not logged in");
        }

        const res = await fetch(POST_ENDPOINT, {
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

  useEffect(() => {
    refetch();
  }, [feedType, refetch, username]);

  return (
    <>
      {(isLoading || isRefetching) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && !isRefetching && posts?.length === 0 && (
        <p className="text-center my-4 font-bold">No posts in this tab</p>
      )}
      {!isLoading && !isRefetching && posts && (
        <div className="pb-20">
          {posts.map((post, index) => (
            <div key={post.id}>
              <Post post={post} />
              {/* Insert AdsCard every 5 posts & Rotate ads */}
              {(index + 1) % 15 === 0 && <AdsCard index={index} />}
            </div>
          ))}
        </div>
      )}
    </>
  );
};
export default Posts;
