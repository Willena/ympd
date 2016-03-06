/**
 * Created by Guillaume on 05/03/2016.
 */

window.pluginManager.add({
    name : "youtube-dl",
    ui : '<form role="form"><div class="row"><div class="form-group col-md-9"><label class="control-label" for="streamurl">Video</label><input type="text" class="form-control" id="streamurl" /></div></div></form>',
    onDisplay : function () {
        console.log("called", this);
        document.getElementById("plg-modal-body").innerHTML = this.ui;

        $("#pluginModal").modal('show');
    },
    onStart : function (obj) {

    },
    onStop : function (obj) {

    }

});