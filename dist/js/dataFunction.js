



export const setLocationObject = (locationObj, coordsObj) => {
    const {lat, lon,name,unit} = coordsObj;
    locationObj.setLat(lat);
    locationObj.setLon(lon);
    locationObj.setName(name);
    if(unit) {
        locationObj.setunit(unit);
    }
};

export const getHomeLocation = () => {
    return localStorage.getItem("defaultWaetherLocation")
};

export const getWeatherFromCoords = async (locationObj) => {
    const lat = locationObj.getLat();
    const lon = locationObj.getLon();
    const units = locationObj.getUnit();
    const url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units =${units}&appid = ${WEATHER_API_KEY}`;
    try {
        const weatherStream = await fetch(url);
        const weatherjson = await weatherStream.json();
        return weatherjson;
    
    }catch(err) {
        console.error(err);
    }

}

export const getCoordsFromApi =  async (entryText, units) => {
    const regex = /^\d+$/g;
    const flag = regex.test(entryText) ? "zip" : "q";
    const url = `http://api.openweathermap.org/data/2.5/weather?${flag} = ${entryText}&units =${units}&appid = ${WEATHER_API_KEY}`;
    const encodeUrl = encodeURI(url);
    try {
        const dataStream = await fetch(encodeUrl);
        const jsonData = await dataStream.json();
        console.log(jsonData);
        return jsonData;

    } catch (err) {
        console.error(err.stack);
    }
};

export const cleanText = (text) => {
    const regex = / {2,}/g;
    const entryText = text.replaceAll(regex, "").trim();
    return entryText;
}

