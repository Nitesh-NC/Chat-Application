import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logout, setOnlineUser, setSocketConnection, setUser } from "../redux/userSlice";
import Sidebar from "../components/Sidebar";
import logo from "../assets/logo.jpg"
import io from "socket.io-client"

const Home = () => {
  const user = useSelector((state) => state.user);
  console.log("redux-user-data", user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  console.log('onlineuser',user)

  const fetchUserDetails = async () => {
    try {
      const URL = `http://localhost:8080/api/user-details`;
      const response = await axios({
        url: URL,
        withCredentials: true,
      });
      dispatch(setUser(response.data.data));
      // console.log("response user details",response)
      if (response.data.data.logout) {
        dispatch(logout());
        navigate("/email");
      }
    } catch (error) {
      console.log("error in response", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);
  //now to fetched data is transfer to other component so use redux


  // socket connection 
  useEffect(()=>{
    const socketConnection = io("http://localhost:8080",{
      auth : {
        token : localStorage.getItem('token')
      }
    })

    socketConnection.on('onlineUser',(data)=>{
      console.log(data)
      dispatch(setOnlineUser(data))
    })

    dispatch(setSocketConnection(socketConnection))

    return()=>{
      socketConnection.disconnect()
    }
  },[])

  const basePath = location.pathname === '/'
  return (
    <>
      <div className="grid lg:grid-cols-[300px,1fr] h-screen max-h-screen">
      <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
        <Sidebar/>
      </section>
        {/* display message component here which thats /id */}
        <section className={`${basePath && "hidden"}`}>
          {/* nested component  */}
          <Outlet />
        </section>
        <div className={`justify-center items-center flex-col gap-2 hidden ${!basePath ? "hidden" : "lg:flex" }`}>
            <div>
              <img
                src={logo}
                width={250}
                alt='logo'
              />
            </div>
            <p className='text-lg mt-2 text-slate-500'>Select user to send message</p>
        </div>
      </div>
    </>
  );
};

export default Home;
