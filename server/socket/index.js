const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");
const UserModel = require("../models/UserModel");
const {
  ConversationModel,
  MessageModel,
} = require("../models/ConversationModel");

const app = express();

// socket connection

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    Credential: true,
  },
});

//online user
const onlineUser = new Set();

io.on("connection", async (socket) => {
  console.log("connect user", socket.id);
  const token = socket.handshake.auth.token;

  //current user detail
  const user = await getUserDetailsFromToken(token);

  //create a room with that perticular id
  socket.join(user?._id?.toString());
  onlineUser.add(user?._id?.toString());

  io.emit("onlineUser", Array.from(onlineUser));

  socket.on("message-page", async (userId) => {
    console.log("message user", userId);
    const userDetails = await UserModel.findById(userId).select("-password");

    const payload = {
      _id: userDetails?._id,
      name: userDetails?.name,
      email: userDetails?.email,
      profile_pic: userDetails?.profile_pic,
      online: onlineUser.has(userId),
    };

    socket.emit("message-user", payload);

    const getConversationMessage = await ConversationModel.findOne({
      $or: [
        { sender: user?._id, receiver: userId },
        { sender: userId, receiver: user?._id },
      ],
    })
      .populate("messages")
      .sort({ updatedAt: -1 });

    socket.emit("messages", getConversationMessage?.messages || []);
  });

  //previous message

  //new message
  socket.on("new message", async (data) => {
    //check conversation is available both user

    let conversation = await ConversationModel.findOne({
      $or: [
        { sender: data?.sender, receiver: data?.receiver },
        { sender: data?.receiver, receiver: data?.sender },
      ],
    });

    console.log("new message", data);
    console.log("conversation", conversation);

    //conversation not available
    if (!conversation) {
      const createConversation = await ConversationModel({
        sender: data?.sender,
        receiver: data?.receiver,
      });
      conversation = await createConversation.save();
    }
    const message = new MessageModel({
      text: data.text,
      imageUrl: data.imageUrl,
      videlUrl: data.videoUrl,
      msgByUserId: data?.msgByUserId,
    });
    const saveMessage = await message.save();

    const updateConversation = await ConversationModel.updateOne(
      { _id: conversation?._id },
      {
        $push: { messages: saveMessage?._id },
      }
    );
    const getConversationMessage = await ConversationModel.findOne({
      $or: [
        { sender: data?.sender, receiver: data?.receiver },
        { sender: data?.receiver, receiver: data?.sender },
      ],
    })
      .populate("messages")
      .sort({ updatedAt: -1 });

    io.to(data?.sender).emit("messages", getConversationMessage?.messages);
    io.to(data?.receiver).emit("messages", getConversationMessage?.messages);
  });

  //disconnect
  socket.on("disconnect", () => {
    onlineUser.delete(user?._id);
    console.log("disconnect user", socket.id);
  });
});

module.exports = { app, server };
