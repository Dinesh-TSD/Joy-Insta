import { useEffect, useRef, useState } from "react";
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
import { baseUrl } from "../../constant/url";

const ReelItem = ({ reel, isVisible, globalMute, setGlobalMute }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Handle play/pause based on visibility and sync mute
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Sync mute
    video.muted = globalMute;

    // Play or pause
    if (isVisible) {
      video.play().catch(() => { });
    } else {
      video.pause();
    }

    // Listen to play/pause events
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, [isVisible, globalMute]);

  // Toggle global mute for all videos
  const handleMuteToggle = (e) => {
    e.stopPropagation();
    setGlobalMute((prev) => !prev);
    document.querySelectorAll("video").forEach((v) => {
      v.muted = !globalMute;
    });
  };

  // Toggle play/pause for this video
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => { });
    else video.pause();
  };

  return (
    <div className="snap-start h-[95vh] w-full relative flex justify-center items-center">
  {/* Video Container */}
  <div
    className="
       relative w-[300px] h-[90vh] rounded-sm overflow-hidden bg-transparent
    cursor-pointer
    shadow-[0_0_8px_rgba(0,255,247,0.5),0_0_16px_rgba(0,255,247,0.4),0_0_32px_rgba(0,255,247,0.3)]
    transition-shadow duration-200 ease-in-out
    hover:shadow-[0_0_12px_rgba(0,255,247,0.7),0_0_24px_rgba(0,255,247,0.6),0_0_48px_rgba(0,255,247,0.5)]
    "
    onClick={togglePlay}
  >
    {/* Soft radial glow layer */}
    <div
      className="
        absolute -inset-1/2
        w-[200%] h-[200%]
        bg-[radial-gradient(ellipse_at_center,rgba(0,255,247,0.2),transparent_70%)]
        blur-[30px]
        pointer-events-none
      "
    />

    {/* Video Element */}
    <video
      ref={videoRef}
      src={`${baseUrl}${reel.fileUrl}`}
      data-id={reel._id}
      className="w-full h-full object-cover reel-video"
      loop
      playsInline
      controls={false}
    />

    {/* Play Icon (when paused) */}
    {!isPlaying && (
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
        <div className="bg-[#0303037a] p-4 rounded-full">
          <FaPlay className="text-white text-3xl" />
        </div>
      </div>
    )}

    {/* Mute/Unmute Button */}
    <button
      onClick={handleMuteToggle}
      className="absolute top-3 right-3 z-10 bg-black bg-opacity-60 p-2 rounded-full text-white"
    >
      {globalMute ? <FaVolumeMute size={18} /> : <FaVolumeUp size={18} />}
    </button>

    {/* Caption & Info */}
    <div className="absolute bottom-10 left-10 text-white max-w-sm">
      <h4 className="font-bold text-lg">@{reel.user.username}</h4>
      <p className="text-sm">{reel.user.caption}</p>
    </div>
  </div>

  {/* Right Sidebar Icons */}
  <div className="absolute bottom-10 right-80 flex flex-col gap-4 text-white text-xl items-center">
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
