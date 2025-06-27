import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FaCog } from "react-icons/fa";
import { MdGridOn, MdMovie, MdBookmarkBorder, MdPersonPin } from "react-icons/md";
import Posts from "../../components/common/Posts";
import EditProfile from "./EditProfile";
import { baseUrl } from "../../constant/url";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const Profile = () => {
  const [feedType, setFeedType] = useState("posts");
  const { username } = useParams();

  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/api/auth/me`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return data;
    },
  });

  const { data: user, isLoading, isRefetching } = useQuery({
    queryKey: ["userProfile", username],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/api/users/profile/${username}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return data;
    },
  });

  const isMyProfile = authUser?.user?._id === user?._id;

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row md:items-start md:gap-12 border-b border-gray-700 pb-6">
        <div className="flex justify-center w-full md:w-auto">
          <img
            src={user?.profileImg || "/avatar-placeholder.png"}
            alt="Profile"
            className="w-36 h-36 rounded-full object-cover"
          />
        </div>

        <div className="flex-1 mt-6 md:mt-0">
          <div className="flex flex-col md:flex-row md:items-center md:gap-6 mb-4">
            <h2 className="text-2xl font-medium">{user?.username}</h2>
            {isMyProfile ? (
              <EditProfile authUser={authUser} />
            ) : (
              <button className="px-4 py-1.5 border rounded-md text-base font-medium">Follow</button>
            )}
            <button className="text-xl ml-2">
              <FaCog />
            </button>
          </div>

          <div className="flex gap-8 text-base mb-4">
            <span><strong>{user?.posts?.length || 0}</strong> posts</span>
            <span><strong>{user?.followers?.length || 0}</strong> followers</span>
            <span><strong>{user?.following?.length || 0}</strong> following</span>
          </div>

          <div className="">
            <p className="font-semibold text-base">{user?.fullName}</p>
            <p className="text-base text-gray-300">{user?.bio}</p>
            {user?.link && (
              <a href={user?.link} className="text-blue-400 text-base hover:underline" target="_blank" rel="noreferrer">
                {user?.link}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Story Highlights */}
      <div className="flex gap-4 overflow-x-auto py-6 border-b border-gray-700">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full border-2 border-gray-500 flex items-center justify-center overflow-hidden">
              <img src="/story-placeholder.jpg" alt={`Story ${i + 1}`} className="w-full h-full object-cover" />
            </div>
            <span className="text-sm text-gray-300 mt-2">Highlight {i + 1}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex justify-around border-t border-gray-700 mt-6 text-lg font-medium uppercase tracking-wide">
        {[
          { type: "posts", label: "Posts", icon: <MdGridOn size={22} /> },
          { type: "reels", label: "Reels", icon: <MdMovie size={22} /> },
          { type: "saved", label: "Saved", icon: <MdBookmarkBorder size={22} /> },
          { type: "tagged", label: "Tagged", icon: <MdPersonPin size={22} /> },
        ].map(tab => (
          <div
            key={tab.type}
            className={`flex items-center gap-2 py-4 cursor-pointer ${
              feedType === tab.type ? "border-t-2 border-white text-white" : "text-gray-400"
            } hover:text-white`}
            onClick={() => setFeedType(tab.type)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </div>
        ))}
      </div>

      {/* Feed Content */}
      <div className="mt-10">
        {feedType === "posts" && <Posts feedType="posts" username={username} userId={user?._id} layout="grid" />}
        {feedType === "reels" && <div className="text-center text-gray-500">No reels yet.</div>}
        {feedType === "saved" && <div className="text-center text-gray-500">No saved posts.</div>}
        {feedType === "tagged" && <div className="text-center text-gray-500">No tagged content.</div>}
      </div>
    </div>
  );
};

export default Profile;
