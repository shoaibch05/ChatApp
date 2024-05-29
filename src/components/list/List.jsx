import './List.css'
import Userinfo from './userinfo/Userinfo'
import Chatlist from './chatlist/Chatlist'

const List = () => {
  return (
    <div className="List">
      <Userinfo />
      <Chatlist />
    </div>
  )
}

export default List
