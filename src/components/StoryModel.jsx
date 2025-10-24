import { ArrowLeft, Sparkle, Text, TextIcon, Upload } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import { createStory, fetchStories } from "../features/stories/story-slice";

function StoryModel({ setShowModel }) {
    const bgColors = [
        '#111111',
        '#ffffff',
        "#6366f1", // Indigo (Tailwind indigo-500)
        "#8b5cf6", // Purple (Tailwind purple-500)
        "#64748b", // Slate (Tailwind slate-500)
        "#4f46e5", // Indigo (Tailwind indigo-600)
    ];
    const [model, setModel] = useState("text");
    const [background, setBackground] = useState(bgColors[0]);
    const [text, setText] = useState("");
    const [media, setMedia] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const dispatch = useDispatch();
    const { getToken } = useAuth();

    const handleMediaUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setMedia(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleCreateStory = async () => {
        const token = await getToken();
        const formData = new FormData();
        formData.append('media_type', model === 'text' ? 'text' : (media?.type.startsWith('image') ? 'image' : 'video'));
        formData.append('content', text);
        formData.append('background_color', background);
        if (media) {
            formData.append('media', media);
        }

        await dispatch(createStory({ token, storyData: formData })).unwrap();
        await dispatch(fetchStories(token));
        setShowModel(false);
    };

    return (
        <div className="fixed inset-0 z-110 min-h-screen bg-black/60 backdrop-blur text-white flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="text-center mb-4 flex items-center justify-between">
                    <button onClick={() => setShowModel(false)} className="text-white p-2 cursor-pointer">
                        <ArrowLeft />
                    </button>
                    <h2 className="text-lg font-medium">Create Story</h2>
                    <span className="w-10"></span>
                </div>
                {/* add to stories box if text, image, video*/}
                <div className="rounded*lg h-96 flex items-center justify-center relative" style={{ backgroundColor: background }}>
                    {model === 'text' && (
                        <textarea className="bg-transparent text-white w-full h-full p-6 text-lg resize-none focus:outline-none"
                            placeholder="what's on your mind?"
                            onChange={(e) => setText(e.target.value)}
                            value={text}
                        />
                    )}
                    {model === 'media' && previewUrl && (
                        media?.type.startsWith('image') ? (
                            <img src={previewUrl} alt="add image to your story" className="object-contain max-h-full" />
                        ) : (
                            <video src={previewUrl} className="object-contain max-h-full" />
                        )
                    )}
                </div>
                {/* to switch the background colors */}
                <div className="flex mt-4 gap-2">
                    {bgColors.map((color) => (
                        <button key={color} className="w-6 h-6 rounded-full ring cursor-pointer"
                            onClick={() => setBackground(color)}
                            style={{ backgroundColor: color }} />
                    ))}
                </div>
                {/* buttons for text and media */}
                <div className="flex mt-4 gap-2">
                    <button
                        onClick={() => { setModel('text'); setMedia(null); setPreviewUrl(null) }}
                        className={`flex-1 flex items-center justify-center gap-2 p-2 rounded ${model === 'text' ? 'bg-white text-black' : 'bg-black text-white'}`}>
                        <TextIcon size={18} />Text
                    </button>
                    <label className={`flex-1 flex items-center justify-center gap-2 p-2 cursor-pointer rounded ${model === 'media' ? 'bg-white text-black' : 'bg-black text-white'}`}>
                        <input
                            onChange={(e) => { handleMediaUpload(e); setModel('media') }}
                            type="file" accept="image/*, video/*" className="hidden" />
                        <Upload size={18} />photo/Video
                    </label>
                </div>
                {/* create story button */}
                <button
                    onClick={() => toast.promise(handleCreateStory(), {
                        loading: 'Creating story...',
                        success: 'Story created!',
                        error: 'Error creating story'
                    })}
                    className="flex mt-4 gap-2 p-2 w-full bg-blue-600 justify-center">
                    <Sparkle />Create Story
                </button>
            </div>

        </div>
    )
}

export default StoryModel;