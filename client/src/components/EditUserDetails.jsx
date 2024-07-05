import { useEffect, useRef, useState } from "react";
import Avatar from "./Avatar";
import uploadFile from "../helpers/uploadFile";
import Divider from "./Divider";
import axios from "axios";
import toast from 'react-hot-toast'
import { setUser } from "../redux/userSlice";
import { useDispatch } from "react-redux";

const EditUserDetails = ({ onclose, user }) => {
  const [data, setData] = useState({
    name: user?.user || "",
    profile_pic: user?.profile_pic || "",
  });

  const uploadPhotoRef = useRef()
  const dispatch = useDispatch()

  // toset the name
  useEffect(() => {
    setData((preve) => {
      return {
        ...preve,
        ...user,
      };
    });
  }, [user]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const handleUploadPhoto = async (e) => {
    
    const file = e.target.files[0];

    const uploadPhoto = await uploadFile(file);

    setData((preve) => {
      return {
        ...preve,
        profile_pic: uploadPhoto?.url,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
        const URL = `http://localhost:8080/api/update-user`

        const response = await axios({
            method : 'post',
            url : URL,
            data : data,
            withCredentials : true
        })

        console.log('response',response)
        toast.success(response?.data?.message)
        
        if(response.data.success){
            dispatch(setUser(response.data.data))
            onclose()
        }
     
    } catch (error) {
        console.log(error)
        toast.error()
    }
  };

  const handleUploadOpenPhoto = (e) => {
    e.preventDefault();
    e.stopPropagation();
    uploadPhotoRef.current.click()
  }
  return (
    <>
      <div className="fixed top-0 bottom-0 right-0 left-0 bg-gray-700 bg-opacity-40 flex justify-center items-center z-10">
        <div className="bg-white p-4 py-6 m-1 rounded-lg w-full max-w-sm">
          <h2 className="font-semibold">Profile Details</h2>
          <p className="text-sm">edit user details</p>
          <form onSubmit={handleSubmit}>
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
              required
              value={data.name}
              onChange={handleOnChange}
            />
            <div className="my-1">
              <div>Photo</div>
              <div className="flex items-center gap-3">
                <Avatar
                  width={70}
                  height={70}
                  imageurl={data?.profile_pic}
                  name={data?.name}
                />
                <label
                  htmlFor="profile_pic"
                  className="block text-sm font-medium text-gray-700"
                >
                  <button className="font-semibold" onClick={handleUploadOpenPhoto}>change Pic</button>
                  <input
                    type="file"
                    id="profile_pic"
                    className="hidden"
                    onChange={handleUploadPhoto}
                    ref={uploadPhotoRef}
                  />
                </label>
              </div>
            </div>
            <Divider />
            <div className="flex gap-2 w-fit ml-auto mt-4">
              <button
                onClick={onclose}
                className="bg-red-500 hover:bg-red-800 p-2 rounded-lg text-white"
              >
                cancle
              </button>
              <button
                onClick={handleSubmit}
                className="bg-green-500 hover:bg-green-800 p-2 rounded-lg text-white"
              >
                save
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditUserDetails;
