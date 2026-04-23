import { useParams } from 'react-router-dom';
import { useState, useEffect, useCallback, MouseEvent } from 'react';
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

import { useRouter } from 'src/routes/hooks';
import { useValidation } from 'src/hooks/useValidation';
import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';
import * as productService from 'src/services/productService';
import * as imageService from 'src/services/imageService';

import { Images, ProductProps } from '../product-table-row';
import { getCategory } from '../utils';
import ProductForm from '../components/product-input-form';

export function ProductsEdit() {
  const router = useRouter();
  const { id } = useParams();
  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Sửa thông tin sản phẩm
        </Typography>
      </Box>

      <Card sx={{ p: '32px 24px 24px' }}>
        <CardContent>
          <ProductForm id={id || ''} typeForm="Edit-form" />
        </CardContent>
      </Card>
    </DashboardContent>
  );
}
