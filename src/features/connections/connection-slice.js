// create user slice

import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import API from "../../api/axios";

const initialState = {
    connections: [],
    pendingConnections: [],
    followers: [],
    following: [],
    status: 'idle',
    error: null
}

export const fetchConnections = createAsyncThunk('connections/fetchConnections', async(token) => {
    const {data} =  await API.post('/api/connections', {}, {
        headers: {Authorization: token}
    })
    return data.success ? data : {}
})

const connectionSlice = createSlice({
    name: 'connections',
    initialState,
    reducers:{

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchConnections.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchConnections.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.connections = action.payload.connections || []
                state.pendingConnections = action.payload.pendingConnections || []
                state.followers = action.payload.followers || []
                state.following = action.payload.following || []
            })
            .addCase(fetchConnections.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
    }
})

export default connectionSlice.reducer