
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import API from "../../api/axios";
import toast from "react-hot-toast";

const initialState = {
    posts: [],
    status: 'idle',
    error: null
}

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async(token) => {
    const {data} =  await API.get('/api/post/feed', {
        headers: {Authorization: token}
    })
    return data.success ? data.posts : []
})

export const createPost = createAsyncThunk('posts/createPost', async({token, postData}) => {
    const {data} =  await API.post('/api/post/add', postData, {
        headers: {
            Authorization: token,
            'Content-Type': 'multipart/form-data'
        }
    })
    if(data.success) {
        toast.success(data.message)
        return data.post
    } else {
        toast.error(data.message)
        return null
    }
})

export const likePost = createAsyncThunk('posts/likePost', async({token, postId}) => {
    const {data} =  await API.post('/api/post/like', {postId}, {
        headers: {Authorization: token}
    })
    if(data.success) {
        return data.post
    } else {
        toast.error(data.message)
        return null
    }
})

export const addComment = createAsyncThunk('posts/addComment', async({token, postId, text}) => {
    const {data} =  await API.post('/api/post/comment', {postId, text}, {
        headers: {Authorization: token}
    })
    if(data.success) {
        return data.post
    } else {
        toast.error(data.message)
        return null
    }
})

export const sharePost = createAsyncThunk('posts/sharePost', async({token, postId}) => {
    const {data} =  await API.post('/api/post/share', {postId}, {
        headers: {Authorization: token}
    })
    if(data.success) {
        return data.post
    } else {
        toast.error(data.message)
        return null
    }
})

const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers:{

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPosts.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.posts = action.payload
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.posts.unshift(action.payload)
            })
            .addCase(likePost.fulfilled, (state, action) => {
                if(action.payload) {
                    const index = state.posts.findIndex(post => post._id === action.payload._id)
                    if(index !== -1) {
                        state.posts[index] = action.payload
                    }
                }
            })
            .addCase(addComment.fulfilled, (state, action) => {
                if(action.payload) {
                    const index = state.posts.findIndex(post => post._id === action.payload._id)
                    if(index !== -1) {
                        state.posts[index] = action.payload
                    }
                }
            })
            .addCase(sharePost.fulfilled, (state, action) => {
                if(action.payload) {
                    const index = state.posts.findIndex(post => post._id === action.payload._id)
                    if(index !== -1) {
                        state.posts[index] = action.payload
                    }
                }
            })
    }
})

export default postSlice.reducer;
