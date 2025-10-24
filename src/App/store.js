// create a story by using redux to handle the data from apis
import {configureStore} from '@reduxjs/toolkit'
import userSlice from './../features/user/user-slice.js';
import connectionSlice from './../features/connections/connection-slice.js';
import messageSlice from './../features/messages/message-slice.js';
import postSlice from '../features/posts/post-slice.js';
import storySlice from '../features/stories/story-slice.js';
import discoverSlice from '../features/discover/discover-slice.js';
export const Store = configureStore({
    reducer: {
        user: userSlice,
        connection: connectionSlice,
        messages: messageSlice,
        posts: postSlice,
        stories: storySlice,
        discover: discoverSlice
    }

})