import './chatlist.css';
import { useState, useEffect } from 'react';
import Adduser from './adduser/Adduser';
import { useUserStore } from '../../../lib/userStore';
import { onSnapshot, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useChatStore } from '../../../lib/chatStore';


const Chatlist = () => {
  const [chats, setChats] = useState([]);
  const [addMode, setAddMode] = useState(false);
  const { currentUser } = useUserStore();
  const [input, setinput] = useState("");
  const { chatId, changeChat } = useChatStore();
  console.log(chatId);
  useEffect(() => {
    if (!currentUser?.id) return;

    const unsub = onSnapshot(doc(db, "userchats", currentUser.id), async (snapshot) => {
      const data = snapshot.data();
      if (!data) return;

      const items = data.chats || [];
      const promises = items.map(async (item) => {
        const userDocRef = doc(db, "users", item.receiverId);
        const userDocSnap = await getDoc(userDocRef);
        const user = userDocSnap.data();
        return { ...item, user };
      });

      const chatData = await Promise.all(promises);
      setChats(chatData.sort((a, b) => b.updateAt - a.updateAt));
    });

    return () => {
      unsub();
    };
  }, [currentUser?.id]);
  const handleSelect = async (chat) => {
    const userChats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });
    const chatIndex = userChats.findIndex((item) => item.chatId === chat.chatId);
    userChats[chatIndex].isSeen = true;
    const userchatRef = doc(db, "userchats", currentUser.id);
    try {
      await updateDoc(userchatRef,{
        chats: userChats,
      });
      changeChat(chat.chatId, chat.user);
      
    } catch (err) {
      console.log(err);
    };

  };
  const filteredChats = chats.filter((c)=>c.user.username.toLowerCase().includes(input.toLowerCase()));
  return (
    <div className="chatlist">
      <div className="search">
        <div className="searchbar">
          <img src="./search.png" alt="Search" />
          <input type="text" placeholder="Search" onChange={(e)=>setinput(e.target.value)}/>
        </div>
        <img
          src={addMode ? "./minus.png" : "./plus.png"}
          alt="Toggle Add Mode"
          className="add"
          onClick={() => setAddMode((prev) => !prev)}
        />
      </div>
      {filteredChats.map((chat) => (
        <div className="items" key={chat.chatId} onClick={() => handleSelect(chat)}
          style={{ backgroundColor: chat?.isSeen ? "transparent" : "#5183fe" }}>
          <img src={chat.user.blocked.includes(currentUser.id)? "./avatar.png" : chat.user.avatar || "./avatar.png"} alt="Avatar" />
          <div className="texts">
            <span>{chat.user.blocked.includes(currentUser.id)? "User" : chat.user.username }</span>
            <p>{chat.lastMessage || "No message"}</p>
          </div>
        </div>
      ))}
      {addMode && <Adduser />}
    </div>
  );
};

export default Chatlist;
