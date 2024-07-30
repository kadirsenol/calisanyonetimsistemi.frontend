import { Box, useTheme,IconButton, Typography, Button } from '@mui/material';
import { tokens } from './theme';
import DownloadIcon from '@mui/icons-material/Download';
import StatBox from './StatBox';
import { AirlineSeatFlat, Category, FlashlightOff, FlashlightOn, Group, ShoppingCart, SportsScore } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import axios from "axios";
import LineChart from './LineChart';
import { useSelector } from 'react-redux';


const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const role = useSelector((state) => state.user.role);
  const [hastalikIzni, setHastalikIzni] = useState("");
  const [ozelIzin, setOzelIzin] = useState("");
  const [tatilIzni, setTatilIzni] = useState("");
  const [uretkenlikPuan, setUretkenlikPuan] = useState("");
  const [analitiklikPuan, setAnalitiklikPuan] = useState("");
  const [takimCalismasiPuan, setTakimCalismasiPuan] = useState("");
  const [departmanOrtPuan, setDepartmanOrtPuan] = useState({});
  const [departmaIzinKullanimi, setDepartmanIzinKullanimi] = useState({});
  const [izinAnomaliData, setizinAnomaliData] = useState(null);

  const navigate = useNavigate();





  useEffect(()=>{
    getUser();
    if(role !=="" && role === "yonetici"){
      getDepartmanOrtPuanlar();
      getDepartmanKullanilanIzinler();
    }      
  },[role])

      


  const [selectedYearForBireysel, setSelectedYearForBireysel] = useState('');
  const [selectedYearForDepartman, setSelectedYearForDepartman] = useState('');
  const [selectedYearForBireyselAnomali, setSelectedYearForBireyselAnomali] = useState('');
  const [selectedYearForDepartmanAnomali, setSelectedYearForDepartmanAnomali] = useState('');





  const [data, setData] = useState(null);
  const [dataForDepartman, setDataForDepartman] = useState(null);
  const [dataForAnomaliBireysel, setdataForAnomaliBireysel] = useState(null);
  const [dataForAnomaliDepartman, setdataForAnomaliDepartman] = useState(null);





 
  const yearsforBireysel = Array.from({ length: 11 }, (_, i) => 2020 + i);
  const yearsforDepartman = Array.from({ length: 11 }, (_, i) => 2020 + i);
  const yearsforBireyselAnomali = Array.from({ length: 11 }, (_, i) => 2020 + i);
  const yearsforDepartmanAnomali = Array.from({ length: 11 }, (_, i) => 2020 + i);





  // Bireysel trend render
  const renderData = () => {
    if (!data) return null;

    return Object.entries(data).map(([name, details]) => (
      <div key={name} style={{ marginBottom: '20px' }}>
        <h2>{name}</h2>
        <div>
          <h3>Analitiklik</h3>
          <ul>
            {Object.entries(details.analitiklik).map(([month, value]) => (
             <li key={month}>{month}: {value === null ? null : value}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Takım Çalışması</h3>
          <ul>
            {Object.entries(details.takimCalismasi).map(([month, value]) => (
             <li key={month}>{month}: {value === null ? null : value}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Üretkenlik</h3>
          <ul>
            {Object.entries(details.uretkenlik).map(([month, value]) => (
             <li key={month}>{month}: {value}</li>
            ))}
          </ul>
        </div>
      </div>
    ));
  };

  //Departman trend render
  const renderDataDepartman = () => {
    if (!dataForDepartman) return null;

    return Object.entries(dataForDepartman).map(([name, details]) => (
      <div key={name} style={{ marginBottom: '20px' }}>
        <h2>{name}</h2>
        <div>
          <h3>Analitiklik</h3>
          <ul>
            {Object.entries(details.analitiklik).map(([month, value]) => (
              <li key={month}>{month}: {value === null ? null : value}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Takım Çalışması</h3>
          <ul>
            {Object.entries(details.takimCalismasi).map(([month, value]) => (
              <li key={month}>{month}: {value === null ? null : value}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Üretkenlik</h3>
          <ul>
            {Object.entries(details.uretkenlik).map(([month, value]) => (
              <li key={month}>{month}: {value === null ? null : value}</li>
            ))}
          </ul>
        </div>
      </div>
    ));
  };


//Bireysel Anomali rende
const renderAnomaliBireysel = () => {
  if (!dataForAnomaliBireysel) return null;

  return Object.entries(dataForAnomaliBireysel).map(([name, details]) => (
    <div key={name} style={{ marginBottom: '20px' }}>
      <h2>{name}</h2>
      <div>
        <h3>Analitiklik</h3>
        <ul>
          {Object.entries(details.analitiklik).map(([month, value]) => (
           value&& <li key={month}>{month}: {value === null ? null : value}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Takım Çalışması</h3>
        <ul>
          {Object.entries(details.takimCalismasi).map(([month, value]) => (
           value&& <li key={month}>{month}: {value === null ? null : value}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Üretkenlik</h3>
        <ul>
          {Object.entries(details.uretkenlik).map(([month, value]) => (
           value&& <li key={month}>{month}: {value === null ? null : value}</li>
          ))}
        </ul>
      </div>
    </div>
  ));
};

//Departman anomali render
const renderAnomaliDepartman = () => {
  if (!dataForAnomaliDepartman) return null;

  return Object.entries(dataForAnomaliDepartman).map(([name, details]) => (
    <div key={name} style={{ marginBottom: '20px' }}>
      <h2>{name}</h2>
      <div>
        <h3>Analitiklik</h3>
        <ul>
          {Object.entries(details.analitiklik).map(([month, value]) => (
           value&& <li key={month}>{month}: {value === null ? null : value}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Takım Çalışması</h3>
        <ul>
          {Object.entries(details.takimCalismasi).map(([month, value]) => (
           value&& <li key={month}>{month}: {value === null ? null : value}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Üretkenlik</h3>
        <ul>
          {Object.entries(details.uretkenlik).map(([month, value]) => (
           value&& <li key={month}>{month}: {value === null ? null : value}</li>
          ))}
        </ul>
      </div>
    </div>
  ));
};

  



  const getUser = async ()=>{

    try {
      const response = await axios.get("DashBoard/GetUser",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      }
    );
      if (response.status === 200 || response.status === 204 ) {
          setHastalikIzni(response.data.hastalikIzinBakiye);
          setOzelIzin(response.data.ozelIzinBakiye);
          setTatilIzni(response.data.tatilIzinBakiye);
          setAnalitiklikPuan(response.data.toplamAnalitiklikPuan);
          setTakimCalismasiPuan(response.data.toplamTakimCalismasiPuan);
          setUretkenlikPuan(response.data.toplamUretkenlikPuan);

      }else {
        toast.info(
          "Beklenmedik bir durum meydana geldi, bilgilerinizi kontrol ederek lutfen tekrar deneyin."
        );
      }
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        toast.error("Sunucuya bağlanılamadı. !");
      } else if (error.response.status === 500) {
        //Problem(), server side bissunes exceptions and all catch error
        toast.error(error.response.data.detail);
      }else if (error.response.status === 401) {
          toast.error("Lütfen giriş yapınız.");
          navigate("/"); 
      } else if (error.response.status === 400) {
        //BadRequest(), server side valid. Eger frontend validinden bir sekil kurtulursa back validi devreye girecek
        Object.values(error.response.data.errors).forEach((value) => {
          value.forEach((message) => {
            toast.error(message);
          });
        });
      } else {
        toast.error("Opps! Beklenmedik bir hata meydana geldi.");
      }
    }        
  }


  const getDepartmanOrtPuanlar = async ()=>{

    try {
      const response = await axios.get("yonetici/Performans/DepartmanOrtPerPuan",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      }
    );
      if (response.status === 200 || response.status === 204 ) {
        setDepartmanOrtPuan(response.data)
          console.log(response.data);

      }else {
        toast.info(
          "Beklenmedik bir durum meydana geldi, bilgilerinizi kontrol ederek lutfen tekrar deneyin."
        );
      }
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        toast.error("Sunucuya bağlanılamadı. !");
      } else if (error.response.status === 500) {
        //Problem(), server side bissunes exceptions and all catch error
        toast.error(error.response.data.detail);
      }else if (error.response.status === 401) {
          toast.error("Lütfen giriş yapınız.");
          navigate("/"); 
      } else if (error.response.status === 400) {
        //BadRequest(), server side valid. Eger frontend validinden bir sekil kurtulursa back validi devreye girecek
        Object.values(error.response.data.errors).forEach((value) => {
          value.forEach((message) => {
            toast.error(message);
          });
        });
      } else {
        toast.error("Opps! Beklenmedik bir hata meydana geldi.");
      }
    }        
  }


  const getDepartmanKullanilanIzinler = async ()=>{

    try {
      const response = await axios.get("yonetici/Izin/DepartmanBazliKullanilanIzinler",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      }
    );
      if (response.status === 200 || response.status === 204 ) {
        setDepartmanIzinKullanimi(response.data);        
      }else {
        toast.info(
          "Beklenmedik bir durum meydana geldi, bilgilerinizi kontrol ederek lutfen tekrar deneyin."
        );
      }
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        toast.error("Sunucuya bağlanılamadı. !");
      } else if (error.response.status === 500) {
        //Problem(), server side bissunes exceptions and all catch error
        toast.error(error.response.data.detail);
      }else if (error.response.status === 401) {
          toast.error("Lütfen giriş yapınız.");
          navigate("/"); 
      } else if (error.response.status === 400) {
        //BadRequest(), server side valid. Eger frontend validinden bir sekil kurtulursa back validi devreye girecek
        Object.values(error.response.data.errors).forEach((value) => {
          value.forEach((message) => {
            toast.error(message);
          });
        });
      } else {
        toast.error("Opps! Beklenmedik bir hata meydana geldi.");
      }
    }        
  }


  const BireyselOrtPerTrendi = async (event)=>{

    if (!event || !event.target) {
      console.error('Event or event.target is undefined');
      return;
    }

    const year = event.target.value;
    setSelectedYearForBireysel(year);

    try {
      const response = await axios.get(`yonetici/Performans/BireyselOrtPerTrendi/${year}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      }
    );
      if (response.status === 200 || response.status === 204 ) {
        setData(response.data);     
      }else {
        toast.info(
          "Beklenmedik bir durum meydana geldi, bilgilerinizi kontrol ederek lutfen tekrar deneyin."
        );
      }
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        toast.error("Sunucuya bağlanılamadı. !");
      } else if (error.response.status === 500) {
        //Problem(), server side bissunes exceptions and all catch error
        toast.error(error.response.data.detail);
      }else if (error.response.status === 401) {
          toast.error("Lütfen giriş yapınız.");
          navigate("/"); 
      } else if (error.response.status === 400) {
        //BadRequest(), server side valid. Eger frontend validinden bir sekil kurtulursa back validi devreye girecek
        Object.values(error.response.data.errors).forEach((value) => {
          value.forEach((message) => {
            toast.error(message);
          });
        });
      } else {
        toast.error("Opps! Beklenmedik bir hata meydana geldi.");
      }
    }        
  }

  const DepartmanOrtPerTrendi = async (event)=>{

    if (!event || !event.target) {
      console.error('Event or event.target is undefined');
      return;
    }

    const year = event.target.value;
    setSelectedYearForDepartman(year);

    try {
      const response = await axios.get(`yonetici/Performans/DepartmanOrtPerTrendi/${year}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      }
    );
      if (response.status === 200 || response.status === 204 ) {
        setDataForDepartman(response.data);     
      }else {
        toast.info(
          "Beklenmedik bir durum meydana geldi, bilgilerinizi kontrol ederek lutfen tekrar deneyin."
        );
      }
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        toast.error("Sunucuya bağlanılamadı. !");
      } else if (error.response.status === 500) {
        //Problem(), server side bissunes exceptions and all catch error
        toast.error(error.response.data.detail);
      }else if (error.response.status === 401) {
          toast.error("Lütfen giriş yapınız.");
          navigate("/"); 
      } else if (error.response.status === 400) {
        //BadRequest(), server side valid. Eger frontend validinden bir sekil kurtulursa back validi devreye girecek
        Object.values(error.response.data.errors).forEach((value) => {
          value.forEach((message) => {
            toast.error(message);
          });
        });
      } else {
        toast.error("Opps! Beklenmedik bir hata meydana geldi.");
      }
    }        
  }

  const BireyselPerformansAnomali = async (event)=>{

    if (!event || !event.target) {
      console.error('Event or event.target is undefined');
      return;
    }

    const year = event.target.value;
    setSelectedYearForBireyselAnomali(year);

    try {
      const response = await axios.get(`yonetici/Performans/BireyselPerformansAnomali/${year}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      }
    );
      if (response.status === 200 || response.status === 204 ) {
        setdataForAnomaliBireysel(response.data);     
        console.log(response.data);
      }else {
        toast.info(
          "Beklenmedik bir durum meydana geldi, bilgilerinizi kontrol ederek lutfen tekrar deneyin."
        );
      }
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        toast.error("Sunucuya bağlanılamadı. !");
      } else if (error.response.status === 500) {
        //Problem(), server side bissunes exceptions and all catch error
        toast.error(error.response.data.detail);
      }else if (error.response.status === 401) {
          toast.error("Lütfen giriş yapınız.");
          navigate("/"); 
      } else if (error.response.status === 400) {
        //BadRequest(), server side valid. Eger frontend validinden bir sekil kurtulursa back validi devreye girecek
        Object.values(error.response.data.errors).forEach((value) => {
          value.forEach((message) => {
            toast.error(message);
          });
        });
      } else {
        toast.error("Opps! Beklenmedik bir hata meydana geldi.");
      }
    }        
  }

  const DepartmanPerformansAnomali = async (event)=>{

    if (!event || !event.target) {
      console.error('Event or event.target is undefined');
      return;
    }

    const year = event.target.value;
    setSelectedYearForDepartmanAnomali(year);

    try {
      const response = await axios.get(`yonetici/Performans/DepartmanPerformansAnomali/${year}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      }
    );
      if (response.status === 200 || response.status === 204 ) {
        setdataForAnomaliDepartman(response.data);     
        console.log(response.data);
      }else {
        toast.info(
          "Beklenmedik bir durum meydana geldi, bilgilerinizi kontrol ederek lutfen tekrar deneyin."
        );
      }
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        toast.error("Sunucuya bağlanılamadı. !");
      } else if (error.response.status === 500) {
        //Problem(), server side bissunes exceptions and all catch error
        toast.error(error.response.data.detail);
      }else if (error.response.status === 401) {
          toast.error("Lütfen giriş yapınız.");
          navigate("/"); 
      } else if (error.response.status === 400) {
        //BadRequest(), server side valid. Eger frontend validinden bir sekil kurtulursa back validi devreye girecek
        Object.values(error.response.data.errors).forEach((value) => {
          value.forEach((message) => {
            toast.error(message);
          });
        });
      } else {
        toast.error("Opps! Beklenmedik bir hata meydana geldi.");
      }
    }        
  }

  const IzinAnomali = async ()=>{

    try {
      const response = await axios.get(`yonetici/Izin/IzinAnomali`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      }
    );
      if (response.status === 200 || response.status === 204 ) {
        setizinAnomaliData(response.data);
      }else {
        toast.info(
          "Beklenmedik bir durum meydana geldi, bilgilerinizi kontrol ederek lutfen tekrar deneyin."
        );
      }
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        toast.error("Sunucuya bağlanılamadı. !");
      } else if (error.response.status === 500) {
        //Problem(), server side bissunes exceptions and all catch error
        toast.error(error.response.data.detail);
      }else if (error.response.status === 401) {
          toast.error("Lütfen giriş yapınız.");
          navigate("/"); 
      } else if (error.response.status === 400) {
        //BadRequest(), server side valid. Eger frontend validinden bir sekil kurtulursa back validi devreye girecek
        Object.values(error.response.data.errors).forEach((value) => {
          value.forEach((message) => {
            toast.error(message);
          });
        });
      } else {
        toast.error("Opps! Beklenmedik bir hata meydana geldi.");
      }
    }        
  }
  

  return (
  <>
    <Box m="15px">
      {/* Grid & Charts */}
      <Box >
      <Box
        display="grid"
        gridTemplateColumns="repeat(10, 1fr)"
        gridAutoRows="120px"
        gap="25px"
        // overflow="auto"
      >
        {/* Row 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ maxWidth: '220px', borderRadius: '16px' }}
        >
          <StatBox
            title={"Bireysel"}
            subtitle="Hastalık İzni"
            progress={hastalikIzni / 5}
            increase={
                      <div>
                      {"%" + ((hastalikIzni / 5) * 100).toFixed(0)}
                        <br />
                      {"Kalan: " + (5 - (5-hastalikIzni))}
                      </div>
            }        
            icon={
              <AirlineSeatFlat
                sx={{ color: colors.greenAccent[600], fontSize: '26px' }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ maxWidth: '220px', borderRadius: '16px' }}
        >
          <StatBox
            title={"Bireysel"}
            subtitle="Tatil İzni"
            progress={tatilIzni / 5}
            increase={
                      <div>
                      {"%" + ((tatilIzni / 5) * 100).toFixed(0)}
                        <br />
                      {"Kalan: " + (5 - (5-tatilIzni))}
                      </div>
                      } 
            icon={
              <Group
                sx={{ color: colors.greenAccent[600], fontSize: '26px' }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ maxWidth: '220px', borderRadius: '16px' }}
        >
          <StatBox
            title={"Bireysel"}
            subtitle="Özel İzin"
            progress={ozelIzin / 5}
            increase={
              <div>
              {"%" + ((ozelIzin / 5) * 100).toFixed(0)}
                <br />
              {"Kalan: " + (5 - (5-ozelIzin))}
              </div>
                      }
            icon={
              <Category
                sx={{ color: colors.greenAccent[600], fontSize: '26px' }}
              />
            }
          />
        </Box>
        <Box gridColumn="span 2" />
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          justifyContent="center"
          alignItems="center"          
          sx={{ maxWidth: '220px', borderRadius: '16px', marginLeft:'-80px' }}
        >
          <StatBox
            title={"Bireysel"}
            subtitle='Analitiklik Puan'
            progress={1}
            increase={analitiklikPuan}
            icon={
              <SportsScore
                sx={{ color: colors.greenAccent[600], fontSize: '26px' }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ maxWidth: '220px', borderRadius: '16px', marginLeft:'-30px'  }}
        >
          <StatBox
            title={"Bireysel"}
            subtitle="Takım Çalışması Puan"
            progress={1}
            increase={takimCalismasiPuan}
            icon={
              <SportsScore
                sx={{ color: colors.greenAccent[600], fontSize: '26px' }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 2"
          backgroundColor={colors.primary[400]}
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ maxWidth: '220px', borderRadius: '16px', marginLeft:'-30px'  }}
        >
          <StatBox
            title={"Bireysel"}
            subtitle="Üretkenlik Puan"
            progress={1}
            increase={uretkenlikPuan}
            icon={
              <SportsScore
                sx={{ color: colors.greenAccent[600], fontSize: '26px' }}
              />
            }
          />
        </Box>
        <Box gridColumn="span 1" />
        {
          role === "yonetici" ?
          <>

{Object.entries(departmanOrtPuan).map(([department, metrics], index) => (
        Object.entries(metrics).map(([metric, value], metricIndex) => (
          <Box
            key={`${index}-${metricIndex}`}
            gridColumn="span 3"
            backgroundColor={colors.primary[400]}
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ maxWidth: '220px', borderRadius: '16px', marginLeft: '20px' }}
          >
            <StatBox
              title={department+" "+"Departmanı"}
              subtitle={metric.replace(/ortalama/i, '')}  // "ortalama" kelimesini çıkar
              progress={1}
              increase={`${value}`}
              icon={
                <SportsScore sx={{ color: colors.greenAccent[600], fontSize: '26px' }} />
              }
            />
          </Box>
        ))
      ))}

{Object.entries(departmaIzinKullanimi).map(([department, metrics], index) => (
  Object.entries(metrics).map(([metric, value], metricIndex) => (
    <Box
      key={`${index}-${metricIndex}`}
      gridColumn="span 3"
      backgroundColor={colors.primary[400]}
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ maxWidth: '220px', borderRadius: '16px', marginLeft: '20px' }}
    >
      <StatBox
        title={`${department} Departmanı`} // Departman ismi
        subtitle={metric.replace(/ Kullanimi/i, '')} // İzin türü açıklaması
        progress={1}
        increase={`${value}`} // İzin türü kullanımı
        icon={
          <SportsScore sx={{ color: colors.greenAccent[600], fontSize: '26px' }} />
        }
      />
    </Box>
  ))
))}
          
        </>
        :
        null
        }
    </Box>   
    </Box>    

    <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="15px"
            p="0 30px"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Revenue Generated
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                Toplam
              </Typography>
            </Box>

            <Box>
              <IconButton>
                <DownloadIcon
                  sx={{
                    fontSize: '26px',
                    color: colors.greenAccent[500],
                  }}
                />
              </IconButton>
            </Box>
          </Box>

          <Box height="240px" mt="-30px">
            <LineChart isDashboard={true} />
          </Box>
        </Box>
    </Box>



    <div>
      <label htmlFor="year-select"> Bireysel performans trendi için yıl seçin :</label>
      <select id="year-select" value={selectedYearForBireysel} onChange={BireyselOrtPerTrendi}>
        <option value="">Seçiniz</option>
        {yearsforBireysel.map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
      <Button size='small' className='m-4' variant='contained' onClick={()=>setData("")}>Verileri temizle</Button>

      {renderData()}
    </div>


    <div>
      <label htmlFor="year-select"> Departmanlara göre performans trendi için yıl seçin :</label>
      <select id="year-select" value={selectedYearForDepartman} onChange={DepartmanOrtPerTrendi}>
        <option value="">Seçiniz</option>
        {yearsforDepartman.map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
        <Button size='small' className='m-4' variant='contained' onClick={()=>setDataForDepartman("")}>Verileri temizle</Button>

      {renderDataDepartman()}
    </div>



    <div>
      <label htmlFor="year-select"> Bireysel performans anomali için yıl seçin :</label>
      <select id="year-select" value={selectedYearForBireyselAnomali} onChange={BireyselPerformansAnomali}>
        <option value="">Seçiniz</option>
        {yearsforBireyselAnomali.map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
      <Button size='small' className='m-4' variant='contained' onClick={()=>setdataForAnomaliBireysel("")}>Verileri temizle</Button>
      {renderAnomaliBireysel()}
    </div>


    <div>
      <label htmlFor="year-select"> Departmanlara göre performans anomali için yıl seçin :</label>
      <select id="year-select" value={selectedYearForDepartmanAnomali} onChange={DepartmanPerformansAnomali}>
        <option value="">Seçiniz</option>
        {yearsforDepartmanAnomali.map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
      <Button size='small' className='m-4' variant='contained' onClick={()=>setdataForAnomaliDepartman("")}>Verileri temizle</Button>
      {renderAnomaliDepartman()}
    </div>

<div>
<Button size='small' variant='contained' onClick={IzinAnomali}>İzin anomoli bilgilerini getir</Button>
<Button size='small' className='m-4' variant='contained' onClick={()=>setizinAnomaliData("")}>İzin anomoli bilgilerini temizle</Button>
    {izinAnomaliData && (
        <div>
          {Object.entries(izinAnomaliData).map(([name, values]) => (
            <div key={name} style={{ marginBottom: '20px' }}>
              <h2>{name}</h2>
              <ul>
                {Object.entries(values).map(([key, value]) => (
                  <li key={key}>{key}: {value}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
</div>

    </>

  );
};

export default Dashboard;
