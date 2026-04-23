import { useState } from 'react';
import { ProductProps } from 'src/sections/product/product-table-row';
import type { ProductAddProps } from 'src/sections/product/view/products-add';

export const useValidation = (initialData: ProductProps | ProductAddProps) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = (formData: ProductProps | ProductAddProps, images: (string | File)[]) => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.tensp) newErrors.tensp = 'Tên sản phẩm không được để trống.';
    // eslint-disable-next-line no-restricted-globals
    const isNumber = (value: string): boolean => !isNaN(Number(value));

    if (!formData.giasp) {
      newErrors.giasp = 'Giá sản phẩm không được để trống.';
    } else if (!isNumber(formData.giasp.toString())) {
      newErrors.giasp = 'Giá sản phẩm phải là một số.';
    } else if (formData.giasp <= 0) {
      newErrors.giasp = 'Giá sản phẩm phải lớn hơn 0.';
    }
    if (!formData.giamgia) {
      // newErrors.giamgia = 'Giảm giá không được để trống.';
    } else if (!isNumber(formData.giamgia.toString())) {
      newErrors.giamgia = 'Giảm giá phải là một số.';
    } else if (formData.giamgia < 0) {
      newErrors.giamgia = 'Giảm giá không được là số âm.';
    } else if (formData.giamgia > formData.giasp) {
      newErrors.giamgia = 'Giảm giá phải nhỏ hơn giá sản phẩm.';
    }
    if (!formData.kho) {
      newErrors.kho = 'Kho hàng không được để trống.';
    } else if (!isNumber(formData.kho.toString())) {
      newErrors.kho = 'Số lượng kho phải là một số.';
    } else if (formData.kho < 0) {
      newErrors.kho = 'Số lượng kho không được là số âm.';
    }
    if (!formData.loai) newErrors.loai = 'Vui lòng chọn loại sản phẩm.';
    if (!formData.mota) newErrors.mota = 'Mô tả sản phẩm không được để trống.';
    if (images.length === 0) newErrors.images = 'Vui lòng tải lên ít nhất một ảnh sản phẩm.';
    setErrors(newErrors);
    return newErrors;
  };

  return { errors, validateForm };
};
