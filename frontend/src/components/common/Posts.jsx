import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "../../constant/url";

const Posts = () => {

	const { data: posts, isLoading, refetch, isRefetching } = useQuery({
		queryKey: ["posts"],
		queryFn: async () => {
			try {
				const res = await fetch(`${baseUrl}/api/posts/all`, {
					method: "GET",
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
		}
	})

	useEffect(() => {
		refetch()
	}, [refetch])

	return (
		<>
			{(isLoading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching && posts?.length === 0 && (
				<p className='text-center my-4'>No posts in this tab. Switch 👻</p>
			)}
			{!isLoading && !isRefetching && posts && (
				<div className="flex flex-col">
					{posts.map((post, index) => (
						<Post key={post._id} post={post} />
					))}
					{/* Divider */}

				</div>
			)}
		</>
	);
};
export default Posts;