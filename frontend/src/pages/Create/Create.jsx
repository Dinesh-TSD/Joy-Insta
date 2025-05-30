import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { MdEmojiEmotions } from "react-icons/md";
import { RiImageAddFill } from "react-icons/ri";

const Create = ({ isOpen, onClose }) => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);

  const handleEmojiClick = (emojiData) => {
    setCaption((prev) => prev + emojiData.emoji);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handlePost = () => {
    // Submit post logic here (FormData + API call)
    console.log("Post Submitted:", { caption, image });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      <div className="bg-black w-[90vw] max-w-md rounded-xl p-4 relative shadow-xl border border-gray-200">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-2 right-2 text-xl text-gray-700">
          <IoClose />
        </button>

        <h2 className="text-lg font-semibold mb-3">Create a Post</h2>

        {/* Caption Area */}
        <textarea
          placeholder="Write a caption..."
          className="w-full border p-2 rounded-md resize-none mb-2"
          rows={3}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <div className="flex p-2">
          {/* Image Upload */}
          <RiImageAddFill
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mr-4 text-3xl"
          />
          {/* Emoji Toggle */}
          <button
            onClick={() => setShowEmoji(!showEmoji)}
            className="text-blue-500 text-sm mb-2"
          >
            <MdEmojiEmotions className="text-3xl" />
          </button>

          {/* Emoji Picker */}
          {showEmoji && (
            <div className="mb-2 max-h-[250px] overflow-y-auto">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}

        </div>

        {/* Submit Button */}
        <button
          onClick={handlePost}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md"
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default Create;
