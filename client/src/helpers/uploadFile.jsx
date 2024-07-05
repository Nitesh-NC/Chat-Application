const url = `https://api.cloudinary.com/v1_1/dwsxsuyye/auto/upload`;
// console.log(
//   "VITE_CLOUDINARY_CLOUD_NAME",
//   import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
// );

const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  // cloud preset
  formData.append("upload_preset", "chat-app-file");

  const response = await fetch(url, {
    method: "post",
    body: formData,
  });

  const responseData = await response.json();

  return responseData;
};

export default uploadFile;
