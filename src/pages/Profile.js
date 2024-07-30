import { CssBaseline, ThemeProvider } from '@mui/material';
import { ColorModeContext, useMode } from '../components/profile/theme';
import Sidebar from '../components/profile/Sidebar';

import PreOrderDetails from '../components/profile/PreOrderDetails';
import { useSelector } from 'react-redux';
import Users from '../components/profile/Users';
import PerformansDegerlendirme from '../components/profile/PerformansDegerlendirme';
import ProfileImages from '../components/profile/ProfileImages';
import Dashboard from '../components/profile/Dashboard';
import Izins from '../components/profile/Izins';
import Rapors from '../components/profile/Rapors';


function Profile() {
  const [theme, colorMode] = useMode();
  const pageAdmin = useSelector((state) => state.admin.pageAdmin);


  return (


    <div style={{ position: 'relative', width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center',
    backgroundImage: `url(./apBg.svg)`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
     }}
    className="flex justify-center min-h-screen items-center relative "
    >
    <ColorModeContext.Provider value={colorMode}>
  <ThemeProvider theme={theme}>    
    <CssBaseline />
    <div className="app flex">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {/* İçerik */}
        
        {pageAdmin === 'Dashboard' && <Dashboard/>}
        {pageAdmin === 'Users' && <Users />}
        {pageAdmin === 'Performans Değerlendirme' && <PerformansDegerlendirme />}
        {pageAdmin === 'Rapor' && <Rapors />}
        {/* {pageAdmin === 'Pre Order Details' && <PreOrderDetails />} */}
        {pageAdmin === 'Izin' && <Izins />}
        {/* {pageAdmin === 'Profile Images' && <ProfileImages />} */}
      </main>
    </div>
  </ThemeProvider>
</ColorModeContext.Provider>
</div>
  );
}

export default Profile;
