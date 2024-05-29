import React from 'react'
import "./adduser.css"
import { collection, query, where, getDoc, getDocs, setDoc, serverTimestamp, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import { useState } from 'react';
import { useUserStore } from '../../../../lib/userStore';

const Adduser = () => {
  const [user, setUser] = useState(null);
  const {currentUser} = useUserStore();
  const handleSearch = async e => {
    e.preventDefault();
    const formdata = new FormData(e.target)
    const username = formdata.get("username");
    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setUser(querySnapshot.docs[0].data());
        
      }
    } catch (err) {
      console.log(err);
    }
  }
  const handleAdd = async() => {
    const Chatref = collection(db, "chats")
    const userChatref = collection(db, "userchats")
    try {
      const newChatRef = doc(Chatref)
      await setDoc(newChatRef,{
        createdAt: serverTimestamp(),
        messages: [],
      });
      console.log(newChatRef.id)
     
      await setDoc(doc(userChatref, user.id),{
        chats: arrayUnion({
          chatId: newChatRef.id ,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: Date.now(),

        }),
      });
      await updateDoc(doc(userChatref, currentUser.id),{
        chats: arrayUnion({
          chatId: newChatRef.id ,
          lastMessage: "",
          receiverId: user.id,
          updatedAt: Date.now(),

        }),
      });

    } catch (err) {
      console.log(err)
      
    }

  }
  return (
    <div className="adduser">
      <form onSubmit={handleSearch}>
        <input type="text" name="username" placeholder="username" />
        <button className="formsearch">Search</button>
      </form>
      {user && <div className="ausers">
        <div className="adetails">
          <img src={user.avatar || "./avatar.png"} alt="" />
          <span>{user.username}</span>
        </div>
        <button onClick={handleAdd}>Add</button>
      </div>}
    </div>
  )
}

export default Adduser
