console.log('Homework 2-A...')

d3.csv('../data/hubway_trips_reduced.csv',parse,dataLoaded);


var trips;

function dataLoaded(err,rows){

    console.log(rows);
    trips = crossfilter(rows);
    
    //total 2012 trips
    var tripByYear = trips.dimension(function(d){
        return d.startTime;
    })
 console.log('total 2012 trips' +":" +tripByYear.filter([new Date(2011,12,01),new Date(2012,12,01)]).top(Infinity).length);
   
    //total number of trips in 2012 AND taken by male, registered users
   
    var tripByUser = trips.dimension(function(d){
        if(!d.gender){
            return "anon";
        }
        return d.gender;
    })
    console.log('total 2012 trips taken by male' +":" + tripByUser.filter('Male').top(Infinity).length);
    
    //total number of trips in 2012, by all users (male, female, or unknown), starting from Northeastern (station id 5). 
    tripByUser.dispose();
    
    var tripByStation = trips.dimension(function(d){
       return d.startStation;
    })
    
    console.log('total 2012 trips taken in Northeastern' +":" +tripByStation.filter('5').top(Infinity).length);
    
    //top 50 trips, in all time, by all users, regardless of starting point, in terms of trip duration. Log the array of these    trips in console.
    tripByYear.dispose();
    tripByStation.dispose();
  var tripByDruation =  trips.dimension(function(d){
        return d.duration;
    })
   console.log(tripByDruation.top(50));
    
    tripByDruation.filterAll();
    
    //Group
    var tripsByAge = trips.dimension(function(d){if(!d.age){return "anon"}  return 2016 - d.age})
    var tripsByAgeGroup = tripsByAge.group(function(d){return Math.floor(d/10);});
    var types = tripsByAgeGroup.all();
    console.log(types);
    
    
}

function parse(d){
    if(+d.duration<0) return;

    return {
        duration: +d.duration,
        startTime: parseDate(d.start_date),
        endTime: parseDate(d.end_date),
        startStation: d.strt_statn,
        endStation: d.end_statn,
        age : +d.birth_date,
        gender : d.gender
    }
}

function parseDate(date){
    var day = date.split(' ')[0].split('/'),
        time = date.split(' ')[1].split(':');

    return new Date(+day[2],+day[0]-1, +day[1], +time[0], +time[1]);
}

