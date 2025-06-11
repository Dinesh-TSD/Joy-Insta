import { FaBookmark, FaComment, FaHeart, FaPlusSquare, FaRegComment, FaRegCompass, FaShare } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { baseUrl } from '../../constant/url'
import LoadingSpinner from "./LoadingSpinner";
import toast from "react-hot-toast";
import { formatPostDate } from "../../utils/date";


const Post = ({ post }) => {

    const [comment, setComment] = useState("");
    const queryClient = useQueryClient();

    const { data: authUser } = useQuery({
        queryKey: ["authUser"],
        queryFn: async () => {
            try {
                const res = await fetch(`${baseUrl}/api/auth/me`, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-type": "application/json"
                    }
                })
                const data = await res.json();

                if (!res.ok) throw new Error(data.error || "somthing went wrong")

                return data;
            } catch (error) {
                throw error
            }
        },
    })
    const { mutate: deletePost, isPending: isDeleting } = useMutation({
        mutationFn: async () => {
            try {
                const res = await fetch(`${baseUrl}/api/posts/${post._id}`, {
                    method: "DELETE",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "somthing went wrong")

                return data;
            } catch (error) {
                throw error
            }
        },
        onSuccess: () => {
            toast.success("post deleted")
            queryClient.invalidateQueries({
                queryKey: ["posts"]
            })
        }
    })

    const { mutate: likePost, isPending: isLiking } = useMutation({
        mutationFn: async () => {
            try {
                const res = await fetch(`${baseUrl}/api/posts/like/${post._id}`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-type": "application/json"
                    }
                })
                const data = await res.json();

                if (!res.ok) throw Error(data.error || "somthing went wrong")
                return data;
            } catch (error) {
                throw error
            }
        },
        onSuccess: (updatedLikes) => {
            queryClient.setQueryData(["posts"], (oldData) => {
                return oldData.map((p) => {
                    if (p._id === post._id) {
                        return { ...p, likes: updatedLikes }
                    }
                    return p;
                })
            })
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    const { mutate: commentPost, isPending: isCommenting } = useMutation({
        mutationFn: async () => {
            try {

                const res = await fetch(`${baseUrl}/api/posts/comment/${post._id}`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ text: comment }),
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
        onSuccess: () => {
            toast.success("Comment posted successfully");
            setComment("");
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const postOwner = post.user;
    const isLiked = post.likes.includes(authUser.user._id)
    const isMyPost = authUser.user._id === post.user._id;
    const formattedDate = formatPostDate(post.createdAt)

    const handleDeletePost = () => {
        deletePost();
    };

    const handlePostComment = (e) => {
        e.preventDefault();
        if (isCommenting) return;
        commentPost();
    };

    const handleLikePost = () => {
        if (isLiking) return;
        likePost();
    };

    return (
        <>
            <div className="p-2 mb-6 max-w-[500px] mx-auto">
                {/* Post Header */}
                <div className="flex items-center justify-between px-3 pt-3">
                    <div className="flex items-center gap-3">
                        <img
                            src={postOwner.profileImg}
                            alt={postOwner.username}
                            className="h-10 w-10 rounded-full object-cover border border-[#00FFF7]/30"
                        />
                        <span className="font-semibold text-sm text-white">{postOwner.username}</span>
                    </div>
                    <button className="text-xl font-bold text-gray-400 hover:text-white">⋯</button>
                </div>

                {/* Post Media */}
                <div className="mt-3 w-full max-h-[600px] overflow-hidden ">
                    {post.fileType === "image" ? (
                        <img
                            src={`${baseUrl}${post.fileUrl}`}
                            alt="post"
                            className="w-full h-auto object-contain"
                        />
                    ) : (
                        <video
                            controls
                            src={`${baseUrl}${post.fileUrl}`}
                            className="w-full h-auto object-contain"
                        />
                    )}
                </div>

                {/* Action Icons */}
                <div className="px-3 pt-3 flex justify-between items-center text-white">
                    <div className="flex gap-4 text-2xl">
                        <FaHeart className="hover:text-red-500 cursor-pointer" />
                        <FaComment className="hover:text-sky-400 cursor-pointer" />
                        <FaShare className="hover:text-green-400 cursor-pointer" />
                    </div>
                    <FaBookmark className="hover:text-yellow-300 cursor-pointer text-2xl" />
                </div>

                {/* Like Count */}
                <div className="px-3 pt-2 text-sm text-white font-semibold">
                    {post.likes?.length || 0} likes
                </div>

                {/* Caption */}
                <div className="px-3 pt-1 pb-1 text-sm text-[#C5EFFF]">
                    <p>
                        <span className="font-semibold mr-2 text-white">{postOwner.username}</span>
                        {post.caption}
                    </p>
                </div>

                {/* View All Comments */}
                <div className="px-3 text-sm text-[#8899AA] hover:underline cursor-pointer">
                    View all {post.comments?.length || 0} comments
                </div>

                {/* Add Comment */}
                <div className="px-3 pt-2 flex items-center gap-2">
                    <img
                        src={authUser.user.profileImg}
                        alt="Your profile"
                        className="h-8 w-8 rounded-full object-cover"
                    />
                    <input
                        type="text"
                        placeholder="Add a comment..."
                        className="bg-transparent border-none outline-none text-sm text-white flex-1 placeholder-[#8899AA]"
                    />
                    <button className="text-sm text-[#00FFF7] font-semibold">Post</button>
                </div>

                {/* Timestamp */}
                <div className="px-3 pt-1 pb-2 text-xs text-[#8899AA] uppercase">
                    {new Date(post.createdAt).toLocaleDateString()}
                </div>
            </div>


        </>
    )
}

export default Post