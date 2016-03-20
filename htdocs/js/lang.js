var Lang = function () {

    this.lang = {
                en: {
                    'btn.next': "Next",
                    'btn.previous': "Previous",
                    'text.queue': "Queue",
                    'btn.cancel': "Cancel",
                    'btn.addAll': "Add all",
                    'text.browseDb': "Browse database",
                    'text.addStream': "Add Stream",
                    'text.settings': "Settings",
                    'text.plugins': "Plugins",
                    'text.rand': "Random",
                    'text.consume': "Consume",
                    'text.single': "Single",
                    'text.cxFade': "Crossfade",
                    'text.repeat': "Repeat",
                    'text.clearQueue': "Clear queue",
                    'text.saveQueue': "Save queue",
                    'text.noty': "Notifications",
                    'text.duration': "Duration",
                    'text.artist': "Artist",
                    'text.album': "Album",
                    'text.title': "Title",
                    'text.loading': "Loading...",
                    'text.search': "Search",
                    'text.streamUrl': "Stream URL",
                    'text.root': "Root",
                    'dirble.cat': "Categories",
                    'noty.connected': "Connected to ympd",
                    'error.tooManyResult': "Too many results, please refine your search!",
                    'noty.text.added': " added",
                    'noty.text.playlist': "Playlist ",
                    'noty.error.mpdLost': "ympd lost connection to MPD ",
                    'noty.error.ympdLost': "Connection to ympd lost, retrying in 3 seconds ",
                    'text.error': "error",
                    'noty.dbUpdate': "Updating MPD Database... ",
                    'text.searching': "Searching",
                    'text.playlistName': "Playlist name",
                    'btn.save': "Save",
                    'text.updateDb': "Update DB",
                    'text.passwordSet': "MPD Password is set",
                    'text.passMissmatch': "Password does not match!",
                    'text.passConfPlaceholder': "Password confirmation",
                    'text.mpdPasswdConf': "MPD Password (Confirmation)",
                    'text.mpdPasswd': "MPD password",
                    'text.password': "Password",
                    'text.mpdHost': "MPD Host/IP",
                    'text.mpdPort': "MPD Port",
                    'text.description': ' <h4><a href="http://www.ympd.org"><span class="glyphicon glyphicon-play-circle"></span> ympd</a>&nbsp;&nbsp;&nbsp; <small>MPD Web GUI - written in C, utilizing Websockets and Bootstrap/JS</small> </h4> <p> ympd is a lightweight MPD (Music Player Daemon) web client that runs without a dedicated webserver or interpreters like PHP, NodeJS or Ruby. It\'s tuned for minimal resource usage and requires only very litte dependencies.</p> <h5>ympd uses following excellent software:</h5> <h6><a href="http://cesanta.com/docs.html">Mongoose</a> <small>GPLv2</small> </h6> <h6><a href="http://www.musicpd.org/libs/libmpdclient/">libMPDClient</a> <small>BSD License</small> </h6>'
                }
    };
    this.currentLang = navigator.language || navigator.userLanguage;
    this.defaultLang = 'en';
};

Lang.prototype.appendData = function (lang) {
    for (var k in lang)
    {
        if (k in this.lang)
        {
            for (var k2 in lang[k])
            {
                this.lang[k].push(lang[k][k2]);
            }
        }
        else
        {
            this.lang[k] = lang[k];
        }
    }
};

Lang.prototype.getTranslation = function (id) {

    if (this.currentLang in this.lang) {
        if (id in this.lang[this.currentLang])
            return this.lang[this.currentLang][id];
        else {
            for (var k in this.lang) {
                if (id in this.lang[k])
                    return this.lang[k][id];
            }
        }
    }
    else {
        if (id in this.lang[this.defaultLang])
            return this.lang[this.defaultLang][id];
        else
            return id;
    }

};

Lang.prototype.evaluateLang = function () {
    $("[data-lang]").each(function(){
       // return $(this).data('test');
    });
};

window.langManager = new Lang();
