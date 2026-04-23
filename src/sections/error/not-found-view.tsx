import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { SimpleLayout } from 'src/layouts/simple';

// ----------------------------------------------------------------------

export function NotFoundView() {
  return (
    <SimpleLayout content={{ compact: true }}>
      <Container>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Xin lỗi, không tìm thấy trang!
        </Typography>

        <Typography sx={{ color: 'text.secondary' }}>
          Xin lỗi, chúng tôi không tìm thấy trang bạn đang tìm kiếm. Có lẽ bạn đã nhập sai URL? Hãy
          kiểm tra lỗi chính tả của bạn.
        </Typography>

        <Box
          component="img"
          src="/assets/illustrations/illustration-404.svg"
          sx={{
            width: 320,
            height: 'auto',
            my: { xs: 5, sm: 10 },
          }}
        />

        <Button component={RouterLink} href="/" size="large" variant="contained" color="inherit">
          Trở về trang chủ
        </Button>
      </Container>
    </SimpleLayout>
  );
}
