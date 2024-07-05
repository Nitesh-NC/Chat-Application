import React from "react";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";

const UserSearchCard = ({user,onclose}) => {
  return (
    <Link to={"/"+user?._id} className='flex items-center gap-3 p-2 lg:p-4 border border-transparent border-b-slate-200 hover:border hover:bg-slate-200 rounded cursor-pointer'
    onClick={onclose}>
      <div>
        <Avatar
          width={50}
          height={50}
          name={user?.name}
          userId={user?._id}
          imageurl={user?.profile_pic}
        />
      </div>
      <div>
            <div className='font-semibold text-ellipsis line-clamp-1'>
                {user?.name}
            </div>
            <p className='text-sm text-ellipsis line-clamp-1'>{user?.email}</p>
        </div>
    </Link>
  );
};

export default UserSearchCard;
