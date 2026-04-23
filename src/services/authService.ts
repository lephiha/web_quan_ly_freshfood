import * as request from '../utils/httpRequest';

export const loginUser = async (dataAuth: { email: any; password: any }) => {
  try {
    const response = await request.post(
      'dangnhap.php',
      new URLSearchParams({
        email: dataAuth.email,
        pass: dataAuth.password,
      })
    );
    return response.result;
  } catch (error) {
    console.error(error);
    return error;
  }
};
