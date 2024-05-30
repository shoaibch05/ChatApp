import React, { useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useChatStore } from '../../lib/chatStore';
import './chatroom.css';

function CreateChatroom({ onCreate }) {
  const [newChatroomName, setNewChatroomName] = useState('');
  const changeChat = useChatStore(state => state.changeChat);

  const handleCreateChatroom = async () => {
    try {
      if (newChatroomName.trim()) {
        const chatroomsCollection = collection(db, 'chatrooms');
        const chatroomRef = await addDoc(chatroomsCollection, { name: newChatroomName });
        const newChatroom = { id: chatroomRef.id, name: newChatroomName };
        changeChat(newChatroom.id, { id: newChatroom.id, username: newChatroom.name, blocked: [] }, true);
        onCreate(newChatroom);
        setNewChatroomName('');
      }
    } catch (error) {
      console.error('Error creating chatroom:', error);
    }
  };

  return (
    <div className="create-chatroom">
      <h2>Create Chatroom</h2>
      <input
        type="text"
        value={newChatroomName}
        onChange={(e) => setNewChatroomName(e.target.value)}
        placeholder="Chatroom name"
      />
      <button onClick={handleCreateChatroom}>Create</button>
    </div>
  );
}

export default CreateChatroom;
