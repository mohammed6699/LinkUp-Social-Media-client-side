// create user slice

import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import API from "../../api/axios";

const initialState = {
    messages: [],
    unreadCount: 0,
    status: 'idle',
    error: null
}

export const fetchRecentMessages = createAsyncThunk('messages/fetchRecentMessages', async(token) => {
    const {data} =  await API.get('/api/messages/recent', {
        headers: {Authorization: token}
    })
    return data.success ? data.messages : []
})

export const getChatMessages = createAsyncThunk('messages/getChatMessages', async ({ token, to_user_id }) => {
    const { data } = await API.post('/api/message/get', { to_user_id }, {
        headers: { Authorization: token }
    });
    return data.success ? data.messages : [];
});

export const getUnreadMessageCount = createAsyncThunk('messages/getUnreadMessageCount', async (token) => {
    const { data } = await API.get('/api/message/unread-count', {
        headers: { Authorization: token }
    });
    return data.success ? data.count : 0;
});

export const sendMessage = createAsyncThunk('messages/sendMessage', async ({ token, messageData }) => {
    const { data } = await API.post('/api/message/send', messageData, {
        headers: { Authorization: token }
    });
    return data.success ? data.message : null;
});

const messageSlice = createSlice({
    name: 'messages',
    initialState,
    reducers:{
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        // replace an optimistic message (temp id) with the server message
        replaceMessage: (state, action) => {
            const { tempId, message } = action.payload;
            const idx = state.messages.findIndex(m => m._id === tempId);
            if (idx !== -1) {
                state.messages[idx] = message;
            } else if (message) {
                // if we didn't find the temp message, just push the server message
                state.messages.push(message);
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRecentMessages.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchRecentMessages.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.messages = action.payload
            })
            .addCase(fetchRecentMessages.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            .addCase(getChatMessages.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getChatMessages.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.messages = action.payload;
            })
            .addCase(getUnreadMessageCount.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getUnreadMessageCount.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.unreadCount = action.payload;
            })
            .addCase(getUnreadMessageCount.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            
            
    }
})

export const { addMessage } = messageSlice.actions;
export default messageSlice.reducer;