var tabs = [];
var removedTabs = [];
var tabMap = new Object();
var currentActivatedTabId;

//var timeoutID;
/*
function checkActivity() {
*/
    /*
    this.addEventListener('mousemove', resetActivity);
    this.addEventListener('mousedown', resetActivity);
    this.addEventListener('keypress', resetActivity);
    this.addEventListener('DOMMouseScroll', resetActivity);
    this.addEventListener('mousewheel', resetActivity);
    */
/*
    chrome.tabs.onActivated.addListener( function(activeInfo) {
        startTime(activeInfo.tabId);
    });

}
*/

function startTime(tabId) {

    tabMap[tabId] = window.setTimeout(function() {
        chrome.tabs.remove(tabId);
    }, 5000);
}

/*
function resetActivity() {
    window.clearTimout(timemoutID);
    startTime();
    
}
*/

function makeInactive(activeInfo) {
    //insert something about removing the tab and storing the details of the tab
    //somewhere in an array so it can be relatively easily retrieved
    console.log(activeInfo);
    recordRemoved(activeInfo);
    chrome.tabs.remove(activeInfo.tabId);

}

function recordActive(toRecord) {
    tabs.push(toRecord);
}

function recordRemoved(toRecord) {
    removedTabs.push(toRecord); 
}

function getRemoverForTabId(tabId) {
    return function() {
        chrome.tabs.remove(tabId);
    };
}

function init() {

    chrome.windows.getAll({populate:true}, function (windows) {

        for(var i = 0; i < windows.length; i++) {
            var tab = windows[i].tabs;

            for(var j = 0; j < tab.length; j++) {
                //record the information of the tabs

                startTime(tab[j].id);
                recordActive(tab[j]);
            }
        }
    });

    //checkActivity();

    //keep track of tabs when they are closed
    /* Idea would be to place the information of the tabs
       that are removed into another array or something similar
       so that the information can be displayed in another location
       in case the user wants to quickly access it later */
    chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
        delete tabMap[tabId];        
        //recordRemoved(removeInfo);
    });

    //keep track of new tabs when they are opened
    /* When a new tab is created, it should be added to the 
       array of all tabs, should also switch which tab is active.
       */
    chrome.tabs.onCreated.addListener(function(tab) {
        startTime(tab.id);
        recordActive(tab);
    });

    //keeps track of which tab is active
    chrome.tabs.onActivated.addListener(function(activeInfo) {
        window.clearTimeout(tabMap[currentActivatedTabId]);
        delete tabMap[currentActivatedTabId]; 
        if(currentActivatedTabId) {
            tabMap[currentActivatedTabId] = window.setTimeout(getRemoverForTabId(currentActivatedTabId), 5000);
        }
        currentActivatedTabId = activeInfo.tabId;
        window.clearTimeout(tabMap[currentActivatedTabId]);

    });

    //make items from the removedTabs array available for display and 
    //clickable through 

}

init();