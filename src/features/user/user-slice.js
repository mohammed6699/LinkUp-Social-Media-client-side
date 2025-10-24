// create user slice

import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import API from "../../api/axios";
import toast from "react-hot-toast";

const initialState = {
    value: null
}
// get users
export const fetchUser = createAsyncThunk('user/fetchUser', async(token) => {
    const {data} =  await API.get('/api/user', {
        headers: {Authorization: token}
    })
    return data.success ? data.user : null
})
export const updateUser = createAsyncThunk('user/updateUser', async ({userdata, token}) => {
    const {data} = await API.post('/api/update', userdata, { headers: {Authorization: token}
    })
    if(data.success){
        toast.success(data.message)
        return data.user
    }else{
        toast.error(data.message)
        return null
    }
})

export const followUser = createAsyncThunk('user/followUser', async ({ token, id }) => {
    const { data } = await API.post('/api/follow', { id }, {
        headers: { Authorization: token }
    });
    if (data.success) {
        toast.success(data.message);
        return data;
    } else {
        toast.error(data.message);
        return null;
    }
});

export const unfollowUser = createAsyncThunk('user/unfollowUser', async ({ token, id }) => {
    const { data } = await API.post('/api/unfollow', { id }, {
        headers: { Authorization: token }
    });
    if (data.success) {
        toast.success(data.message);
        return data;
    } else {
        toast.error(data.message);
        return null;
    }
});

export const sendConnectionRequest = createAsyncThunk('user/sendConnectionRequest', async ({ token, id }) => {
    const { data } = await API.post('/api/connect', { id }, {
        headers: { Authorization: token }
    });
    if (data.success) {
        toast.success(data.message);
        return data;
    } else {
        toast.error(data.message);
        return null;
    }
});

export const acceptConnectionRequest = createAsyncThunk('user/acceptConnectionRequest', async ({ token, id }) => {
    const { data } = await API.post('/api/accept', { id }, {
        headers: { Authorization: token }
    });
    if (data.success) {
        toast.success(data.message);
        return data;
    } else {
        toast.error(data.message);
        return null;
    }
});

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers:{
        setDummyUser: (state, action) => {
            state.value = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUser.fulfilled, (state, action) => {
            state.value = action.payload
        }).addCase(updateUser.fulfilled, (state, action) => {
            state.value = action.payload
        })
        .addCase(followUser.fulfilled, (state, action) => {
            if (action.payload) {
                state.value.following.push(action.meta.arg.id);
            }
        })
        .addCase(unfollowUser.fulfilled, (state, action) => {
            if (action.payload) {
                state.value.following = state.value.following.filter(id => id !== action.meta.arg.id);
            }
        })
    }
})

export default userSlice.reducer;