import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import Messages from "./pages/Messages";
import Connections from "./pages/Connections";
import Discover from './pages/Discover';
import Profile from './pages/Profile';
import CreatePost from "./pages/CreatePost";
import {useUser} from "@clerk/clerk-react"
import Layout from "./pages/Layout";
import { Toaster } from "react-hot-toast";
import ChatPage from "./pages/ChatPage";
export default function App() {
  const {user} = useUser();

  return (
   <>
   <Toaster />
    <Routes>
    {/* Your routes will go here */}
      <Route path="/" element={ !user ? <Login /> : <Layout />}>
          <Route index element={<Feed />}/>
          <Route path="messages" element={<Messages />}/>
          <Route path="messages/:userId" element={<ChatPage />} />
          <Route path="connections" element={<Connections />} />
          <Route path="discover" element={<Discover />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:profileId" element={<Profile />} />
          <Route path="create-post" element={<CreatePost />} />
          <Route path="chat-page" element={<ChatPage />} />
      </Route>
   </Routes>
   </>
  )
}