var currentDay = moment().format('L');
var cacheKey = 'savedCity';

// Get my starting data, try to load from local storage
var citiesArr = JSON.parse(localStorage.getItem( cacheKey ) );

if( !citiesArr ) {
    citiesArr = [];
            
}
console.log(citiesArr)

function getRandomImage() {
    var images = ["url('https://cdn.pixabay.com/photo/2015/03/26/09/47/sky-690293_960_720.jpg')", 
                "url('https://images.unsplash.com/photo-1499346030926-9a72daac6c63?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80')", 
                "url('https://cdn.pixabay.com/photo/2018/08/23/07/35/thunderstorm-3625405_960_720.jpg', 'https://cdn.pixabay.com/photo/2013/02/21/19/10/sea-84629_960_720.jpg')", 
                "url('https://cdn.pixabay.com/photo/2016/10/18/21/22/california-1751455_960_720.jpg')",
                "url('https://cdn.pixabay.com/photo/2013/10/02/23/03/dawn-190055_960_720.jpg')",
                "url('https://cdn.pixabay.com/photo/2015/11/22/15/16/lightning-1056419_960_720.jpg')",
                "url('https://cdn.pixabay.com/photo/2018/04/12/18/13/sunset-3314275_960_720.jpg')",
                "url('https://cdn.pixabay.com/photo/2017/01/06/23/04/homberg-1959229_960_720.jpg')",
                "url('https://cdn.pixabay.com/photo/2017/12/29/18/47/nature-3048299_960_720.jpg')",
                "url('https://cdn.pixabay.com/photo/2016/03/04/19/36/beach-1236581_960_720.jpg')",
                "url('https://cdn.pixabay.com/photo/2018/05/30/00/24/thunderstorm-3440450_960_720.jpg')",
                "url('https://cdn.pixabay.com/photo/2016/10/25/14/03/clouds-1768967_960_720.jpg')"];
    var image = images[Math.floor(Math.random()*images.length)];
     console.log(image)
   
   document.body.style.backgroundImage = image
    }

getRandomImage()


    
   
       
        


//Starting point
function searchWeather( ) {
    $('#search-button').on('click', function(event) {
        event.preventDefault();
        var city = $('#search-term').val();
    


    

    fetchCityWeather(city);
    
    });

}

function compileCityList( citiesArr ){
      
    citiesArr.forEach(e => {
        var html = "<button class='city' data-city='" + e + "'>" + e + "</button>";
    $('#cities-list').prepend(html)
   
});

    $('.city').each(function( ) {
        $( this ).click(function(){
            var cityName = $(this).data('city');
            
            fetchCityWeather(cityName);
        })
    });
}

//}

//Get weather from API
// Fetch new data from the API if we don't have it
function fetchCityWeather( city ){
    var apiKey = '&appid=b632ec08df3670825eeb6363ee690a0e';
    
    var cityURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + apiKey;
    
    $.ajax({
        url: cityURL,
        method: "GET"
      }).then(function (response) {
    //   if (response == null){
    //       alert("City not Found, please enter a valid city")
    //   }
    //  console.log(response)
        $('#city-name').html(response.name + " " + currentDay );
        
    var cityName = response.name
    var latitude = response.coord.lat;
    var longitude = response.coord.lon;
    var queryURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&units=imperial&exclude=hourly' + apiKey;
   
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
})};

//render five day forcast
function renderForcast(data) {
   

    for (var i = 1; i < 6; i++){
        var weatherImg = 'http://openweathermap.org/img/w/'+ data.daily[i].weather[0].icon + '.png';
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
       
        $('#temp').html('Temperature: ' + data.current.temp + '°F');
        $('#humidity').html('Humidity: ' + data.current.humidity + '%');
        $('#wind').html('Wind Speed:  ' + data.current.wind_speed + 'mph');
    
    };

function renderUVIndex(uvIndex){
   
    $('#uv-index').html('UV Index:  ')
   
    if( uvIndex > 5 ){
        
        $('#uv-index-span').html( uvIndex );
        $('#uv-index-span').css({ 'background-color': 'red', 'padding-left' : '2px', 'padding-right' : '2px', 'border-radius' : '3px' });
    
    }else if( uvindex < 6 && uvIndex > 2){
        
        $('#uv-index-span').html( uvIndex )
        $('#uv-index-span').css({ 'background-color': 'yellow', 'padding-left' : '2px', 'padding-right' : '2px', 'border-radius' : '3px' });

    }else{

        $('#uv-index-span').html( uvIndex );
        $('#uv-index-span').css({ 'background-color': 'green', 'padding-left' : '2px', 'padding-right' : '2px', 'border-radius' : '3px' });

    };


}

    function addNewCity(cityName) {
         
        if(citiesArr.indexOf(cityName) === -1){
            console.log('adding new city to storage')
            citiesArr.push( cityName );
            localStorage.setItem( cacheKey, JSON.stringify( citiesArr ) );
        }

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

//establish client location to populate initial page load
function showPosition(position) {
    // Grab coordinates from the given object
    var latitude = position.coords.latitude.toFixed(4);
    var longitude = position.coords.longitude.toFixed(4);


    // Call function to run ajax request to pull weather data based on current location
    yourLocationWeather(latitude, longitude);
}

function yourLocationWeather( latitude, longitude ) {
    //var apiKey = '3620c85faf154e74a7e16400eae1d31e';
    var queryURL = 'https://api.opencagedata.com/geocode/v1/json?q=' + latitude + '+' + longitude + '&key=3620c85faf154e74a7e16400eae1d31e';
        
    
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response.results[0].components.city)
        
        fetchCityWeather(response.results[0].components.city)
    })
};  

getLocation();

searchWeather();
compileCityList(citiesArr);
