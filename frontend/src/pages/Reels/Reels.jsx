import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ReelItem from "../../components/common/ReelItem";
import { baseUrl } from "../../constant/url";

const Reels = () => {
  const [currentVisible, setCurrentVisible] = useState(null);
  const [globalMute, setGlobalMute] = useState(true);
  const observerRef = useRef(null);

  const { data: reels = [] } = useQuery({
    queryKey: ["reels"],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/api/posts/allreels`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch reels");
      return data;
    },
  });

  useEffect(() => {
    // Create observer once
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setCurrentVisible(entry.target.dataset.id);
            }
          });
        },
        { threshold: 0.75 }
      );
    }

    const videos = document.querySelectorAll(".reel-video");
    videos.forEach((video) => observerRef.current.observe(video));

    return () => {
      observerRef.current.disconnect();
    };
  }, [reels]);

  return (
    <div className="reels-container h-screen w-full overflow-y-scroll snap-y snap-mandatory">
      {reels.map((reel) => (
        <ReelItem
          key={reel._id}
          reel={reel}
          isVisible={currentVisible === reel._id}
          globalMute={globalMute}
          setGlobalMute={setGlobalMute}
        />
      ))}
    </div>
  );
};

export default Reels;
