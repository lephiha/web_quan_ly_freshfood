import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { DashboardContent } from 'src/layouts/dashboard';
import * as userService from 'src/services/userService';
import { UserProps } from 'src/sections/user/user-table-row';
import { useRouter } from 'src/routes/hooks';
import LoginContext from 'src/store/loginContext';
import { Label } from 'src/components/label';
import { getImageURL } from 'src/utils/format-image';

function ProfileView() {
  const loginCtx = useContext(LoginContext);
  const router = useRouter();
  const { id } = useParams();

  const [listUser, setListUser] = useState<UserProps[]>([]);

  useEffect(() => {
    const fetchApi = async () => {
      const resultListUser = await userService.getUser();
      setListUser(resultListUser);
    };
    fetchApi();
  }, []);

  const profile: UserProps = listUser.filter((item) => item.uid === id)[0];

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Thông tin người dùng
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
            width: '60%',
            minWidth: '400px',
            padding: '4rem 5rem',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box display="flex" justifyContent="center">
              <Avatar
                src={getImageURL(profile?.imageprofile || '')}
                alt={profile?.username}
                sx={{
                  width: '200px',
                  height: '200px',
                }}
              />
            </Box>

            <Box display="flex" mt={4} flexDirection="column">
              <Typography variant="h5">Chi tiết tài khoản</Typography>
              <Box ml={6} mt={2}>
                <Box display="flex">
                  <Typography variant="subtitle1" mr={5}>
                    Tên người dùng:
                  </Typography>
                  {profile?.username}
                </Box>
                <Box display="flex" mt={2}>
                  <Typography variant="subtitle1" mr={5}>
                    Quyền người dùng:
                  </Typography>
                  <Label color={(profile?.status === '0' && 'success') || 'error'}>
                    {profile?.status === '0' ? 'User' : 'Admin'}
                  </Label>
                </Box>
              </Box>
            </Box>

            <Box display="flex" mt={4} flexDirection="column">
              <Typography variant="h5">Liên hệ</Typography>
              <Box ml={6} mt={2}>
                <Box display="flex">
                  <Typography variant="subtitle1" mr={5}>
                    Địa chỉ email:
                  </Typography>
                  {profile?.email}
                </Box>
                <Box display="flex" mt={2}>
                  <Typography variant="subtitle1" mr={5}>
                    Số điện thoại:
                  </Typography>
                  {profile?.mobile}
                </Box>
              </Box>
            </Box>
          </Box>
        </Card>
      </Box>
    </DashboardContent>
  );
}

export default ProfileView;
