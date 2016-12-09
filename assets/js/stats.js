function getReq(url, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
}

function formatNum(num) {
  if(num > 999999) {
    var fixedM = (num/1000000).toFixed(1) + 'm';
    return fixedM.split(".")[1] !== "0m" ? fixedK : fixedM.split(".")[0] + 'm';
  } else if(num > 999) {
    var fixedK = (num/1000).toFixed(1) + 'k';
    return fixedK.split(".")[1] !== "0k" ? fixedK : fixedK.split(".")[0] + 'k';
  } else {
    return num;
  }
}

function extractBaseURL(url) {
  return url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i)[1];
}

function removeWWW(url) {
  return url.replace("www.", "");
}

function removeProtocol(url) {
  return url.replace(/^https?\:\/\//gi, "")
}

function timeSince(timeStamp) {
    var now = new Date(),
      secondsPast = (now.getTime() - timeStamp.getTime()) / 1000;
    if(secondsPast < 60){
    	var secondsCalc = parseInt(secondsPast);
      return (secondsCalc > 1 ? secondsCalc + ' seconds ago' : secondsCalc + ' second ago');
    }
    if(secondsPast < 3600){
    	var minutesCalc = parseInt(secondsPast/60);
      return (minutesCalc > 1 ? minutesCalc + ' minutes ago' : minutesCalc + ' minute ago');
    }
    if(secondsPast <= 86400){
    	var hoursCalc = parseInt(secondsPast/3600);
      return (hoursCalc > 1 ? hoursCalc + ' hours ago' : hoursCalc + ' hour ago');
    }
    if(secondsPast > 86400){
        day = timeStamp.getDate();
        month = timeStamp.toDateString().match(/ [a-zA-Z]*/)[0].replace(" ","");
        year = timeStamp.getFullYear() == now.getFullYear() ? "" :  " "+timeStamp.getFullYear();
        return day + " " + month + year;
    }
}

function daysSince(timeStamp) {
  var now = new Date(),
  secondsPast = (now.getTime() - timeStamp.getTime()) / 1000;
  var daysSinceOrZero = parseInt(secondsPast / 86400);
  return daysSinceOrZero > 0 ? daysSinceOrZero : 1;
}

function fillData(data) {
  document.getElementById("report-longURL").innerHTML = removeWWW(extractBaseURL(data.longURL));
  document.getElementById("report-shortURL").innerHTML = removeProtocol(data.shortURL);
  document.getElementById("report-shortURL").href = data.shortURL;
  document.getElementById("report-total-visits").innerHTML = formatNum(data.stats.visits);
  document.getElementById("report-visits-per-day").innerHTML = formatNum(Math.floor(data.stats.visits / daysSince(new Date(data.createdAt))));
  document.getElementById("report-created-at").innerHTML = timeSince(new Date(data.createdAt));
}

var urlID = window.location.href.split("/")[3];
getReq("/" + urlID + "/api", function(data) {
  data = JSON.parse(data);
  if(data.error) {
    document.getElementById("report").classList.add("hide");
    document.getElementById("header").classList.add("text-center");
    document.getElementById("header").innerHTML = "404";
  }

  if(!data.error) {
    fillData(data);
  }
});
