console.log()

// Get my starting data, try to load from local storage
var citiesStore = JSON.parse(localStorage.getItem( 'weatherByCity' ) );

if( ! citiesStore ) {
    citiesStore = {};

}


// Display the city's data
function renderCityData( city ){

console.log( city );

    //try to get city data
    var cityData = getCityData( city );

    if( ! cityData ) {

        console.log( 'did not get data, exiting render function' );
        //exit function if no data available
        return;


    }

    //render data to HTML
    console.log( 'Got the city Data, render HTML' );
};


// Get the cities Data
function getCityData( city ){
    //If I have existing city data
    if( citiesStore[city] ) {

        //return data
        return citiesStore[city];

        //return failed to get data
    }else{
        
        fetchCityData( city );
        return false;
    } 

};



// Fetch new data from the API if we don't have it
function fetchCityData( city ){

    var url = '';



$.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    console.log(response);
  
        //Save our response data to our storage obj
        citiesStore;
        //store only the information that we need, it's not necessary to store the entire response if we don't need all that data
        //create an object that stores the data that we need as it relates to the data on the page.

        cityStore[city] ={
            name: response.name,
            humidity: response.humidity
            //etc
        }
    }
};
    renderCityData( 'Wisconsin Rapids, WI')

    //check out font awesome for spinner to use while loading data