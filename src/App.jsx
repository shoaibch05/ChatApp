import React, { useEffect } from 'react';
import List from './components/list/List';
import Chat from './components/Chat/Chat';
import Detail from './components/Detail/Detail';
import Login from './components/login/Login';
import Notification from './components/notification/Notification';
import ChatroomList from './components/Chatroom/ChatroomList';
import CreateChatroom from './components/Chatroom/CreateChatroom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import { useUserStore } from './lib/userStore';
import { useChatStore } from './lib/chatStore';
import './components/Chatroom/chatroom.css';

const App = () => {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const { chatId, isChatroom } = useChatStore();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });
    return () => {
      unsub();
    };
  }, [fetchUserInfo]);

  const handleCreateChatroom = (chatroom) => {
    // No need to call setChatId here as changeChat already sets the chatId
  };

  const chatroomClass = chatId && !isChatroom ? 'chatroom-squeeze' : 'chatroom';

  if (isLoading) return <div className="loading">Loading....</div>;
  return (
    <div className='container'>
      {currentUser ? (
        <>
          <List />
          {chatId && <Chat />}
          {chatId && !isChatroom && <Detail />}
          <div className={chatroomClass}>
            <CreateChatroom onCreate={handleCreateChatroom} />
            <ChatroomList onSelectChatroom={(chatId) => useChatStore.getState().changeChat(chatId, { id: chatId, username: 'Chatroom', blocked: [] }, true)} />
          </div>
        </>
      ) : (<Login />)}
      <Notification />
    </div>
  );
};

export default App;
