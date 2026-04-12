import requests
from typing import Optional

def get_weather(lat: float, lon: float) -> str:
    try:
        url = "https://api.open-meteo.com/v1/forecast"
        params = {
            "latitude": lat,
            "longitude": lon,
            "current_weather": True
        }
        r = requests.get(url, params=params, timeout=10)
        if r.status_code != 200: return "Weather service unavailable."
        
        data = r.json()
        current = data.get("current_weather", {})
        temp = current.get("temperature")
        wind = current.get("windspeed")

        advisory = "Normal farming conditions."
        if temp and temp >= 35: advisory = "High temperature. Increase irrigation."
        elif wind and wind >= 25: advisory = "High wind speed. Avoid spraying chemicals."

        return f"Current Weather: {temp}°C, Wind: {wind} km/h. Advisory: {advisory}"
    except:
        return "Unable to fetch weather data."
