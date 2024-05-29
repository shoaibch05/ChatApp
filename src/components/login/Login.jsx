import React from 'react';
import "./login.css";
import { useState } from 'react';
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import upload from '../../lib/upload';

const Login = () => {
  const[avatar, setavatar] = useState({
    file: null,
    url: ""
  });
  const [loading, setloading] =  useState(false)
  const handleavatar = e =>{
    if(e.target.files[0]){
      setavatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0])
      })

    }
  }
  const handlelogin = async e => {
    e.preventDefault()
    setloading(true)
    const formData = new FormData(e.target)
    const {email, password} =  Object.fromEntries(formData);
    try {
      await signInWithEmailAndPassword(auth, email, password)
      toast.success("login Sucess")
    } catch (err) {
      console.log(err)
      toast.error(err.message)
      
    }finally{
      setloading(false)
    }
    
  }
  const handleRegister = async e => {
    e.preventDefault()
    setloading(true)
    const formData = new FormData(e.target)
    const {username, email, password} =  Object.fromEntries(formData);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password)
      const imgUrl = await upload(avatar.file)

      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        avatar: imgUrl,
        id: res.user.uid,
        blocked: []
      });
      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: []
      });
      toast.success("Account Created Successfully!")
      
    } catch (err) {
      console.log(err)
      toast.error(err.message)
      
    }finally{
      setloading(false)
    }
    
  }
  return (
    <div className= "login">
      <div className="item">
        <h1>Welcome Back!</h1>
        <form action="" onSubmit={handlelogin}>
          <input type="email" name="email" placeholder="Email" id=""/>
          <input type="password" name="password" placeholder="password" id=""/>
          <button disabled = {loading}>{loading ? "Loading": "Sign in"}</button>
        </form>
      </div>
      <div className="seprator"></div>
      <div className="item">
      <h1>Create an Account!</h1>
        <form onSubmit= {handleRegister}>
          <img src={avatar.url || "./avatar.png"} alt=""/>
          <label htmlFor="file">Upload Photo</label>
          <input type="file" name="file" id="file" style={{display:"none"}} onChange={handleavatar}/>
          <input type="text" name="username" placeholder="Username" id=""/>
          <input type="email" name="email" placeholder="Email" id=""/>
          <input type="password" name="password" placeholder="password" id=""/>
          <button disabled = {loading}>{loading ? "Loading" : "Sign up"}</button>
        </form>
      </div>
    </div>
  )
}

export default Login
