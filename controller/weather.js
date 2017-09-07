/**
 * Created by milad on 8/2/2017.
 */
var Weather = require('weather-js');


//String from Object of weather
var createWeatherReport = function(result)
{
    var report = result[1].current.day + "\n" +
        "temperature:    " + result[1].current.temperature + "°C" + "\n" +
        "condition:          " + result[1].current.skytext + "\n" +
        "humidity:           " + result[1].current.humidity + "%" + "\n" +
        "windspeed:       " + result[1].current.winddisplay + "\n";
    return report;
};

/**
 * Finds weather info of given city
 * @param city city name (string)
 * @param callback callbackfn (arg[0] = weatherReport as string)
 */
module.exports.sendWeatherInfo = function(city, callback)
{
    Weather.find(
    {
        search: city,
        degreeType: 'C'
    }, function(err, result)
    {
        if (err)
        {
            console.log(err);
            callback("Didn't found that :(");
        }
        else if (result.length == 0)
        {
            console.log("weather error");
            callback("Didn't found that or other error :(");
        }
        else
        {
            callback(createWeatherReport(result));
        }
    });
}