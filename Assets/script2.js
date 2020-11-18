var currentDay = moment().format('L');
var cacheKey = 'savedCity';

// Get my starting data, try to load from local storage
var citiesArr = JSON.parse(localStorage.getItem( cacheKey ) );

if( !citiesArr ) {
    citiesArr = [];       
}

//function randomly generates image for background
function getRandomImage() {
    var images = ["url('https://cdn.pixabay.com/photo/2015/03/26/09/47/sky-690293_960_720.jpg')", 
                "url('https://images.unsplash.com/photo-1499346030926-9a72daac6c63?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80')", 
                "url('https://cdn.pixabay.com/photo/2018/08/23/07/35/thunderstorm-3625405_960_720.jpg')", 
                "url('https://cdn.pixabay.com/photo/2013/02/21/19/10/sea-84629_960_720.jpg')", 
                "url('https://cdn.pixabay.com/photo/2016/10/18/21/22/california-1751455_960_720.jpg')",
                "url('https://cdn.pixabay.com/photo/2015/11/22/15/16/lightning-1056419_960_720.jpg')",
                "url('https://cdn.pixabay.com/photo/2018/04/12/18/13/sunset-3314275_960_720.jpg')",
                "url('https://cdn.pixabay.com/photo/2017/01/06/23/04/homberg-1959229_960_720.jpg')",
                "url('https://cdn.pixabay.com/photo/2017/12/29/18/47/nature-3048299_960_720.jpg')",
                "url('https://cdn.pixabay.com/photo/2016/03/04/19/36/beach-1236581_960_720.jpg')",
                "url('https://cdn.pixabay.com/photo/2018/05/30/00/24/thunderstorm-3440450_960_720.jpg')",
                "url('https://cdn.pixabay.com/photo/2016/10/25/14/03/clouds-1768967_960_720.jpg')"];
    var image = images[Math.floor(Math.random()*images.length)];
     
   document.body.style.backgroundImage = image
}

//Random background image generated call
getRandomImage()

//Function for initiating weather search from form input
function searchWeather( ) {
    $('#search-term').keyup( e => {
        
        if (e.keyCode === 13){
            e.preventDefault();
            $('#search-button').click();
        }
    });
    $('#search-button').on('click', function(event) {
        event.preventDefault();
        var city = $('#search-term').val();
    
    fetchCityWeather(city);
    
    });
}

// Pulls previously searched cities from the array of cities stored in local storage
function compileCityList( citiesArr ){
      $('#cities-list').html('');

    citiesArr.forEach(e => {
        var html = `<button class='btn btn-light btn-block city' data-city='${e}'>${e}<span data-city='${e}'class='delete-this btn btn-outline-danger'>X</span></button>`;
        
        $('#cities-list').prepend(html)
    });

    $('.city').each( function()  {
        $( this ).click(function(){
            var cityName = $(this).data('city');
            fetchCityWeather(cityName);
        })
    });

    $('.delete-this').each( function() {
        $( this ).click( function ()  {
            var cityToDelete = $(this).data('city');
             deleteFromStorage(cityToDelete);
        })
    })
}

//Get weather from API
// Fetch new data from the API if we don't have it
function fetchCityWeather( city ){
    var apiKey = '&appid=b632ec08df3670825eeb6363ee690a0e';
    var cityURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}${apiKey}`;
    
    $.ajax({
        url: cityURL,
        method: "GET"
    }).then(function (response) {
 
        $('#city-name').html( `${response.name} ${currentDay}` );
       
        var cityName = response.name
        var latitude = response.coord.lat;
        var longitude = response.coord.lon;
        var queryURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&exclude=hourly${apiKey}`;
    
        var weatherImg = 'http://openweathermap.org/img/w/'+ response.weather[0].icon + '.png'
        
        //sends searched city to function to add it to the stored cities array
        addNewCity(cityName)
    
        //displays image icon of current weather
        $('.weather-img').attr("src", weatherImg)

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (data) {
        
            var uvIndex = data.current.uvi
            renderCityData(data);
            renderUVIndex(uvIndex);
            renderForcast(data);
            
        })
    })
    .fail(function(){
        alert("Search failed, Please try another city.")
    })
};

//delete city from local storage
function deleteFromStorage( cityToDelete ) {
  
    const index = citiesArr.indexOf( cityToDelete );
    
    if (index > -1 ){
        citiesArr.splice(index, 1);
        localStorage.setItem( cacheKey, JSON.stringify( citiesArr ))
    };
   
    compileCityList(citiesArr);
}
//render five day forcast
function renderForcast(data) {
   
    for (var i = 1; i < 6; i++){
        var weatherImg = `http://openweathermap.org/img/w/${data.daily[i].weather[0].icon}.png`;
        var formattedDate = moment.unix(data.daily[i].dt).format('l')
       

         $('#forcast-' + i).html(formattedDate)
        $('.weather-img-' + i).attr("src", weatherImg)
        $('#temp-' + i).html('Temp: ' + Math.round(data.daily[i].temp.day) + '°F');
        $('#humidity-' + i).html('Humidity: ' + data.daily[i].humidity + '%');
        
    }
}

// Display the searched city weather data
function renderCityData( data ){

    //try to get city data
    var cityName = citiesArr[0];

    if( !cityName ) {

        //exit function if no data available
        return;
    }
    
    //render data to HTML
    $('#temp').html(`Temperature: ${data.current.temp}°F`);
    $('#humidity').html(`Humidity: ${data.current.humidity}%`);
    $('#wind').html(`Wind Speed: ${data.current.wind_speed}mph`);
    
};

//display UV index within a color coded tile that indicates severity level
function renderUVIndex(uvIndex){
   
    $('#uv-index').html('UV Index:  ')
   
    if( uvIndex > 5 ){
        
        $('#uv-index-span').html( uvIndex );
        $('#uv-index-span').css({ 'background-color': 'red', 'padding-left' : '2px', 'padding-right' : '2px', 'border-radius' : '3px' });
    
    }else if( uvIndex < 6 && uvIndex > 2){
        
        $('#uv-index-span').html( uvIndex )
        $('#uv-index-span').css({ 'background-color': 'yellow', 'padding-left' : '2px', 'padding-right' : '2px', 'border-radius' : '3px' });

    }else{

        $('#uv-index-span').html( uvIndex );
        $('#uv-index-span').css({ 'background-color': 'green', 'padding-left' : '2px', 'padding-right' : '2px', 'border-radius' : '3px' });
    };
}

function addNewCity(cityName) {
        
    if(citiesArr.indexOf(cityName) === -1){
        
        citiesArr.push( cityName );
        localStorage.setItem( cacheKey, JSON.stringify( citiesArr ) );
    }
    compileCityList(citiesArr);
    
};

    // Location established by client allowing location access
function getLocation() {
    // Make sure browser supports this feature
    if (navigator.geolocation) {
        // Provide our showPosition() function to getCurrentPosition
        navigator.geolocation.getCurrentPosition(showPosition);
            
    }else {
        alert("Geolocation is not supported by this browser.");
    }
};


function showPosition(position) {
    // Grab coordinates from the given object
    var latitude = position.coords.latitude.toFixed(4);
    var longitude = position.coords.longitude.toFixed(4);

    // Call function that runs ajax request to pull weather data based on current location
    yourLocationWeather(latitude, longitude);
}

//ajax call that converts latitude and longitude to the closes city
function yourLocationWeather( latitude, longitude ) {
    console.log("latitude" + latitude)
    console.log("longitude " + longitude)
    var queryURL = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=3620c85faf154e74a7e16400eae1d31e`;
        
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        fetchCityWeather(response.results[0].components.town)
    })
};  

getLocation();
searchWeather();
compileCityList(citiesArr);
