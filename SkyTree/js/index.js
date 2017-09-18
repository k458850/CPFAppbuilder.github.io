var weatherData = "", uvData = "",RGBStart=0,RGBTimer;
//http://api.openweathermap.org/img/w/.png
$(function () {
    navigator.geolocation.getCurrentPosition(function (location) {
        //console.log(location.coords.latitude);
        //console.log(location.coords.longitude);

        ///*weather*/
        $.get("http://api.openweathermap.org/data/2.5/weather?lat=" + location.coords.latitude + "&lon=" + location.coords.longitude +"&units=metric&lang=zh_tw&appid=4b57e1c4d2edc6f01c8cb793bdea71ea", function (data) {
            console.dir(data);
            weatherData = data;
            console.log(weatherData.main.temp);
            console.log(weatherData.weather[0].description);
            console.log(weatherData.weather[0].icon);

            $("#address").html("<h1>" + weatherData.name + "</h1>");
            $("#iconImg").html("<img src='http://api.openweathermap.org/img/w/" + weatherData.weather[0].icon + ".png' />");
            $("#description").html("<h2>" + weatherData.weather[0].description + "</h2>");
        });

        /*UV*/
        $.get("http://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + location.coords.latitude + "&lon=" + location.coords.longitude + "&lang=zh_tw&appid=4b57e1c4d2edc6f01c8cb793bdea71ea", function (data) {
            console.dir(data);
            uvData = data;
            console.log(uvData[0].value);
            $("#uvValue").html("<h2>UV: " + uvData[0].value + "</h2>");
        });
    });
    $('#btnCpfRestart').click(function () {
        if (RGBStart == 0 ) setup();
    })
    setup();
})

function setup() {
    if (cpf) {
        var ret = cpf.setPinMode('["resetPin"],["setPinMode", "analog", 0, "INPUT"],["setPinMode", "analog", 1,"INPUT"],["grove_newChainableLED", 7, 8, 1]');
        cpfStart();
    }
    else alert('���б¥��s��');
}

function cpfStart() {
    if (weatherData != '' && uvData != '' && RGBStart == 0) {
        clearInterval(RGBTimer);

        RGBStart = 1;
    } else if (weatherData == '' || uvData == '') {
        RGBTimer = setInterval(cpfStart, 500);
    }
}

function cpfLoop() {
    
}
