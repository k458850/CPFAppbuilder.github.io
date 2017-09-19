var weatherData = "", uvData = "", RGBStart = 0, CPFStartTimer, CPFLoopTimer,ledFlashCount=0,ledFlashDirection=0;

//http://api.openweathermap.org/img/w/.png
$(function () {

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(getInformation, errorCallback);
    } else {
        alert('您的瀏覽器不支援定位功能');
        var gpsData = { "coords": { "latitude": '24.1372291', "longitude": '120.6809453' } }
        getInformation(gpsData);
    }

    function errorCallback(error) {
        var errorTypes = {
            0: "不明原因錯誤",
            1: "使用者拒絕提供位置資訊",
            2: "無法取得位置資訊",
            3: "位置查詢逾時"
        };
        var gpsData = { "coords": { "latitude": '24.1372291', "longitude": '120.6809453' } }
        getInformation(gpsData);
    }

    function getInformation(location) {
        //console.log(location.coords.latitude);
        //console.log(location.coords.longitude);

        ///*weather*/
        $.get("http://api.openweathermap.org/data/2.5/weather?lat=" + location.coords.latitude + "&lon=" + location.coords.longitude + "&units=metric&lang=zh_tw&appid=4b57e1c4d2edc6f01c8cb793bdea71ea", function (data) {
            console.dir(data);
            weatherData = data;
            console.log(weatherData.main.temp);
            console.log(weatherData.weather[0].description);
            console.log(weatherData.weather[0].icon);

            $("#address").html("<h1>" + weatherData.name + "</h1>");
            $("#iconImg").html("<img src='http://api.openweathermap.org/img/w/" + weatherData.weather[0].icon + ".png' />");
            $("#description").html("<h2>" + weatherData.weather[0].description + "</h2>");
            $("#tempValue").html("<h2>" + weatherData.main.temp + " °C</h2>");
        });

        /*UV*/
        $.get("http://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + location.coords.latitude + "&lon=" + location.coords.longitude + "&lang=zh_tw&appid=4b57e1c4d2edc6f01c8cb793bdea71ea", function (data) {
            console.dir(data);
            uvData = data;
            console.log(uvData[0].value);
            $("#uvValue").html("<h2>UV: " + uvData[0].value + "</h2>");
        });
    }
    $('#btnCpfRestart').click(function () {
        if (RGBStart == 0) setup();
    });
    setup();
    
})

function setup() {
    if (cpf) {
        var ret = cpf.setPinMode('["resetPin"],["setPinMode", "analog", 0, "INPUT"],["setPinMode", "analog", 1,"INPUT"],["grove_newChainableLED", 7, 8, 1]');
        cpfStart();
    }
    else alert('雲教授未連接');
}

function cpfStart() {
    if (weatherData != '' && uvData != '' && RGBStart == 0) {
        clearInterval(CPFStartTimer);
        CPFLoopTimer = setInterval(cpfLoop, 300);
        RGBStart = 1;
    } else if (weatherData == '' || uvData == '') {
        CPFStartTimer = setInterval(cpfStart, 500);
    }
}

function getWeatherRGBColor(number) {
    var color = {};
    switch (number){
        case number < 20:
            color.r = 0, color.g = 0, color.b = 235;
            break;
        case number >= 20 && number < 25:
            color.r = 0, color.g = 100, color.b = 110;
            break;
        case number >= 25 && number < 30:
            color.r = 0, color.g = 219, color.b = 219;
            break;
        case number >= 30 && number < 35:
            color.r = 25, color.g = 142, color.b = 0;
            break;
        case number >= 35 && number < 40:
            color.r = 206, color.g = 0, color.b = 0;
            break;
    }
    return color;
}

function getUVRGBColor(number) {
    var color = {};
    switch (number) {
        case number < 3:
            color.r = 0, color.g = 255, color.b = 0;
            break;
        case number >= 3 && number < 6:
            color.r = 255, color.g = 255, color.b = 0;
            break;
        case number >= 6 && number < 8:
            color.r = 255, color.g = 128, color.b = 0;
            break;
        case number >= 8 && number < 11:
            color.r = 255, color.g = 0, color.b = 0;
            break;
        case number >= 11 :
            color.r = 128, color.g = 0, color.b = 128;
            break;
    }
    return color;
}

function cpfLoop() {
    
    if (ledFlashDirection==0) {
        ledFlashCount++;
        var color = getWeatherRGBColor(weatherData.main.temp);
        var ledR = color.r / 15 * ledFlashCount;
        var ledG = color.g / 15 * ledFlashCount;
        var ledB = color.b / 15 * ledFlashCount;
        if (cpf) cpf.setChainableLed("0," + ledR + "," + ledG + "," + ledB + ";");
        
        color = getWeatherRGBColor(uvData[0].value);
        ledR = color.r / 15 * ledFlashCount;
        ledG = color.g / 15 * ledFlashCount;
        ledB = color.b / 15 * ledFlashCount;
        if (cpf) cpf.setChainableLed("1," + ledR + "," + ledG + "," + ledB + ";");
        if (ledFlashCount >= 15) ledFlashDirection = 1;
    } else {
        ledFlashCount--;
        var color = getWeatherRGBColor(weatherData.main.temp);
        var ledR = color.r / 15 * ledFlashCount;
        var ledG = color.g / 15 * ledFlashCount;
        var ledB = color.b / 15 * ledFlashCount;
        if (cpf) cpf.setChainableLed("0," + ledR + "," + ledG + "," + ledB + ";");

        color = getWeatherRGBColor(uvData[0].value);
        ledR = color.r / 15 * ledFlashCount;
        ledG = color.g / 15 * ledFlashCount;
        ledB = color.b / 15 * ledFlashCount;
        if (cpf) cpf.setChainableLed("0," + ledR + "," + ledG + "," + ledB + ";");
        if (ledFlashCount <= 0) ledFlashDirection = 0;
    }
}
