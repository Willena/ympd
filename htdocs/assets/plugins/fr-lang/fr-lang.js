/**
 * Created by Guillaume on 20/03/2016.
 */
window.pluginManager.add({
    name: "fr-lang",
    lang : {
        fr : {
            'btn.next': "Suivant",
            'btn.previous': "Précedant",
            'text.queue': "File d'attente",
            'btn.cancel': "Annuler",
            'btn.close' : "Fermer",
            'btn.addAll': "Tout ajouter",
            'text.browseDb': "Parcourir la base",
            'text.addStream': "Ajouter un flux",
            'text.settings': "Paramètres",
            'text.plugins': "Plugins",
            'text.rand': "Aleatoire",
            'text.consume': "Consume",
            'text.single': "Single",
            'text.cxFade': "Crossfade",
            'text.repeat': "Répéter",
            'text.clearQueue': "Vider la playlist",
            'text.saveQueue': "Sauvegarder la playlist",
            'text.noty': "Notifications",
            'text.duration': "Durée",
            'text.artist': "Artiste",
            'text.album': "Album",
            'text.title': "Titre",
            'text.loading': "Chargement...",
            'text.search': "Recherche",
            'text.streamUrl': "URL du flux",
            'text.root': "Racine",
            'dirble.cat': "Categories",
            'noty.connected': "Connecté à ympd",
            'error.tooManyResult': "Les résultat sont trop nombreux. Merci d'affiner votre recherche !",
            'noty.text.added': " ajouté",
            'noty.text.playlist': "Playlist ",
            'noty.error.mpdLost': "ympd a perdu la connexion à MPD ",
            'noty.error.ympdLost': "La connexion avec ymp a été perdu! prochain essai dans 3 secondes ",
            'text.error': "Erreur",
            'noty.dbUpdate': "Mise à jour de la base de données ",
            'text.searching': "Recherche en cours",
            'text.playlistName': "Nom de la playlist",
            'btn.save': "Sauvegarder",
            'text.wait' :"Veuillez patienter",
            'text.updateDb': "Mettre à jour la BDD",
            'text.passwordSet': "Mot de passe pour MPD défini",
            'text.passMissmatch': "Les mots de passe ne correspondent pas",
            'text.passConfPlaceholder': "Confirmation du mot de passe",
            'text.mpdPasswdConf': "Mot de passe MPD ( confirmation )",
            'text.mpdPasswd': "Mot de passe MPD",
            'text.password': "Mot de passe",
            'text.mpdHost': "MPD Hote/IP",
            'text.mpdPort': "MPD Port",
            'text.description': ' <h4><a href="http://www.ympd.org"><span class="glyphicon glyphicon-play-circle"></span> ympd</a>&nbsp;&nbsp;&nbsp; <small>MPD Web GUI - written in C, utilizing Websockets and Bootstrap/JS</small> </h4> <p> ympd is a lightweight MPD (Music Player Daemon) web client that runs without a dedicated webserver or interpreters like PHP, NodeJS or Ruby. It\'s tuned for minimal resource usage and requires only very litte dependencies.</p> <h5>ympd uses following excellent software:</h5> <h6><a href="http://cesanta.com/docs.html">Mongoose</a> <small>GPLv2</small> </h6> <h6><a href="http://www.musicpd.org/libs/libmpdclient/">libMPDClient</a> <small>BSD License</small> </h6>'
        }
    },
    ui : "",
    onStart : function()
    {
        langManager.appendData(this.lang);
        langManager.evaluateLang();
    }
});