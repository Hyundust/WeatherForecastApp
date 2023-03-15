import React from 'react'
import {useState } from 'react'
import axios from 'axios';
import { motion } from "framer-motion"
import { BsFillCloudSunFill,BsWind } from 'react-icons/bs'
import {MdSevereCold} from 'react-icons/md'
import {FaHotjar} from "react-icons/fa"




function Weather() {
  
    const [forecast,setForecast] = useState([]);
    const [city,setCity] = useState("");  
    const [searched, setSearched] = useState(false);
    const [cityInput,setCityInput]=useState("");


    const API_KEY = "ed79cc4c0fe4dabf8eb2bd3c52e195b4"

    //temperature convertion fnction 
    function convertTemperature(temp) {
      if (temp === 0) {
        return 0;
      } else {
        return Math.round(temp);
      }
    }


    const HandleChange = () =>{
      setCity(cityInput);

      const url = `https://api.openweathermap.org/data/2.5/forecast?units=metric&q=${city}&cnt=40&appid=${API_KEY}`;
      axios.get(url, {
            params: {
                      q: `${city}`,
                      cnt: 40,
                      units: 'metric',
                      appid:`${API_KEY}`
                    }
})
  
    .then(response => {
          const data = response.data;
          const forecastData = data.list;
  
          
          const groupedForecastData = {};

          forecastData.forEach(dataPoint => {
              const date = dataPoint.dt_txt.split(' ')[0];

              if(!groupedForecastData[date]) {
                 groupedForecastData[date] = [];
              }
              groupedForecastData[date].push(dataPoint);
          });
          const forecast = [];

          for (const date in groupedForecastData){

            const dataPoints = groupedForecastData[date];

            const minTemp = convertTemperature(Math.min(...dataPoints.map(dataPoint => dataPoint.main.temp_min)));
            const maxTemp = convertTemperature(Math.max(...dataPoints.map(dataPoint => dataPoint.main.temp_max)));

            const windSpeed = convertTemperature(dataPoints[0].wind.speed)
            const icon = dataPoints[0].weather[0].icon;
            const weatherCondition = dataPoints[0].weather[0].description;

            //Converting date
            const dateObj = new Date(date);
            const formattedDate = `${dateObj.getDate()} ${dateObj.toLocaleString('default', { month: 'short' })}`;
            const dayOfWeek = dateObj.toLocaleString('default', { weekday: 'long' });

        forecast.push({
                date: formattedDate,
                dayOfWeek:dayOfWeek,
                minTemperature: minTemp,
                maxTemperature: maxTemp,
                windSpeed: windSpeed,
                icon: icon,
                weatherCondition: weatherCondition
        });
      }
  
      console.log('5-day forecast:', forecast);
      setForecast(forecast);
      setSearched(true);
    })
    .catch(error => {

      console.error(error);

    });
      }
    return (
      
        
      <div class="w-screen flex justify-center items-center font-serif h-screen bg-gradient-to-r from-blue-500 to-yellow-600">
      
      {!searched && (
        <>
          <motion.div
          className="box"
          animate={{ x:0, y:-140, rotate:0}}
          transition={{ type: "spring" }}
      >
          <h1 class="text-5xl font-bold text-white mb-8 flex ">Weather Forecast  <BsFillCloudSunFill/></h1>
          <div class="flex items-center justify-center max-w-sm mx-auto">
            <input class="w-full px-4 py-2 rounded-l-lg rounded-r-none focus: text-gray-900 active:bg-violet-800"
              type="text"
              placeholder="Enter City"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
            />
            <button onClick={HandleChange} class="bg-blue-500 hover:bg-blue-600 rounded-r-lg rounded-l-none text-white font-bold px-4 py-2">
              Submit
            </button>
        </div>  
        </motion.div>
      </>
      )}

      {searched && (
        <>
        <motion.div
            className="box flex flex-col items-center justify-center"
            animate={{ x: 0, y: 0, rotate: 360 }}
            transition={{ type: "spring" }}
        >
        <div class="text-center">
            <h1 class="text-5xl font-bold text-white flex">Weather Forecast<BsFillCloudSunFill/></h1>
            <div class="flex items-center justify-center mt-8">
                <input
                    class=" text-center w-64 h-18 px-4 py-2 rounded-l-lg rounded-r-none focus:text-gray-900 active:bg-slate-300"
                    type="text"
                    placeholder="Enter City"
                    value={cityInput}
                    onChange={(e) => setCityInput(e.target.value)}
                />
                <button
                    onClick={HandleChange}
                    class="bg-blue-500 hover:bg-blue-600 rounded-r-lg rounded-l-none text-white font-bold px-4 py-2 "
                >
                    Submit
                </button>
            </div>
        </div>
        <div class="rounded-lg p-8 bg-white shadow-lg w-120 h-46 mt-10 flex justify-center">
            <div class="text-left mx-12 ">
                <h1 class="text-3xl font-bold text-center">
                  {city}
                </h1>
                <p class="text-lg mb-4 text-center">
                  Today
                </p>
                <h2 class="text-2xl justify-between mx-12 flex space-x-4" >
                  <MdSevereCold/>: {forecast[0].minTemperature}°C  
                  <FaHotjar/>: {forecast[0].maxTemperature}°C 
                </h2>
                <p class="text-lg mb-2 text-center ">
                  {forecast[0].weatherCondition}
                </p>
                <p class="text-lg justify-center flex">
                  <BsWind/> : {forecast[0].windSpeed} m/s
                </p>
            </div>
        </div>
    <div class="flex justify-center mt-8">
        {forecast.slice(1).map((item) => (
            <div class="bg-white rounded-lg shadow-lg m-4 p-1 w-48 h-64 border-2 border-gray-500" key={item.date}>
                <div class="text-lg mb-2 text-center">
                    {item.date} ({item.dayOfWeek})
                </div>
                <img
                    src={`http://openweathermap.org/img/w/${item.icon}.png`}
                    alt={item.weatherCondition}
                    class="w-20 h-20 mx-auto mb -2 animate-pulse"
                />
                <div class="m-2 text-lg mb-2 justify-between flex text-center">
                    <MdSevereCold/>{item.minTemperature}°C<FaHotjar/> {item.maxTemperature}°C
                </div>
                <div class=" text-lg justify-between mx-12 flex "> 
                    <BsWind/> {item.windSpeed} m/s
                </div>
            </div>
        ))}
    </div>  
</motion.div>

            
         
      </>
    )}
    </div>
  );
}
    
export default Weather;