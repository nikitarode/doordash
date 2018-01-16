var app = angular.module('myApp', ["ngRoute"]);

app.config(function($routeProvider){
    $routeProvider
    .when("/", {
        templateUrl : "login.html",
        controller: "loginController"
    })
    .when("/chat", {
        templateUrl : "chat.html",
        controller: "chatController"
    })
});

angular.module('myApp').factory('appData', function(){
    var sharedData = {};
    sharedData.userDetails = {"ryan" : "Ryan Gonzalez", "nikita": "Nikita Rode", "keyur" : "Keyur Joshi"};
    sharedData.usersList = ["ryan", "nikita", "keyur"];
    sharedData.listOfPeople = {
        "Business" : ["nikita", "ryan", "keyur"],
        "Analytics" : ["keyur", "ryan"],
        "Design" : [],
        "Engineering" : [],
        "HR" : [],
        "Operations" : [],
        "Special Ops" : []
    };
    sharedData.messageQueue = {
      "Business" : [["nikita", "Hi there"], ["ryan", "Hi Nikita"], ["ryan", "how r u?"], ["keyur", "hi guys"],
                    ["nikita", "Hi there"], ["ryan", "Hi Nikita"], ["ryan", "how r u?"], ["keyur", "hi guys"],
                    ["nikita", "Hi there"], ["ryan", "Hi Nikita"], ["ryan", "how r u?"], ["keyur", "hi guys"],
                    ["nikita", "Hi there"], ["ryan", "Hi Nikita"], ["ryan", "how r u?"], ["keyur", "hi guys"],
                    ["nikita", "Hi there"], ["ryan", "Hi Nikita"], ["ryan", "how r u?"], ["keyur", "hi guys"]],
      "Analytics": [["keyur", "Hi this is keyur"], ["ryan", "hi Keyur"]],
      "Design" : [],
      "Engineering" : [],
      "HR" : [],
      "Operations" : [],
      "Special Ops" : []
    }; 
    return sharedData;
});

app.controller("loginController", function($scope, $location, appData){
    $scope.formSubmit = function(){
        var uname = document.forms['register'].querySelector("input[name='uname']").value;
        if(appData.usersList.indexOf(uname) > -1){ //found user
            appData.user = uname;
            appData.logTime = new Date();
            $location.path('/chat');
        }else{ //display error message
            var span = document.getElementById("errorMsg");
            span.textContent = "Username entered here is not registered. Please try again!";
            span.style.display = 'block';
        }
    }
});

app.controller("chatController", function($scope, appData){
    $scope.listofAttendee = "";
    $scope.displayUserDetails = function(){
        $scope.fullName = appData.userDetails[appData.user];
        $scope.logedSince = "online";
        var time = setInterval($scope.displayTime, 60000);
    }
    $scope.displayTime = function(){
        var timenow = new Date();
        var diff = Math.ceil((timenow - appData.logTime)/60000);
        $scope.logedSince = "Online for " + diff + " minutes";
        document.getElementById("onlineDet").innerHTML = $scope.logedSince;
    }
    $scope.addMessage = function(msg){
        var chatWindow = document.getElementById("chatWindow");
        var span = document.createElement("span");
        span.textContent = msg[1];
        var from = msg[0];
        span.classList.add('msg');   //general style for a msg
        if(from === appData.user){
            span.classList.add('myMsg'); //red backgound
            chatWindow.appendChild(span);
        }
        else{
            span.classList.add('someoneElseMsg');
            chatWindow.appendChild(span);
            //also append name of person below msg
            span = document.createElement("span");
            span.textContent = from;
            span.style.textAlign = 'left';
            span.style.marginLeft = '10px';
            chatWindow.appendChild(span);
        }
        span.scrollIntoView(false);
    }
    $scope.addChat = function(){
        var chatText = document.getElementById("msgInput").value;
        if(chatText.length > 0){
            appData.messageQueue[$scope.tabName].push([appData.user, chatText]);
            $scope.addMessage([appData.user, chatText]);
            document.getElementById("msgInput").value = "";
            //add person name to header
            if(appData.listOfPeople[$scope.tabName].indexOf(appData.user) === -1){
                appData.listOfPeople[$scope.tabName].push(appData.user);
                if($scope.listofAttendee.length > 0){
                    $scope.listofAttendee += ", " + appData.user;
                }else{
                    $scope.listofAttendee = appData.user;
                }
            }
        }
    }
    $scope.handleSelect = function(){
        $scope.tabName = event.target.innerHTML; 
        /* set active style */
        $scope.setStyle(event.target);
            
        /* Handle header */
        var title = document.getElementById("subject");
        title.textContent = $scope.tabName;
                
        /* display list of people in the header */
        var list = appData.listOfPeople[$scope.tabName];
        var displayName = "";
        if(list){
            if(list.length > 0){
                displayName += list[0];
            }
            for(var i=1; i<list.length; i++){
                displayName += ", " + list[i];
            }
        }
//        document.getElementById("attendeeList").textContent = displayName;
        $scope.listofAttendee = displayName;
                
        /* Handle messages */
        var chatWindow = document.getElementById("chatWindow");
        //remove all previous messages
        Array.from(chatWindow.children).forEach(function(child){
            chatWindow.removeChild(child);
        });
        var tabMessages = appData.messageQueue[$scope.tabName];
        if(tabMessages){
            tabMessages.forEach($scope.addMessage);
        }
    }
    $scope.setStyle = function(elem){
      //active
        var tabs = document.querySelectorAll(".chatContainer li>a");
        tabs.forEach(function(tab){
           tab.classList.remove("active"); 
        });
        elem.classList.add("active");
    }
    
});

