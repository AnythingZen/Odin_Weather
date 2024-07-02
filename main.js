const weatherForm = document.querySelector('.weatherForm');
const placeInput = document.getElementById('search');

const card = document.querySelector('.card');
const body = document.querySelector('body');

const API_KEY = '82af182be9c247a2bf7102756240107&q';

weatherForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // else page refresh

    const country = placeInput.value;

    if (country) {
        try {
            const weatherData = await getWeatherData(country);
            const updateTemperatureFunction = getTemperature(weatherData.current.temp_c, weatherData.current.temp_f);
            displayWeatherData(weatherData, updateTemperatureFunction);
        }
        catch(error) {
            console.log(error);
            displayError(error);
        }
    }
    else {
        displayError('You did not enter a country?');
    }

})

async function getWeatherData(country) {
    const apiUrl = `http://api.weatherapi.com/v1/current.json?key=${API_KEY}=${country}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
        throw new Error(`Unable to fetch data for [${country.toUpperCase()}]`);
    }

    return await response.json();
}

function displayWeatherData(weatherData, updateTemperatureFunction) {
    card.textContent = '';
    card.style.display = 'flex';

    const location = document.createElement('h1');
    const temperatureBlock = document.createElement('div');
    const temperature = document.createElement('p');
    const toggleSwitch = document.querySelector('.switch')
    const currentWeather = document.createElement('p');
    const weatherEmote = document.createElement('img');

    location.className = 'location';
    temperatureBlock.className = 'temperatureBlock';
    temperature.className = 'temperature';
    currentWeather.className = 'currentWeather';
    weatherEmote.className = 'weatherEmote';

    temperatureBlock.appendChild(temperature)
    temperatureBlock.appendChild(toggleSwitch);
    card.appendChild(location);
    card.appendChild(temperatureBlock);
    card.appendChild(currentWeather);
    card.appendChild(weatherEmote);

    const {location: {name},
           current: {condition: { icon, text },
           temp_c, temp_f,}} = weatherData;

    let currentTemp = updateTemperatureFunction();
    temperature.innerText = currentTemp; // default is celcius
    const toggle = document.getElementById('toggle');

    toggle.addEventListener('click', () => {
        currentTemp = updateTemperatureFunction();
        temperature.innerText = currentTemp;
    });
    
    location.innerText = name;
    currentWeather.innerText = `It is currently ${text}`;
    weatherEmote.src = icon;
}

function displayError(error) {
    const errorMessage = document.createElement('p');
    errorMessage.className = 'errorMessage';

    errorMessage.innerText = error;
    errorMessage.style.fontWeight = 'bold'

    card.textContent = '';
    card.style.display = 'flex';
    card.appendChild(errorMessage);
}

function getTemperature(celcius, fahrenheit) {
    let isCelcius = true; // default = celcius

    const toggle = createSwitchElement();
    body.appendChild(toggle);
    const toggleSwitch = document.querySelector('#toggle');

    const updateTemperature = function() {
        return isCelcius ? `${celcius} °C` : `${fahrenheit} ° F`;
      };

    toggleSwitch.addEventListener('click', () => {
        isCelcius = !isCelcius;
    })
    
    return updateTemperature;
}

function createSwitchElement() {
    const switchLabel = document.createElement('label');
    const checkboxInput = document.createElement('input');
    const sliderSpan = document.createElement('span');

    switchLabel.className = 'switch';
    checkboxInput.id = 'toggle';
    sliderSpan.className = 'slider round';
    
    checkboxInput.type ='checkbox';

    switchLabel.appendChild(checkboxInput);
    switchLabel.appendChild(sliderSpan);

    return switchLabel;
}