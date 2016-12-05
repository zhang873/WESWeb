/**
 * Created by shgbit on 14-1-20.
 */
/** Common*/
var durations;
var playlistchildren;
var $mediaIds;
var users = new Users;
var nm = false;
MediaUnionUser = Backbone.Model.extend({
    initialize: function() {
    },
    defaults: {
        mediaId: '',
        departId:''        
    }
});
MediaUnionUsers = Backbone.Collection.extend({    
    url:'/mediaunionuser',
    model: MediaUnionUser
});
var mediaunionusers = new MediaUnionUsers;
mediaunionusers.fetch();
users.fetch({async:false});



//取到用户的id


var personid =  {
    "id":$.cookie('token')
};
console.log(personid);

$.ajax({
    type:'POST',
    url: '/media/statics/personstatus',
    data: personid
}).done(function(res){
    console.log(res);
    console.log(res.status);
});




function getUsername(mediaid){
    var muuModels=mediaunionusers.models;
    var userModels = users.models;
    var departid='';
    var $username='';
    for(var i = 0; i<muuModels.length;i++){
        if(mediaid==muuModels[i].attributes.mediaId){
            departid = muuModels[i].attributes.departId;
            break;
        }
    }
    for(var j=0;j<userModels.length;j++){
        if(departid==userModels[j].attributes.departId){
            $username=userModels[j].attributes.name;
            return $username;
        }
    }
    return $username;
}

function validateMediaName($name) {
    var reg = /[<>\*\?:\^|"]/ig;
//    var reg = /^[a-zA-Z0-9_\.\(\)\-\u4e00-\u9fa5]+$/ig;
    var $result={};
    if($name.match(reg)) $result={status:false,message:'格式不正确'};
    else if($name.getRealLength() > 50 ) $result={status:false,message:'长度不能超过50字节'};
//    if(!$name.match(reg)) $result={status:false,message:'文件夹名或者媒体名只能为数字、中英文、点、下划线和中划线'};
//    else $result={status:true,message:''};

    // 后缀名
    //if ($name.indexOf())

    else $result={status:true,message:''}
    return $result
}

function validateImage(type) {
    var imageRegex = /image*/i;
    if(imageRegex.test(type)) return true;
    return false;
}


function compressAndUpload() {
    'use strict';
    var currentId = $('#mediaNav').attr('currentId') ? $('#mediaNav').attr('currentId') : '';    
    var url = '/uploadPPT';
    $('#compressAndUpload').fileupload({
        url: url,
        dataType: 'json',
        singleFileUploads: false,
        add: function (e, data) {
            allmedias.fetch({url:'/allmedias'}).done(function(collection){
            $.ajax({
                type:'GET',
                url:'/getMediaSize',
                contentType: "application/json; charset=utf-8"
            }).done(function(result) {
                var maxSize = parseInt(result.mediacap) * 1024 * 1024 * 1024;
                var minSize = 2 * 1024 * 1024 * 1024;
            var fileList = $('#filelist');
            var fileItemHead = '<tr class="fade in"><td class="col-xs-10">';
            var fileItemTail = '</td></tr>';
            var isValid = false;
            var newFiles = [];
            var numSize = 0;//已有空间大小
            var sySize = 0;//剩余空间大小
            $('#compressCancelBtn').click(function() {
                location.reload();
            });
            $('#compressModalClose').click(function() {
                location.reload();
            });
            $('#compressNameDiv').css("display", "block");
            $.each(data.files, function (index, file) {
                if(validateImage(file.type)){
                    isValid = true;
                    fileList.append(fileItemHead + file.name + fileItemTail);
                    newFiles.push(file)
                }
            });
            for (var i = 0; i < collection.length; i++) {
                console.log(collection[i].size)
                numSize += parseInt(collection[i].size);
            }
            data.files = newFiles;
            sySize = maxSize-numSize;
            if(isValid) {
                $('#compressTypeAlert').css("display","none");
                $('#compressUploadBtn').click(function() {
                    var compressname = $('#compressName').val().trim();
                    console.log(compressname)
                    if(compressname === '') {
                        $('#compressNameAlert').css("display","block");
                    } else {
                        if(sySize < minSize){
                            alert("媒体库容量不足，请删除一些后再上传或联系管理员！")
                        }else{
                            data.compressname = compressname;
                            data.submit();
                        }
                    }
                });
                $('#addFilesBtn').hide();

            } else {
                $('#compressTypeAlert').css("display","block");
            }
            })
            });
        },
        done: function (e, data) {
            if(!data.result) {
                alert('未知的错误');
                location.reload();
            } else if (data.result.status) {
            	var curTime=new Date().getTime().toString();
                $.ajax({
                    type:'POST',
                    url: '/compressPPT?path=' + currentId + '&compressname=' + data.compressname + '&tmpDir=' + data.result.message + '&curtime='+curTime,
                    dataType: 'JSON'
                }).done(function(res){
                        if(res.status === 'success') {

                        } else {
                            alert('打包上传失败');
                        }
                        location.reload();
                })
            } else {
                alert(data.result.message);
                location.reload();
            }
        },
        progressall: function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('#cprogress').show();
            $('#cprogress .progress-bar').css('width',progress + '%');
            $('#cprogresspercent').html(progress + '%')
        }
    }).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');
}
function fileUpload() {

    'use strict';
	var each,names=[],curTime;
    var currentId = $('#mediaNav').attr('currentId') ? $('#mediaNav').attr('currentId') : '';
    curTime=new Date().getTime().toString();
    var url = '/upload/media?path=' + currentId+'-'+curTime;


    $('#uploadInput').fileupload({
        url: url,
        dataType: 'json',
        add: function (e, data) {
        	allmedias.fetch({url:'/allmedias'}).done(function(collection){
                $.ajax({
                    type:'GET',
                    url:'/getMediaSize',
                    contentType: "application/json; charset=utf-8"
                }).done(function(result) {
                    var maxSize = parseInt(result.mediacap) * 1024 * 1024 * 1024;
                    var minSize = 2 * 1024 * 1024 * 1024;
                for (var i = 0, len =collection.length; i < len; i++) {
                    each = collection[i];
                    names.push(each.name);
                }
                    var clear = true;
                    $.each(data.files, function (index, file) {
                        if (file.size>1024*1024*1024*1.5) {
                            alert('文件体积超过1.5GB,请重新选择！')
                            clear = false;
                        } else {
                            if(!file.name.toLowerCase().match(/\.mp4$|\.mp3$|\.png$|\.jpg$|\.mkv$|\.flv$|\.zip$/)) {
                                if(file.name.toLowerCase().match(/\.wmv/)){
                                    alert("文件为WMV，需将其转成mp4文件！")
                                    clear = false;
                                }else if (!window.confirm('上传的文件格式不支持，是否继续上传？')) {
                                   clear = false;
                                }
                            } else {
                                var $result=validateMediaName(file.name)
                                if(!$result.status) {
                                    alert($result.message)
                                    clear = false;
                                }
                            }
                        }
                    })
                
                if(clear) {
                    var numSize = 0;//已有空间大小
                    var sySize = 0;//剩余空间大小
                    var isSave = false;
                    for (var i = 0; i < collection.length; i++) {
                        //console.log(collection[i].size)
                        numSize += parseInt(collection[i].size);
                    }
                    //numSize是除要上传媒体的总size
                    //console.log(numSize)
                    sySize = maxSize-numSize;
                    if(sySize < minSize){
                        alert("媒体库容量不足，请删除一些后再上传或联系管理员！")
                    }else{
                        data.submit();
                    }
                }
                })
            });
            
        },
        done: function (e, data) {
            var isSave = true;
            if(!data.result) return alert('未知的错误');
            if(data.result.status == 'fail') return alert(data.result.message);
          
            var media = new Media(data.result.result);
            var view = new MediaItemView({model:media});
            $("#mediaList").children('tbody').prepend(view.render().el);
            medias.add(media);
            media = media.toJSON();
            medias.get(media.parentId) ? medias.get(media.parentId).fetch() : null;
            
	    location.reload();
        },
        progressall: function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('#progress').show();
            $('#progress .progress-bar').css('width',progress + '%');
            $('#progresspercent').html(progress + '%')
            if(progress === 100) {
                $('#progress').hide();
                $('#progress .progress-bar').css('width', 0 + '%');
            }
        }
    }).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');
}

function rmFolder($media) {                        //删除节点的递归
    if($media.type === 'folder') {
        var $medias = medias.filter(function(media) {
            return media.toJSON().parentId === $media.id
        });
        $.each($medias, function(i, o) {
            rmFolder(o.toJSON());
        });
    }
    medias.remove($media);
}

function updateParent($media,$mtime,$flag) {
    if($media.parentId !== '') {
        var parentMedia = medias.get($media.parentId) ? medias.get($media.parentId) : $media
        switch ($flag) {
            case 'create':
                var newsize = parentMedia.toJSON().size+1;
                parentMedia.set('size',newsize);
                break;
            case 'update':
                break;
            case 'delete':
                var newsize = parentMedia.toJSON().size-1;
                parentMedia.set('size',newsize);
                break;
        }
        parentMedia.set('mtime',$mtime);
    }
}

function checkMediaNameExist($name,$oldname,$type,count,parentId) {
    var $medias = allmedias.filter(function(media) {
        return (media.toJSON().name === $name && media.toJSON().type === $type
             && media.toJSON().parentId === parentId && media.toJSON().name !== $oldname);
    });
    if($medias.length !== 0) {
        $.each($medias, function(i, o) {
            var tempname = '';
            if(count === 0) {
                count = count+1;
                tempname = $name+'('+count+')';
            } else {
                var last = '('+count+')';
                var lastIndex = $name.lastIndexOf(last);
                var originName =$name.substring(0,lastIndex);
                count++;
                tempname = originName+'('+count+')';
            }
            var result = checkMediaNameExist(tempname,$oldname,$type,count,parentId);
            $name = result.tempname;
            count = result.count;
        });
    }
    return {tempname:$name,count:count};
}

/** Model*/
Media = Backbone.Model.extend({
    urlRoot:'/media',
    initialize: function() {
    },
    defaults: {
        name: '全部文件',
        type:'folder',
        url:'',
        size:0,
        duration:'00:00:10',
        mtime:new Date().getTime(),
        parentId:''
    }
});
/** Collection */
Medias = Backbone.Collection.extend({
    model: Media
});
var medias = new Medias;

AllMedias = Backbone.Collection.extend({
    url:'/allmedias',
    model: Media
});

var allmedias = new AllMedias;
allmedias.fetch();

/** View */


MediaListView = Backbone.View.extend({
    el:"#mediaList",

    events: {
        'click #allMedias': 'selectAllMedias',
        'click .mediaItemChk': 'selectOneMedia',
        'click .sortByName': 'sortByName',
        'click .sortByType': 'sortByType',
        'click .sortBySize': 'sortBySize',
        'click .sortByDuration': 'sortByDuration',
        'click .sortByMtime': 'sortByMtime'
    },
    initialize: function() {
        _.templateSettings = {
            interpolate : /\{\{(.+?)\}\}/g
        };

        var that = this;
        medias.fetch({url:'/medias',
            success:function(collection,res) {
                var $medias = medias.sortBy(function (media) {
                    return media.get('mtime');
                });
                $medias = $medias.filter(function(media) {
                    return   media.toJSON().parentId === '';
                });
                var mediaNavView = new MediaNavView({model:initializeModel});
                $("#mediaNav").append(mediaNavView.render().el);
                that.render($medias);
            },
            error:function(){
                alert('error');
            }
        });

    },
    initializeRender:function() {

        var currentId = $('#mediaNav').attr('currentId') ? $('#mediaNav').attr('currentId') : '';
        var $medias = medias.sortBy(function (media) {
            return media.get('mtime');
        });
        var $medias = $medias.filter(function(media) {
            return media.toJSON().parentId === currentId
        });
        this.render($medias);
    },
    render: function($medias) {

        $(this.el).children('tbody').children().remove();
        var $sortFlag = $('#mediaList').find('.caret:visible').parents('.sortBy').hasClass('dropup');
        if(!$sortFlag) {
            this.renderDesc($medias);
        } else {
            this.renderAsc($medias);
        }
        var query = $('#searchInput').val().trim();
        if(query !== '') {
            $(".mediaParent").show();
        }
        else {
            $(".mediaParent").hide();
        }

    },
    renderAsc:function($medias) {
        $.each($medias, function(i, o) {
            var view = new MediaItemView({model:o});
            $("#mediaList").children('tbody').append(view.render().el);

        })
    },
    renderDesc:function($medias) {
        $.each($medias, function(i, o) {
            var view = new MediaItemView({model:o});
            $("#mediaList").children('tbody').prepend(view.render().el);

        })
    },
    selectAllMedias: function(e) {
        if($("#allMedias:checked").length > 0)
            $(".mediaItemChk").prop('checked',true);
        else
            $(".mediaItemChk").prop('checked',false);

        if (e && e.stopPropagation) {
            e.stopPropagation();
        }
        else {
            window.event.cancelBubble = true;
        }

    },
    selectOneMedia: function() {
        if($(".mediaItemChk:checked").length == $(".mediaItemChk").length)
            $("#allMedias").prop('checked',true);
        else
            $("#allMedias").prop('checked',false)
    },
    sortByName:function() {
        this.sortBy('Name');
    },
    sortByType:function() {
        this.sortBy('Type');
    },
    sortBySize:function() {
        this.sortBy('Size');
    },
    sortByDuration:function() {
        this.sortBy('Duration');
    },
    sortByMtime:function() {
        this.sortBy('Mtime');
    },
    sortBy: function(sortColNname) {
        var taget ='.sortBy'+sortColNname;
        $(taget).find('.caret').show();
        $(taget).siblings().removeClass('dropup').find('.caret').hide();
        if(!$(taget).hasClass('dropup')) {
            $(taget).addClass('dropup');
        } else {
            $(taget).removeClass('dropup');
        }
        var mediaId = $('#mediaNav').attr('currentId') ? $('#mediaNav').attr('currentId') : '';
        var $medias = medias.sortBy(function (media) {
            return media.get(sortColNname.toLowerCase());
        });
        var query = $('#searchInput').val().trim();
        if(query !== '') {
            $medias = $medias.filter(function(media) {
                return media.toJSON().name.indexOf(query) > -1;
            });
        } else {
            $medias = $medias.filter(function(media) {
                return media.toJSON().parentId === mediaId;
            });
        }

        $('#allMedias').prop('checked', false);
        this.render($medias);
    }
})

MediaItemView = Backbone.View.extend({
    tagName:"tr",

    events: {
        'mouseover': 'showOper',
        'mouseout': 'hideOper',
        'click .curpointer': 'showMediaChild',
        'click .mediaParent': 'showMediaParentChild',
        'click .moveMedia': 'moveMediaItem',
        'click .deleteMedia': 'removeMediaItem',
        'click .renameMedia': 'renameMedia',
        'click .publish': 'publish',
        'click .seeImage': 'seeImage'
        //'click #smallImg': 'hideImage'
    },

    initialize: function() {
        _.bindAll(this,'render');
        this.model.bind('change',this.render);
    },
    render: function() {
        var tempMode = this.model.toJSON();
        var displayType = '';
        var oprateName = '重命名';
        tempMode.mtime=new moment(parseInt(tempMode.mtime)).lang('zh-cn').from();//format('YYYY-MM-DD HH:mm:ss');
        switch (tempMode.type) {
            case 'mstream':displayType = '流媒体';oprateName = '编辑';tempMode.size = '-';displayDownload='none';displayImg='none';displayPublish='inline';displayImage='none';break;
            case 'web':displayType = '网页';oprateName = '编辑';tempMode.size = '-';displayDownload='none';displayImg='none';displayPublish='inline';displayImage='none';break;
            case 'folder':displayType = '文件夹';tempMode.duration = '';tempMode.size = '-';displayImg='none';displayDownload='none';displayPublish='none';displayImage='none';break;
            case 'ppt':displayType = 'PPT';tempMode.size=filesize(tempMode.size, {base: 2}).toUpperCase();displayDownload='inline';displayImg='none';displayPublish='none';displayImage='none';break;
            case 'imageSlide':displayType = '图片压缩包';tempMode.size=filesize(tempMode.size, {base: 2}).toUpperCase();displayDownload='inline';displayImg='none';displayPublish='inline';displayImage='none';break;
            case 'picture':displayType = '图片';tempMode.size=filesize(tempMode.size, {base: 2}).toUpperCase();displayDownload='inline';displayImg='inline';displayPublish='inline';displayImage='inline';break;
            case 'video':displayType = '视频';tempMode.size=filesize(tempMode.size, {base: 2}).toUpperCase();displayDownload='inline';displayImg='inline';displayPublish='inline';displayImage='none';break;
            case 'other':displayType = '其他';tempMode.size=filesize(tempMode.size, {base: 2}).toUpperCase();displayDownload='inline';displayImg='none';displayPublish='none';displayImage='none';break;
            default :alert('缺省错误');break;
        }

        var username=getUsername(tempMode.id);
        if(!username)username=$.cookie('name');
        var mediaParent = medias.get(tempMode.parentId) ? medias.get(tempMode.parentId).toJSON() : initializeModel.toJSON() ;
        var $temp = _.template($('#mediaTemplate').html(),
            {id:tempMode.id, name: tempMode.name,type:tempMode.type, size:tempMode.size,username:username,md5:tempMode.md5,
                duration: tempMode.duration,
                mtime: tempMode.mtime,
                displayType:displayType,
                mediaParentName:mediaParent.name,
                mediaParentId:tempMode.parentId,
                url:tempMode.url,
                extName:tempMode.name.split('.').pop(),
                oprateName:oprateName});
            $(this.el).html($temp);
            if(tempMode.type == 'folder') {
                $(this.el).find('.mediaName').parent().addClass('curpointer');
                $(this.el).find('.downloadMedia').remove();
            }
            else {
            }
        return this;
    },
    publish: function() {
        durations="00:00:00";
        playlistchildren=[];
        tempMedia = this.model.toJSON();
        var $children = {
                    "out" : "0",
                    "in" : "0",
                    "duration" : tempMedia.duration,
                    "url" : tempMedia.url,
                    "type" : tempMedia.type,
                    "name" : tempMedia.name,
                    "id" : tempMedia.id,
                    "size" : tempMedia.size,
                    "md5" : tempMedia.md5
                };
        playlistchildren.push($children);
        durations=tempMedia.duration;
       	 $('#fastPublish').modal('show');
        //$('#publishModal').modal('show');
    },
    seeImage: function() {
        var tempMode = this.model.toJSON();
        $('#viewImg')[0].src = tempMode.url;
        $('#viewImg').attr("width","710")
        $('#viewImg').attr("height","400")
        var width = -($('#viewImg')[0].width/2);
        var height = -($('#viewImg')[0].height/2);
        $('#viewImg').css("margin-top",height);
        $('#viewImg').css("margin-left",width);
        //var extName=tempMode.name.split('.').pop();
        //$('#smallImg')[0].src="/download/"+tempMode.id+'.'+extName;
        $('#smallImg').modal('show');
        
    },
    hideImage:function(){
    	$('#smallImg').hide();
    },
    showOper: function() {
        if($('#uploadInput').length > 0 || $('#compressAndUpload').length > 0) {
            $(this.el).find('.mediaName').parent().removeClass("col-xs-10").addClass("col-xs-6");
            $(this.el).find('.mediaOper').show();
        }
    },

    hideOper: function() {
        if($('#uploadInput').length > 0 || $('#compressAndUpload').length > 0) {
            $(this.el).find('.mediaName').parent().removeClass("col-xs-6").addClass("col-xs-10");
            $(this.el).find('.mediaOper').hide();
        }

    },
    showMediaChild:function() {
        this.showChild(this.model);
    },
    showMediaParentChild:function() {
        var $tmpMedia = (this.model.toJSON().parentId !== '') ? medias.get(this.model.toJSON().parentId)
            :initializeModel;
        $('#searchInput').val('');
        this.showChild($tmpMedia);
    },
    showChild: function($tempMedia) {
        $("#allMedias").prop('checked',false);
        var mediaId = $tempMedia.toJSON().id;
        var sortColNname = $('#mediaList').find('.caret:visible').attr('sortColName') ?
            $('#mediaList').find('.caret:visible').attr('sortColName') : 'mtime';
        var $medias = medias.sortBy(function (media) {
            return media.get(sortColNname);
        });
        $medias = $medias.filter(function(media) {
            return media.toJSON().parentId === mediaId;
        });
        $('#mediaNav').attr('currentId',mediaId);
        $("#mediaNav").children().first().nextAll().remove();
        if($tempMedia !== initializeModel) {
            this.showNav($tempMedia);
        }
        mediaListView.render($medias);
        if($('#uploadInput').length > 0 || $('#compressAndUpload').length > 0) {
            fileUpload();
            compressAndUpload();
        }
    },
    showNav:function($model) {
        var that = this;
            var view = new MediaNavView({model:$model});
            $("#mediaNav").children().first().after(view.render().el);
        if($model.toJSON().parentId !== '') {
            var mediaParent = medias.get($model.toJSON().parentId);
            that.showNav(mediaParent);
        }
    },
    moveMediaItem:function() {
        var $ids = [];
        $ids.push(this.model.toJSON().id)
        $('#moveMedia').attr('medias', JSON.stringify($ids));
        $('#moveMedia').modal('show');
        $("#dirList").children().remove();
        var view = new PathItemView({model:initializeModel});
        $("#dirList").append(view.render().el);
    },
    removeMediaItem:function() {
        var that = this;
        if(confirm("确认删除吗？")) {
            var $media = this.model;
            console.log($media);
            var mediaId = $media.attributes._id;
            var personId = '';
            var muuModels=mediaunionusers.models;
            for(var i = 0; i<muuModels.length;i++){
                if(mediaId==muuModels[i].attributes.mediaId){
                    personId = muuModels[i].attributes.departId;
                    break;
                }
            }


            var parentMedia = medias.get($media.toJSON().parentId) ?
                parentMedia = medias.get($media.toJSON().parentId) :initializeModel;
            this.model.destroy().done(function(json){
                if(json.status === 'success') {
                    var mtime = json.result.mtime;
                    updateParent(parentMedia,mtime,'delete');
                    rmFolder($media.toJSON());
                    //$(that.el).remove();
                }
                location.href = '/ML';
                if(personId !== $.cookie('token')){
                    var personid =  {
                        "id":personId
                    };
                    $.ajax({
                        type:'POST',
                        url: '/media/statics/personstatus',
                        data: personid
                    }).done(function(res){

                        console.log(res.statue);
                    })
                }

            });
        }

    },
    showWebStreamModal:function(tmpType) {
        var tmpMedia = this.model.toJSON();
        $('#createWedStream').attr('type', tmpType);
        $('#createWedStream').prop('tmpMediaId', tmpMedia.id);
        $('#createWedStreamTxt').val(tmpMedia.name);
        $('#createWedStreamUrlTxt').val(tmpMedia.url);
        var time_tmp=tmpMedia.duration.toString();
        var attr_time=time_tmp.split(":");
        $('#txtItemDurationHour').val(attr_time[0]);
        $('#txtItemDurationMin').val(attr_time[1]);
        $('#txtItemDurationSec').val(attr_time[2]);
        switch (tmpType) {
            case 'web':$('#createWedStream').find('h4').html('修改网页');
                $('#otherMediaName').html('网页名称：');
                $('#urlName').html('网页地址：');
                $('#createWedStreamTxt').prop('placeholder','请输入网页名称');
                $('#createWedStreamUrlTxt').prop('placeholder','如：http://www.example.com');
                break;
            case 'mstream':$('#createWedStream').find('h4').html('修改流媒体');
                $('#otherMediaName').html('流媒体名称：');
                $('#urlName').html('流媒体地址：');
                $('#createWedStreamTxt').prop('placeholder','请输入流媒体名称');
                $('#createWedStreamUrlTxt').prop('placeholder','如：rtsp://110.80.31.70:6000/channe1');
                break;
            default :$('#createWedStream').find('h4').html('缺省');break;
        }
        $('#createWedStream').modal('show');
        $('#createWedStream').on('shown.bs.modal',function() {
            $('#createWedStreamTxt').focus()
        });
    },
    renameMedia:function() {
        var tmpMedia = this.model.toJSON();
        switch (tmpMedia.type) {
            case 'mstream':
                this.showWebStreamModal('mstream')
                break;
            case 'web':
                this.showWebStreamModal('web')
                break;
            case 'folder':
                var tempMediaName=tmpMedia.name;
//                alert(postifx)
                $('#renameMediaTxt').val(tempMediaName);
                $('#renameMedia').attr('mediaId',tmpMedia.id);
                $('#renameMedia').attr('mediaName',tmpMedia.name);
                $('#postifx').hide();
                $('#renameMedia').modal('show');
                $('#renameMedia').on('shown.bs.modal',function() {
                    $('#renameMediaTxt').focus();
                });
//                alert('sss');
                break;
            default :
                var postifx='';
                var tempMediaName=tmpMedia.name;
                if(tmpMedia.name.split('.').length>1 && tmpMedia.type!=="folder") {
                    var arr=tmpMedia.name.split('.');
                    arr.pop();
                    tempMediaName = arr.join('.');
                    postifx='.'+tmpMedia.name.split('.').pop();
                }
                $('#renameMediaTxt').val(tempMediaName);
                $('#renameMedia').attr('mediaId',tmpMedia.id);
                $('#renameMedia').attr('mediaName',tmpMedia.name);
                $('#postifx').show();
                $('#postifx').html(postifx)

                $('#renameMedia').modal('show');
                $('#renameMedia').on('shown.bs.modal',function() {
                    $('#renameMediaTxt').focus();
                });
                break;
        }
    }
})

MediaNavView = Backbone.View.extend({
    tagName:"li",
    events: {
        'click a': 'showCurrentFolder'
    },
    initialize: function() {
    },
    render: function() {
        _.templateSettings = {
            interpolate : /\{\{(.+?)\}\}/g
        };
        var tempMode = this.model.toJSON();
        var displayName = tempMode.name.length <10 ? tempMode.name : tempMode.name.substr(0,10);
        var $temp = _.template($('#mediaNavTemplate').html(),
            {id:tempMode.id, name: tempMode.name,displayName:displayName});
        $(this.el).html($temp);
        return this;
    },
    showCurrentFolder: function() {
        $("#allMedias").prop('checked',false);
        $(this.el).nextAll().remove();
        var mediaId = $(this.el).children('a').attr('currentId');
        $('#mediaNav').attr('currentId',mediaId);
        var sortColNname = $('#mediaList').find('.caret:visible').attr('sortColName') ?
            $('#mediaList').find('.caret:visible').attr('sortColName') : 'mtime';
        var $medias = medias.sortBy(function (media) {
            return media.get(sortColNname);
        });
        $medias = $medias.filter(function(media) {
            return media.toJSON().parentId === mediaId;
        });
        mediaListView.render($medias);
        if($('#uploadInput').length > 0 || $('#compressAndUpload').length > 0) {
            fileUpload();
            compressAndUpload();
        }
    }
})


PathItemView =Backbone.View.extend({
    tagName:"li",
    events: {
        'click .selectedFolder':'markChange',
        'click .moveTo': 'moveTo'
    },

    initialize: function() {

    },
    render: function() {
        var tempMode = this.model.toJSON();
        var $parentId = tempMode.id;
        var $medias = medias.filter(function(media) {
            return media.get('parentId') == $parentId && media.get('type') == 'folder'
        });
        var mark='sp-blank';
        if($medias.length>0) {
            mark='sp-plus';
        }
        var dirName = tempMode.name.length < 20 ?tempMode.name : tempMode.name.substr(0, 20) + '...';

        var $temp = _.template($('#folderTemplate').html(),
            {id:tempMode.id,name:dirName ,path: tempMode.path,mark:mark});

        $(this.el).html($temp);
        return this;
    },
    markChange:function(e) {

        console.log('markChange')

        if (e && e.stopPropagation) {
            e.stopPropagation();
        }
        else {
            window.event.cancelBubble = true;
        }
        e = window.event || e
        var target = e.srcElement || e.target
        if($(target).hasClass('sp-blank')) return ;
        if($(target).siblings('ul:visible').length===0) {
            $(target).removeClass('sp-plus');
            $(target).addClass('sp-minus');
            $(target).parent().parent().siblings('li').find('ul:visible').hide()
            $.each($(target).parent().parent().siblings('li').find('span'), function(i, o) {
                if ($(o).hasClass('sp-plus') || $(o).hasClass('sp-minus')) $(o).addClass('sp-plus')
            })
            if($(target).siblings('ul').length==0){
                var $ul=document.createElement('ul');
                $($ul).addClass('nav col-sm-offset-1')
                $(target).parent().append($ul);
                var $parentId = $(target).siblings('a').attr('mediaId')
                var $medias = medias.filter(function(media) {
                    return media.get('parentId') == $parentId && media.get('type') == 'folder'
                })
                if($medias.length == 0) return;
                $.each($medias, function(i, o) {

                    var tempMode = o.toJSON()
                    var $parentId = tempMode.id;
                    var $medias = medias.filter(function(media) {
                        return media.get('parentId') == $parentId && media.get('type') == 'folder'
                    })
                    var mark='sp-blank';
                    if($medias.length>0) {
                        mark='sp-plus';
                    }

                    var dirName = tempMode.name.length < 20 ?tempMode.name : tempMode.name.substr(0, 20) + '...';
                    var $temp = _.template($('#folderTemplate').html(),
                        {id:tempMode.id,name:dirName, path:tempMode.path, mark:mark});
                    $($ul).append('<li>'+$temp+'</li>');
                })
            }
            else {
                $(target).siblings('ul').show();
            }
        }
        else {
            $(target).addClass('sp-plus');
            $(target).removeClass('sp-minus');
            $(target).siblings('ul').hide();
        }
    },
    moveTo:function(e) {
        e = window.event || e
        var target = e.srcElement || e.target
        $('.divselected').remove();
        var $div=document.createElement('div');
        $($div).addClass('divselected');
        $(target.parentNode).prepend($div)
        var $mediasTo=$(target).attr('mediaId');
        $('#moveMedia').attr('mediasTo', $mediasTo);

    }
})

/**
 *  视频转码模态框 created by tangpriest
 *
 */

MediaTransView = Backbone.View.extend({
    el:'#tranMediaModal',
    events:{
        'click #chooseMediaAndUpload': 'uploadMedia',
        'click #downTranstedMedia':'downloadMedia'

    },
    uploadMedia:function(){
        console.log('starting uploading media to web-server');
       /* $('#tranMediaModal').modal('hide');

        $('#chooseSolutionModal').modal('show');*/

        console.log($('.transMedia').attr('id'));
        var fileName = $('.transMedia').attr('id');
        var file_Name = {
            'fileName':fileName
        }
        $.ajax({
            type:'POST',
            timeout : 1000 * 60 *60,
            async : false,
            url:'/transMediaToMp4',
            data:file_Name,
            success: function(data){
                if(data.status == '200'){
                    $('#loading').show();

                    var acessTranStatus = setInterval(function(){
                       $.ajax({
                           type:'GET',
                           url:'/getranstatues',
                           contentType: "application/json; charset=utf-8",
                           success:function(result){
                               if(result.status == 1){
                                   console.log('转码仍然再进行中');
                               }
                               if(result.status == 0){
                                   alert('转码完成');
                                   clearInterval(acessTranStatus);
                                   $('#loading').hide();
                                   $('#tranSuccess').show();
                                   $('#downSuccessMedia').show();

                                   $('#downloadtext').attr('href','/file/' + fileName);


                               }
                           }
                       })
                    },3000)

                }
            }
        })
    },
    downloadMedia:function(){
        var fileName = $('.transMedia').attr('id');
        var param  = {
            'fileName':fileName
        }
        $.get('/downfiles',param,function(data){

        })
        window.open("http://localhost:8500/downfiles?id=3");
        /*$.ajax({
            type:'GET',
            url:'/downfiles',
            success:function(result){
                console.log(result);
            }
        })*/


    }
})
var mediatransview = new MediaTransView;



OprateMediaView = Backbone.View.extend({
    el:"#operateMediaArea",
    events: {
        'input #searchInput': 'searchMedias',
        'prototypechange #searchInput': 'searchMedias',
        'click #searchBtn': 'searchMedias',
        'click #uploadFilesBtn': 'uploadFilesModal',
        'click #createFolderBtn': 'createFolderModal',
        'click #createFolderConfirmBtn': 'createFolderConfirm',
        'click #addWebPage': 'addWebPage',
        'click #addMediaStream': 'addMediaStream',
        'click #createWedStreamConfirmBtn': 'createWedStreamConfirm',
        'click #moveBtn': 'moveModal',
        'click #moveMediaConfirmBtn': 'moveMediaConfirm',
        'click #deleteBtn': 'deleteMedias',
        'click #publishesBtn': 'publishMedias',
        'click #transMedia' : 'tranMedias',
        'click #renameMediaConfirmBtn': 'renameMediaConfirm'


    },

    initialize: function() {

    },
    render: function() {

    },
    searchMedias:function() {
        var query = $('#searchInput').val().trim();
        var sortColNname = $('#mediaList').find('.caret:visible').attr('sortColName') ?
            $('#mediaList').find('.caret:visible').attr('sortColName') : 'mtime';
        var $medias = medias.sortBy(function (media) {
            return media.get(sortColNname);
        });
        $("#mediaNav").children().first().nextAll().remove();
        if(query !== '') {
            $medias = $medias.filter(function(media) {
                return media.toJSON().name.indexOf(query) > -1;
            });
            var li  = document.createElement('li');
            $(li).html('搜索:\''+query+'\'');
            $("#mediaNav").append(li);
            mediaListView.render($medias);
        } else {
            $medias = $medias.filter(function(media) {
                return media.toJSON().parentId === '';
            });
            mediaListView.render($medias);
        }

        $('#allMedias').prop('checked', false);

    },
    uploadFilesModal: function() {
        $('#uploadFilesModal').modal('show');
    },
    createFolderModal:function() {
        $('#createFolder').modal('show');
        $('#createFolder').on('shown.bs.modal',function() {
            $('#createFolderTxt').focus()
        });
    },
    createFolderConfirm:function() {
        var currentId = $('#mediaNav').attr('currentId') ? $('#mediaNav').attr('currentId') : '';
        var tmpName = $('#createFolderTxt').val().trim();
        if(this.oprateValidateMediaName('#createFolderTxt','文件（夹）名')) {
            tmpName = checkMediaNameExist(tmpName,'','folder',0,currentId).tempname;
            var thisModel = new Media({name:tmpName,parentId:currentId});
            thisModel.set({duration:''});
            thisModel.set({mtime:new Date().getTime()});
            thisModel.save().done(function(json){
                if(json.status === 'success') {
                    thisModel.set({id:json.result.id});
                    var mtime = new Date().getTime();
                    thisModel.set({mtime:mtime});
                    updateParent(thisModel.toJSON(),mtime,'create');
                    var view = new MediaItemView({model:thisModel});
                    $("#mediaList").children('tbody').prepend(view.render().el);
                    $('#createFolderTxt').val('');
                    medias.add(thisModel);
                    $('#createFolder').modal('hide');
                }
            });
        }
        location.href = '/ML';
    },
    addWebPage:function() {
        $('#createWedStream').attr('type','web');
        this.showWebStreamModal();
    },
    addMediaStream:function() {
        $('#createWedStream').attr('type', 'mstream');
        this.showWebStreamModal();
    },
    showWebStreamModal:function() {
        $('#createWedStream').prop('tmpMediaId', null);
        $('#createWedStreamTxt').val('');
        $('#createWedStreamUrlTxt').val('');
        var $type =   $('#createWedStream').attr('type');
        switch ($type) {
            case 'web':$('#createWedStream').find('h4').html('添加网页');
                       $('#otherMediaName').html('网页名称：');
                       $('#urlName').html('网页地址：');
                       $('#createWedStreamTxt').prop('placeholder','请输入网页名称');
                       $('#createWedStreamUrlTxt').prop('placeholder','如：http://www.example.com');
                       break;
            case 'mstream':$('#createWedStream').find('h4').html('添加流媒体');
                           $('#otherMediaName').html('流媒体名称：');
                           $('#urlName').html('流媒体地址：');
                           $('#createWedStreamTxt').prop('placeholder','请输入流媒体名称');
                           $('#createWedStreamUrlTxt').prop('placeholder','如：rtsp://110.80.31.70:6000/channe1');
                           break;
            default :$('#createWedStream').find('h4').html('缺省');break;
        }

        $('#txtItemDurationHour').val('23');
        $('#txtItemDurationMin').val('59');
        $('#txtItemDurationSec').val('59');

        $('#createWedStream').modal('show');
        $('#createWedStream').on('shown.bs.modal',function() {
            $('#createWedStreamTxt').focus()
        });
    },
    createWedStreamConfirm:function() {
    	
        var tmpmediaId = $('#createWedStream').prop('tmpMediaId');
        var $type =   $('#createWedStream').attr('type');
        var currentId = $('#mediaNav').attr('currentId') ? $('#mediaNav').attr('currentId') : '';
        var tmpName = $('#createWedStreamTxt').val().trim();
        var tmpUrl = $('#createWedStreamUrlTxt').val().trim();
        var thisModel ;
        if(this.oprateValidateMediaName('#createWedStreamTxt','网页或流媒体名') && this.oprateValidateMediaUrl('#createWedStreamUrlTxt')) {

            if(!tmpmediaId) {
                tmpName = checkMediaNameExist(tmpName,'',$type,0,currentId).tempname;
                thisModel = new Media({
                  name:tmpName,
                  parentId:currentId,
                  type:$type,
                  url:tmpUrl});
            } else {
                thisModel =medias.get(tmpmediaId);
                if(thisModel.toJSON().name === tmpName && thisModel.toJSON().url === tmpUrl)  $('#createWedStream').modal('hide');
                tmpName = checkMediaNameExist(tmpName,thisModel.toJSON().name,$type,0,currentId).tempname;
                thisModel.set({name:tmpName,url:tmpUrl});
            }

            var hour = $('#txtItemDurationHour').val().trim() || "0";
            var min = $('#txtItemDurationMin').val().trim() || "0";
            var sec = $('#txtItemDurationSec').val().trim() || "0";

            var reg = /^\d*$/;
            if(!reg.test(hour) || parseInt(hour)  > 24 || parseInt(hour) < 0) return alert('小时格式不正确');
            if(!reg.test(min) || parseInt(min) > 59 || parseInt(min) < 0) return alert('分钟格式不正确');
            if(!reg.test(sec) || parseInt(sec) > 59 || parseInt(sec) < 0) return alert('秒格式不正确');

            String.format = function() {
              if (arguments.length == 0)
                return null;

              var str = arguments[0];
              for (var i = 1; i < arguments.length; i++) {
                var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
                str = str.replace(re, arguments[i]);
              }

              return str;
            }

            var duration = String.format('{0}:{1}:{2}', parseInt(hour) < 10 ? '0'+parseInt(hour) : parseInt(hour) ,
              parseInt(min) < 10 ? '0'+parseInt(min) : parseInt(min),
              parseInt(sec) < 10 ? '0'+parseInt(sec) : parseInt(sec));

            thisModel.set({
              duration: duration
            })
            var mtime = new Date().getTime();
            thisModel.set({mtime:mtime});
            thisModel.save().done(function(json){
                if(json.status === 'success') {
                    if(!tmpmediaId) {
                        thisModel.set({id:json.result.id});
                        //var mtime = json.result.mtime;
                        thisModel.set({mtime:mtime});
                        updateParent(thisModel.toJSON(),mtime,'create');
                        var view = new MediaItemView({model:thisModel});
                        $("#mediaList").children('tbody').prepend(view.render().el);
                        $('#createWedStreamTxt').val('');
                        $('#createWedStreamUrlTxt').val('');
                        medias.add(thisModel);
                    } else {
                        updateParent(thisModel.toJSON(),mtime,'update');
                    }
                    $('#createWedStream').modal('hide');
                    //location.href = '/ML';
                }
            });
        }

    },
    tranMedias:function(){
        $('#tranMediaModal').modal('show');
        $('#downSuccessMedia').hide();

    },
    moveModal:function() {
        var $ids = [];
        $(".mediaItemChk:checked").each(function(i, o) {
            $ids.push($(o).val());
        })
        if($ids.length == 0) return popBy("#moveBtn", false, '请先选择您要移动的文件或者文件夹');
        $('#moveMedia').attr('medias', JSON.stringify($ids));

        $('#moveMedia').modal('show');
        $("#dirList").children().remove();
        var view = new PathItemView({model:initializeModel});
        $("#dirList").append(view.render().el);
    },
    moveMediaConfirm:function() {
        var currentId = $('#mediaNav').attr('currentId') ? $('#mediaNav').attr('currentId') : '';
        var moveMedias = $('#moveMedia').attr('medias');
        moveMedias = JSON.parse(moveMedias);
        var putMedias = [];
        var mediasTo =$('#moveMedia').attr('mediasTo');
        var toMeida = medias.get(mediasTo)? medias.get(mediasTo) : initializeModel;
        $.each(moveMedias,function(i,o) {
            var temMedia = medias.get(o);
            if(temMedia.toJSON().parentId !== mediasTo && temMedia.toJSON().id !== mediasTo) {
                var $medias = medias.filter(function(media) {
                    return (media.toJSON().name === temMedia.toJSON().name &&
                        media.toJSON().type === temMedia.toJSON().type
                        && media.toJSON().parentId === toMeida.toJSON().id)
                });
                if($medias.length === 0) {
                    putMedias.push(o);
                }
            }
        });
        if(putMedias.length > 0) {
            $.ajax({
                type: "put",
                url: "/medias/move",
                data: JSON.stringify({moveMedias: putMedias, mediasTo: mediasTo}),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (json) {
                    if(json.status === 'success') {
                        var mtime =json.result.mtime;
                        var updateMediaTo = medias.get(mediasTo) ? medias.get(mediasTo) : initializeModel;
                        updateMediaTo.set({mtime:mtime,size:updateMediaTo.toJSON().size+putMedias.length});
                        var updateMediaFrom = medias.get(currentId) ? medias.get(currentId) : initializeModel;
                        updateMediaFrom.set({mtime:mtime,size:updateMediaFrom.toJSON().size-putMedias.length});
                        $.each(putMedias,function(i,o) {
                            var temMedia = medias.get(o);
                            temMedia.set({parentId:mediasTo});
                        });
                        mediaListView.initializeRender();
                    }
                },
                error: function (err) {
                    window.location.reload();
                }
            });
        }
        $('#moveMedia').modal('hide');
    },
    deleteMedias:function() {
        var $ids = [];
        $(".mediaItemChk:checked").each(function(i, o) {
            $ids.push($(o).val());
        })
        if($ids.length == 0) return popBy("#deleteBtn", false, '请先选择您要删除的文件或者文件夹');
        if(confirm("确认删除吗？")) {
            var currentId = $('#mediaNav').attr('currentId') ? $('#mediaNav').attr('currentId') : '';
            var parentMedia = medias.get(currentId) ? medias.get(currentId) :initializeModel ;
            $.ajax({
                type: "DELETE",
                url: "/medias/",
                data: JSON.stringify($ids),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (json) {
                    if(json.status === 'success') {
                        $.each($ids,function(i,o) {
                            var $tempMedia = medias.get(o);
                            var mtime = json.result.mtime;
                            updateParent(parentMedia,mtime,'delete');
                            rmFolder($tempMedia.toJSON());
                        })
                        $("#allMedias").prop('checked',false);
                        $(".mediaItemChk:checked").parents('tr').remove();
                    }
                },
                error: function (err) {
                    alert(err.responseText)
                }
            });
        }
        location.reload();
        //location.href = '/ML';
    },
    publishMedias:function(){
        durations="00:00:00";
        playlistchildren=[];
        var $ids = [];
        $(".mediaItemChk:checked").each(function(i, o) {
            $ids.push($(o).val());
        })   
        $.each($ids,function(i,o) {
            var $tempMedia = medias.get(o);
            if($tempMedia.attributes.type!='folder'&&$tempMedia.attributes.type!='other'){
                var $children = {
                    "out" : "0",
                    "in" : "0",
                    "duration" : $tempMedia.attributes.duration,
                    "url" : $tempMedia.attributes.url,
                    "type" : $tempMedia.attributes.type,
                    "name" : $tempMedia.attributes.name,
                    "id" : $tempMedia.attributes.id,
                    "size" :$tempMedia.attributes.size,
                    "md5" :$tempMedia.attributes.md5
                };
                var $duration=$tempMedia.attributes.duration.split(':');
                var $durations=durations.split(':');
                for(var i=0;i<3;i++){
                    $duration[i]=parseInt($duration[i]);
                    $durations[i]=parseInt($durations[i]);
                }

                $durations[2]=$durations[2]+$duration[2]<60?$durations[2]+$duration[2]:$durations[2]+$duration[2]-60;
                if($durations[2]+$duration[2]>=60)$durations[1]+=1;
                $durations[1]=$durations[1]+$duration[1]<60?$durations[1]+$duration[1]:$durations[1]+$duration[1]-60;
                if($durations[1]+$duration[1]>=60)$durations[0]+=1;
                $durations[0]=$durations[0]+$duration[0];
                $durations[2]=$durations[2]<10?'0'+$durations[2].toString():$durations[2].toString();
                $durations[1]=$durations[1]<10?'0'+$durations[1].toString():$durations[1].toString();
                $durations[0]=$durations[0]<10?'0'+$durations[0].toString():$durations[0].toString();
                durations=$durations[0]+':'+$durations[1]+':'+$durations[2];
                playlistchildren.push($children);
            }else{
                alert($tempMedia.attributes.type+'类型不能快速发布！')
            }

            
        })
        if(playlistchildren.length == 0) return popBy("#publishesBtn", false, '请先选择您要发布的文件');
        $('#fastPublish').modal('show');
    },
    renameMediaConfirm:function() {
        var currentId = $('#mediaNav').attr('currentId') ? $('#mediaNav').attr('currentId') : '';
        var mediaId = $('#renameMedia').attr('mediaId') ;
        var oldName = $('#renameMedia').attr('mediaName');
        var temMedia =medias.get(mediaId);
        var postifc = $('#postifx:visible').length > 0 ? $('#postifx:visible').html() :'';
        var tmpName = $('#renameMediaTxt').val().trim() + postifc;
        if(oldName === tmpName ) {
            $('#renameMedia').modal('hide');
            return ;
        } else if(this.oprateValidateMediaName('#renameMediaTxt','文件（夹）名')) {
                tmpName = checkMediaNameExist(tmpName,temMedia.toJSON().name,temMedia.toJSON().type,0,currentId).tempname;
                temMedia.set({name:tmpName});
                temMedia.save().done(function(json){
                    if(json.status === 'success') {
                        var mtime = json.result.mtime;
                        updateParent(temMedia.toJSON(),mtime,'update');
                        $('#renameMediaTxt').val('');
                        $('#renameMedia').modal('hide');
                    }
                });
            }
    },
    oprateValidateMediaName:function(obj,typeName) {
        var message = '';
        var flag = true;
        var mediaName = $(obj).val().trim();
        if(mediaName === '') {
            message = '不能为空';
            flag = false;
        } else {
           var result = validateMediaName(mediaName);
            message = result.message;
            flag = result.status;
        }
        if(!popBy(obj,flag,typeName+message)) return false;
        return true;
    },
    oprateValidateMediaUrl:function(obj) {
        var message = '';
        var flag = true;
        var mediaUrl = $(obj).val().trim();
        if(mediaUrl === '') {
            message = '网页和流媒体URL不能为空';
            flag = false;
        } else {
            var strRegex = "^((https|http|ftp|rtsp|mms)?://)"
                + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@
                + "(([0-9]{1,3}.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
                + "|" // 允许IP和DOMAIN（域名）
                + "([0-9a-z_!~*'()-]+.)*" // 域名- www.
                + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]." // 二级域名
                + "[a-z]{2,6})" // first level domain- .com or .museum
                + "(:[0-9]{1,5})?" // 端口- :80
                + "((/?)|" // a slash isn't required if there is no file name
                + "(/[0-9a-z_!~*'().;?:@&=+$,%#-\\[\\]]+)+/?)$";
            var re=new RegExp(strRegex, 'i');
            if(!re.test(mediaUrl)) {
                flag = false;
                message = '网页和流媒体URL格式错误';
            }
        }

//        else {
//            var result = validateMediaName(mediaName);
//            message = result.message;
//            flag = result.status;
//        }
        if(!popBy(obj,flag,message)) return false;
        return true;
    }
})
var initializeModel = new Media({id:''});
var mediaListView = new MediaListView;
var oprateMediaView = new OprateMediaView;