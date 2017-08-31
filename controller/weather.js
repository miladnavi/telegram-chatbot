/**
 * Created by milad on 8/2/2017.
 */

//String from Object of weather
module.exports.createWeatherReport = function (result) {
    var report = result[1].current.day + "\n" +
        "temperature:    " + result[1].current.temperature + "°C" + "\n" +
        "condition:          " + result[1].current.skytext + "\n" +
        "humidity:           " + result[1].current.humidity + "%" + "\n" +
        "windspeed:       " + result[1].current.winddisplay + "\n";
    return report;
};