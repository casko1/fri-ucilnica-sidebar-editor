let editing = false;

document.addEventListener("DOMContentLoaded", function () {
    chrome.storage.sync.get("FRIpredmetiState", function (data){
        if(!data.FRIpredmetiState){ //undefined or false
            chrome.storage.sync.set({"FRIpredmetiState": false})
        }
        else{ //true
            editing = data.FRIpredmetiState;
            document.querySelector(".uredi").textContent = "Finish editing"
        }
    })

    document.querySelector(".uredi").addEventListener("click", function (){

        if(!editing){
            editing = true;
            document.querySelector(".uredi").textContent = "Finish editing"

            chrome.storage.sync.set({"FRIpredmetiState": true})
            chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, "BeginEdit");
            });
        }
        else{
            editing=false;
            document.querySelector(".uredi").textContent = "Edit subjects"
            chrome.storage.sync.set({"FRIpredmetiState": false})
            chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, "EndEdit");
            });
        }
    }, false);


    document.querySelector(".reset").addEventListener("click", function (){


        document.querySelector(".uredi").textContent = "Edit subjects"

        chrome.storage.sync.set({"FRIpredmetiState": false})
        chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, "Reset");
        });
    }, false);

}, false);