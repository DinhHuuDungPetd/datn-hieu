import axios from "axios";

const CLOUD_NAME = "ddnasugap"; // Thay bằng cloud name của bạn
const UPLOAD_PRESET = "beGreen"; // Thay bằng upload preset unsigned của bạn
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

export async function uploadImageToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const response = await axios.post(CLOUDINARY_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.secure_url;
} 