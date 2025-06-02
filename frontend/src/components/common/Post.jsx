import { FaHeart, FaPlusSquare, FaRegComment, FaRegCompass } from "react-icons/fa";
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
            {/* Post Header */}
            <div className="flex items-center justify-between px-3 pt-3">
                <div className="flex items-center gap-3">
                    <img
                        src={postOwner.profileImg}
                        alt={postOwner.username}
                        className="h-10 w-10 rounded-full object-cover border"
                    />
                    <span className="font-semibold text-sm">{postOwner.username}</span>
                </div>
                <button className="text-xl font-bold text-gray-500 hover:text-black">⋯</button>
            </div>

            {/* Post Image */}
            <div className="bg-white border rounded-md shadow-sm mt-2">
                <img
                    src={post.img}
                    alt="post"
                    className="w-full object-cover max-h-[600px]"
                />
            </div>

            {/* Post Actions */}
            <div className="px-3 pt-3 flex gap-4 text-xl text-gray-700">
                <FaHeart className="hover:text-red-500 cursor-pointer" />
                <FaRegCompass className="hover:text-blue-500 cursor-pointer" />
                <FaPlusSquare className="hover:text-purple-500 cursor-pointer" />
            </div>

            {/* Post Caption */}
            <div className="px-3 pb-4 text-sm">
                <p>
                    <span className="font-semibold mr-2">{postOwner.user}</span>
                    {/* {post.caption} */}
                </p>
            </div>
        </>
    )
}

export default Post