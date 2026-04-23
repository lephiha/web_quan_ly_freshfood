import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { SimpleLayout } from 'src/layouts/simple';
import Card from '@mui/material/Card';

// ----------------------------------------------------------------------
const dataContact = {
  name: 'Hoang Anh',
  phoneNumber: '0123456789',
  email: 'dohoanganh444@gmail.com',
  address: '150 Chiến Thắng, Thanh Trì, Hà Nội',
};

export function ContactView() {
  return (
    <SimpleLayout content={{ compact: true }}>
      <Container>
        <Card sx={{ p: 4 }}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            Thông tin liên hệ
          </Typography>
          <Typography>{dataContact.name}</Typography>
          <Typography>{dataContact.phoneNumber}</Typography>
          <Typography>{dataContact.email}</Typography>
          <Typography>{dataContact.address}</Typography>

          <Button component={RouterLink} href="/" size="large" variant="contained" color="inherit">
            Trở về trang chủ
          </Button>
        </Card>
      </Container>
    </SimpleLayout>
  );
}
