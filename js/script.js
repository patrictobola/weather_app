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
function updatePagination(){
    const paginationContainer = $('.pagination');
    paginationContainer.empty();

    cities.forEach((city, index) => {
        const iconClass = (index === currentIndex) ? 'fas fa-circle' : 'far fa-circle';
        const paginationIcon = $(`<span class="${iconClass} icon-spacing"></span>`)
        paginationContainer.append(paginationIcon);
    })

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
    updateBackground(city);
    updatePagination();
}

function updateBackground(city) {
    const imageUrl = `url('/public/${city}.jpg')`;
    $('#weather-widget').css('background-image', imageUrl);
}


$(document).ready(() => {
    updateWidget(cities[currentIndex]);
    updatePagination();

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
            navigate('next');
            } else {
                navigate('prev');
            }
        }
    });

    

    function navigate(direction) {
        const totalCities = cities.length;
    
        if (direction === 'next') {
            currentIndex = (currentIndex > 0) ? (currentIndex - 1) : (totalCities - 1);
        } else if (direction === 'prev') {
            currentIndex = (currentIndex < totalCities - 1) ? (currentIndex + 1) : 0;
        }
    
        updateWidget(cities[currentIndex]);
    }
    
});
