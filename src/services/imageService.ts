import * as request from '../utils/httpRequest';

export const updateImage = async (fileImage: File, id: string) => {
  try {
    // Sử dụng FormData để gửi tệp tin
    const formData = new FormData();
    formData.append('id', id);
    formData.append('file', fileImage);

    // Gửi yêu cầu POST với tệp tin
    const response = await request.post('upload.php', formData);

    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const deleteImage = async (fileName: string, id: string) => {
  try {
    // Gửi yêu cầu POST với tệp tin
    const response = await request.post(
      'deleteimage.php',
      new URLSearchParams({
        id,
        name: fileName,
      })
    );
    // Kiểm tra kết quả response
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};
