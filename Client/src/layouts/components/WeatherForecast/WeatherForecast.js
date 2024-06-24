import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import "./WeatherForecast.css";

const WeatherForecast = () => {
  const [weather, setWeather] = useState({
    morning: null,
    noon: null,
    evening: null,
  });
  const apiKey = "fc15450ddc393035f877568ebc8a39c7";
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    const currentDate = new Date();
    const days = [
      "Chủ Nhật",
      "Thứ 2",
      "Thứ 3",
      "Thứ 4",
      "Thứ 5",
      "Thứ 6",
      "Thứ 7",
    ];
    const dayOfWeek = days[currentDate.getDay()];
    const date = currentDate.toLocaleDateString("en-US", { day: "2-digit" });
    setDayOfWeek(dayOfWeek);
    setDate(date);

    const fetchLocationAndWeather = async (latitude, longitude) => {
      try {
        const locationResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
        );
        setLocation(locationResponse.data.name);

        const weatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
        );
        const forecasts = weatherResponse.data.list;

        setWeather({
          morning: forecasts.find(
            (entry) => moment.unix(entry.dt).utc().format("HH:mm") === "09:00"
          ),
          noon: forecasts.find(
            (entry) => moment.unix(entry.dt).utc().format("HH:mm") === "12:00"
          ),
          evening: forecasts.find(
            (entry) => moment.unix(entry.dt).utc().format("HH:mm") === "18:00"
          ),
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchLocationAndWeather(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, [apiKey]);

  const formatTemperature = (temp) => {
    return `${(temp - 273.15).toFixed(1)}°C`;
  };

  return (
    <div className="weather-container">
      <div className="weather-date">
        <h2>{date.replace(/(\d{1})(?!\d)/g, "$1")}</h2>
        <p>{dayOfWeek}</p>
      </div>
      <div className="weather-item">
        <h3>Sáng (9 AM)</h3>
        {weather.morning ? (
          <p>{`Nhiệt độ: ${formatTemperature(
            weather.morning.main.temp
          )}\nDescription: ${weather.morning.weather[0].description}`}</p>
        ) : (
          <p>No data available.</p>
        )}
      </div>
      <div className="weather-item">
        <h3>Trưa (12 PM)</h3>
        {weather.noon ? (
          <p>{`Nhiệt độ: ${formatTemperature(
            weather.noon.main.temp
          )}\nDescription: ${weather.noon.weather[0].description}`}</p>
        ) : (
          <p>No data available.</p>
        )}
      </div>
      <div className="weather-item">
        <h3>Chiều (6 PM)</h3>
        {weather.evening ? (
          <p>{`Nhiệt độ: ${formatTemperature(
            weather.evening.main.temp
          )}\nDescription: ${weather.evening.weather[0].description}`}</p>
        ) : (
          <p>No data available.</p>
        )}
      </div>
      <div className="weather-item">
        <div className="location">{location}</div>
      </div>
    </div>
  );
};

export default WeatherForecast;
