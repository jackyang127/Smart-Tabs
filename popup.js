/*
 *var port = chrome.extension.connect({name: "Sample Communication"});
 *port.postMessage("Hi BackGround");
 *port.onMessage.addListener(function(msg) {
 *    console.log(msg);
 *}); */

/*
chrome.extension.onMessage.addListener(function(message, messageSender, sendResponse) {
    // message is the message you sent, probably an object
    // messageSender is an object that contains info about the context that sent the message
    // sendResponse is a function to run when you have a response
    tabList = message;

}); */
document.addEventListener('DOMContentLoaded', function () {
   var tabList = [];
   var bg = chrome.extension.getBackgroundPage();

   var removedTab = Object.keys(bg.removedTabs);
   for (x in bg.removedTabs) {
       tabList[tabList.length] = bg.removedTabs[x];
   }

   if (tabList.length == 0) {
     document.getElementById("entry-1").innerHTML = "Nothing to display :)";
    } 
      for (var i = 0; i < tabList.length; i++) {
          var idName = "entry-" + (i+1);
          if (tabList.length < 5) {
          document.getElementById(idName).href = tabList[i].url;
          document.getElementById(idName).innerHTML = tabList[i].title;
          } else {
          document.getElementById(idName).href = tabList[tabList.length - 5 + i].url;
          document.getElementById(idName).innerHTML = tabList[tabList.length - 5 + i].title;
          }
      }
       
    
});

document.addEventListener('DOMContentLoaded', function () {
    var links = document.getElementsByTagName("a");
    for (var i = 0; i < links.length; i++) {
        (function () {
            var ln = links[i];
            var location = ln.href;
            ln.onclick = function () {
                chrome.tabs.create({active: true, url: location});
            };
        })();
    }
});
