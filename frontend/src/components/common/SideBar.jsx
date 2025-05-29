import { FaHome, FaSearch, FaRegHeart } from "react-icons/fa";
import { RiMessengerLine } from "react-icons/ri";
import { MdOutlineExplore, MdAddBox } from "react-icons/md";
import { BiMoviePlay } from "react-icons/bi";
import { HiMenu } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { baseUrl } from "../../constant/url";
import { useEffect, useRef, useState } from "react";
import { FaCog } from "react-icons/fa";
import { BiBarChart } from "react-icons/bi";
import { MdSwitchAccount } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


const SideBar = () => {
  const [showMore, setShowMore] = useState(false);
  const moreRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setShowMore(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const queryClient = useQueryClient();

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`${baseUrl}/api/auth/logout`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-type": "application/json"
          }
        })
        const data = await res.json();

        if (!res.ok) throw Error(data.error || "somthing went wrong")
      } catch (error) {
        throw error
      }
    },
    onSuccess: () => {
      queryClient.clear()
      toast.success("Logout success");
      navigate("/login");
    },
    onError: () => {
      toast.error("logout failed")
    }
  })

  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch(`${baseUrl}/api/auth/me`, {
          method: "GET",
          credentials: "include",

        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");

        return data;

      } catch (error) {
        throw error
      }
    }
  });

  return (
    <div className="fixed top-0 left-0 h-screen w-20 sm:w-64 bg-black text-white border-r border-gray-800 flex flex-col items-center sm:items-start py-4 px-2 z-50">

      {/* Instagram Logo or Name */}
      <div className="mb-8 w-full flex items-center justify-center sm:justify-start px-4">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Instagram_logo.svg"
          alt="Instagram"
          className="w-8 sm:hidden"
        />
        <h1 className="hidden sm:block text-2xl font-bold">Instagram</h1>
      </div>

      <SidebarItem icon={<FaHome />} label="Home" to="/" />
      <SidebarItem icon={<FaSearch />} label="Search" to="/search" />
      <SidebarItem icon={<MdOutlineExplore />} label="Explore" to="/explore" />
      <SidebarItem icon={<BiMoviePlay />} label="Reels" to="/reels" />
      <SidebarItem icon={<RiMessengerLine />} label="Messages" to="/messages" />
      <SidebarItem icon={<FaRegHeart />} label="Notifications" to="/notifications" />
      <SidebarItem icon={<MdAddBox />} label="Create" to="/create" />
      <SidebarItem icon={<MdAddBox />} label="Dashboard" to="/dashboard" />


      {/* Profile Avatar */}
      <SidebarItem
        icon={
          <img
            src={authUser?.user.profileImg}
            alt="profile"
            className="w-6 h-6 rounded-full"
          />
        }
        label="Profile"
        to={`/profile/${authUser?.user.username}`}
      />

      {/* More Button */}
      <div className="relative mt-auto w-full px-2" ref={moreRef}>
        <button
          onClick={() => setShowMore(!showMore)}
          className="flex items-center space-x-4 w-full py-2 rounded-lg hover:bg-gray-800 transition-all cursor-pointer"
        >
          <div className="text-xl">
            <HiMenu />
          </div>
          <span className="hidden sm:block text-base">More</span>
        </button>

        {showMore && (
          <div className="absolute bottom-14 left-0 sm:left-2 w-64 bg-black text-white border border-gray-800 rounded-xl shadow-lg py-2 z-50">
            <DropdownItem icon={<FaCog />} label="Settings" />
            <DropdownItem icon={<BiBarChart />} label="Activity" />
            <DropdownItem icon={<MdSwitchAccount />} label="Switch Account" />
            <DropdownItem icon={<FiLogOut />} label="Logout" onClick={(e) => {
              e.preventDefault();

              // Immediate UI update
              queryClient.clear(); // Clear cached data right away
              navigate("/login");  // Redirect instantly
              logout();
            }} />
          </div>
        )}
      </div>

    </div>
  );
};

const SidebarItem = ({ icon, label, to }) => (
  <Link
    to={to}
    className="flex items-center space-x-4 w-full px-2 py-4 rounded-lg hover:bg-gray-800 transition-all cursor-pointer"
  >
    <div className="text-xl">{icon}</div>
    <span className="hidden sm:block text-sm font-medium">{label}</span>
  </Link>
);

const DropdownItem = ({ icon, label, to, onClick }) => {
  if (to) {
    return (
      <Link
        to={to}
        className="flex items-center space-x-4 w-full px-2 py-4 hover:bg-gray-800 rounded-lg transition-all text-sm"
      >
        <div className="text-xl">{icon}</div>
        <span className="text-base">{label}</span>
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className="flex items-center space-x-4 w-full px-2 py-4 hover:bg-gray-800 rounded-lg transition-all text-sm text-left"
    >
      <div className="text-xl">{icon}</div>
      <span className="text-base">{label}</span>
    </button>
  );
};



export default SideBar;
