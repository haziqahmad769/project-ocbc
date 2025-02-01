import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";

const HomePage = () => {
  return (
    <>
      <div className="flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen">
        {/* Header */}
        <div className="flex w-full p-4 border-b border-gray-700"></div>
        
        {/*  CREATE POST INPUT */}
        <CreatePost />

        {/* POSTS */}
        <Posts />
      </div>
    </>
  );
};
export default HomePage;
