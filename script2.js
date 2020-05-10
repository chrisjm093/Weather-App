console.log('Start Weather APPPPPP!');
var currentDay = moment().format('L');
var cacheKey = 'savedCity';

// Get my starting data, try to load from local storage
var citiesArr = JSON.parse(localStorage.getItem( cacheKey ) );

if( !citiesArr ) {
    citiesArr = [];
            
}
console.log(citiesArr)



//Starting point
function searchWeather( ) {
    $('#search-button').on('click', function(event) {
        event.preventDefault();
        var city = $('#search-term').val();
    


    

    fetchCityWeather(city);
    
    });

}

function compileCityList( citiesArr ){
    console.log(citiesArr.length);
    console.log('entered compile city list function');    
     
    citiesArr.forEach(e => {
        var html = "<button class='city' data-city='" + e + "'>" + e + "</button>";
    $('#cities-list').prepend(html)
    console.log(e)
});

    $('.city').each(function( ) {
        $( this ).click(function(){
            var cityName = $(this).data('city');
            console.log(cityName);
            console.log(compileCityList);
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
        // console.log('initial api call response:')
        // console.log(response);
     
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
        //console.log(data)
        var uvIndex = data.current.uvi
        renderCityData(data);
        renderUVIndex(uvIndex);
        renderForcast(data);
        
    })
})};

//render five day forcast
function renderForcast(data) {
   // console.log('entered renderForcast function' + data)

    for (var i = 0; i < 5; i++){
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

    //console.log( 'able to render city data for: ' + citiesArr[0] );
    
        //try to get city data
       var cityName = citiesArr[0];

    //console.log("this is the city data: " + cityName);
        if( !cityName ) {
    
            //console.log( 'did not get data, exiting render function' );
            //exit function if no data available
            return;
        }
    
        //render data to HTML
        //console.log( 'Got the city Data, render HTML' );
       
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
       
       
       // console.log( cityName )
        if(citiesArr.indexOf(cityName) === -1){
            console.log('adding new city to storage')
            citiesArr.push( cityName );
            localStorage.setItem( cacheKey, JSON.stringify( citiesArr ) );
        }

    };


    //console.log('saved cities: ' + citiesArr)
    // Location established by client allowing location access
// function getLocation() {
//     // Make sure browser supports this feature
//     if (navigator.geolocation) {
//         // Provide our showPosition() function to getCurrentPosition
//         navigator.geolocation.getCurrentPosition(showPosition);
            
//     }else {
//         alert("Geolocation is not supported by this browser.");
//         }
//       };

// //establish client location to populate initial page load
// function showPosition(position) {
//     // Grab coordinates from the given object
//     var latitude = position.coords.latitude;
//     var longitude = position.coords.longitude;

//     console.log("Your coordinates have been read");

//     // Call function to run ajax request to pull weather data based on current location
//     yourLocationWeather(latitude, longitude);
// }

// function yourLocationWeather( latitude, longitude ) {
//     var apiKey = '&appid=b632ec08df3670825eeb6363ee690a0e';
//     var queryURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&units=imperial&exclude=hourly' + apiKey;
        
//     console.log("latitude: " + latitude + " longitude: " + longitude);
    
//     $.ajax({
//         url: queryURL,
//         method: "GET"
//     }).then(function (response) {
//         console.log(response)
        
//         renderCityData(response)
//     })
// };  

// getLocation();
searchWeather();
compileCityList(citiesArr);
