
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import uploadFile from "../helpers/uploadFile"
import axios from 'axios'
import toast from "react-hot-toast";
import { PiUserCircle } from "react-icons/pi";

const CheckEmailPage = () => {
  const [data, setData] = useState({
    email: "",
  });
  
  const navigate = useNavigate()

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
    const URL = `http://localhost:8080/api/email`


    try{
      const response = await axios.post(URL,data)
      // console.log("response", response)
      toast.success(response.data.message)

      if(response.data.success){
        setData({
          email: "",
        })
        navigate('/password',{
          state : response?.data?.data
        })
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
    <div className="w-fit mx-auto">
    <PiUserCircle size={80}/>
    </div>
      <h2 className="text-2xl font-semibold mb-4 text-center">Register</h2>
      <form onSubmit={handleSubmit}>        
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter email"
            className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={data.email}
            onChange={handleOnChange}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Continue
        </button>
      </form>
      <p className="my-3 text-center" >New user?<Link to={"/register"} className="hover:text-blue-400 font-semibold">Register</Link></p>
    </div>
  </div>
  )
}

export default CheckEmailPage