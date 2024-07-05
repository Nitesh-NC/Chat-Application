import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import uploadFile from "../helpers/uploadFile"
import axios from 'axios'
import toast from "react-hot-toast";

const RegisterPage = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: "",
  });
  
  const [uploadPhoto, setUploadPhoto] = useState("")
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

  const handleUploadPhoto = async(e) =>{
    const file = e.target.files[0]

    const uploadPhoto = await uploadFile(file)
    // console.log("uploadPhoto",uploadPhoto)
    // now set the file in state 
    setUploadPhoto(file)

    setData((preve)=>{
      return {
        ...preve,
        profile_pic : uploadPhoto?.url
      }
    })
  }
  const handleClearUplaodPhoto = (e) => {
    setUploadPhoto(null)
    e.preventDefault()
    e.stopPropagation()
  }
  const handleSubmit = async(e) => {
    e.preventDefault()
    e.stopPropagation()

    // const URL = `${import.meta.env.VITE_BACKEND_URL}/api/register`
    const URL = `http://localhost:8080/api/register`


    try{
      const response = await axios.post(URL,data)
      console.log("response", response)
      toast.success(response.data.message)

      if(response.data.success){
        setData({
          name: "",
          email: "",
          password: "",
          profile_pic: "",
        })
        navigate('/email')
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
        <h2 className="text-2xl font-semibold mb-4 text-center">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter username"
              className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={data.name}
              onChange={handleOnChange}
              required
            />
          </div>
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
          <div className="mb-4">
            <label
              htmlFor="profile_pic"
              className="block text-sm font-medium text-gray-700"
            >
              Profile
              <div className="h-14 bg-slate-200 flex justify-center items-center border rounded hover:border-indigo-600 cursor-pointer ">
              <p className="text-sm max-w-[300px] text-ellipsis line-clamp-1">
              {uploadPhoto?.name ? uploadPhoto?.name : "Upload Profile Picture"}
              </p>
              {uploadPhoto?.name && (
                <button className="text-lg ml-4 hover:text-red-500"
              onClick={handleClearUplaodPhoto}><IoClose/></button>
              )}
              
              </div>
            </label>
            <input
              type="file"
              id="profile_pic"
              name="profile_pic"
              className="bg-slate-200 px-2 py-1 hidden"
              onChange={handleUploadPhoto}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Register
          </button>
        </form>
        <p className="my-3 text-center" >Already have account?<Link to={"/email"} className="hover:text-blue-400 font-semibold">Login</Link></p>
      </div>
    </div>
  );
};

export default RegisterPage;
