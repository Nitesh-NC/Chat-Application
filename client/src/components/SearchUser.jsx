import { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import Loading from "./Loading";
import UserSearchCard from "./UserSearchCard";
import toast from "react-hot-toast";
import axios from "axios";
import { IoClose } from "react-icons/io5";

const SearchUser = ({onclose}) => {
  const [searchUser, setSearchUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("")

  const handleSearchUser = async () =>{
    try{
        setLoading(true)
        const URL = `http://localhost:8080/api/search-user`
        const response = await axios.post(URL,{
            search : search
        })
        setLoading(false)
        setSearchUser(response.data.data)
    }
    catch(error){
        toast.error(error?.response?.data?.message)
    }
  }
  useEffect(()=>{
    handleSearchUser()
  },[search])

  console.log("searchUser",searchUser)
  return (
    <>
      <div className="fixed top-0 bottom-0 left-0 right-0 bg-slate-700 bg-opacity-40 p-2 z-10">
        <div className="w-full max-w-lg mx-auto mt-10">
          <div className="bg-white rounded h-14 overflow-hidden flex ">
            <input
              type="text"
              placeholder="search...."
              className="w-full outline-none pu-1 h-full px-4  "
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
            />
            <div className="h-14 w-14 flex justify-center items-center">
              <IoSearchOutline size={25} />
            </div>
          </div>

          {/* display sear use  */}
          <div className="bg-white mt-2 w-full p-4 rounded">
            {/**no user found */}
            {searchUser.length === 0 && !loading && (
              <p className="text-center text-slate-500">no user found!</p>
            )}
            {loading && (
                <p><Loading/></p>
            )}

             {searchUser.length !==0 && !loading && (
                searchUser.map((user, index)=>{
                    return(
                        <UserSearchCard key={user._id} user={user} onclose={onclose}/>
                    )
                })
             )}
          </div>
        </div>
        <div className='absolute top-0 right-0 text-2xl p-2 lg:text-4xl hover:text-white'
        onClick={onclose}>
            <button>
            <IoClose 
                size={20}
            />
            </button>
        </div>
      </div>
    </>
  );
};

export default SearchUser;