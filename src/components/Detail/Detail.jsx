import './Detail.css'
import { auth, db } from '../../lib/firebase'
import { useChatStore } from '../../lib/chatStore'
import { useUserStore } from '../../lib/userStore';
import { updateDoc, doc, arrayRemove, arrayUnion } from 'firebase/firestore';

const Detail = () => {
  const { chatId, user, isCurrentUserBlocked, isReceiverUserBlocked } = useChatStore();
  const { currentUser } = useUserStore();
  const handleBlock = async () => {
    if (!user) return;
    const userDocRef = doc(db, "users", currentUser.id)
    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverUserBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
    } catch (err) {
      console.log(err);
    }


  }
  return (
    <div className="Detail">
      <div className="detaileduser">
        <img src={user?.avatar || "/avatar.png"} />
        <h2>{user?.username}</h2>
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aperiam, ut.</p>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Privacy and help</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Photos</span>
            <img src="./arrowDown.png" alt="" />
          </div>
          <div className="photos">
            <div className="photoitems">
              <div className="photodetails">
                <img src="./Koala.jpg" alt="" />
                <span>photo of 2024</span>
              </div>
              <img src="./download.png" alt="" className="icon" />
            </div>
            <div className="photoitems">
              <div className="photodetails">
                <img src="./Koala.jpg" alt="" />
                <span>photo of 2024</span>
              </div>
              <img src="./download.png" alt="" className="icon" />
            </div>
            <div className="photoitems">
              <div className="photodetails">
                <img src="./Koala.jpg" alt="" />
                <span>photo of 2024</span>
              </div>
              <img src="./download.png" alt="" className="icon" />
            </div>
            <div className="photoitems">
              <div className="photodetails">
                <img src="./Koala.jpg" alt="" />
                <span>photo of 2024</span>
              </div>
              <img src="./download.png" alt="" className="icon" />
            </div>
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared files</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <button onClick={handleBlock}>{
          isCurrentUserBlocked ? "You're Blocked!" : isReceiverUserBlocked ? "User Blocked" : "Block User"
        }</button>
        <button className="logout" onClick={() => auth.signOut()}>Logout</button>
      </div>
    </div>

  )
}

export default Detail
