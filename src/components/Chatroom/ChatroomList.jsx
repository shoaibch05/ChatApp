import React, { useState, useEffect } from 'react';
import { useChatStore } from '../../lib/chatStore';
import { useUserStore } from '../../lib/userStore';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import './chatroom.css';

function ChatroomList({ onSelectChatroom }) {
  const [chatrooms, setChatrooms] = useState([]);
  const changeChat = useChatStore(state => state.changeChat);
  const currentUser = useUserStore(state => state.currentUser);

  useEffect(() => {
    const fetchChatrooms = async () => {
      try {
        const chatroomsCollection = collection(db, 'chatrooms');
        const chatroomsSnapshot = await getDocs(chatroomsCollection);
        const fetchedChatrooms = chatroomsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setChatrooms(fetchedChatrooms);
      } catch (error) {
        console.error('Error fetching chatrooms:', error);
      }
    };

    fetchChatrooms();
  }, []);

  const handleChatroomSelect = (chatroom) => {
    changeChat(chatroom.id, { id: chatroom.id, username: chatroom.name, blocked: [] });
    onSelectChatroom(chatroom.id);
  };

  return (
    <div className="roomlist">
      <h2>Chatrooms</h2>
      <ul className="chatroom-list">
        {chatrooms.map(chatroom => (
          <li key={chatroom.id} onClick={() => handleChatroomSelect(chatroom)}>
            {chatroom.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChatroomList;
