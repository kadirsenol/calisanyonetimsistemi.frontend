import { Box, useTheme,IconButton, Typography, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
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


const monthNames = {
  1: 'Ocak',
  2: 'Şubat',
  3: 'Mart',
  4: 'Nisan',
  5: 'Mayıs',
  6: 'Haziran',
  7: 'Temmuz',
  8: 'Ağustos',
  9: 'Eylül',
  10: 'Ekim',
  11: 'Kasım',
  12: 'Aralık'
};


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
    <div key={name} className="mb-8">
      <h2 className="text-lg font-semibold">{name}</h2>
      <div className="mt-4">
        <h3 className="text-base font-medium">Analitiklik</h3>
        <div className="overflow-x-auto mx-auto px-4 max-w-full">
          <table className="min-w-full border-collapse border border-gray-300 mt-2">
            <thead>
              <tr className="bg-gray-100 text-sm">
                {Object.keys(details.analitiklik).map(month => (
                  <th key={month} className="border border-gray-300 px-2 py-1 text-left">{month}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="text-sm">
                {Object.values(details.analitiklik).map((value, index) => (
                  <td key={index} className="border border-gray-300 px-2 py-1">{value === null ? null : value}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-base font-medium">Takım Çalışması</h3>
        <div className="overflow-x-auto mx-auto px-4 max-w-full">
          <table className="min-w-full border-collapse border border-gray-300 mt-2">
            <thead>
              <tr className="bg-gray-100 text-sm">
                {Object.keys(details.takimCalismasi).map(month => (
                  <th key={month} className="border border-gray-300 px-2 py-1 text-left">{month}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="text-sm">
                {Object.values(details.takimCalismasi).map((value, index) => (
                  <td key={index} className="border border-gray-300 px-2 py-1">{value === null ? null : value}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-base font-medium">Üretkenlik</h3>
        <div className="overflow-x-auto mx-auto px-4 max-w-full">
          <table className="min-w-full border-collapse border border-gray-300 mt-2">
            <thead>
              <tr className="bg-gray-100 text-sm">
                {Object.keys(details.uretkenlik).map(month => (
                  <th key={month} className="border border-gray-300 px-2 py-1 text-left">{month}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="text-sm">
                {Object.values(details.uretkenlik).map((value, index) => (
                  <td key={index} className="border border-gray-300 px-2 py-1">{value}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  
  ));
};

  //Departman trend render
  const renderDataDepartman = () => {
if (!dataForDepartman) return null;

return Object.entries(dataForDepartman).map(([name, details]) => (
  <div key={name} className="mb-8">
    <h2 className="text-lg font-semibold">{name}</h2>
    <div className="mt-4">
      <h3 className="text-base font-medium">Analitiklik</h3>
      <div className="overflow-x-auto mx-auto px-4 max-w-full">
        <table className="min-w-full border-collapse border border-gray-300 mt-2">
          <thead>
            <tr className="bg-gray-100 text-sm">
              {Object.keys(details.analitiklik).map(month => (
                <th key={month} className="border border-gray-300 px-2 py-1 text-left">{month}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="text-sm">
              {Object.values(details.analitiklik).map((value, index) => (
                <td key={index} className="border border-gray-300 px-2 py-1">{value === null ? null : value}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div className="mt-4">
      <h3 className="text-base font-medium">Takım Çalışması</h3>
      <div className="overflow-x-auto mx-auto px-4 max-w-full">
        <table className="min-w-full border-collapse border border-gray-300 mt-2">
          <thead>
            <tr className="bg-gray-100 text-sm">
              {Object.keys(details.takimCalismasi).map(month => (
                <th key={month} className="border border-gray-300 px-2 py-1 text-left">{month}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="text-sm">
              {Object.values(details.takimCalismasi).map((value, index) => (
                <td key={index} className="border border-gray-300 px-2 py-1">{value === null ? null : value}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div className="mt-4">
      <h3 className="text-base font-medium">Üretkenlik</h3>
      <div className="overflow-x-auto mx-auto px-4 max-w-full">
        <table className="min-w-full border-collapse border border-gray-300 mt-2">
          <thead>
            <tr className="bg-gray-100 text-sm">
              {Object.keys(details.uretkenlik).map(month => (
                <th key={month} className="border border-gray-300 px-2 py-1 text-left">{month}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="text-sm">
              {Object.values(details.uretkenlik).map((value, index) => (
                <td key={index} className="border border-gray-300 px-2 py-1">{value}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>






    ));
  };


//Bireysel Anomali rende
const renderAnomaliBireysel = () => {
if (!dataForAnomaliBireysel) return null;

return Object.entries(dataForAnomaliBireysel).map(([name, details]) => (
  <div key={name} className="mb-8">
    <h2 className="text-lg font-semibold">{name}</h2>
    <div className="mt-4">
      <h3 className="text-base font-medium">Analitiklik</h3>
      <div className="overflow-x-auto mx-auto px-4 max-w-full">
        <table className="min-w-full border-collapse border border-gray-300 mt-2">
          <thead>
            <tr className="bg-gray-100 text-sm">
              {Object.keys(details.analitiklik).map(month => (
                <th key={month} className="border border-gray-300 px-2 py-1 text-left">{month}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="text-sm">
              {Object.values(details.analitiklik).map((value, index) => (
                <td key={index} className="border border-gray-300 px-2 py-1">{value === null ? null : value}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div className="mt-4">
      <h3 className="text-base font-medium">Takım Çalışması</h3>
      <div className="overflow-x-auto mx-auto px-4 max-w-full">
        <table className="min-w-full border-collapse border border-gray-300 mt-2">
          <thead>
            <tr className="bg-gray-100 text-sm">
              {Object.keys(details.takimCalismasi).map(month => (
                <th key={month} className="border border-gray-300 px-2 py-1 text-left">{month}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="text-sm">
              {Object.values(details.takimCalismasi).map((value, index) => (
                <td key={index} className="border border-gray-300 px-2 py-1">{value === null ? null : value}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div className="mt-4">
      <h3 className="text-base font-medium">Üretkenlik</h3>
      <div className="overflow-x-auto mx-auto px-4 max-w-full">
        <table className="min-w-full border-collapse border border-gray-300 mt-2">
          <thead>
            <tr className="bg-gray-100 text-sm">
              {Object.keys(details.uretkenlik).map(month => (
                <th key={month} className="border border-gray-300 px-2 py-1 text-left">{month}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="text-sm">
              {Object.values(details.uretkenlik).map((value, index) => (
                <td key={index} className="border border-gray-300 px-2 py-1">{value}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  ));
};

//Departman anomali render
const renderAnomaliDepartman = () => {
if (!dataForAnomaliDepartman) return null;

return Object.entries(dataForAnomaliDepartman).map(([name, details]) => (
  <div key={name} className="mb-8">
    <h2 className="text-lg font-semibold">{name}</h2>
    <div className="mt-4">
      <h3 className="text-base font-medium">Analitiklik</h3>
      <div className="overflow-x-auto mx-auto px-4 max-w-full">
        <table className="min-w-full border-collapse border border-gray-300 mt-2">
          <thead>
            <tr className="bg-gray-100 text-sm">
              {Object.keys(details.analitiklik).map(month => (
                <th key={month} className="border border-gray-300 px-2 py-1 text-left">{month}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="text-sm">
              {Object.values(details.analitiklik).map((value, index) => (
                <td key={index} className="border border-gray-300 px-2 py-1">{value === null ? null : value}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div className="mt-4">
      <h3 className="text-base font-medium">Takım Çalışması</h3>
      <div className="overflow-x-auto mx-auto px-4 max-w-full">
        <table className="min-w-full border-collapse border border-gray-300 mt-2">
          <thead>
            <tr className="bg-gray-100 text-sm">
              {Object.keys(details.takimCalismasi).map(month => (
                <th key={month} className="border border-gray-300 px-2 py-1 text-left">{month}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="text-sm">
              {Object.values(details.takimCalismasi).map((value, index) => (
                <td key={index} className="border border-gray-300 px-2 py-1">{value === null ? null : value}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div className="mt-4">
      <h3 className="text-base font-medium">Üretkenlik</h3>
      <div className="overflow-x-auto mx-auto px-4 max-w-full">
        <table className="min-w-full border-collapse border border-gray-300 mt-2">
          <thead>
            <tr className="bg-gray-100 text-sm">
              {Object.keys(details.uretkenlik).map(month => (
                <th key={month} className="border border-gray-300 px-2 py-1 text-left">{month}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="text-sm">
              {Object.values(details.uretkenlik).map((value, index) => (
                <td key={index} className="border border-gray-300 px-2 py-1">{value}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
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

{ role === "yonetici" ? 

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
: null}

    </Box>


{role === "yonetici" ? <>

<div className="container mx-auto p-4">
      <div className="flex items-center space-x-4">
        <FormControl size='small' variant="outlined" className="w-full md:w-1/2">
          <InputLabel id="year-select-label" className="text-gray-700">Bireysel performans trendi için yıl seçin</InputLabel>
          <Select
            labelId="year-select-label"
            id="year-select"
            value={selectedYearForBireysel}
            onChange={BireyselOrtPerTrendi}
            label="Bireysel performans trendi için yıl seçin"
          >
            <MenuItem value="">
              <em>Seçiniz</em>
            </MenuItem>
            {yearsforBireysel.map(year => (
              <MenuItem key={year} value={year}>{year}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          size='small'
          variant='contained'
          color='inherit'
          onClick={() => setData(null)}
        >
          Verileri temizle
        </Button>
      </div>
      <br></br>
      {renderData()}
    </div>
    

    <div className="container mx-auto p-4">
      <div className="flex items-center space-x-4">
        <FormControl size='small' variant="outlined" className="w-full md:w-1/2">
          <InputLabel id="year-select-label" className="text-gray-700">Departmanlara göre performans trendi için yıl seçin</InputLabel>
          <Select
            labelId="year-select-label"
            id="year-select"
            value={selectedYearForDepartman}
            onChange={DepartmanOrtPerTrendi}
            label="Bireysel performans trendi için yıl seçin"
          >
            <MenuItem value="">
              <em>Seçiniz</em>
            </MenuItem>
            {yearsforDepartman.map(year => (
              <MenuItem key={year} value={year}>{year}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          size='small'
          variant='contained'
          color='inherit'
          onClick={() => setDataForDepartman(null)}
        >
          Verileri temizle
        </Button>
      </div>
      <br></br>
      {renderDataDepartman()}
    </div>

    <div className="container mx-auto p-4">
      <div className="flex items-center space-x-4">
        <FormControl size='small' variant="outlined" className="w-full md:w-1/2">
          <InputLabel id="year-select-label" className="text-gray-700">Bireysel performans anomali için yıl seçin</InputLabel>
          <Select
            labelId="year-select-label"
            id="year-select"
            value={selectedYearForBireyselAnomali}
            onChange={BireyselPerformansAnomali}
            label="Bireysel performans trendi için yıl seçin"
          >
            <MenuItem value="">
              <em>Seçiniz</em>
            </MenuItem>
            {yearsforBireyselAnomali.map(year => (
              <MenuItem key={year} value={year}>{year}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          size='small'
          variant='contained'
          color='inherit'
          onClick={() => setdataForAnomaliBireysel(null)}
        >
          Verileri temizle
        </Button>
      </div>
      <br></br>
      {renderAnomaliBireysel()}
    </div>


    <div className="container mx-auto p-4">
      <div className="flex items-center space-x-4">
        <FormControl size='small' variant="outlined" className="w-full md:w-1/2">
          <InputLabel id="year-select-label" className="text-gray-700">Departmanlara göre performans anomali için yıl seçin</InputLabel>
          <Select
            labelId="year-select-label"
            id="year-select"
            value={selectedYearForDepartmanAnomali}
            onChange={DepartmanPerformansAnomali}
            label="Bireysel performans trendi için yıl seçin"
          >
            <MenuItem value="">
              <em>Seçiniz</em>
            </MenuItem>
            {yearsforDepartmanAnomali.map(year => (
              <MenuItem key={year} value={year}>{year}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          size='small'
          variant='contained'
          color='inherit'
          onClick={() => setdataForAnomaliDepartman(null)}
        >
          Verileri temizle
        </Button>
      </div>
      <br></br>
      {renderAnomaliDepartman()}
    </div>


<div className="container mx-auto p-4">
      <div className="flex items-center space-x-4">
        <Button size='small' variant='contained' color='inherit' onClick={IzinAnomali}>
          İzin anomali bilgilerini getir
        </Button>
        <Button size='small' variant='contained' color='inherit' onClick={() => setizinAnomaliData(null)}>
          İzin anomali bilgilerini temizle
        </Button>
      </div>

{izinAnomaliData && (
        <div className="mt-4">
          {Object.entries(izinAnomaliData).map(([name, values]) => {
            const months = Object.keys(values).map(month => parseInt(month, 10));
            return (
              <div key={name} className="mb-8 p-4 bg-white shadow-md rounded-lg">
                <h2 className="text-lg font-semibold">{name}</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-300 mt-2">
                    <thead>
                      <tr className="bg-gray-100 text-sm">
                        {months.length > 0 && months.map(month => (
                          <th key={month} className="border border-gray-300 px-2 py-1 text-left">
                            {monthNames[month] || `Ay ${month}`}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="text-sm">
                        {months.map(month => (
                          <td key={month} className="border border-gray-300 px-2 py-1">
                            {values[month]}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>





</>

: null }

</>
    

  );
};

export default Dashboard;
