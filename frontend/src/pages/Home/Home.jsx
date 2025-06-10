import { FaHeart, FaPlusSquare, FaRegCompass } from 'react-icons/fa';
import Posts from '../../components/common/Posts'
import { useState } from "react";


const Home = () => {

  const [feedType, setFeedType] = useState("forYou");
const stories = [
  { id: 1, name: "Your Story", img: "https://i.pravatar.cc/150?img=1" },
  { id: 2, name: "alex", img: "https://i.pravatar.cc/150?img=2" },
  { id: 3, name: "jessy", img: "https://i.pravatar.cc/150?img=3" },
  { id: 4, name: "dinesh", img: "https://i.pravatar.cc/150?img=4" },
  { id: 5, name: "luke", img: "https://i.pravatar.cc/150?img=5" },
    { id: 6, name: "luke", img: "https://i.pravatar.cc/150?img=5" },
  { id: 7, name: "luke", img: "https://i.pravatar.cc/150?img=5" },

];

  return (
    <>
      {/* Main Feed */}
      <main className="flex-1 max-w-2xl mx-auto p-4">
        {/* Stories */}
        <div className="flex gap-4 overflow-x-auto mb-6">
          {stories.map((story) => (
            <div key={story.id} className="flex flex-col items-center min-w-[70px]">
              <img
                src={story.img}
                alt={story.name}
                className="h-16 w-16 rounded-full border-2 border-pink-500 object-cover"
              />
              <span className="text-xs mt-1 text-gray-700">{story.name}</span>
            </div>
          ))}
        </div>

        {/* Posts */}
       <Posts />

      </main>
    </>
  )
}

export default Home