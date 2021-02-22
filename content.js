document.addEventListener("DOMContentLoaded", function () {

    chrome.storage.sync.get("FRIpredmetiSubjects", function (data) {
        if(!data.FRIpredmetiSubjects){ //first time load
            loadInitialData();
        }
        else{
            applySettings(data.FRIpredmetiSubjects, false);
        }
    });


    chrome.storage.sync.get("FRIpredmetiState", function (data){
        if(data.FRIpredmetiState){ //edit state
            editSubjects();
        }
    })


}, false)


chrome.runtime.onMessage.addListener(function (request){
    if(request.toString() === "BeginEdit"){
        editSubjects();
    }
    else if(request.toString() === "EndEdit"){
        endEditing();
    }
    else if(request.toString() === "Reset"){
        reset();
    }
    }
)


function editSubjects() {

    displayAddOptions();

    let seznam = document.getElementById("nav-drawer").querySelectorAll("[aria-label='Spletno mesto']")[0]
        .querySelector("ul")


    for(let i = 0; i < seznam.children.length; i++){
        let removeButton = document.createElement("BUTTON")
        removeButton.innerHTML = String.fromCodePoint(0x274C)

        removeButton.addEventListener("click", function (){
            removeSubject(i)
        })

        seznam.children[i].appendChild(removeButton);
        seznam.children[i].style.display = "flex"

        let moveUpButton = document.createElement("BUTTON")
        moveUpButton.innerHTML = String.fromCodePoint(0x1F53C)

        moveUpButton.addEventListener("click", function (){
            moveSubject(i, -1) //-1 is up
        })

        seznam.children[i].appendChild(moveUpButton);

        let moveDownButton = document.createElement("BUTTON")
        moveDownButton.innerHTML = String.fromCodePoint(0x1F53D)

        moveDownButton.addEventListener("click", function (){
            moveSubject(i, 1) //1 is down
        })

        seznam.children[i].appendChild(moveDownButton);
    }
}

function displayAddOptions(){
    let addButton = document.querySelector(".addToSideBar");
    if(!addButton){
        let navbar = document.querySelector(".navbar");
        let rightMost = document.querySelector("[class^='nav navbar-nav ml-auto']")

        let ul = document.createElement("UL");
        ul.setAttribute("class", "navbar-nav d-none d-md-flex addToSideBar");

        let li = document.createElement("LI");
        li.setAttribute("class", "addSubjectLI dropdown nav-item")

        let a = document.createElement("A");
        a.textContent = `Add to sidebar ${String.fromCodePoint(0x2795)}`
        a.setAttribute("class", "dropdown-toggle nav-link")
        a.setAttribute("id", "addPageDropDown")
        a.setAttribute("data-toggle", "dropdown")
        a.setAttribute("aria-controls", "addPageDropDownMenu")

        let options = document.createElement("DIV");
        options.setAttribute("class", "dropdown-menu");
        options.setAttribute("id", "addPageDropDownMenu");
        options.setAttribute("aria-labelledby", "addPageDropDown");
        options.setAttribute("role", "menu");

        let form = document.createElement("FORM")
        form.setAttribute("class", "dropdown-item")
        form.setAttribute("role", "menuitem")
        form.setAttribute("id", "addSubjectForm")
        form.setAttribute("name", "addSubjectForm")

        form.addEventListener("submit", addSubject);

        let inputName = document.createElement("INPUT")
        inputName.setAttribute("type", "text")
        inputName.setAttribute("placeholder", "Display name")
        inputName.setAttribute("style", "display: block")
        inputName.setAttribute("id", "displayName")

        let selectIcon = document.createElement("SELECT")
        selectIcon.setAttribute("style", "font-family: 'FontAwesome', 'sans-serif'; display: block")
        selectIcon.setAttribute("id", "selectIcon")

        let option1 = document.createElement("OPTION")
        option1.setAttribute("value", "icon fa fa-tachometer fa-fw ")
        option1.innerHTML = "&#xf0e4";

        let option2 = document.createElement("OPTION")
        option2.setAttribute("value", "icon fa fa-home fa-fw ")
        option2.innerHTML = "&#xf015";

        let option3 = document.createElement("OPTION")
        option3.setAttribute("value", "icon fa fa-calendar fa-fw ")
        option3.innerHTML = "&#xf073";

        let option4 = document.createElement("OPTION")
        option4.setAttribute("value", "icon fa fa-file fa-fw ")
        option4.innerHTML = "&#xf15b";

        let option5 = document.createElement("OPTION")
        option5.setAttribute("value", "icon fa fa-graduation-cap fa-fw ")
        option5.innerHTML = "&#xf19d";

        selectIcon.appendChild(option5);
        selectIcon.appendChild(option4);
        selectIcon.appendChild(option3);
        selectIcon.appendChild(option2);
        selectIcon.appendChild(option1);

        let selectMargin = document.createElement("SELECT")
        selectMargin.setAttribute("id", "selectMargin")
        selectMargin.setAttribute("style", "display: block")

        let marginOption1 = document.createElement("OPTION");
        marginOption1.setAttribute("value", "ml-1")
        marginOption1.innerHTML = "Margin 1";

        let marginOption2 = document.createElement("OPTION");
        marginOption2.setAttribute("value", "ml-0")
        marginOption2.innerHTML = "Margin 0";

        selectMargin.appendChild(marginOption1);
        selectMargin.appendChild(marginOption2);


        let selectType = document.createElement("SELECT")
        selectType.setAttribute("id", "selectType")
        selectType.setAttribute("style", "display: block")

        let typeOption1 = document.createElement("OPTION");
        typeOption1.setAttribute("value", "link")
        typeOption1.innerHTML = "Link";

        let typeOption2 = document.createElement("OPTION");
        typeOption2.setAttribute("value", "seperator")
        typeOption2.innerHTML = "Seperator";

        selectType.appendChild(typeOption1)
        selectType.appendChild(typeOption2)

        let submitButton = document.createElement("INPUT")
        submitButton.setAttribute("type", "submit")
        submitButton.setAttribute("value", "Add this subject")
        submitButton.setAttribute("style", "display: block")

        form.appendChild(inputName);
        form.appendChild(selectIcon);
        form.appendChild(selectMargin);
        form.appendChild(selectType);
        form.appendChild(submitButton);

        options.appendChild(form);

        li.appendChild(a);
        li.appendChild(options);

        ul.appendChild(li);

        navbar.insertBefore(ul, rightMost);
    }
}


function endEditing() {
    let addButton = document.querySelector(".addToSideBar");
    if(addButton){
        addButton.remove()
    }


    let seznam = document.getElementById("nav-drawer").querySelectorAll("[aria-label='Spletno mesto']")[0]
        .querySelector("ul")

    for(let i = 0; i < seznam.children.length; i++){
        seznam.children[i].style.display = "list-item"
        let buttons = seznam.children[i].getElementsByTagName('button');

        while(buttons.length > 0){
            buttons[0].remove();
        }
    }
}

function applySettings(data, refresh) {
    let seznam = document.getElementById("nav-drawer").querySelectorAll("[aria-label='Spletno mesto']")[0]
        .querySelector("ul")


    while(seznam.children.length > 0){
        seznam.children[0].remove()
    }

    console.log(data)
    for(let i = 0; i < data.length; i++){

        let li = document.createElement("LI")
        let top;

        if(data[i].type === "link"){
            top = document.createElement("A")
        }
        else{
            top = document.createElement("DIV")
        }

        top.setAttribute("class", data[i].base["class"]);
        top.setAttribute("data-key", data[i].base["data-key"]);
        top.setAttribute("data-isexpandable", data[i].base["data-isexpandable"]);
        top.setAttribute("data-indent", data[i].base["data-indent"]);
        top.setAttribute("data-showdivider", data[i].base["data-showdivider"]);
        top.setAttribute("data-nodetype", data[i].base["data-nodetype"]);
        top.setAttribute("data-collapse", data[i].base["data-collapse"]);
        top.setAttribute("data-forceopen", data[i].base["data-forceopen"]);
        top.setAttribute("data-isactive", "0");
        top.setAttribute("data-hidden", data[i].base["data-hidden"]);
        top.setAttribute("data-preceedwithhr", data[i].base["data-preceedwithhr"]);
        top.setAttribute("data-key", data[i].base["data-key"]);
        top.setAttribute("data-key", data[i].base["data-key"]);

        let firstLevel = document.createElement("DIV")
        firstLevel.setAttribute("class", data[i].visual["margin"]);

        let secondLevel = document.createElement("DIV")
        secondLevel.setAttribute("class", "media");

        let thirdLevelSpan1 = document.createElement("SPAN");
        thirdLevelSpan1.setAttribute("class", "media-left");

        let icon = document.createElement("I");
        icon.setAttribute("class", data[i].visual["icon"])
        icon.setAttribute("aria-hidden", "true")

        let thirdLevelSpan2 = document.createElement("SPAN");
        thirdLevelSpan2.setAttribute("class", "media-body");
        thirdLevelSpan2.textContent = data[i].visual["text"];

        if(data[i].type === "link"){
            top.setAttribute("href", data[i].base["link"]);

            if(data[i].base["link"] === window.location.href){
                top.setAttribute("data-isactive", "1");
                top.setAttribute("class", data[i].base["class"] + " active active_tree_node")
                thirdLevelSpan2.setAttribute("class", "media-body font-weight-bold");
            }
        }

        thirdLevelSpan1.appendChild(icon);

        secondLevel.appendChild(thirdLevelSpan1);
        secondLevel.appendChild(thirdLevelSpan2);

        firstLevel.appendChild(secondLevel);

        top.appendChild(firstLevel);

        li.appendChild(top);

        seznam.appendChild(li);
    }

    if(refresh){
        editSubjects();
    }

}

function loadInitialData() {
    let seznam = document.getElementById("nav-drawer").querySelectorAll("[aria-label='Spletno mesto']")[0]
        .querySelector("ul")

    let subjects = []

    for(let i = 0; i < seznam.children.length; i++){
        let tmp;
        let type;
        let link = "";
        if(seznam.children[i].getElementsByTagName('a').length > 0){
            tmp = seznam.children[i].getElementsByTagName('a')[0];
            type = "link";
            link = seznam.children[i].getElementsByTagName('a')[0].getAttribute("href");
        }
        else{
            tmp = seznam.children[i].getElementsByTagName('div')[0];
            type = "seperator";
        }

        let classString = tmp.getAttribute("class")
        let classTmp = classString.split(" ");
        if(classTmp.length > 2){
            classString = classTmp.slice(0, 2).join(" ")
        }

        subjects.push({
            "type": type,
            "base": {
                "link": link,
                "class": classString,
                "data-key": tmp.getAttribute("data-key"),
                "data-isexpandable": tmp.getAttribute("data-isexpandable"),
                "data-indent": tmp.getAttribute("data-indent"),
                "data-showdivider": tmp.getAttribute("data-showdivider"),
                "data-type": tmp.getAttribute("data-type"),
                "data-nodetype": tmp.getAttribute("data-nodetype"),
                "data-collapse": tmp.getAttribute("data-collapse"),
                "data-forceopen": tmp.getAttribute("data-forceopen"),
                "data-hidden": tmp.getAttribute("data-hidden"),
                "data-preceedwithhr": tmp.getAttribute("data-preceedwithhr")
            },
            "visual": {
                "margin": tmp.children[0].getAttribute("class"),
                "icon": tmp.querySelector("i").getAttribute("class"),
                "text": tmp.querySelector("[class^='media-body']").textContent
            }
        })
    }

    chrome.storage.sync.set({"FRIpredmetiSubjects": subjects})


}

function moveSubject(index, direction){
    chrome.storage.sync.get("FRIpredmetiSubjects", function (data){
        //1 - down, -1 - up
        if(index === data.FRIpredmetiSubjects.length - 1 && direction === 1){
            return;
        }
        else if(index === 0 && direction === -1){
            return;
        }
        else{
            let tmp = data.FRIpredmetiSubjects[index + direction];
            data.FRIpredmetiSubjects[index + direction] = data.FRIpredmetiSubjects[index];
            data.FRIpredmetiSubjects[index] = tmp;
        }

        chrome.storage.sync.set({"FRIpredmetiSubjects": data.FRIpredmetiSubjects}, function (){
            applySettings(data.FRIpredmetiSubjects, true);
        })
    })
}

function removeSubject(index){
    chrome.storage.sync.get("FRIpredmetiSubjects", function (data){
        data.FRIpredmetiSubjects.splice(index, 1)

        chrome.storage.sync.set({"FRIpredmetiSubjects": data.FRIpredmetiSubjects}, function (){
            applySettings(data.FRIpredmetiSubjects, true);
        })
    })
}

function addSubject(e){
    e.preventDefault();
    let name = document.getElementById("displayName").value;
    let margin = document.getElementById("selectMargin").value;
    let type = document.getElementById("selectType").value;

    if(name === ""){
        alert("Display name cannot be empty");
        return;
    }



    chrome.storage.sync.get("FRIpredmetiSubjects", function (data){

        let url = window.location.href;
        let dataKey = url.match(/\d+/)[0];

        data.FRIpredmetiSubjects.push({
            "type": type,
            "base": {
                "link": window.location.href,
                "class": "list-group-item list-group-item-action",
                "data-key": dataKey,
                "data-isexpandable": "1",
                "data-indent": "1",
                "data-showdivider": "0",
                "data-type": "",
                "data-nodetype": "1",
                "data-collapse": "0",
                "data-forceopen": "0",
                "data-hidden": "0",
                "data-preceedwithhr": "0"
            },
            "visual": {
                "margin": margin,
                "icon": document.getElementById("selectIcon").value,
                "text": name
            }
        });

        chrome.storage.sync.set({"FRIpredmetiSubjects": data.FRIpredmetiSubjects}, function (){
            document.getElementById("displayName").value = "";
            document.getElementById("addPageDropDownMenu").setAttribute("class", "dropdown-menu");
            document.getElementById("addPageDropDown").setAttribute("aria-expanded", "false");
            document.querySelector("[class^='addSubjectLI']").setAttribute("class", "addSubjectLI dropdown nav-item")
            applySettings(data.FRIpredmetiSubjects, true);
        })
    })

}


function reset(){
    endEditing();
    chrome.storage.sync.clear()
    location.reload();
}