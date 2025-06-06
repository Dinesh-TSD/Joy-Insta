import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { IoClose, IoCloseSharp } from "react-icons/io5";
import { MdEmojiEmotions } from "react-icons/md";
import { RiImageAddFill } from "react-icons/ri";
import { baseUrl } from "../../constant/url";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";

const Create = ({ isOpen, onClose }) => {
  const [caption, setCaption] = useState("");
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const imgRef = useRef(null);
  const [showEmoji, setShowEmoji] = useState(false);

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
  })
  const queryClient = useQueryClient();

  const { mutate: CreatePost, isError, isPending, error } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`${baseUrl}/api/posts/create`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ text, img })
        })
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Something went wrong");

        return data;
      } catch (error) {
        throw error
      }
    },
    onSuccess: () => {
      setText("")
      setImg(null)
      toast.success("post created")
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      onClose()
    }
  })


  const handleSubmit = (e) => {
    e.preventDefault();
    CreatePost({ text, img })
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      <div className="bg-black w-[90vw] max-w-md rounded-xl p-4 relative shadow-xl border border-gray-200">

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 text-xl text-gray-400 hover:text-white"
        >
          <IoClose />
        </button>

        <h2 className="text-lg font-semibold mb-3 text-white">Create a Post</h2>

        <div className="flex items-start gap-4 border-b border-gray-700 pb-4">
          {/* Avatar */}
          <div className="avatar">
            <div className="w-8 rounded-full">
              <img src={authUser?.profileImg || "/avatar-placeholder.png"} alt="Profile" />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full">
            {/* Textarea */}
            <textarea
              className="w-full p-0 text-lg resize-none bg-transparent border-none focus:outline-none text-white placeholder-gray-400"
              placeholder="What is happening?!"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />

            {/* Image Preview */}
            {img && (
              <div className="relative w-72 mx-auto">
                <IoCloseSharp
                  className="absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
                  onClick={() => {
                    setImg(null);
                    imgRef.current.value = null;
                  }}
                />
                <img
                  src={img}
                  alt="Preview"
                  className="w-full mx-auto h-72 object-contain rounded"
                />
              </div>
            )}

            {/* Controls */}
            <div className="flex justify-between border-t border-gray-700 pt-2 items-center">
              <div className="flex gap-2 items-center">
                {/* Image Picker */}
                <CiImageOn
                  className="text-white w-6 h-6 cursor-pointer"
                  onClick={() => imgRef.current.click()}
                />
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  ref={imgRef}
                  onChange={handleImgChange}
                />

                {/* Emoji Toggle */}
                <BsEmojiSmileFill
                  className="text-white w-5 h-5 cursor-pointer"
                  onClick={() => setShowEmoji(!showEmoji)}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 py-1 text-sm"
              >
                {isPending ? <LoadingSpinner /> : "Post"}
              </button>
            </div>

            {/* Emoji Picker */}
            {showEmoji && (
              <div className="mt-2 max-h-[250px] overflow-y-auto">
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}

            {/* Error Display */}
            {isError && <div className="text-red-500 text-sm">{error.message}</div>}
          </form>
        </div>
      </div>
    </div>


  );
};

export default Create;
