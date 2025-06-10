import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import { baseUrl } from "../../constant/url";

const CreatePost = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const fileRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const { mutate: createPost, isPending } = useMutation({
    mutationFn: async () => {
      try {
        const formData = new FormData();
        formData.append("text", text);
        if (file) {
          formData.append("file", file);
        }

        const res = await fetch(`${baseUrl}/api/posts/create`, {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Post creation failed");

        return data;
      } catch (err) {
        throw err;
      }
    },
    onSuccess: () => {
      toast.success("Post created!");
      setText("");
      setFile(null);
      setPreviewUrl("");
      fileRef.current.value = null;
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      onClose();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select an image or video file");
      return;
    }
    createPost();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);

    // Preview
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center">
      <div className="bg-[#f2f6ff] w-[90vw] max-w-md p-4 rounded-xl relative text-white shadow-2xl">
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-white text-xl"
          onClick={onClose}
        >
          <IoClose />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-black">Create Post</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Textarea */}
          <textarea
            className="bg-gray-800 rounded p-2 resize-none h-20 text-white"
            placeholder="Write something..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          {/* File Preview */}
          {previewUrl && (
            <div className="relative">
              {file.type.startsWith("video") ? (
                <video
                  src={previewUrl}
                  controls
                  className="w-full h-60 rounded mb-2"
                />
              ) : (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-64 object-contain rounded mb-2"
                />
              )}
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setPreviewUrl("");
                  fileRef.current.value = null;
                }}
                className="absolute top-1 right-1 bg-black bg-opacity-60 px-2 py-1 rounded text-sm"
              >
                Remove
              </button>
            </div>
          )}

          {/* File Input */}
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            ref={fileRef}
            className="file:bg-blue-600 file:text-white file:px-4 file:py-1 file:rounded file:border-0 bg-gray-900 p-1 rounded"
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="bg-blue-600 hover:bg-blue-700 py-2 rounded text-white font-medium"
          >
            {isPending ? "Posting..." : "Create Post"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
