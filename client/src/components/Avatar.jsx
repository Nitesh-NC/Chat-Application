import { PiUserCircle } from "react-icons/pi";
import { useSelector } from "react-redux";


const Avatar = ({userId, name, imageurl, width, height}) => {
  const onlineUser = useSelector(state => state?.user?.onlineUser)
    let avatarName = ""

    if(name){
      const splitName = name?.split(" ")

      if(splitName.length > 1){
        avatarName = splitName[0][0]+splitName[1][0]
      }else{
        avatarName = splitName[0][0]
      }
    }

    const isOnline = onlineUser.includes(userId)

  return (
    <>
        <div className="text-slate-800  rounded-full text-xl font-bold relative" style={{width : width+"px", height : height+"px" }}>
            {imageurl ? (
                <img src={imageurl} alt={name} width={width} height={height} className="overflow-hidden rounded-full"/>
            ):(
                name ? (
                    <div style={{width : width+"px", height : height+"px" }} className="overflow-hidden rounded-full flex justify-center items-center bg-slate-300">
                    {avatarName}
                    </div>
                ):(
                    <PiUserCircle size={width}/>
                )
            )
            }
            {isOnline && (
            <div className="bg-green-500 absolute p-1 bottom-2 right-0 z-10 rounded-full">
            </div>

            )}

        </div>
    </>
  )
}

export default Avatar