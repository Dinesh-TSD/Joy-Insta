// File: /pages/LoginPage.jsx (updated with boy/girl characters)
import { useState } from "react";
import { Link } from "react-router-dom";
import bgImage from '../../assets/bg.png';
import profile from '../../assets/profile.png';

import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import XSvg from '../../components/svgs/X';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { baseUrl } from "../../constant/url";
import toast from "react-hot-toast";
import { FaUser } from "react-icons/fa";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { FcGoogle } from 'react-icons/fc';

import BoyCharacter from '../../components/BoyCharacter';
import GirlCharacter from '../../components/GirlCharacter';

const Login = () => {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});

	const [isProposing, setIsProposing] = useState(false);
	const [proposalResult, setProposalResult] = useState('');

	const queryClient = useQueryClient();

	const { mutate, isPending, isError, error } = useMutation({
		mutationFn: async ({ username, password }) => {
			try {
				const res = await fetch(`${baseUrl}/api/auth/login`, {
					method: "POST",
					credentials: "include",
					headers: { "Content-type": "application/json" },
					body: JSON.stringify({ username, password }),
				});
				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Something went wrong");
			} catch (error) {
				throw error;
			}
		},
		onSuccess: () => {
			setProposalResult('accepted');
			toast.success("Login success");
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
		onError: () => {
			setProposalResult('rejected');
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		setIsProposing(true);
		setProposalResult('');
		mutate(formData);
		setTimeout(() => {
			setIsProposing(false);
		}, 2000);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	return (
		<div
			className="min-h-screen w-full flex items-center justify-center px-6 py-7 relative bg-cover bg-center"
			style={{ backgroundImage: `url(${bgImage})` }}
		>
			<div className="flex w-full max-w-6xl h-[540px] border border-[#00BFCF]/30 rounded-3xl overflow-hidden shadow-2xl shadow-[#00E0FF]/10">

				{/* Left: Boy Character */}
				<div className="w-1/3 hidden md:flex items-center justify-center bg-transparent">
					<BoyCharacter isProposing={isProposing} proposalResult={proposalResult} />
				</div>

				{/* Center: Login Form */}
				<div className="w-full md:w-1/3 p-10 flex flex-col justify-center animate-fade-right">
					<h2 className="text-[#00E0FF] text-4xl font-bold text-center mb-6 tracking-wide">Login</h2>

					<input
						type="text"
						name="username"
						placeholder="Enter your username"
						value={formData.username}
						onChange={handleInputChange}
						className="w-full px-4 py-3 mb-4 rounded-xl bg-[#1A1F2E]/90 text-[#C5EFFF] placeholder:text-[#8899AA] border border-[#00BFCF]/50 focus:outline-none focus:ring-2 focus:ring-[#00E0FF]/60 transition-all"
					/>

					<input
						type="password"
						name="password"
						placeholder="Enter your password"
						value={formData.password}
						onChange={handleInputChange}
						className="w-full px-4 py-3 mb-6 rounded-xl bg-[#1A1F2E]/90 text-[#C5EFFF] placeholder:text-[#8899AA] border border-[#00BFCF]/50 focus:outline-none focus:ring-2 focus:ring-[#00E0FF]/60 transition-all"
					/>

					<button
						type="submit"
						onClick={handleSubmit}
						className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00E0FF] to-[#00FFD1] text-[#0A0F1C] font-bold hover:from-[#00BFCF] hover:to-[#00E0FF] transition"
					>
						{isProposing ? 'Proposing...' : 'LOGIN & PROPOSE'}
					</button>

					<p className="text-center text-[#8899AA] mt-4 text-sm hover:underline cursor-pointer">
						Forgot password?
					</p>

					<div className="text-[#8899AA] text-center mt-6 text-sm">Don’t have an account?</div>
					<Link to='/signup'>
						<button
							type="button"
							className="mt-2 w-full py-3 rounded-xl bg-gradient-to-r from-[#00E0FF] to-[#00FFD1] text-[#0A0F1C] font-bold hover:from-[#00BFCF] hover:to-[#00E0FF] transition"
						>
							SIGN UP
						</button>
					</Link>


					<div className="flex items-center my-6">
						<hr className="flex-grow border-t border-[#00BFCF]/30" />
						<span className="px-2 text-[#8899AA] text-sm">OR</span>
						<hr className="flex-grow border-t border-[#00BFCF]/30" />
					</div>

					<button
						type="button"
						className="w-full py-3 flex items-center justify-center gap-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-100 transition"
					>
						<FcGoogle className="text-xl" />
						Continue with Google
					</button>
				</div>

				{/* Right: Girl Character */}
				<div className="w-1/3 hidden md:flex items-center justify-center bg-transparent">
					<GirlCharacter proposalResult={proposalResult} />
				</div>

			</div>
		</div>
	);
};

export default Login;
