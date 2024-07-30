import { useState } from 'react';
import { ProSidebar, Menu, MenuItem } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import { useNavigate } from 'react-router-dom';
import { tokens } from './theme';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { setPageAdmin } from '../../store/slices/adminSlice';
import { Addchart, AirlineSeatFlat, Category, Draw, Group, Image, Logout, ReplyAll, ShoppingCart, TipsAndUpdates } from '@mui/icons-material';

// Custom Item component for MenuItems
const Item = ({ title, icon, selected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();



  return (
    <MenuItem
      active={selected === title}
      style={{ color: colors.grey[100] }}
      onClick={() =>{dispatch(setPageAdmin(title)); dispatch(setPageAdmin(title))}}
      icon={icon}
    >
      <Typography>{title}</Typography>
    </MenuItem> 
  );
};



const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const selected = useSelector((state)=>state.admin.pageAdmin)
  const userName = useSelector((state)=>state.user.name);
  const pozisyon = useSelector((state)=>state.user.pozisyon);
  const role = useSelector((state)=>state.user.role).toUpperCase();

  return (
    <Box
      sx={{
        '& .pro-sidebar-inner': {
          background: `${colors.grey[500]} !important`,
        },
        '& .pro-icon-wrapper': {
          backgroundColor: 'transparent !important',
        },
        '& .pro-inner-item': {
          padding: '5px 35px 5px 20px !important',
        },
        '& .pro-inner-item:hover': {
          color: '#fff !important',
        },
        '& .pro-menu-item.active': {
          color: '#fff !important',
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square" >
          {/* Logo & Menu Icon */}
          <MenuItem
            
            icon={isCollapsed ? <MenuOutlinedIcon onClick={() => setIsCollapsed(!isCollapsed)} /> : undefined}
            style={{
              margin: '0 0 5px 0',
              color: colors.grey[100],
              cursor: 'default'              
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
                style={{ cursor: 'default' }}
              >
                <div className='flex justify-center'>            
                    <ReplyAll onClick={() => navigate("/")} className='cursor-pointer' sx={{fontSize:'30px', color: colors.grey[100], '&:hover': { color: '#ffffff' } }}  />
                </div>
                  <div>
                <Typography variant="h3" color={colors.grey[100]} className='cursor-default'>                  
                    {role}
                </Typography>
                  </div>

                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {/* User */}
          {!isCollapsed && (
            <Box mb="20px">
              <Box display="flex" justifyContent="center" alignItems="cemter">
                <img
                  src={`./profileImage.png`}
                  alt="admin-profile"
                  width="130px"
                  height="130px"
                  style={{ borderRadius: '50%', cursor: 'pointer' }}
                />
              </Box>

              <Box textAlign="center">
                <Typography
                  variant="h3"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: '10px 0 0 0' }}
                >
                  {userName}
                </Typography>
                <Typography variant="h5" color='#000000'>
                  {pozisyon}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Menu Items */}
          <Box paddingLeft={isCollapsed ? undefined : '10%'}>

          <Item
              title="Dashboard"
              icon={<HomeOutlinedIcon />}
              selected={selected}
            />
            
          { role === "YONETICI" ?
          <>            
            <Item
              title="Users"
              icon={<Group />}
              selected={selected}
            />
            <Item
              title="Rapor"
              icon={<Draw />}
              selected={selected}
            />
            <Item
              title="Performans Değerlendirme"
              icon={<Category />}
              selected={selected}
            />
            </>
            :
            null
          }            
            {/* <Item
              title="Pre Order Details"
              icon={<Addchart />}
              selected={selected}
            /> */}
            <Item
              title="Izin"
              icon={<AirlineSeatFlat />}
              selected={selected}
            />
             {/* <Item
              title="Profile Images"
              icon={<Image />}
              selected={selected}
            />   */}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
