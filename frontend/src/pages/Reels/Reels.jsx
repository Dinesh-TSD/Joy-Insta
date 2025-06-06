import ReelItem from "../../components/common/ReelItem";
import sb from '../../assets/sb.mp4'

const Reels = () => {

  const dummyReels = [
  {
    id: 1,
    videoUrl: `${sb}`,
    username: "dinesh.dev",
    caption: "Life is a journey 🚀",
    likes: 100,
  },
  {
    id: 2,
    videoUrl: "/videos/reel2.mp4",
    username: "code_master",
    caption: "Another day, another bug 😅",
    likes: 250,
  },
];

  return (
    <div className="h-screen w-full bg-red-300 overflow-y-scroll snap-y snap-mandatory">
      {dummyReels.map((reel) => (
        <ReelItem key={reel.id} reel={reel} />
      ))}
    </div>
  )
}

export default Reels