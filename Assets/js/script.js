var searchButton = document.querySelector("#searchButton")
var cityText = document.querySelector("#cityText")
var searchHistorySection = document.querySelector("#searchHistorySection")

var selectedCity = "";

// Initialize the page by looking at the local storage and generating the existing buttons from prior searches
init();
function init(){
    loadLocalStorage();
}

// create a function to load the existing searches, create buttons based on those searches, and add attributes to those buttons
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

// create an event listener for the search button, so that when the button is pushed, the text provided in the textbox is submitted as the city to be searched
searchButton.addEventListener('click',function(event){
    event.preventDefault();
    createCityButton();
})

// When the button is pushed, add another button with the submitted text
function createCityButton(){
    const buttonName = cityText.value;

    selectedCity = buttonName;

    // if there is no existing element in local storage, add it to the local storage and create a button for it and add an event listener

    // https://spicyyoghurt.com/tutorials/javascript/store-data-html5-local-storage
    if (localStorage.getItem(`city-${selectedCity}`) === null){
        var buttonElement = document.createElement("button");
        buttonElement.className = `align-self-center cityButton city-${selectedCity}`
        buttonElement.setAttribute("id", "cityButton")
        buttonElement.innerText = buttonName

        searchHistorySection.append(buttonElement)
    }

    localStorage.setItem(`city-${selectedCity}`,selectedCity)

    buttonElement.addEventListener("click",function(event){
        selectedCity = "";
        selectedCity = event.target.innerText;
        createCurrentWeatherSection();
    })

    createCurrentWeatherSection();
}

// Create a function to change the city that is being looked up based on the text inside the button that is clicked.

// https://stackoverflow.com/questions/55012836/why-does-queryselector-only-select-the-first-element-and-how-can-i-fix-this
function loadExistingButtons(){
    document.querySelectorAll(".cityButton").forEach(buttons => buttons.addEventListener("click", () => {

        selectedCity = "";
        selectedCity = event.target.innerText;
        createCurrentWeatherSection()
    }
    ))
}

// Create a function to generate a section which will contain the current and future weather forecasts. Then generate empty elements which will be filled in with all of the information for the current weather in the selected city
function createCurrentWeatherSection(){

    const cityName = selectedCity

// Clear the section first, then add to the section once again and fill it with new information
    // https://getbootstrap.com/docs/4.0/utilities/display/
    if (document.getElementById("weatherDisplay")){
        document.getElementById("weatherDisplay").remove()
    }

    var contentSectionElement = document.createElement("section");
    contentSectionElement.className = "weatherDisplay border justify-content-around text-center m-3"
    contentSectionElement.setAttribute("id", "weatherDisplay")

    // add blank elements associated with the current weather
    getWeatherDivSection(contentSectionElement, "Current");

    // Create the title "5 Day Forecast"
    var futureWeatherTitle = document.createElement("p");
    futureWeatherTitle.className = "text-center h3 m-1"
    futureWeatherTitle.append(`5 Day Forecast`)

    contentSectionElement.append(futureWeatherTitle)

    document.querySelector("#contentSection").append(contentSectionElement)

    getFutureWeatherSection();
}

// generate a sections that will contain all of the future weather forecasts and then generate empty elements for each future weather forecast
function getFutureWeatherSection(){
    var futureWeatherDiv = document.createElement("section")
    futureWeatherDiv.className = "text-center row border justify-content-around m-1 futureWeather"
    futureWeatherDiv.setAttribute("id", "futureWeatherDisplay")

// TODO: this function adds a weather section to the Weather Div and gives an id of 1 (later used to create day1) to each item
    getWeatherDivSection(futureWeatherDiv, 1)
    getWeatherDivSection(futureWeatherDiv, 2)
    getWeatherDivSection(futureWeatherDiv, 3)
    getWeatherDivSection(futureWeatherDiv, 4)
    getWeatherDivSection(futureWeatherDiv, 5)
    document.querySelector("#weatherDisplay").append(futureWeatherDiv)

// TODO: Check that this works
    getWeatherInfo();
}

// generate the empty elements for each forecast and assign attributes to each element to later be filled
function getWeatherDivSection(originalCodeContainer,dayNum){

// TODO - GLOBAL VARIABLE
    const cityName = selectedCity;
    const timeID = "timeIdDay"+dayNum;
    const weatherIcon = "weatherIcon"+dayNum;
    const tempID = "tempIdDay"+dayNum;
    const windID = "windIdDay"+dayNum;
    const humidityID = "humidityIdDay"+dayNum;
    const uvIndexID = "uvIndexID"+dayNum;

    var divSection = document.createElement("section");

    divSection.className = "p-2 border border-white border-rounded"

    var pCity = document.createElement('p');
    pCity.className = `align-self-left h2`
    pCity.innerText = cityName;
    divSection.append(pCity);

    var pTime = document.createElement('p');
    pTime.className = `align-self-left ${timeID}`
    divSection.append(pTime)

    var pTemp = document.createElement('p');
    pTemp.className = `align-self-left ${tempID}`
    divSection.append(pTemp)

    var pWind = document.createElement('p');
    pWind.className = `align-self-left ${windID}`
    divSection.append(pWind);

    var pHumidity = document.createElement('p');
    pHumidity.className = `align-self-left ${humidityID}`
    divSection.append(pHumidity);

    var pUVI = document.createElement('p');
    pUVI.className = `align-self-left ${uvIndexID}`
    divSection.append(pUVI);

    originalCodeContainer.append(divSection)
}

// create a function to get the information needed for the weather elements, then look up the element based on the class or id assigned to them and insert the information
function getWeatherInfo(){
    var latitude;
    var longitude;

    var apiKey = "046bc294aa42125873f047e14ff6f4c3"

    var apiCityName = selectedCity

    // use fetch and take the api key, city name, and api web address to retrieve the necessary information, in this case, I need to look up the lat and long for the selected city from the single day APT and use that informtation for the 5 day forecast api
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${apiCityName}&appid=${apiKey}`)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        latitude = data.coord.lat;
        longitude = data.coord.lon;

        // Use the lat and long to retrieve the 5 day forecast informetion for the selected city
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly&appid=${apiKey}`)
        .then(function (secondResponse) {
            return secondResponse.json();

        })
        .then(function (secondData) {

            // For the current day (0) and the next 5 days (1-4) get the required info, look up the element associated to that info (elementID sorted by the day) and display the information inside that element
            for (i = 0; i < 6; i++){
                if (i == 0){

                    // https://coderrocketfuel.com/article/convert-a-unix-timestamp-to-a-date-in-vanilla-javascript
                    const dateTime = new Date(secondData.current.dt * 1000)

                    document.querySelector(`.timeIdDayCurrent`).innerText = `Date: ${dateTime.toLocaleString("en-US", {month: "long"})} ${dateTime.toLocaleString("en-US", {day: "numeric"})}, ${dateTime.toLocaleString("en-US", {year: "numeric"})}`


                    // addText(`tempIdDayCurrent`, secondData.current.temp)
                    document.querySelector(`.tempIdDayCurrent`).innerText = `Temp: ${(((secondData.current.temp-273.15)*1.8)+32).toFixed(2)}\xB0 `
                    // addText(`humidityIdDayCurrent`, secondData.current.humidity)

                    // Use the reference provided to determine which emoji to display
                        // REF:  https://openweathermap.org/weather-conditions#Weather-Condition-Codes-2
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

                    document.querySelector(`.windIdDayCurrent`).innerText = `Wind: ${secondData.current.wind_speed} MPH`

                    document.querySelector(`.humidityIdDayCurrent`).innerText = `Humidity: ${secondData.current.humidity}`
                    // addText(`uvIndexIDCurrent`, secondData.current.uvi)
                    document.querySelector(`.uvIndexIDCurrent`).innerText = `UVI: ${secondData.current.uvi}`

                    document.querySelector(`.uvIndexIDCurrent`).innerText = `UVI: `

                    var uviColor = document.createElement('a');
                    uviColor.innerText = secondData.current.uvi
                    if (secondData.current.uvi <= 6){
                        uviColor.className = `p-1 bg-success text-white`
                    } else if (secondData.current.uvi <= 8){
                        uviColor.className = `p-1 bg-warning text-white`
                    } else {
                        uviColor.className = `p-1 bg-danger text-white`
                    }

                    document.querySelector(`.uvIndexIDCurrent`).append(uviColor)
                } else {

                    const dateTime = new Date(secondData.daily[i].dt * 1000)

                    document.querySelector(`.timeIdDay${i}`).innerText = `Date: ${dateTime.toLocaleString("en-US", {month: "long"})} ${dateTime.toLocaleString("en-US", {day: "numeric"})}, ${dateTime.toLocaleString("en-US", {year: "numeric"})}`

                    document.querySelector(`.tempIdDay${i}`).innerText = `Temp: ${(((secondData.daily[i].temp.day-273.15)*1.8)+32).toFixed(2)}\xB0`

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

                    document.querySelector(`.windIdDay${i}`).innerText = `Wind: ${secondData.daily[i].wind_speed} MPH`

                    document.querySelector(`.humidityIdDay${i}`).innerText = `Humidity: ${secondData.daily[i].humidity}`
                    // console.log(`.humidityIdDay${i}: ${secondData.daily[i].uvi}`)
                    document.querySelector(`.uvIndexID${i}`).innerText = `UVI: `

                    var uviColor = document.createElement('a');
                    uviColor.innerText = secondData.daily[i].uvi
                    if (secondData.daily[i].uvi <= 6){
                        uviColor.className = `p-1 bg-success text-white`
                    } else if (secondData.daily[i].uvi <= 8){
                        uviColor.className = `p-1 bg-warning text-white`
                    } else {
                        uviColor.className = `p-1 bg-danger text-white`
                    }

                    document.querySelector(`.uvIndexID${i}`).append(uviColor)
                }
            }
        });
    });
}
