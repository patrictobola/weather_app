const apiKey = 'ef4b6b74657f4288a4a154605242301';
const cities = ['London', 'Milan', 'Bangkok', 'Los Angeles', 'Nairobi'];
let currentIndex = 0;

function getDayOfWeek(dateString) {
    const daysOfWeek = ['DOM', 'LUN', 'MAR', 'MER', 'GIO', 'VEN', 'SAB'];

    const date = new Date(dateString);
    const dayIndex = date.getDay();

    return daysOfWeek[dayIndex];
}

function getWeather(city) {
    const apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=8&aqi=no&alerts=no`;
    return $.get(apiUrl);
}

function updateWidget(city) {
    getWeather(city).done((data) => {
        const { location, current, forecast } = data;
        const temperature = `${current.temp_c}°C`;
        const conditionText = `${current.condition.text}`;
        const minTempCurrentDay = `${Math.round(forecast.forecastday[0].day.mintemp_c)}`;
        const maxTempCurrentDay = `${Math.round(forecast.forecastday[0].day.maxtemp_c)}`;
        
        $('.city-name').text(location.name);
        $('.weather-text').text(conditionText);
        $('.temperature').text(temperature);
        $('.daily-temperature').text(`${minTempCurrentDay}°/${maxTempCurrentDay}°`);

        const forecastHtml = forecast.forecastday.slice(1, 8).map(day => `
            <div class="forecast-item">
            <div class="forecast-text">${getDayOfWeek(day.date)}</div>
                <img src="${day.day.condition.icon}">
                <div class="forecast-daily-temp">${Math.round(day.day.mintemp_c)}/${Math.round(day.day.maxtemp_c)}°C</div>
            </div>
        `).join('');

        $('.carousel').html(forecastHtml);
    });
}

function updateBackground(city) {
    const imageUrl = `url('/public/${city}.jpg')`;
    $('#weather-widget').css('background-image', imageUrl);
}

$(document).ready(() => {
    updateWidget(cities[currentIndex]);
    updateBackground(cities[currentIndex]);

    let startX = 0;
    let endX = 0;

    $('#weather-widget').on('mousedown touchstart', (event) => {
        startX = (event.type === 'mousedown') ? event.pageX : event.touches[0].pageX;
    });
    $('#weather-widget').on('mouseup touchend', (event) => {
        endX = (event.type === 'mouseup') ? event.pageX : event.changedTouches[0].pageX;

        const differenceX = endX - startX;
        const threshold = 100;

        if (Math.abs(differenceX) > threshold) {
            if (differenceX > 0) {
            navigateNext();
            } else {
            navigatePrev();
        }   updateBackground(cities[currentIndex]);
        }
    });

    

    function navigateNext() {
        if (currentIndex > 0) {
            currentIndex--;
            updateWidget(cities[currentIndex]);
        } else {
            currentIndex = cities.length - 1;
            updateWidget(cities[currentIndex]);
        }
    };

    function navigatePrev() {
        const totalCities = cities.length;
        if (currentIndex < totalCities - 1) {
            currentIndex++;
            updateWidget(cities[currentIndex]);
        } else {
            currentIndex = 0
            updateWidget(cities[currentIndex]);
        }
    };
});
