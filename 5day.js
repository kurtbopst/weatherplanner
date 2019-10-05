
    var coords = [30.332184, -81.655647];//Jacksonville
    var marker = null;
    var weatherDays = [];
    var data_now;

    const mymap = L.map('locate-map').setView([0, 0], 1.5); //Create Leaflet.js interactive map


    const attribution = 
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const tiles = L.tileLayer(tileUrl,  { attribution });
    tiles.addTo(mymap);



    //Using cors-anywhere to get rid of CORS issue
    const api_now =
     "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/579b5e61e05df0d045fa12eec4467f58/";

    async function getWeather(coords) {
        
        
        const response_now = await fetch(api_now + coords[0] + "," + coords[1]);
        data_now = await response_now.json();


        console.log( "DarkSky API - " + api_now + coords[0] + "," + coords[1])
        populateTable(data_now);
    }


    //Get location based on Geolocation
    function getLocation() {
        if (navigator.geolocation) {
            tileUrl
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

        //5-day forecast with DarkSky.net
        var min, max, avgtemp; //Temperature
        for(i = 1; i < 6; i++){
            document.getElementById((i).toString() + "-dt").innerHTML = 
                secondsToString(weatherNow.daily.data[i].time);


            switch(weatherNow.daily.data[i].icon.toString()){//Weather Pictures
                case "partly-cloudy-day": 
                    document.getElementById((i).toString() + "-pic").src = 
                        "src/weather/cloudy.png";
                    break;
                case "Rain": //cnage 'Rain' to appropriate value
                    document.getElementById((i).toString() + "-pic").src = 
                        "src/weather/drizzle.png";
                    break;
                case "clear-day":
                    document.getElementById((i).toString() + "-pic").src = 
                        "src/weather/sunny.png";
                    break;
                default:
                    document.getElementById((i).toString() + "-pic").src = 
                        "src/weather/sunny.png";
                    break;
            }
            //average high and low temps
            max = weatherNow.daily.data[i].temperatureMax;
            min = weatherNow.daily.data[i].temperatureMin;
            avgtemp = (max + min)/2;

            document.getElementById((i).toString() + "-avg").innerHTML = 
                avgtemp.toFixed(0).toString() + " °F"; // Temperature
            document.getElementById((i).toString() + "-hl").innerHTML =  
                "Wind speed: " + weatherNow.daily.data[i].windSpeed.toString() + "\n" +
                "Heading: " + weatherNow.daily.data[i].windBearing.toString() + "°" + windDir(weatherNow.daily.data[i].windBearing);

        }
        // Present Weather
        // CURRENT DATE 
        document.getElementById("0-dt").innerHTML = secondsToString(weatherNow.currently.time);
        // IMAGE document.getElementById("0-pic").src =
        document.getElementById("0-avg").innerHTML = 
            weatherNow.currently.temperature.toFixed(0).toString() + " °F"; 
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

    function secondsToString(seconds){
        var ms = seconds * 1000;//time is passed as sec, converted to msec
        var dtOptions = {weekday: 'short', month: 'short', day: 'numeric'};
        var d = new Date(ms); 

        return d.toLocaleDateString("en-us", dtOptions); // Date
    }

    
    getLocation();
    mymap.on('click', onMapClick);

    

    