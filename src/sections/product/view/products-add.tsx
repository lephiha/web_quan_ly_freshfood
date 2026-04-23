import { useCallback, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import FormHelperText from '@mui/material/FormHelperText';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import CardContent from '@mui/material/CardContent';

import { DashboardContent } from 'src/layouts/dashboard';
import { useRouter } from 'src/routes/hooks';
import * as productService from 'src/services/productService';
import * as imageService from 'src/services/imageService';
import { useValidation } from 'src/hooks/useValidation';

import { Images, ProductProps } from '../product-table-row';
import { getCategory } from '../utils';
import ProductForm from '../components/product-input-form';

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
export function ProductsAdd() {
  const router = useRouter();
  const [formData, setFormData] = useState<ProductAddProps>({
    tensp: '',
    images: [],
    loai: '',
    mota: '',
    giasp: 0,
    giamgia: 0,
    kho: 0,
    id: '',
  });
  const [images, setImages] = useState<(string | File)[]>([]);
  const { errors, validateForm } = useValidation(formData);
  const [isValidated, setIsValidated] = useState<{ [key: string]: boolean }>({});

  const addProductApi = async () => {
    const resultAdd = await productService.addProduct(formData);
    return resultAdd;
  };

  const addImageApi = async (image: File, id: string) => {
    await imageService.updateImage(image, id ? id?.toString() : '');
  };
  const addSaleProductApi = async (productId: string, productSale: number) => {
    await productService.addSaleProduct(productId, productSale);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'images') {
      const files = e.target.files;
      if (files) {
        const newImages = Array.from(files);
        setImages((prevImages) => [...prevImages, ...newImages]);
        // setFormData((prevData) => ({
        //   ...prevData,
        //   [name]: newImages.map((image) => image.name),
        // }));
      }
    } else if (name === 'loai') {
      const categoryNum = listCategory.find((category) => category.value === value);
      setFormData((prevData) => ({
        ...prevData,
        [name]: categoryNum ? categoryNum.id.toString() : '',
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const updateImages = (id: string) => {
    images.forEach((image: File | string) => {
      if (image instanceof File) {
        addImageApi(image, id);
      }
    });
  };

  const handleDeleteImage = useCallback((index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  }, []);

  const listCategory = [
    { id: 1, value: 'Rau Củ' },
    { id: 2, value: 'Thịt, Cá, Trứng' },
    { id: 3, value: 'Trái Cây' },
  ];

  const handleSubmitProductAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Gọi hàm validateForm để xác thực
    const newErrors = validateForm(formData, images);
    if (Object.keys(newErrors).length > 0) return;
    const resultAdd = await addProductApi();
    if (resultAdd.success) {
      addSaleProductApi(resultAdd.name, formData.giamgia);
      updateImages(resultAdd.name);
    }
    router.push('/products');
  };

  const handleMouseEnter = (name: string) => {
    setIsValidated((prev) => ({ ...prev, [name]: true }));
  };
  // const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>, name: string) => {
  //   const inputValue = e.currentTarget.querySelector('input')?.value || '';
  //   const textareaValue = e.currentTarget.querySelector('textarea')?.value || '';

  //   if (inputValue === '' || textareaValue === '') {
  //     setIsValidated((prev) => ({ ...prev, [name]: false }));
  //   } else {
  //     setIsValidated((prev) => ({ ...prev, [name]: true }));
  //   }
  // };

  const handleBlur = (
    e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>,
    name: string
  ) => {
    const inputValue = e.target.value || '';
    const textareaValue = e.target.tagName === 'TEXTAREA' ? inputValue : '';

    if (inputValue === '' || textareaValue === '') {
      setIsValidated((prev) => ({ ...prev, [name]: false }));
    } else {
      setIsValidated((prev) => ({ ...prev, [name]: true }));
    }
  };

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Thông tin sản phẩm mới
        </Typography>
      </Box>
      <Card sx={{ p: '32px 24px 24px' }}>
        <CardContent>
          <ProductForm id="" typeForm="Add-form" />
        </CardContent>
      </Card>
    </DashboardContent>
  );
}
