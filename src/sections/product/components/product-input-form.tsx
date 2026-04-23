import { useParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';

import { getImageURL } from 'src/utils/format-image';
import { useRouter } from 'src/routes/hooks';
import { useValidation } from 'src/hooks/useValidation';
import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';
import * as productService from 'src/services/productService';
import * as imageService from 'src/services/imageService';

import { Images, ProductProps } from '../product-table-row';
import { getCategory } from '../utils';

type ProductFormProps = {
  id: string;
  typeForm: string;
};

export type ProductAddProps = {
  tensp: string;
  images: Array<string>;
  giasp: number;
  giamgia: number;
  mota: string;
  loai: string;
  kho: number;
  id: string;
};

function ProductForm({ id, typeForm }: ProductFormProps) {
  const router = useRouter();
  const [listProduct, setListProduct] = useState<ProductProps[]>([]);
  const [formData, setFormData] = useState<ProductAddProps>({
    id: '',
    giamgia: 0,
    tensp: '',
    images: [],
    loai: '',
    mota: '',
    giasp: 0,
    kho: 0,
  });

  // Sử dụng hook xác thực
  const { errors, validateForm } = useValidation(formData);
  const [isValidated, setIsValidated] = useState<{ [key: string]: boolean }>({});
  const [imagesDelete, setImagesDelete] = useState<{ id: string; name: string }[]>([]);
  const [images, setImages] = useState<(string | File)[]>([]);

  const addProductApi = async () => {
    const resultAdd = await productService.addProduct(formData);
    return resultAdd;
  };
  const updateProductApi = async () => {
    await productService.updateProduct(formData);
  };

  const addSaleProductApi = async (productId: string, productSale: number) => {
    await productService.addSaleProduct(productId, productSale);
  };

  const addImageApi = async (image: File, idProduct: string) => {
    await imageService.updateImage(image, idProduct);
  };

  const deleteImageApi = async (idProduct: string, imageName: string) => {
    await imageService.deleteImage(imageName, idProduct);
  };

  useEffect(() => {
    const fetchApi = async () => {
      const resultListProduct = await productService.getProduct();
      const resultListProductSale = await productService.getProductSale();
      setListProduct([
        ...(Array.isArray(resultListProduct) ? resultListProduct : []),
        ...(Array.isArray(resultListProductSale) ? resultListProductSale : []),
      ]);
    };
    fetchApi();
  }, []);

  const productInfo: ProductProps = listProduct.filter((item) => item.id === id)[0];
  useEffect(() => {
    if (typeForm === 'Edit-form' && productInfo) {
      setFormData((prevData) => ({
        ...prevData,
        ...productInfo,
        images: productInfo.images.map((image) => image.image),
      }));
      setImages(productInfo.images.map((image) => image.image));
    }
  }, [productInfo, typeForm]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'images') {
      const files = e.target.files;
      if (files) {
        const newImages = Array.from(files);
        setImages((prevImages) => [...prevImages, ...newImages]);
      }
    } else if (name === 'loai') {
      const categoryNum = listCategory.find((category) => category.value === value);
      setFormData((prevData) => ({
        ...prevData,
        [name]: categoryNum ? categoryNum.id.toString() : '',
      }));
    } else if (name === 'giamgia' && value === '') {
      setFormData((prevData) => ({ ...prevData, [name]: 0 }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const updateImages = (idProduct: string = '') => {
    images.forEach((image: File | string) => {
      if (image instanceof File) {
        addImageApi(image, idProduct);
      }
    });
  };

  const handleSubmitProductForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors = validateForm(formData, images);
    if (Object.keys(newErrors).length > 0) return;
    if (typeForm === 'Edit-form') {
      updateProductApi();
      addSaleProductApi(formData.id, formData.giamgia);
      updateImages(id);
      await Promise.all(
        imagesDelete.map((imageDelete) => deleteImageApi(imageDelete.id, imageDelete.name))
      );
    } else if (typeForm === 'Add-form') {
      const resultAdd = await addProductApi();
      if (resultAdd.success) {
        addSaleProductApi(resultAdd.name, formData.giamgia);
        updateImages(resultAdd.name);
      }
    }
    router.push('/products');
  };

  const handleDeleteImage = useCallback(
    (index: number) => {
      // Lấy tên ảnh cần xóa từ prevImages
      setImages((prevImages) => {
        const deletedImage = prevImages[index];

        if (typeof deletedImage === 'string' && productInfo) {
          const imageDeleteInfo = productInfo.images.find((image) => image.image === deletedImage);

          // Nếu tìm thấy imaDelete, cập nhật imagesDelete
          if (imageDeleteInfo) {
            setImagesDelete((prevImagesDelete) => [
              ...prevImagesDelete,
              { id: imageDeleteInfo.id, name: deletedImage },
            ]);
          }
        }
        return prevImages.filter((_, i) => i !== index);
      });
    },
    [productInfo]
  );

  const handleclickInput = (name: string) => {
    setIsValidated((prev) => ({ ...prev, [name]: true }));
  };

  const handleBlurInput = (
    e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>,
    name: string
  ) => {
    const inputValue = e.target.value || '';
    const textareaValue = e.target.tagName === 'TEXTAREA' ? inputValue : '';
    console.log(inputValue);

    if (inputValue === '' || textareaValue === '') {
      setIsValidated((prev) => ({ ...prev, [name]: false }));
    } else {
      setIsValidated((prev) => ({ ...prev, [name]: true }));
    }
  };

  const listCategory = [
    { id: 1, value: 'Rau Củ' },
    { id: 2, value: 'Thịt, Cá, Trứng' },
    { id: 3, value: 'Trái Cây' },
  ];
  return (
    <form onSubmit={handleSubmitProductForm}>
      <Box
        sx={{
          display: 'flex',
        }}
      >
        <Box
          sx={{
            flexGrow: 2,
          }}
        >
          <TextField
            fullWidth
            name="tensp"
            label={
              <span>
                Tên sản phẩm
                <span style={{ color: 'red' }}> *</span>
              </span>
            }
            value={formData?.tensp}
            onChange={handleFormChange}
            sx={{ mb: 3 }}
            onClick={() => handleclickInput('tensp')}
            onBlur={(e) => handleBlurInput(e, 'tensp')}
            error={!isValidated.tensp && !!errors.tensp}
            helperText={!isValidated.tensp ? errors.tensp : ''}
          />
          <TextField
            fullWidth
            name="images"
            type="file"
            label={
              <span>
                Ảnh sản phẩm
                <span style={{ color: 'red' }}> *</span>
              </span>
            }
            InputLabelProps={{ shrink: true }}
            onChange={handleFormChange}
            sx={{ mb: 3 }}
          />
          {images.length ? (
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                marginBottom: '24px',
              }}
            >
              {images?.map((image, index) => (
                <Box
                  key={index}
                  sx={{ position: 'relative', marginLeft: '12px', overflow: 'hidden' }}
                >
                  <Avatar
                    variant="rounded"
                    src={getImageURL(image)}
                    alt={formData?.tensp}
                    sx={{ width: '160px', height: '160px' }}
                  />
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: -3,
                      right: -3,
                      '&:hover': {
                        color: 'error.main',
                      },
                    }}
                    onClick={() => handleDeleteImage(index)}
                  >
                    <Iconify icon="solar:close-circle-bold" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          ) : (
            <>
              {errors.images && (
                <Typography
                  color="error"
                  sx={{
                    fontSize: 'caption.fontSize',
                    marginTop: '-21px',
                    marginBottom: '24px',
                  }}
                >
                  {errors.images}
                </Typography>
              )}
            </>
          )}
          <TextField
            fullWidth
            name="loai"
            select
            label={
              <span>
                Loại sản phẩm
                <span style={{ color: 'red' }}> *</span>
              </span>
            }
            value={getCategory(formData?.loai)}
            onChange={handleFormChange}
            onClick={() => handleclickInput('loai')}
            onBlur={(e) => handleBlurInput(e, 'loai')}
            error={!isValidated.loai && !!errors.loai}
            helperText={!isValidated.loai ? errors.loai : ''}
            sx={{ mb: 3 }}
          >
            {listCategory.map((option) => (
              <MenuItem key={option.id} value={option.value}>
                {option.value}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            name="giasp"
            label={
              <span>
                Đơn giá sản phẩm
                <span style={{ color: 'red' }}> *</span>
              </span>
            }
            sx={{ mb: 3 }}
            value={formData?.giasp || ''}
            onChange={handleFormChange}
            onClick={() => handleclickInput('giasp')}
            onBlur={(e) => handleBlurInput(e, 'giasp')}
            error={!isValidated.giasp && !!errors.giasp}
            helperText={!isValidated.giasp ? errors.giasp : ''}
          />
          <TextField
            fullWidth
            name="giamgia"
            label="Giảm giá"
            // InputLabelProps={{ shrink: true }}
            sx={{ mb: 3 }}
            value={formData?.giamgia || ''}
            defaultValue={0}
            onChange={handleFormChange}
            onClick={() => handleclickInput('giamgia')}
            onBlur={(e) => handleBlurInput(e, 'giamgia')}
            error={!isValidated.giamgia && !!errors.giamgia}
            helperText={!isValidated.giamgia ? errors.giamgia : ''}
          />
          <TextField
            fullWidth
            name="kho"
            label={
              <span>
                Số lượng sản phẩm trong kho
                <span style={{ color: 'red' }}> *</span>
              </span>
            }
            // InputLabelProps={{ shrink: true }}
            sx={{ mb: 3 }}
            value={formData?.kho || ''}
            onChange={handleFormChange}
            onClick={() => handleclickInput('kho')}
            onBlur={(e) => handleBlurInput(e, 'kho')}
            error={!isValidated.kho && !!errors.kho}
            helperText={!isValidated.kho ? errors.kho : ''}
          />
          <TextField
            fullWidth
            multiline
            name="mota"
            label={
              <span>
                Mô tả sản phẩm
                <span style={{ color: 'red' }}> *</span>
              </span>
            }
            // InputLabelProps={{ shrink: true }}
            value={formData?.mota}
            onChange={handleFormChange}
            onClick={() => handleclickInput('mota')}
            onBlur={(e) => handleBlurInput(e, 'mota')}
            error={!isValidated.mota && !!errors.mota}
            helperText={!isValidated.mota ? errors.mota : ''}
            rows={4}
            sx={{ mb: 3 }}
          />
        </Box>
      </Box>
      <Box>
        <Button variant="contained" type="submit" sx={{ right: 0 }}>
          Lưu
        </Button>
        <Button variant="contained" sx={{ marginLeft: '12px' }} onClick={() => router.back()}>
          Trở lại
        </Button>
      </Box>
    </form>
  );
}

export default ProductForm;
