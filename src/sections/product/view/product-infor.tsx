import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';

import Typography from '@mui/material/Typography';
import { getImageURL } from 'src/utils/format-image';
import { DashboardContent } from 'src/layouts/dashboard';
import * as productService from 'src/services/productService';
import * as imageService from 'src/services/imageService';
import { UserProps } from 'src/sections/user/user-table-row';
import { useRouter } from 'src/routes/hooks';
import LoginContext from 'src/store/loginContext';
import { Label } from 'src/components/label';
import { ProductProps } from '../product-table-row';

function ProductInfor() {
  const loginCtx = useContext(LoginContext);
  const router = useRouter();
  const { id } = useParams();

  const [listProduct, setListProduct] = useState<ProductProps[]>([]);
  const [images, setImages] = useState<(string | File)[]>([]);

  useEffect(() => {
    const fetchApi = async () => {
      const resultListProduct = await productService.getProduct();
      const resultListProductSale = await productService.getProductSale();
      setListProduct([...resultListProduct, ...resultListProductSale]);
    };
    fetchApi();
  }, []);

  const productInfo: ProductProps = listProduct.filter((item) => item.id === id)[0];
  useEffect(() => {
    if (productInfo) {
      setImages(productInfo.images.map((image) => image.image));
    }
  }, [productInfo]);

  console.log(productInfo);

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Thông tin sản phẩm
        </Typography>
      </Box>

      <Card
        sx={{
          minWidth: '400px',
          minHeight: '600px',
          padding: 2,
          display: 'flex',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            width: '30%',
            paddingRight: 2,
          }}
        >
          <Avatar
            src={getImageURL(productInfo?.images[0].image || '')}
            alt={productInfo?.tensp}
            sx={{
              width: '100%',
              height: '450px',
            }}
            variant="rounded"
          />
        </Box>
        <Box
          sx={{
            width: '70%',
            display: 'flex',
            flexDirection: 'column',
            paddingLeft: 3,
          }}
        >
          <Typography variant="h5">{productInfo?.tensp}</Typography>
          <Box display="flex">
            <Typography variant="h6">Loại sản phẩm:</Typography>
            <Typography variant="body1" pl={3}>
              {productInfo?.loai}
            </Typography>
          </Box>
          <Typography variant="h5">{productInfo?.giasp}</Typography>
          <Typography variant="h5">{productInfo?.mota}</Typography>
        </Box>
      </Card>
    </DashboardContent>
  );
}

export default ProductInfor;
