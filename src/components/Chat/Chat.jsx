import "./Chat.css";
import EmojiPicker from "emoji-picker-react";
import { useState, useEffect } from "react";
import { onSnapshot, doc, arrayUnion, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import upload from "../../lib/upload";

const Chat = () => {
  const [chat, setchat] = useState(false);
  const [open, setopen] = useState(false);
  const [text, settext] = useState("");

  const [img, setimg] = useState(
    {
      file: null,
      url: "",
    }
  );
  const { currentUser } = useUserStore();
  const { chatId, user, isCurrentUserBlocked, isReceiverUserBlocked } = useChatStore();

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setchat(res.data())
    });
    return () => {
      unSub();
    }
  }, [chatId]);

  const handleEmoji = e => {
    settext((prev) => prev + e.emoji);
    setopen(false);
  }

  const handleimg = e => {
    if (e.target.files[0]) {
      setimg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0])
      });
    }
  }

  const handleSend = async () => {
    if (text === "") return;
    let imgUrl = null;

    try {
      if (img.file) {
        imgUrl = await upload(img.file);
      }
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
        }),
      });

      const userIDs = [currentUser.id, user.id];
      userIDs.forEach(async (id) => {
        const userchatRef = doc(db, "userchats", id);
        const userchatsSnapshot = await getDoc(userchatRef);
        if (userchatsSnapshot.exists()) {
          const userChatsData = userchatsSnapshot.data();
          const chatIndex = userChatsData.chats.findIndex((c) => c.chatId === chatId);
          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();
          await updateDoc(userchatRef, {
            chats: userChatsData.chats,
          });
        }
      });

    }
    
    
    catch (err) {
      console.log(err);
    }
    setimg({
      file: null,
      url: ""
    });
    settext("");
  };

  return (
    <div className="Chat">
      <div className="top">
        <div className="userbar">
          <img src={user?.avatar || "./avatar.png"} alt="" />
          <div className="texts">
            <span>{user?.username}</span>
            <p>Lorem ipsum dolor sit.</p>
          </div>
        </div>
        <div className="uicons">
          <img src="./phone.png" alt="" />
          <img src="./video.png" alt="" />
          <img src="./info.png" alt="" />
        </div>
      </div>
      <div className="middle">
        {chat?.messages?.map(message => (
          <div className={message.senderId === currentUser.id ? "message own": "message"} key={message?.createdAt}>
            <div className={message.senderId === currentUser.id ? "Ownmessagetext": "messagetext"}>
              {message.img && <img src={message.img} alt="" />}
              <p>{message.text}</p>
              {/* <span>1 minute ago</span> */}
            </div>
          </div>
        ))
        }
        {img.url && <div className="message own">
          <div className="Ownmessagetext">
            <img src={img.url} alt="" />
          </div>
        </div>
        }
      </div>
      <div className="bottom">
        <div className="uicons">
          <label htmlFor="file">
            <img src="./img.png" alt="img" />
          </label>
          <input type="file" id="file" style={{ display: "none" }} onChange={handleimg} />
          <img src="./camera.png" alt="camera" />
          <img src="./mic.png" alt="mic" />
        </div>
        <input type="text" placeholder={(isCurrentUserBlocked || isReceiverUserBlocked)? "You cannot send message to this person" : "Type Your Message..."} value={text} onChange={(e) => settext(e.target.value)}  disabled={isCurrentUserBlocked || isReceiverUserBlocked} />
        <div className="emoji">
          <img src="./emoji.png" alt="emoji" onClick={() => setopen((prev) => !prev)} />
          <div className="picker">
            <EmojiPicker open={open} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <button className="sendbtn" onClick={handleSend} disabled={isCurrentUserBlocked || isReceiverUserBlocked}>Send</button>
      </div>
    </div>
  )
}

export default Chat;
