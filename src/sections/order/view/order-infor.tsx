import { useCallback, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';

import { DashboardContent } from 'src/layouts/dashboard';
import * as orderService from 'src/services/orderService';
import { UserProps } from 'src/sections/user/user-table-row';
import { useRouter } from 'src/routes/hooks';
import LoginContext from 'src/store/loginContext';
import { Label } from 'src/components/label';
import { getCategory } from 'src/sections/product/utils';
import { fCurrency } from 'src/utils/format-number';
import { getImageURL } from 'src/utils/format-image';
import { getStatusMessage, ORDER_STATUS_OPTIONS } from '../utils';
import { OrderProps } from '../order-table-row';

function OrderInfor() {
  const { id } = useParams();
  const router = useRouter();

  const [listOrder, setListOrder] = useState<OrderProps[]>([]);
  const fetchApi = async () => {
    const resultListOrder = await orderService.getOrder(0);
    setListOrder(resultListOrder);
  };
  useEffect(() => {
    fetchApi();
  }, []);

  const order: OrderProps = listOrder.filter((item) => item.id === id)[0];

  const handleUpdateOrderStatus = useCallback(async (idOrder: string, status: number) => {
    await orderService.updateOrderStatus(idOrder, status);
    fetchApi();
  }, []);

  const [orderStatusValue, setOrderStatusValue] = useState<number>(0);
  const [openSelectOrderStatus, setOpenSelectOrderStatus] = useState(true);

  useEffect(() => {
    if (order) {
      setOrderStatusValue(Number(order.trangthai));
    }
  }, [order]);

  const handleSelectOrderStatus = useCallback(
    (e: SelectChangeEvent<number>) => {
      const newStatus: number = Number(e.target.value);
      setOrderStatusValue(newStatus);
      handleUpdateOrderStatus(id || '', newStatus);

      if (newStatus === 3 || newStatus === 4) {
        setOpenSelectOrderStatus(false);
      } else {
        setOpenSelectOrderStatus(true);
      }
    },
    [handleUpdateOrderStatus, id]
  );

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Thông tin đơn hàng
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Card
          sx={{
            width: '80%',
            minWidth: '400px',
            padding: '2rem 1rem',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
            <Box flex={1} sx={{ display: 'flex' }}>
              <Box mr={1}>
                <Typography variant="subtitle1">ID đơn hàng:</Typography>
                <Typography variant="subtitle1" mt={1}>
                  Tên khách hàng:
                </Typography>
                <Typography variant="subtitle1" mt={1}>
                  Điện thoại liên hệ:
                </Typography>
                <Typography variant="subtitle1" mt={1}>
                  Email:
                </Typography>
                <Typography variant="subtitle1" mt={1}>
                  Thời gian đặt hàng:
                </Typography>
                <Typography variant="subtitle1" mt={1}>
                  Địa chỉ giao hàng:
                </Typography>
              </Box>

              <Box>
                <Typography>{order?.id}</Typography>
                <Typography mt={1}>{order?.username}</Typography>
                <Typography mt={1}>{order?.sodienthoai}</Typography>
                <Typography mt={1}>{order?.email}</Typography>
                <Typography mt={1}>{order?.ngaydat}</Typography>
                <Typography mt={1}>{order?.diachi}</Typography>
              </Box>
            </Box>

            <Box
              flex={1}
              sx={{
                height: 56,
                minWidth: 300,
                mt: -2,
                ml: 15,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Typography variant="subtitle1" mr={1}>
                Trạng thái:
              </Typography>
              {orderStatusValue === 3 || orderStatusValue === 4 ? (
                <Label
                  color={
                    orderStatusValue === 3
                      ? 'success'
                      : orderStatusValue === 4
                        ? 'error'
                        : 'default'
                  }
                  sx={{
                    fontSize: 16,
                    padding: 2,
                  }}
                >
                  {getStatusMessage(Number(orderStatusValue))}
                </Label>
              ) : (
                <Select
                  value={orderStatusValue}
                  onChange={(e) => handleSelectOrderStatus(e)}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '&.Mui-disabled': {
                      color: 'var(--palette-text-primary) !important',
                      '& .MuiSelect-icon': {
                        display: 'none', // Ẩn mũi tên khi Select bị vô hiệu hóa
                      },
                    },
                  }}
                  disabled={!openSelectOrderStatus}
                >
                  {ORDER_STATUS_OPTIONS.map((orderStatus) => (
                    <MenuItem
                      key={orderStatus.value}
                      value={orderStatus.value}
                      disabled={orderStatus.value < orderStatusValue}
                    >
                      {orderStatus.label}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </Box>
          </Box>
          <Box mt={2} borderBottom="1px solid #e8e8e8">
            {order &&
              order.item.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    p: 2,
                    borderTop: '1px solid #e8e8e8',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Avatar
                    variant="rounded"
                    src={getImageURL(item.image)}
                    alt={item.tensp}
                    sx={{ width: 72, height: 72 }}
                  />

                  <Box
                    sx={{
                      width: '100%',
                      ml: 1,
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box>
                      <Typography variant="h6">{item.tensp}</Typography>
                      <Typography variant="body2">
                        Loại sản phẩm: {getCategory(item.loai)}
                      </Typography>
                      <Typography variant="subtitle1">
                        {item.giamgia > 0 ? (
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              sx={{
                                color: 'text.disabled',
                                textDecoration: 'line-through',
                              }}
                            >
                              {fCurrency(item.giasp)}
                            </Typography>
                            &nbsp; {fCurrency(item.giamgia)}
                          </>
                        ) : (
                          fCurrency(item.giasp)
                        )}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: 56,
                        margin: 'auto 0',
                        textAlign: 'center',
                      }}
                    >
                      x{item.soluong}
                    </Box>
                  </Box>
                </Box>
              ))}
          </Box>

          <Box
            sx={{
              mt: 3,
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <Box mr={2}>
              <Typography variant="h6">Thành tiền:</Typography>
              <Typography variant="h6">Phương thức thanh toán:</Typography>
            </Box>
            <Box>
              <Typography sx={{ height: 28 }}>{fCurrency(order?.tongtien)}</Typography>
              <Typography sx={{ height: 28 }}>{order?.phuongthucthanhtoan}</Typography>
            </Box>
          </Box>

          <Button variant="contained" sx={{ marginLeft: '12px' }} onClick={() => router.back()}>
            Trở lại
          </Button>
        </Card>
      </Box>
    </DashboardContent>
  );
}

export default OrderInfor;
