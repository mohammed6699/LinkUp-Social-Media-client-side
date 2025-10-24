import { BadgeCheck, Heart, MessageCircle, Share2 } from 'lucide-react';
import moment from 'moment';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '@clerk/clerk-react';
import { likePost, addComment, sharePost } from '../features/posts/post-slice';

function PostCard({ post }) {
    const content = post?.content || '';
    const postWithHags = content.replace(/#(\w+)/g, '<span class="text-indigo-500 cursor-pointer">#$1</span>');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { getToken } = useAuth();
    const currentUser = useSelector(state => state.user.value);
    const [commentText, setCommentText] = useState('');
    const [showComments, setShowComments] = useState(false);

    const handleLike = async () => {
        const token = await getToken();
        if (!post?._id) return;
        dispatch(likePost({ token, postId: post._id }));
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (commentText.trim() === '') return;
        const token = await getToken();
        if (!post?._id) return;
        dispatch(addComment({ token, postId: post._id, text: commentText }));
        setCommentText('');
    };

    const handleShare = async () => {
        const token = await getToken();
        if (!post?._id) return;
        dispatch(sharePost({ token, postId: post._id }));
    };

    return (
        <div className='bg-white border-xl shadow p-4 mt-4 mb-4 w-full max-w-2xl'>
            {/* user info */}
            <div
                onClick={() => post?.user && navigate(`/profile/${post.user._id}`)}
                className='inline-flex items-center gap-3 cursor-pointer'>
                <img
                    src={post.user.profile_picture}
                    alt='user profile picture'
                    className='w-10 h-10 rounded-full shadow'
                />
                {/* user name and post date */}
                <div>
                    <div className='flex items-center space-x-1'>
                        <span>
                            {post.user?.full_name}
                            <BadgeCheck className='w-4 h-4 text-blue-500' />
                        </span>
                    </div>
                    <div className='text-gray-500 text-sm'>
                        @{post.user?.username}{post.createdAt ? ` · ${moment(post.createdAt).fromNow()}` : ''}
                    </div>
                </div>
            </div>
            {/* content  */}
            {post.content && <div
                className='text-gray-600 text-sm whitespace-pre-line p-2'
                dangerouslySetInnerHTML={{ __html: postWithHags }}
            />}
            {/* Images */}
            <div className='grid grid-cols-2 gap-2'>
                {(post.Image_urls || []).map((image, index) => (
                    <img src={image} key={index}
                        alt='post images'
                        className={`w-full h-48 object-cover rounded-lg ${(post.Image_urls || []).length === 1 ? 'col-span-2 h-auto' : ''}`} />
                ))}
            </div>
            {/* action buttons */}
            <div className='flex items-center gap-4 text-gray-600 text-sm p-2 border-t border-gray-300'>
                <div className='flex items-center gap-1'>
                    <Heart
                        onClick={handleLike}
                        className={`w-4 h-4 cursor-pointer ${(Array.isArray(post.like_count) && currentUser?._id && post.like_count.includes(currentUser._id)) ? 'text-red-600 fill-red-600' : ''}`} />
                    <span>{Array.isArray(post.like_count) ? post.like_count.length : 0}</span>
                </div>
                <div className='flex items-center gap-1'>
                    <MessageCircle
                        onClick={() => setShowComments(!showComments)}
                        className='w-4 h-4 cursor-pointer' />
                    <span>{Array.isArray(post.comments) ? post.comments.length : 0}</span>
                </div>
                <div className='flex items-center gap-1'>
                    <Share2
                        onClick={handleShare}
                        className={`w-4 h-4 cursor-pointer ${(Array.isArray(post.share_count) && currentUser?._id && post.share_count.includes(currentUser._id)) ? 'text-blue-600' : ''}`} />
                    <span>{Array.isArray(post.share_count) ? post.share_count.length : 0}</span>
                </div>
            </div>
            {/* Comment Section */}
            {showComments && (
                <div className="p-2">
                    <form onSubmit={handleComment} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Add a comment..."
                            className="w-full p-2 border rounded-lg"
                        />
                        <button type="submit" className="p-2 bg-indigo-500 text-white rounded-lg">Post</button>
                    </form>
                    <div className="mt-2 space-y-2">
                        {(post.comments || []).map((comment, index) => (
                            <div key={index} className="flex items-start gap-2">
                                <img
                                    src={comment.user?.profile_picture || ''}
                                    alt="user profile"
                                    className="w-8 h-8 rounded-full"
                                />
                                <div>
                                    <p className="text-sm font-semibold">{comment.user?.full_name}</p>
                                    <p className="text-xs text-gray-500">{comment.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default PostCard;