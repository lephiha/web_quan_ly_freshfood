import * as request from '../utils/httpRequest';

export const getProduct = async () => {
  try {
    const response = await request.get('getspmoi.php', {});

    return response.result;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const getProductSale = async () => {
  try {
    const response = await request.get('getdiscount.php', {});

    return response.result;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const addProduct = async (dataProduct: {
  tensp: string;
  giasp: number;
  loai: string;
  mota: string;
  kho: number;
  images: string[];
  giamgia: number;
  id: string;
}) => {
  try {
    const response = await request.post(
      'insertsp.php',
      new URLSearchParams({
        tensp: dataProduct.tensp,
        gia: dataProduct.giasp.toString(),
        loai: dataProduct.loai,
        mota: dataProduct.mota,
        kho: dataProduct.kho.toString(),
        giamgia: dataProduct.giamgia.toString(),
        hinhanh: dataProduct.images[0],
      })
    );

    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const addSaleProduct = async (productId: string, productSale: number) => {
  try {
    const response = await request.post(
      'updategiamgia.php',
      new URLSearchParams({
        id: productId,
        giamgia: productSale.toString(),
      })
    );

    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const updateProduct = async (dataProduct: {
  id: string;
  tensp: string;
  giasp: number;
  loai: string;
  mota: string;
  kho: number;
  giamgia: number;
}) => {
  try {
    const response = await request.post(
      'updatesp.php',
      new URLSearchParams({
        id: dataProduct.id,
        tensp: dataProduct.tensp,
        gia: dataProduct.giasp.toString(),
        loai: dataProduct.loai,
        mota: dataProduct.mota,
        kho: dataProduct.kho.toString(),
        giamgia: dataProduct.giamgia.toString(),
        hinhanh: '',
      })
    );

    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const deleteProduct = async (id: any) => {
  try {
    const response = await request.post(
      'xoa.php',
      new URLSearchParams({
        id,
      })
    );

    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};
