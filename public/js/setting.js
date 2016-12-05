function fileUpload () {
    'use strict';

    var getOptions = function(type) {
        var progress = '';
        var bar = '';
        var percent = '';
        var showVersion = ''
        switch(type) {
            case 'android':
                progress = $('#ANDProgress');
                bar = $('#ANDProgress .progress-bar');
                percent = $('#ANDProgresspercent');
                showVersion = $('#ANDVersion');
                break;
            case 'deamon4android':
                progress = $('#D4AProgress');
                bar = $('#D4AProgress .progress-bar');
                percent = $('#D4AProgresspercent');
                showVersion = $('#D4AVersion');
                break;
            case 'DS120':
                progress = $('#ANDProgress_ds120');
                bar = $('#ANDProgress_ds120 .progress-bar');
                percent = $('#ANDProgresspercent');
                showVersion = $('#ANDVersion1');
                break;
            case 'DS120ctrl':
                progress = $('#D4AProgress_ds120');
                bar = $('#D4AProgress_ds120 .progress-bar');
                percent = $('#D4AProgresspercent');
                showVersion = $('#ds120ctrl');
                break;
            case 'windows':
                progress = $('#WINProgress');
                bar = $('#WINProgress .progress-bar');
                percent = $('#WINProgresspercent');
                showVersion = $('#WINVersion');
                break;
            default:
                return null;
        };
        var options = {
            url: '/upload/package?type=' + type,
            dataType: 'json',
//            formData: {update: type},
            add: function (e, data) {
                $('#confirmModal').modal(options);
                $('#confirmModal').on('hidden.bs.modal', function (e) {
                    data.submit();
                 });
                return false;
            },
            done: function (e, data) {
                if(!data.result) return alert('未知的错误');
                if(data.result.status == 'fail') {
                    var p = bar.width();
                    var x = progress.width();
                    progress.hide();
                    modelHide();
                    console.log(data.result.result);
                    return alert(data.result.result);
                };

                setTimeout(function() {
                    showVersion.html(data.result.result);
                    var p = bar.width();
                    var x = progress.width();
                    if(p === x) {
                        progress.hide();
                        bar.css('width', 0 + '%');
                    }
                }, 1000);
                if(data.result.status == 'success') {
                    $('#finishModal').modal(options);
                    $('#finishModal').on('hidden.bs.modal', function (e) {
                        modelHide();
                    });
                    //alert("升级完成！");

                };
            },
            progressall: function (e, data) {
                var t = parseInt(data.loaded / data.total * 100, 10);
                progress.show();
                bar.css('width',t + '%');
                percent.html(t + '%');
            }
        };
        return options;
    };

    $('#ANDUploadInput').fileupload(getOptions('android')).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');

    $('#ANDUploadInput120').fileupload(getOptions('DS120')).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');

    $('#D4AUploadInput').fileupload(getOptions('deamon4android')).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');

    $('#D4AUploadInputds120').fileupload(getOptions('DS120ctrl')).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');

    $('#WINUploadInput').fileupload(getOptions('windows')).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');
}


/*Setting = Backbone.Model.extend({
    initialize: function() {
    }
});
Settings = Backbone.Collection.extend({
    url:'/mediacapset',
    model: Setting
});

var settings = new Settings;*/


//设置媒体库总量
$.ajax({
    type:'GET',
    url:'/mediacapset'

}).done(function(res){

    console.log(res);
    var cap_value = res.value;
    $("#mediaCap").val(cap_value);

});


//设置媒体库总量
function setMediaCap(){
    var data = {};
    var cap = $("#mediaCap").val();
    data.name = 'mediaCap';
    data.value = cap;
    $.ajax({
        type:'POST',
        url: '/mediacapset',
        data:JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON'
    }).done(function(res){
        if(res.status === 'success') {
            alert('设置成功！');
        }
        if(res.status === 'beyond'){
            alert('不能低于媒体阈值！');
        }
        location.reload();

    })
}


//设置媒体库阈值
$.ajax({
    type:'GET',
    url:'/mediathreshold'

}).done(function(res){

    console.log(res);
    var threshold_value = res.value;
    $("#mediaThreshold").val(threshold_value);
});


function setMediaThreshold(){
    var data = {};
    var thresHold = $("#mediaThreshold").val();
    data.name = 'mediaThreshold';
    data.value = thresHold;
    console.log(data);
    $.ajax({
        type:'POST',
        url: '/mediathreshold',
        data:JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON'
    }).done(function(res){
        if(res.status === 'success') {
            alert('设置成功');
        }
        if(res.status === 'beyond'){
            alert('不能超过媒体总量！');
        }
        if(res.status == 'negative'){
            alert('不能为负数！');
        }
        location.reload();
    })
}











/*
function setMediaThreshold(){
    var data = {};
    var threshold = $("#mediaThreshold").val();
    data.name = 'mediaThreshold';
    data.value = threshold;
    console.log(data);
    $.ajax({
        type:'POST',
        url: '/mediacapset',
        data:JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON'
    }).done(function(res){
        if(res.status === 'success') {

        } else {
            alert('设置失败');
        }
        location.reload();
    })
}
*/






/*
function updatepublish(){
    var data = {};
    var scene=$('#updateScene option:selected').val();
    data.publishscene = scene;
    $.ajax({
            type:'PUT',
            url: '/publishscene',
            data:JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: 'JSON'
    }).done(function(res){
        if(res.status === 'success') {

        } else {
            alert('设置失败');
        }
        location.reload();
    })

};
function modelSubmit(){
    $('#confirmModal').modal('hide');
    //console.log(111);
    //data.submit();
};
function modelHide(){
    location.href='/setting'
};*/

$(function(){
    function showScene(){
        //settings.fetch({async:false});
        //console.log(settings);
        //console.log(settings);
        /*var scene=settings.models[0].attributes.publishscene?settings.models[0].attributes.publishscene:1080;
            var vals = $('#updateScene option');
            for(var i = 0;i<vals.length;i++){
                if(vals[i].value == scene+'P'){
                    vals[i].selected = true
                }
        }*/
    }
    showScene();
});
    //updatePublish()



