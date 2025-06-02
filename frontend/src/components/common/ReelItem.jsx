import { useRef, useState } from "react";
import {
  FaHeart,
  FaComment,
  FaShare,
  FaBookmark,
  FaDownload,
  FaEllipsisV,
  FaPlay,
  FaVolumeMute,
  FaVolumeUp,
} from "react-icons/fa";

const ReelItem = ({ reel }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true); // 🔇 default muted

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation(); // prevent pausing when clicking mute icon
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  return (
    <div className="snap-start h-screen w-full relative flex justify-center items-center bg-black">
      {/* Video Wrapper */}
      <div
        className="relative w-[300px] h-[90vh] rounded-xl overflow-hidden shadow-lg border border-gray-700 cursor-pointer"
        onClick={togglePlay}
      >
        
        <video
          ref={videoRef}
          src={reel.videoUrl}
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted={isMuted}
          controls={false}
        />

        {/* Play/Pause Button Centered */}
        {!isPlaying && (
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="bg-[#0303037a]  p-4 rounded-full ">
              <FaPlay className="text-white text-3xl" />
            </div>
          </div>
        )}

        {/* Mute/Unmute Button */}
        <button
          onClick={toggleMute}
          className="absolute top-3 right-3 bg-black bg-opacity-50 p-2 rounded-full text-white"
        >
          {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
        </button>
      </div>

      {/* Caption & Info */}
      <div className="absolute bottom-10 left-10 text-white max-w-sm">
        <h4 className="font-bold text-lg">@{reel.username}</h4>
        <p className="text-sm">{reel.caption}</p>
      </div>

      {/* Sidebar Icons */}
      <div className="absolute bottom-20 right-10 flex flex-col gap-4 text-white text-xl items-center">
        <button><FaHeart /></button>
        <button><FaComment /></button>
        <button><FaShare /></button>
        <button><FaBookmark /></button>
        <button><FaDownload /></button>
        <button><FaEllipsisV /></button>
      </div>
    </div>
  );
};

export default ReelItem;
