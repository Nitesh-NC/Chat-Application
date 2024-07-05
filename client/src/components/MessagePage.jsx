import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Avatar from "./Avatar";
import { FaAngleLeft } from "react-icons/fa6";
import { ImAttachment } from "react-icons/im";
import { FaImage, FaVideo } from "react-icons/fa6";
import uploadFile from "../helpers/uploadFile";
import { IoClose } from "react-icons/io5";
import Loading from "./Loading";
import { RiSendPlaneFill } from "react-icons/ri";
import moment from "moment";

const MessagePage = () => {
  const params = useParams();
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );
  const user = useSelector((state) => state?.user);
  const [dataUser, setDataUser] = useState({
    name: "",
    email: "",
    profile_pic: "",
    online: false,
    _id: "",
  });
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
  });
  const [openImageVideoUpload, setImageVideoUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allMessage, setAllMessage] = useState([]);
  const currentMessage = useRef(null);

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [allMessage]);

  const handleUploadImageVideo = () => {
    setImageVideoUpload((preve) => !preve);
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];

    setLoading(true);
    const uploadPhoto = await uploadFile(file);
    setLoading(false);
    setImageVideoUpload(false);

    setMessage((preve) => {
      return {
        ...preve,
        imageUrl: uploadPhoto.url,
      };
    });
  };

  const handleClearUplloadImage = () => {
    setMessage((preve) => {
      return {
        ...preve,
        imageUrl: "",
      };
    });
  };

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];

    setLoading(true);
    const uploadPhoto = await uploadFile(file);
    setLoading(false);
    setImageVideoUpload(false);

    setMessage((preve) => {
      return {
        ...preve,
        videoUrl: uploadPhoto.url,
      };
    });
  };

  const handleClearUplloadVideo = () => {
    setMessage((preve) => {
      return {
        ...preve,
        videoUrl: "",
      };
    });
  };

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("message-page", params.userId);

      socketConnection.on("message-user", (data) => {
        // console.log("user-detailssss",data)
        setDataUser(data);
      });
      socketConnection.on("messages", (data) => {
        console.log("message data", data);
        setAllMessage(data);
      });
    }
  }, [socketConnection, params?.userId, user]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setMessage((preve) => {
      return {
        ...preve,
        text: value,
      };
    });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.text || message.imageUrl || message.videoUrl) {
      if (socketConnection) {
        socketConnection.emit("new message", {
          sender: user?._id,
          receiver: params?.userId,
          text: message?.text,
          imageUrl: message?.imageUrl,
          videoUrl: message?.videoUrl,
          msgByUserId: user?._id,
        });
        setMessage({
          text: "",
          imageUrl: "",
          videoUrl: "",
        });
      }
    }
  };
  return (
    <>
      <header className="sticky top-0 h-16 bg-white">
        <div className="flex items-center gap-4 px-4">
          <Link to={"/"} className="lg:hidden">
            <FaAngleLeft size={25} />
          </Link>
          <div>
            <Avatar
              width={50}
              height={50}
              imageurl={dataUser?.profile_pic}
              name={dataUser?.name}
              userId={dataUser._id}
            />
          </div>
          <div>
            <h3 className="font-semibold text-lg my-0">{dataUser?.name}</h3>
            <p className="-my-1">
              {dataUser.online ? (
                <span className="text-green-500">online</span>
              ) : (
                <span className="text-slate-500">ofline</span>
              )}
            </p>
          </div>
        </div>
      </header>

      {/* show all message   */}
      <section className="h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative">
        {/* all message  */}
        <div className="flex flex-col gap-2 mt-1 mx-2" ref={currentMessage}>
          {allMessage.map((msg, index) => {
            return (
              <div
              key={index}
                className={`bg-white p-1 py-1 rounded w-fit  max-w-[280px] md:max-w-sm lg:max-w-md ${
                  user._id === msg.msgByUserId ? "ml-auto bg-blue-200" : ""
                }`}
              >
                <div className="w-full">
                  {msg?.imageUrl && (
                    <img
                      src={msg?.imageUrl}
                      className="w-full h-full object-scale-down"
                    />
                  )}
                  
                  {msg?.videoUrl && (
                    <video 
                    src={msg?.videoUrl}
                    className="w-full h-full object-scale-down"
                    controls
                    autoPlay={false}
                    />
                  )}
                </div>
                <p className="px-2 ">{msg.text}</p>
                <p className="text-xs ml-auto w-fit">
                  {moment(msg.createdAt).format("hh:mm")}
                </p>
              </div>
            );
          })}
        </div>

        {/* upload image display  */}
        {message.imageUrl && (
          <div className="w-full h-full bg-slate-700 bg-opacity-40 flex justify-center items-center rounded overflow-hidden sticky bottom-0">
            <div
              onClick={handleClearUplloadImage}
              className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-500 "
            >
              <IoClose size={30} />
            </div>
            <div className="bg-white p-3 ">
              <img
                src={message.imageUrl}
                width={300}
                height={300}
                alt="uploadImage"
              />
            </div>
          </div>
        )}

        {/* upload video  */}
        {message.videoUrl && (
          <div className="w-full h-full bg-slate-700 bg-opacity-40 flex justify-center items-center rounded overflow-hidden sticky bottom-0">
            <div
              onClick={handleClearUplloadVideo}
              className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-500"
            >
              <IoClose size={30} />
            </div>
            <div className="bg-white p-3 ">
              <video
                src={message.videoUrl}
                width={600}
                height={400}
                alt="uploadVideo"
                controls
                muted
                autoPlay
              />
            </div>
          </div>
        )}

        {/* loading state  */}

        {loading && (
          <div className="w-full h-full flex justify-center items-center sticky bottom-0">
            <Loading />
          </div>
        )}
      </section>

      {/* inpit part  */}
      <section className="h-16 bg-white flex items-center px-4">
        <div className="relative  ">
          <button
            onClick={handleUploadImageVideo}
            className="flex justify-center items-center w-14 h-14 hover:text-slate-500"
          >
            <ImAttachment />
          </button>

          {/* vodeo and image  */}
          {openImageVideoUpload && (
            <div className="bg-white rounded absolute bottom-16 w-36 p-2">
              <form>
                <label
                  htmlFor="uploadImage"
                  className="flex items-center p-2 gap-3 hover:bg-slate-200 rounded cursor-pointer"
                >
                  <div className="text-blue-400">
                    <FaImage size={18} />
                  </div>
                  <p>Image</p>
                </label>
                <label
                  htmlFor="uploadVideo"
                  className="flex items-center p-2 gap-3 hover:bg-slate-200 rounded cursor-pointer"
                >
                  <div className="text-purple-400">
                    <FaVideo size={18} />
                  </div>
                  <p>Video</p>
                </label>
                <input
                  type="file"
                  id="uploadImage"
                  onChange={handleUploadImage}
                  className="hidden"
                />
                <input
                  type="file"
                  id="uploadVideo"
                  onChange={handleUploadVideo}
                  className="hidden"
                />
              </form>
            </div>
          )}
        </div>
        {/* input text box  */}
        <form onSubmit={handleSendMessage} className="h-full w-full flex gap-2">
          <input
            type="text"
            placeholder="Enter your Message..."
            className="py-2 px-4 outline-none h-full w-full bg-slate-50 rounded-lg"
            value={message.text}
            onChange={handleOnChange}
          />
          <button className="text-blue-400 hover:text-blue-500 p-2 ">
            <RiSendPlaneFill size={25} />
          </button>
        </form>
      </section>
    </>
  );
};

export default MessagePage;
