
    var coords = [39.9526, 75.1652];//Philadelphia
    var marker = null;
    var weatherDays = [];
    var data_now;

    const mymap = L.map('locate-map').setView([0, 0], 1.5); //Create Leaflet.js interactive map


    const attribution = 
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const tiles = L.tileLayer(tileUrl,  { attribution });
    tiles.addTo(mymap);



    const api_url =
     "https://api.openweathermap.org/data/2.5/forecast?units=imperial&lat=";
    const key = "f04a7c6c9de841138cad64e676021c42";

    //Using cors-anywhere to get rid of CORS issue
    const api_now =
     "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/579b5e61e05df0d045fa12eec4467f58/";

    async function getWeather(coords) {
        const response = await fetch(api_url + coords[0] + "&lon=" + coords[1] + "&appid=" + key);
        const data = await response.json();
        if(weatherDays.length > 0)
            weatherDays = [];
            
        
        var i;
        for(i = 0;i <= data.list.length-1; i++){
            if(data.list[i].dt_txt.toString().includes("15:00:00")){
                weatherDays.push(data.list[i]); 
            }
        }

        const response_now = await fetch(api_now + coords[0] + "," + coords[1]);
        data_now = await response_now.json();


        console.log( "DarkSky API - " + api_now + coords[0] + "," + coords[1])
        console.log( "OpenWeatherMap API - " + api_url + coords[0] + "&lon=" + coords[1] + "&appid=" + key)
        console.log(weatherDays);
        populateTable(data_now);
    }


    //Get location based on Geolocation
    function getLocation() {
        if (navigator.geolocation) {
           navigator.geolocation.getCurrentPosition(placeMarker);
        }else {
            x.innerHTML = "Geolocation is not supported by this browser.";
        }
    }function placeMarker(pos){
        coords = [pos.coords.latitude, pos.coords.longitude];
        marker = L.marker( [pos.coords.latitude, pos.coords.longitude]).addTo(mymap);
        mymap.setView([pos.coords.latitude, pos.coords.longitude], 9);
    }



    function onMapClick(e){
        coords = [e.latlng.lat, e.latlng.lng];
        if(marker != null)
            marker.setLatLng(e.latlng);
        else
            marker = L.marker( [e.latlng.lat, e.latlng.lng]).addTo(mymap);
    
        
    }

    function populateTable(weatherNow){
        // 5 Day Forecast
        for(var i =0 ; i < weatherDays.length; i++){     
            document.getElementById((i+1).toString() + "-dt").innerHTML = 
                weatherDays[i].dt_txt.toString().slice(5,10); // Temperature

            switch(weatherDays[i].weather[0].main.toString()){//Weather Pictures
                case "Clouds": 
                    document.getElementById((i+1).toString() + "-pic").src = 
                        "src/weather/cloudy.png";
                    break;
                case "Rain":
                    document.getElementById((i+1).toString() + "-pic").src = 
                        "src/weather/drizzle.png";
                    break;
                case "Clear":
                    document.getElementById((i+1).toString() + "-pic").src = 
                        "src/weather/sunny.png";
                    break;
                default:
                    document.getElementById((i+1).toString() + "-pic").src = 
                        "src/weather/sunny.png";
                    break;
            }
            
            document.getElementById((i+1).toString() + "-avg").innerHTML = 
                weatherDays[i].main.temp.toString() + " °F"; // Temperature
            document.getElementById((i+1).toString() + "-hl").innerHTML =  
                "Wind speed: " + weatherDays[i].wind.speed.toString() + "\n" +
                "Heading: " + weatherDays[i].wind.deg.toString() + "°" + windDir(weatherDays[i].wind.deg);
        }

        // Present Weather
        // CURRENT DATE document.getElementById("0-dt").innerHTML =
        // IMAGE document.getElementById("0-pic").src =
        document.getElementById("0-avg").innerHTML = 
            weatherNow.currently.temperature.toString() + " °F"; 
        document.getElementById("0-hl").innerHTML = 
            "Wind speed: " + weatherNow.currently.windSpeed.toString() + "\n" +
            "Heading: " + weatherNow.currently.windBearing.toString() + "°" + windDir(weatherNow.currently.windBearing);

    }

    function windDir(degrees){
        var heading;
        
        if(degrees<30)
            heading = 'N';
        else if (degrees<60)
            heading = 'NE'
        else if (degrees < 120)
            heading = 'E';
        else if (degrees < 150)
            heading = 'SE';
        else if (degrees < 210)
            heading = 'S';
        else if (degrees < 240)
            heading = 'SW';
        else if (degrees < 300)
            heading = 'W';
        else if (degrees < 330)
            heading = 'NW';
        else
            heading = 'N';

        return heading;
    }


    
    getLocation();
    mymap.on('click', onMapClick);

    

    