import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import uploadFile from "../helpers/uploadFile"
import axios from 'axios'
import toast from "react-hot-toast";
import { PiUserCircle } from "react-icons/pi";
import Avatar from "../components/Avatar";
import { useDispatch } from "react-redux";
import { setToken } from "../redux/userSlice";

const CheckPasswordPage = () => {
  const [data, setData] = useState({
    password: "",
  });
  
  const navigate = useNavigate()
  const location = useLocation() // passing sata data from checkEMail
  const dispatch = useDispatch()
  // console.log("location",location.state)

  useEffect(()=>{
    if(!location?.state?.name){
      navigate('/email')
    }
  })

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((preve) => {
      return {
        ...preve,
        // insert value
        [name]: value,
      };
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault()
    e.stopPropagation()

    // const URL = `${import.meta.env.VITE_BACKEND_URL}/api/register`
    const URL = `http://localhost:8080/api/password`


    try{
      const response = await axios({
        method :'post',
        url : URL,
        data : {
          userId : location?.state?._id,
          password : data.password
        },
        withCredentials : true
      })
      // console.log("response", response)
      toast.success(response.data.message)

      if(response.data.success){
        dispatch(setToken(response?.data?.token))
        localStorage.setItem('token',response?.data?.token)
        setData({
          password: "",
        })
        navigate('/')
      }
    }
    catch(error){
      toast.error(error?.response?.data?.message)
      // console.log("error", error)
    }

    // console.log("data",data)
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="bg-white w-full max-w-sm mx-2 rounded-lg shadow-lg overflow-hidden p-6">
    <div className="w-fit mx-auto flex justify-center items-center flex-col">
    {/* <PiUserCircle size={80}/> */}
    <Avatar
      width={70}
      height={70}
      name={location?.state?.name}
      imageurl={location?.state?.profile_pic}
    />
    <h2 className="font-semibold text-lg mt-1">{location?.state?.name}</h2>
    </div>
      <form onSubmit={handleSubmit}>        
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter password"
            className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={data.password}
            onChange={handleOnChange}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          LogIn
        </button>
      </form>
      <p className="my-3 text-center" ><Link to={"/forgot-password"} className="hover:text-blue-400 font-semibold">Forgot Password</Link></p>
    </div>
  </div>
  )
}

export default CheckPasswordPage