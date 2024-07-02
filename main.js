const weatherForm = document.querySelector('.weatherForm');
const placeInput = document.getElementById('search');

const card = document.querySelector('.card');
const API_KEY = '82af182be9c247a2bf7102756240107&q';

weatherForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // else page refresh

    const country = placeInput.value;

    if (country) {
        try {
            const weatherData = await getWeatherData(country);
            displayWeatherData(weatherData, updateTemperature);
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
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}=${country}`;

    const response = await fetch(apiUrl, {mode: 'cors'});

    if (!response.ok) {
        throw new Error(`Unable to fetch data for [${country.toUpperCase()}]`);
    }

    return await response.json();
}

function displayWeatherData(weatherData, updateTemperature) {
    card.textContent = '';
    card.style.display = 'flex';

    const elements = createWeatherCard();
    updateWeatherCard(weatherData, elements, updateTemperature);
}

function updateWeatherCard(weatherData, elements, updateTemperature) {
    const { location, temperature, currentWeather, weatherEmote } = elements;

    const { location: { name }, current: { condition: { icon, text }, temp_c, temp_f } } = weatherData;

    let isCelsius = true;
    let currentTemp = updateTemperature(isCelsius, temp_c, temp_f); // default is celcius
    temperature.innerText = currentTemp;

    const toggleSwitch = document.getElementById('toggle');

    toggleSwitch.addEventListener('click', () => {
        isCelsius = !isCelsius;
        currentTemp = updateTemperature(isCelsius, temp_c, temp_f);
        temperature.innerText = currentTemp;
    });

    location.innerText = name;
    currentWeather.innerText = `It is currently ${text}`;
    weatherEmote.src = icon;
}

function updateTemperature(isCelcius, celcius, fahrenheit) {
    return isCelcius ? `${celcius} °C` : `${fahrenheit} ° F`;
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

function createWeatherCard() {
    const location = document.createElement('h1');
    location.className = 'location';

    const temperatureBlock = document.createElement('div');
    temperatureBlock.className = 'temperatureBlock';

    const temperature = document.createElement('p');
    temperature.className = 'temperature';

    const toggleSwitch = createSwitchElement();

    const currentWeather = document.createElement('p');
    currentWeather.className = 'currentWeather';

    const weatherEmote = document.createElement('img');
    weatherEmote.className = 'weatherEmote';

    temperatureBlock.appendChild(temperature);
    temperatureBlock.appendChild(toggleSwitch);
    card.appendChild(location);
    card.appendChild(temperatureBlock);
    card.appendChild(currentWeather);
    card.appendChild(weatherEmote);

    return { location, temperature, toggleSwitch, currentWeather, weatherEmote };
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

// submit -> get data -> displayData -> createWeatherCard -> updateWeatherCard
// -> attach listener to toggle temp -> callback to updateTemperature 