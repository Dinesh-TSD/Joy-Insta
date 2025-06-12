import { useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BsChat, BsBookmark, BsBookmarkFill, BsShare } from "react-icons/bs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { baseUrl } from "../../constant/url";
import toast from "react-hot-toast";

const PostActions = ({ post, isLiked, currentUser }) => {
  const queryClient = useQueryClient();
  const [saved, setSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(post.likes.length);

  const { mutate: likePost } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${baseUrl}/api/posts/like/${post._id}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-type": "application/json" }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
    onMutate: () => {
      setLiked(prev => !prev);
      setLikeCount(prev => liked ? prev - 1 : prev + 1);
    },
    onSuccess: (updatedLikes) => {
      const userId = currentUser._id;
      const isUserLiked = updatedLikes.includes(userId);
      setLiked(isUserLiked);
      setLikeCount(updatedLikes.length);

      queryClient.setQueryData(["posts"], (oldData) =>
        oldData.map((p) =>
          p._id === post._id
            ? { ...p, likes: updatedLikes }
            : p
        )
      );
    },
    onError: (error) => {
      toast.error(error.message);
      setLiked(prev => !prev);
      setLikeCount(prev => liked ? prev + 1 : prev - 1);
    },
  });

  const handleLikePost = () => {
    likePost();
  };

  return (
    <>
      <div className="flex items-center justify-between mt-2 px-1 text-2xl text-gray-800">
        <div className="flex items-center gap-4">
          <button onClick={handleLikePost}>
            {liked ? (
              <AiFillHeart className="text-pink-500 w-5 h-5 transition-all duration-150" />
            ) : (
              <AiOutlineHeart className="text-slate-600 w-5 h-5 transition-all duration-150" />
            )}
          </button>
          <button onClick={() => setShowComments(true)}>
            <BsChat />
          </button>
          <button onClick={() => navigator.share?.({ title: "Post", url: window.location.href })}>
            <BsShare />
          </button>
        </div>
        <div>
          <button onClick={() => setSaved(prev => !prev)}>
            {saved ? <BsBookmarkFill /> : <BsBookmark />}
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-700 mt-1 px-1">{likeCount} {likeCount === 1 ? "like" : "likes"}</p>

      {showComments && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-md p-4 rounded-md relative">
            <button onClick={() => setShowComments(false)} className="absolute top-2 right-2 text-xl">
              ❌
            </button>
            <h2 className="text-lg font-semibold mb-3">Comments</h2>
            <p className="text-gray-500">Comment feature coming soon...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default PostActions;
