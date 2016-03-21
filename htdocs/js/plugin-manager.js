/**
 * Created by Guillaume on 05/03/2016.
 */


Plugins = function () {
    this.pluginList = [];
};

Plugins.prototype.loadPlg = function () {
    var xhr = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");


    xhr.open("GET", 'assets/plugins/main.json', false);
    xhr.send(null);
    if (xhr.readyState != 4 || (xhr.status != 200 && xhr.status != 0)) {
        throw new Error("Impossible de charger le fichier  (code HTTP : " + xhr.status + ").");
    } // Code == 0 en local

    var obj = JSON.parse(xhr.responseText);

    for (var item in obj) {
        console.log(item, obj[item]);

        var jsData = document.createElement('script');
        jsData.src = 'assets/plugins/' + item + '/' + obj[item];
        document.body.appendChild(jsData);

    }
};

Plugins.prototype.add = function (plg) {
    this.pluginList.push(plg);

    if (plg.externalJs) {
        this.loadExternalJs(plg.externalJs);
    }


    console.log("hey ");

    if (plg.ui != "") {
        var li = document.createElement('li');
        li.id = plg.name;
        li.onclick = function () {
            console.log(this.id);
            pluginManager.rowByName(this.id).onDisplay();
        };

        var a = document.createElement("a");
        a.href = "#";
        a.innerHTML = plg.name;

        li.appendChild(a);

        document.getElementById("plg-drop").appendChild(li);
    }

    plg.onStart();

};

Plugins.prototype.loadExternalJs = function (array) {

    for (i = 0; i < array.length; i++) {
        var jsData = document.createElement('script');
        jsData.src = array[i];
        document.body.appendChild(jsData);
    }


};


Plugins.prototype.rowByName = function (name) {
    for (i = 0; i < this.pluginList.length; i++) {
        //console.log(this.pluginList[i]);
        if (name == this.pluginList[i].name)
            return this.pluginList[i];
    }
    return -1;
};

window.pluginManager = new Plugins();
pluginManager.loadPlg();