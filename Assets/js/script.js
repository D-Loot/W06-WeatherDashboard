var searchButton = document.querySelector("#searchButton")
var cityText = document.querySelector("#cityText")
var searchHistorySection = document.querySelector("#searchHistorySection")

var selectedCity = "";

// TODO: Load the existing buttons from local storage
// Use "createCityButton" to generate a button after reading the local storage

// create a button with the text of the button equal to the submitted city

init();
function init(){
    loadLocalStorage();
}

searchButton.addEventListener('click',function(event){
    event.preventDefault();
    createCityButton();
})

// When the button is pushed, add another button with the submitted text
function createCityButton(){
    const buttonName = cityText.value;

// TODO - GLOBAL VARIABLE
    selectedCity = buttonName;

// https://spicyyoghurt.com/tutorials/javascript/store-data-html5-local-storage
// TODO - GLOBAL VARIABLE
    if (localStorage.getItem(`city-${selectedCity}`) === null){
        var buttonElement = document.createElement("button");
// TODO - GLOBAL VARIABLE
        buttonElement.className = `align-self-center cityButton city-${selectedCity}`
        buttonElement.setAttribute("id", "cityButton")
        buttonElement.innerText = buttonName

        searchHistorySection.append(buttonElement)
    }
    localStorage.setItem(`city-${selectedCity}`,selectedCity)

// TODO - ADD functionality to the button
    buttonElement.addEventListener("click",function(event){
        selectedCity = "";
        selectedCity = event.target.innerText;
        createCurrentWeatherSection();
    })

    createCurrentWeatherSection();
}

function loadLocalStorage(){

    var lsObject = Object.keys(localStorage)

    for (i=0;i<lsObject.length;i++){
        var initButtonElement = document.createElement("button");
// Include "cityButton" to group these elements to a single event listener
        initButtonElement.className = `align-self-center cityButton city-${localStorage.getItem(lsObject[i])}`
        initButtonElement.setAttribute("id", "cityButton")
        initButtonElement.innerText = localStorage.getItem(lsObject[i]);

        searchHistorySection.append(initButtonElement)
    }
    loadExistingButtons();
}

// https://stackoverflow.com/questions/55012836/why-does-queryselector-only-select-the-first-element-and-how-can-i-fix-this
function loadExistingButtons(){
    document.querySelectorAll(".cityButton").forEach(buttons => buttons.addEventListener("click", () => {

// TODO - ASSIGNING GLOBAL VARIABLE IF THE BUTTON IS CLICKED
        selectedCity = "";
        selectedCity = event.target.innerText;
        createCurrentWeatherSection()
    }
    ))
}
// Create a function to display all of the information for the current weather in the selected city

function createCurrentWeatherSection(){

    const cityName = selectedCity

// Clear the section first, then add to the section once again
    // https://getbootstrap.com/docs/4.0/utilities/display/
    if (document.getElementById("weatherDisplay")){
        document.getElementById("weatherDisplay").remove()
    }

    var contentSectionElement = document.createElement("section");
    contentSectionElement.className = "weatherDisplay border justify-content-around text-center m-3"
    contentSectionElement.setAttribute("id", "weatherDisplay")

    getWeatherDivSection(contentSectionElement, "Current");

    document.querySelector("#contentSection").append(contentSectionElement)
    getFutureWeatherSection();
}

function getFutureWeatherSection(){
    var futureWeatherDiv = document.createElement("section")
    futureWeatherDiv.className = "text-center row border justify-content-around m-4"
    futureWeatherDiv.setAttribute("id", "futureWeatherDisplay")

// TODO: this function adds a weather section to the Weather Div and gives an id of 1 (later used to create day1) to each item
    getWeatherDivSection(futureWeatherDiv, 1)
    getWeatherDivSection(futureWeatherDiv, 2)
    getWeatherDivSection(futureWeatherDiv, 3)
    getWeatherDivSection(futureWeatherDiv, 4)

    document.querySelector("#weatherDisplay").append(futureWeatherDiv)

// TODO: Check that this works
    getWeatherInfo();
}

function getWeatherDivSection(originalCodeContainer,dayNum){

// TODO - GLOBAL VARIABLE
    const cityName = selectedCity;
    const timeID = "timeIdDay"+dayNum;
    const weatherIcon = "weatherIcon"+dayNum;
    const tempID = "tempIdDay"+dayNum;
    const humidityID = "humidityIdDay"+dayNum;
    const uvIndexID = "uvIndexID"+dayNum;

    var divSection = document.createElement("section");

    divSection.className = "m-2"

    var pCity = document.createElement('p');
    pCity.className = `align-self-left`
    pCity.innerText = cityName;
    divSection.append(pCity);

    var pTime = document.createElement('p');
    pTime.className = `align-self-left ${timeID}`
    divSection.append(pTime)

    var pTemp = document.createElement('p');
    pTemp.className = `align-self-left ${tempID}`
    divSection.append(pTemp)

    var pHumidity = document.createElement('p');
    pHumidity.className = `align-self-left ${humidityID}`
    // Text to be added later
    // pTemp.innerText = temperature2
    divSection.append(pHumidity);

    var pUVI = document.createElement('p');
    pUVI.className = `align-self-left ${uvIndexID}`
    // Text to be added later
    // pTemp.innerText = temperature2
    divSection.append(pUVI);

    originalCodeContainer.append(divSection)
}

// TODO: create a function to get the information needed for the weather elements
function getWeatherInfo(){
    var latitude;
    var longitude;

    // TODO: keep KeyboardEvent, remove "API City Name" and move to attach apiCityName to cityText.value
    var apiKey = "046bc294aa42125873f047e14ff6f4c3"

// TODO - ASSIGNING A GLOBAL VARIABLE
    var apiCityName = selectedCity

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${apiCityName}&appid=${apiKey}`)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        // console.log(data);
        // console.log(data.main.temp);
        latitude = data.coord.lat;
        longitude = data.coord.lon;

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly&appid=${apiKey}`)
        .then(function (secondResponse) {
            return secondResponse.json();

        })
        .then(function (secondData) {
            // console.log(data);

    // TODO: log all temp data
            console.log(secondData);
            for (i = 0; i < 5; i++){
                if (i == 0){
// https://coderrocketfuel.com/article/convert-a-unix-timestamp-to-a-date-in-vanilla-javascript
                    const dateTime = new Date(secondData.current.dt * 1000)

                    document.querySelector(`.timeIdDayCurrent`).innerText = `Date: ${dateTime.toLocaleString("en-US", {month: "long"})} ${dateTime.toLocaleString("en-US", {day: "numeric"})}, ${dateTime.toLocaleString("en-US", {year: "numeric"})}`


                    // addText(`tempIdDayCurrent`, secondData.current.temp)
                    document.querySelector(`.tempIdDayCurrent`).innerText = `Temp: ${(((secondData.current.temp-273.15)*1.8)+32).toFixed(2)}\xB0 `
                    // console.log(secondData.current.temp)
                    // addText(`humidityIdDayCurrent`, secondData.current.humidity)

// TODO WEATHER ICON --------------------------------------------------------
// REF:  https://openweathermap.org/weather-conditions#Weather-Condition-Codes-2
                    console.log(secondData.current.weather[0].id == 800)
                        if (secondData.current.weather[0].id < 233){
                            var pc = "🌩️"; // 🌩️ THUNDERSTORM
                        } else if (secondData.current.weather[0].id < 322){
                            var pc = "🌦️";  // 🌦️ Drizzle
                        } else if (secondData.current.weather[0].id < 505){
                            var pc = "🌧️"; // 🌧️ SHOWER RAIN
                        } else if (secondData.current.weather[0].id < 512){
                            var pc = "❄️"; // ❄️ SNOW
                        } else if (secondData.current.weather[0].id < 532){
                            var pc = "🌨️"; // 🌨️ RAIN
                        } else if (secondData.current.weather[0].id < 623){
                            var pc = "❄️"; // SNOW
                        } else if (secondData.current.weather[0].id < 782){
                            var pc = "🌫️"; // 🌫️ MIST
                        } else if (secondData.current.weather[0].id == 800){
                            var pc = "🌞"; // 🌞 CLEAR
                        } else if (secondData.current.weather[0].id == 801){
                            var pc = "🌤️"; // 🌤️FEW CLOUDS
                        } else if (secondData.current.weather[0].id == 802){
                            var pc = "🌤️"; // 🌤️SCATTERED CLOUDS
                        } else if (secondData.current.weather[0].id == 803){
                            var pc = "🌥️"; // 🌥️BROKEN CLOUDS
                        } else {
                            var pc = "🌥️"; // 🌥️OVERCAST CLOUDS
                        }

                    document.querySelector(`.tempIdDayCurrent`).append(pc)

// TODO WEATHER ICON --------------------------------------------------------

                    document.querySelector(`.humidityIdDayCurrent`).innerText = `Humidity: ${secondData.current.humidity}`
                    // addText(`uvIndexIDCurrent`, secondData.current.uvi)
                    document.querySelector(`.uvIndexIDCurrent`).innerText = `UVI: ${secondData.current.uvi}`
                } else {
                    // // addText(`tempIdDay${i}`, secondData.daily[1].temp.day)
                    // console.log(`.tempIdDay${i}: ${((secondData.daily[i].temp.day-273.15)*1.8)+32}\xB0`)
                    // ((secondData.daily[i].temp.day-273.15)*1.8)+32

                    const dateTime = new Date(secondData.daily[i].dt * 1000)

                    document.querySelector(`.timeIdDay${i}`).innerText = `Date: ${dateTime.toLocaleString("en-US", {month: "long"})} ${dateTime.toLocaleString("en-US", {day: "numeric"})}, ${dateTime.toLocaleString("en-US", {year: "numeric"})}`

                    document.querySelector(`.tempIdDay${i}`).innerText = `Temp: ${(((secondData.daily[i].temp.day-273.15)*1.8)+32).toFixed(2)}\xB0`
                    // console.log(`.humidityIdDay${i}: ${secondData.daily[i].humidity}`)

                    // TODO WEATHER ICON --------------------------------------------------------
// REF:  https://openweathermap.org/weather-conditions#Weather-Condition-Codes-2
console.log(secondData.daily[i].weather[0].id == 800)
if (secondData.daily[i].weather[0].id < 233){
    var pc = "🌩️"; // 🌩️ THUNDERSTORM
} else if (secondData.daily[i].weather[0].id < 322){
    var pc = "🌦️";  // 🌦️ Drizzle
} else if (secondData.daily[i].weather[0].id < 505){
    var pc = "🌧️"; // 🌧️ SHOWER RAIN
} else if (secondData.daily[i].weather[0].id < 512){
    var pc = "❄️"; // ❄️ SNOW
} else if (secondData.daily[i].weather[0].id < 532){
    var pc = "🌨️"; // 🌨️ RAIN
} else if (secondData.daily[i].weather[0].id < 623){
    var pc = "❄️"; // SNOW
} else if (secondData.daily[i].weather[0].id < 782){
    var pc = "🌫️"; // 🌫️ MIST
} else if (secondData.daily[i].weather[0].id == 800){
    var pc = "🌞"; // 🌞 CLEAR
} else if (secondData.daily[i].weather[0].id == 801){
    var pc = "🌤️"; // 🌤️FEW CLOUDS
} else if (secondData.daily[i].weather[0].id == 802){
    var pc = "🌤️"; // 🌤️SCATTERED CLOUDS
} else if (secondData.daily[i].weather[0].id == 803){
    var pc = "🌥️"; // 🌥️BROKEN CLOUDS
} else {
    var pc = "🌥️"; // 🌥️OVERCAST CLOUDS
}

document.querySelector(`.tempIdDay${i}`).append(pc)

// TODO WEATHER ICON --------------------------------------------------------
                    document.querySelector(`.humidityIdDay${i}`).innerText = `Humidity: ${secondData.daily[i].humidity}`
                    // console.log(`.humidityIdDay${i}: ${secondData.daily[i].uvi}`)
                    document.querySelector(`.uvIndexID${i}`).innerText = `UVI: ${secondData.daily[i].uvi}`
                    // console.log(secondData)

                    // console.log(secondData.daily[1].temp.day)
                }

            }

// TODO: create a function to add API info to the text located in the created section/p elements: temp, humidity, UVI, etc.
            // displayInfo(secondData,"humidityID1");

        });
    });
}

// function addText(id,content){

//     var tempIdDay = document.querySelector(`#tempIdDay${id}`)
//     tempIdDay.innerText = content;
//     // futureWeatherDivSection1.append(pCity1);

//     // var pTemp1 = document.createElement('p');
//     // pTemp1.className = "align-self-left col"
//     // pTemp1.innerText = temperature1
//     // futureWeatherDivSection1.append(pTemp1)

// }


// Get Current Weather: https://openweathermap.org/current
    // api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

    // Parameters
    // q	required	City name, state code and country code divided by comma, Please, refer to ISO 3166 for the state codes or country codes.
    //                  You can specify the parameter not only in English. In this case, the API response should be returned in the same language as the language of requested location name if the location is in our predefined list of more than 200,000 locations.

    // appid	required	Your unique API key (you can always find it on your account page under the "API key" tab)
    // mode	    optional	Response format. Possible values are xml and html. If you don't use the mode parameter format is JSON by default. Learn more
    // units	optional	Units of measurement. standard, metric and imperial units are available. If you do not use the units parameter, standard units will be applied by default. Learn more
    // lang	    optional	You can use this parameter to get the output in your language. Learn more



// By geographic coordinates
// API call

// api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}

// Parameters
// lat, lon	required	Geographical coordinates (latitude, longitude)
// appid	required	Your unique API key (you can always find it on your account page under the "API key" tab)
// mode	optional	Response format. Possible values are xml and html. If you don't use the mode parameter format is JSON by default. Learn more
// units	optional	Units of measurement. standard, metric and imperial units are available. If you do not use the units parameter, standard units will be applied by default. Learn more
// lang	optional	You can use this parameter to get the output in your language. Learn more


// Call 5 day / 3 hour forecast data
// api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}

// Parameters
// q	required	City name, state code and country code divided by comma, use ISO 3166 country codes.
//                  You can specify the parameter not only in English. In this case, the API response should be returned in the same language as the language of requested location name if the location is in our predefined list of more than 200,000 locations.

// appid	required	Your unique API key (you can always find it on your account page under the "API key" tab)
// mode	    optional	Response format. JSON format is used by default. To get data in XML format use mode=xml. Learn more
// cnt	    optional	A number of timestamps, which will be returned in the API response. Learn more
// units	optional	Units of measurement. standard, metric and imperial units are available. If you do not use the units parameter, standard units will be applied by default. Learn more
// lang	    optional	You can use the lang parameter to get the output in your language. Learn more

// By geographic coordinates
// You can search weather forecast for 5 days with data every 3 hours by geographic coordinates. All weather data can be obtained in JSON and XML formats.


// https://openweathermap.org/api/one-call-api
// https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&exclude=hourly,daily&appid={API key}



