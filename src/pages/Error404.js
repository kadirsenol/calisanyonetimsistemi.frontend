
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Error404 = () => {

  const navigate = useNavigate();
  
  return(

    <div style={{ position: 'relative', width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center',
    backgroundImage: `url(./error404.jpg)`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
     }}
    className="flex justify-center min-h-screen items-center relative "
    onClick={()=>navigate('/')}
    >

      <Button
      style={{ position: 'absolute', top: '55%', left: '39.8%'}}
      variant='contained' 
      color='inherit'
      >
        Back to Home
      </Button>

    </div>

  )
};

export default Error404;
