import { Box, Typography, useTheme } from '@mui/material';
import { tokens } from './theme';
import ProgressCirlce from './ProgressCircle';

const StatBox = ({ title, subtitle, icon, progress, increase }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box width="100%" m="0 30px" sx={{ cursor: 'default' }}>
      <Box display="flex" justifyContent="space-between">
        <Box display="flex" alignItems="center" gap={1}>
           {icon}
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ color: '#444444' }}                        
          >
           {title}           
          </Typography>
        </Box>
        <Box>
          <ProgressCirlce progress={progress} />
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h5" sx={{ color: colors.greenAccent[500] }}>
          {subtitle}
        </Typography>
        <Typography
          variant="h5"
          fontStyle="italic"
          sx={{ color: colors.greenAccent[600] }}
        >
          {increase}
        </Typography>
      </Box>
    </Box>
  );
};

export default StatBox;
