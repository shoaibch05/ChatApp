import List from './components/list/List'
import Chat from './components/Chat/Chat'
import Detail from './components/Detail/Detail'
import Login from './components/login/Login'
import Notification from './components/notification/Notification'
import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './lib/firebase'
import { useUserStore } from './lib/userStore'
import { useChatStore } from './lib/chatStore'
const App = () => {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const { chatId } = useChatStore();
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid)
    })
    return () => {
      unsub();
    }


  }, [fetchUserInfo]);

  if (isLoading) return <div className="loading">LOading....</div>;
  return (
    <div className='container'>
      {
        currentUser ? (
          <>
            <List />
            {chatId && <Chat />}
            {chatId && <Detail />}
          </>
        ) : (<Login />)
      }
      <Notification />
    </div>
  )
}

export default App