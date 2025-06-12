import { BsThreeDots } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { baseUrl } from '../../constant/url'
import toast from "react-hot-toast";
import { formatPostDate } from "../../utils/date";
import PostActions from "./PostActions";

const Post = ({ post }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef();
    const queryClient = useQueryClient();

    // Close menu when clicking outside
    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    }, []);

    const { data: authUser } = useQuery({
        queryKey: ["authUser"],
        queryFn: async () => {
            const res = await fetch(`${baseUrl}/api/auth/me`, {
                method: "GET",
                credentials: "include",
                headers: { "Content-type": "application/json" }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Something went wrong");
            return data;
        },
    });

    const { mutate: deletePost } = useMutation({
        mutationFn: async () => {
            const res = await fetch(`${baseUrl}/api/posts/${post._id}`, {
                method: "DELETE",
                credentials: "include",
                headers: { "Content-Type": "application/json" }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Something went wrong");
            return data;
        },
        onSuccess: () => {
            toast.success("Post deleted");
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        }
    });

    const postOwner = post.user;
    const formattedDate = formatPostDate(post.createdAt);
    const isLiked = post.likes.includes(authUser?.user._id);

    return (
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
                {/* Menu */}
                <div className="relative" ref={menuRef}>
                    <button onClick={() => setMenuOpen(!menuOpen)}>
                        <BsThreeDots className="text-xl" />
                    </button>
                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 shadow-lg rounded-md z-50">
                            <button
                                onClick={deletePost}
                                className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Post Media */}
            <div className="mt-3 w-full max-h-[600px] overflow-hidden">
                {post.fileType === "image" ? (
                    <img src={`${baseUrl}${post.fileUrl}`} alt="post" className="w-full h-auto object-contain" />
                ) : (
                    <video controls src={`${baseUrl}${post.fileUrl}`} className="w-full h-auto object-contain" />
                )}
            </div>

            {/* Post Actions */}
            <PostActions post={post} currentUser={authUser.user} isLiked={isLiked} />

            {/* Caption */}
            <div className="px-3 pt-1 pb-1 text-sm text-[#C5EFFF]">
                <p>
                    <span className="font-semibold mr-2 text-white">{postOwner.username}</span>
                    {post.caption}
                </p>
            </div>

            {/* Comments and Timestamp */}
            <div className="px-3 text-sm text-[#8899AA] hover:underline cursor-pointer">
                View all {post.comments?.length || 0} comments
            </div>

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

            <div className="px-3 pt-1 pb-2 text-xs text-[#8899AA] uppercase">
                {new Date(post.createdAt).toLocaleDateString()}
            </div>
        </div>
    );
};

export default Post;
