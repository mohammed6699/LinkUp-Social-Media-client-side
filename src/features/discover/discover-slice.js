
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import API from "../../api/axios";

const initialState = {
    users: [],
    status: 'idle',
    error: null
}

export const fetchUsers = createAsyncThunk('discover/fetchUsers', async({token, input}) => {
    const {data} =  await API.post('/api/discover', {input}, {
        headers: {Authorization: token}
    })
    return data.success ? data.users : []
})

export const fetchUserProfile = createAsyncThunk('discover/fetchUserProfile', async ({ token, profileId }) => {
    const { data } = await API.get(`/api/profiles?profileId=${profileId}`, {
        headers: { Authorization: token }
    });
    return data.success ? data : null;
});

const discoverSlice = createSlice({
    name: 'discover',
    initialState,
    reducers:{

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.users = action.payload
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            .addCase(fetchUserProfile.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.status = 'succeeded';
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
    }
})

export default discoverSlice.reducer
