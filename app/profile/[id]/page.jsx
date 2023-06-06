"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import Profile from "@components/Profile";

const MyProfile = ({ params }) => {
    const [posts, setPosts] = useState([]);
    const searchParams = useSearchParams();
    const userName = searchParams.get('name');

	useEffect(() => {
		const fetchPosts = async () => {
			const response = await fetch(`/api/users/${params?.id}/posts`, {
				method: "GET",
				headers: {
					"Cache-Control": "no-store", // Disables caching
				}
			});
			const data = await response.json();
			console.log(data);
			setPosts(data);
		};

		if(params?.id) fetchPosts();
	}, [params.id]);

	return (
		<Profile
			name={userName}
			desc={`Welcome to ${userName}'s personalised profile page!\nExplore ${userName}'s exceptional prompts and be inspired by the power of their imagination`}
			data={posts}
		/>
	);
};

export default MyProfile;
