/**
 * Created by Guillaume on 05/03/2016.
 */
// api-key :   AIzaSyDA-rwPdNFTPpp64aaurlOftZE8Gr47F9Q
window.pluginManager.add({
    name : "youtube-dl",
    lang : {
        en : {
            modalTitle  : "Add Youtube video",
            queryLabel : "Search keywords",
            btnText : "Search !",
            addVideo : "Add Video",
            videoInfo : "Information"
        }
    },
    externalJs : ["https://apis.google.com/js/client.js?onload=gApiInit"],
    ui : ' <form id="form" class="form"> <div class="form-group"> <label for="queryInput">Search keywords:</label> <div class="input-group"> <input class="form-control" id="queryInput" placeholder="keywords" type="text"> <span class="input-group-btn"> <button id="btnSearch" class="btn btn-default" type="submit">Search !</button> </span> </div> </div> </form> <div id="SearchResult"> </div>',
    onDisplay : function () {
        console.log("called", this);
        document.getElementById("plugin-modal-title").innerHTML = this.name;
        document.getElementById("plg-modal-body").innerHTML = this.ui;
        var that = this;
        document.getElementById("form").onsubmit = function (ev) {
            ev.preventDefault();
            that.searchVideo(document.getElementById("queryInput").value,'');
            document.getElementById("SearchResult").innerHTML = '<br><br><img src="assets/plugins/'+that.name+'/loading.gif"> ';

        };
       // document.getElementById("plugin-modal-title").innerHTML = this.;


        $("#pluginModal").modal('show');
    },
    onStart : function () {

    },
    onStop : function () {

    },
    searchVideo : function (query, pageToken) {
        var that = this;
        var request = gapi.client.youtube.search.list({
            part: "snippet",
            type: "video",
            pageToken : pageToken,
            q: encodeURIComponent(query).replace(/%20/g, "+"),
            maxResults: 5
        });
        // execute the request
        request.execute(function(response) {
            var results = response.result;
            console.log(results);
            var nextPageTocken = results.nextPageToken;
            var prevPageTocken = results.prevPageToken;
            document.getElementById("SearchResult").innerHTML = "";
            var dataPanel = '';
            for (i=0;i<results.items.length;i++)
            {
                var snippet = results.items[i].snippet;
                var videoId = results.items[i].id.videoId;
                var thumnailSrc = snippet.thumbnails.default.url;
                var title = snippet.title;
                var desc = snippet.description;

                dataPanel += '<div class="row"><div class="col-md-11">';
                dataPanel += '<div class="panel panel-default">';
                dataPanel +=  '<div class="panel-body"><div class="row"><div class="col-md-3">';
                dataPanel += '<a href="#" class="thumbnail"><img src="'+thumnailSrc+'" alt="thumbnailVideo">';
                dataPanel += '</a></div><div class="col-md-7"><span style="font-weight: bold">'+title+'</span> <br><p>'+desc+'</p></div>';
                dataPanel += '<div class="col-md-2"><button id="'+videoId+'" class="addVideoBtn btn btn-primary">Add </button></div></div>';
                dataPanel += '</div></div></div></div>';


            }

            dataPanel += '<br><ul class="pager">';
            if (prevPageTocken != null)
                dataPanel += '<li id="prev" class="page-btn"><a href="#" id="'+prevPageTocken+'">Previous</a></li>';

            if (nextPageTocken != null)
                dataPanel += '<li id="next" class="page-btn"><a href="#" id="'+nextPageTocken+'">Next</a></li>';



            dataPanel += '</ul>';

            document.getElementById("SearchResult").innerHTML += dataPanel;

            if (nextPageTocken != null)
            {
                document.getElementById(nextPageTocken).onclick = function (ev) {
                    that.searchVideo(query, ev.target.id);
                };
            }

            if (prevPageTocken != null)
            {
                document.getElementById(prevPageTocken).onclick = function (ev) {
                    that.searchVideo(query, ev.target.id);
                };
            }


            var addBtn = document.querySelectorAll(".addVideoBtn");

            for (i=0;i<addBtn.length;i++)
            {
                addBtn[i].onclick = function () {
                    console.log("https://www.youtube.com/watch?v="+addBtn.id);
                }
            }



        });
    }


});

function gApiInit() {
    gapi.client.setApiKey("AIzaSyDA-rwPdNFTPpp64aaurlOftZE8Gr47F9Q");
    gapi.client.load("youtube", "v3", function() {
      //  console.log("init !!")
    });
}
