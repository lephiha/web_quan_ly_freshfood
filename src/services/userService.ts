import * as request from '../utils/httpRequest';

export const getUser = async () => {
  try {
    const response = await request.get('getuser.php', {});
    return response.result;
  } catch (error) {
    console.error(error);
    return error;
  }
};
