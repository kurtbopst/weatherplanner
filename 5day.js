    var coords = [39.9526, 75.1652];//Philadelphia
    var marker = null;
    var weatherDays = [];

    const mymap = L.map('locate-map').setView([0, 0], 1.5); //Create Leaflet.js interactive map


    const attribution = 
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const tiles = L.tileLayer(tileUrl,  { attribution });
    tiles.addTo(mymap);



    const api_url =
     "https://api.openweathermap.org/data/2.5/forecast?lat=";
    const key = "f04a7c6c9de841138cad64e676021c42";

    async function getWeather(coords) {
        const response = await fetch(api_url + coords[0] + "&lon=" + coords[1] + "&units=imperial&appid=" + key);
        const data = await response.json();
        if(weatherDays.length > 0)
            weatherDays = [];
        
        var i;
        for(i = 0;i <= data.list.length-1; i++){
            if(data.list[i].dt_txt.toString().includes("15:00:00")){
                weatherDays.push(data.list[i]); 
            }
        }
        console.log(weatherDays);
        populateTable();
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

    function populateTable(){
        //forecast-pic
        var i;
        for(i =0 ; i < weatherDays.length; i++){

            //var temp = weatherDays[i].dt_txt.toString();
            

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
                case "Rain":
                    document.getElementById((i+1).toString() + "-pic").src = 
                        "src/weather/sunny.png";
                    break;
                // case "Rain":
                //     document.getElementById((i+1).toString() + "-pic").src = 
                //         "src/weather/sunny.png";
                //     break;
                // case "Rain":
                //     document.getElementById((i+1).toString() + "-pic").src = 
                //         "src/weather/sunny.png";
                //     break;
                default:
                    document.getElementById((i+1).toString() + "-pic").src = 
                        "src/weather/sunny.png";
                    break;
            }
            
            document.getElementById((i+1).toString() + "-avg").innerHTML = 
                weatherDays[i].main.temp.toString() + " °F"; // Temperature
            document.getElementById((i+1).toString() + "-hl").innerHTML =  
                "Wind speed: " + weatherDays[i].wind.speed.toString() + "\n" +
                "Heading: " + weatherDays[i].wind.deg.toString() + "°";


        }





    }


    
    getLocation();
    mymap.on('click', onMapClick);

    

    