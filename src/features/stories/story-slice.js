
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import API from "../../api/axios";

const initialState = {
    stories: [],
    status: 'idle',
    error: null
}

export const fetchStories = createAsyncThunk('stories/fetchStories', async(token) => {
    const {data} =  await API.get('/api/story/stories', {
        headers: {Authorization: token}
    })
    return data.success ? data.stories : []
})

export const createStory = createAsyncThunk('stories/createStory', async({token, storyData}) => {
    const {data} =  await API.post('/api/story/create', storyData, {
        headers: {
            Authorization: token,
            'Content-Type': 'multipart/form-data'
        }
    })
    if(data.success) {
        return data.story
    } else {
        return {}
    }
})

const storySlice = createSlice({
    name: 'stories',
    initialState,
    reducers:{

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchStories.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchStories.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.stories = action.payload
            })
            .addCase(fetchStories.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            .addCase(createStory.fulfilled, (state, action) => {
                // No longer updating state here. A refetch will be triggered from the component.
            })
    }
})

export default storySlice.reducer;
