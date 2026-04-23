import * as request from '../utils/httpRequest';

export const getOrder = async (idUser: number) => {
  try {
    const response = await request.post(
      'xemdonhang.php',
      new URLSearchParams({
        iduser: idUser.toString(),
      })
    );
    return response.result;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const updateOrderStatus = async (idOrder: string, status: number) => {
  try {
    const response = await request.post(
      'updateorder.php',
      new URLSearchParams({
        id: idOrder,
        trangthai: status.toString(),
      })
    );
    return response;
  } catch (error) {
    console.error(error);
    return error;
  }
};
