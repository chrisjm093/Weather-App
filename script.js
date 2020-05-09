//remove this file! it is not used anymore



// console.log('Start Weather APPPPPP!');
// var currentDay = moment().format('L')
// var cacheKey = 'weatherByCity';

// // Get my starting data, try to load from local storage
// var citiesStore = JSON.parse(localStorage.getItem( cacheKey ) );
// var citiesArr = [];


// console.log(citiesStore)
// if( !citiesStore ) {
//     citiesStore = {};
    
// }




// // Display the city's data
// function renderCityData( city ){

// console.log( 'ablt to render city data for: ' + city );

//     //try to get city data
//     var cityData = getCityData( city );
// console.log("this is the city data: " + cityData);
//     if( !cityData ) {

//         console.log( 'did not get data, exiting render function' );
//         //exit function if no data available
//         return;
//     }

//     //render data to HTML
//     console.log( 'Got the city Data, render HTML' );
//     $('#city-name').append(cityData.name + " " + currentDay);
//     $('#temp').append('Temperature: ' + cityData.temp + '°F');
//     $('#humidity').append('Humidity: ' + cityData.humidity + '%');
//     $('#wind').append('Wind Speed:  ' + cityData.windSpeed + 'mph');

// };


// // Get the cities Data
// function getCityData( city ){
//     //If I have existing city data
//     if( citiesStore[city] ) {

//         //return data
//         return citiesStore[city];

//         //return failed to get data
//     }else{
        
//         fetchCityData( city );
//         return false;
//     } 

// };



// // Fetch new data from the API if we don't have it
// function fetchCityData( city ){
//     var apiKey = '&appid=b632ec08df3670825eeb6363ee690a0e';
    
//     var cityURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + apiKey;
    
//     $.ajax({
//         url: cityURL,
//         method: "GET"
//       }).then(function (response) {
//         console.log( 'city search to lat/long processing' + response);

//     var cityName = response.name
//     var latitude = response.coord.lat;
//     var longitude = response.coord.lon;
//     var queryURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&units=imperial&exclude=hourly' + apiKey;
//     console.log(cityName)
//    console.log("latitude: " + latitude + " longitude: " + longitude);


// $.ajax({
//     url: queryURL,
//     method: "GET"
//   }).then(function (response) {
//     console.log(response)
  
//         //Save our response data to our storage obj
//         citiesStore;
//         //store only the information that we need, it's not necessary to store the entire response if we don't need all that data
//         //create an object that stores the data that we need as it relates to the data on the page.

//         citiesStore[city] = {
//             name: cityName,
//             temp: response.current.temp,
//             humidity: response.current.humidity,
//             windSpeed: response.current.wind_speed,
//             UVIndex: response.current.uvi
           
//         } 
//         // fiveDayForcast[city] = {

//         // }
        
//         localStorage.setItem( cacheKey, JSON.stringify( citiesStore ) )
//         console.log(' city object information stored' + citiesStore);
//         renderCityData( city );
//     })
// })};

// $('#search-button').on('click', function(event) {
//     event.preventDefault();
//     var city = $('#search-term').val();


// renderCityData(city);

// });