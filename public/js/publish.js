var boxes = new Boxes;
var groups = new Groups;
var playlist = new Playlist;

function today(){
    var today=new Date();
    var h=today.getFullYear();
    var m=today.getMonth()+1;
    if( m < 10){m = '0' + m;}
    var d=today.getDate();
    if( d < 10){d = '0' + d}
    var hour = today.getHours();
    if(hour < 10){hour = '0' + hour}
    var min = today.getMinutes();
    if(min < 10){min = '0' + min}
    var sec = today.getSeconds();
    if(sec < 10){sec = '0'+sec}
    return "快速发布"+h+m+d+hour+min+sec;

}

_.templateSettings = {
    interpolate : /\{\{(.+?)\}\}/g
};

Setting = Backbone.Model.extend({
    initialize: function() {
    },
    defaults: {
        publishscene: ''
    }
});
Settings = Backbone.Collection.extend({
    url:'/publishscene',
    model: Setting
});

var settings = new Settings;

GroupView = Backbone.View.extend({
    tagName: 'tr',
    template: _.template($('#group-template').html()),

    initialize: function() {
    },

    render: function() {
        var p = this.model.toJSON();
        this.$el.html(this.template(p));
        return this;
    }
});


GroupListView = Backbone.View.extend({
    el: '#group-list',

    events: {
        'click th input': 'selectAll',
        'click td input': 'selectOne'
    },

    initialize: function() {
        this.listenTo(groups, 'add', this.addOne);
        groups.fetch();
    },

    render: function() {
        // 若做排序，重写此方法。
    },

    addOne: function(group) {
        var view = new GroupView({model:group});
        this.$('tbody').append(view.render().el);
    },

    selectAll: function(e) {
        var publishGroups = function(m){
            for(var a=0;a<groups.models.length;a++){
                for(var j=0;j<groups.models[a].attributes.boxes.length;j++){
                    var $id=groups.models[a].attributes.boxes[j];
                    $(".publishBox[value='" + $id +  "']").prop('checked', m);
                };
            }
        }
        if(this.$('th input:checked').length > 0) {
            this.$('td input').prop('checked', true);
            publishGroups(true);
        } else {
            this.$('td input').prop('checked', false);
            publishGroups(false);
        }
        if (e && e.stopPropagation) {
            //支持W3C
            e.stopPropagation();
        } else {
            //IE的方式
            window.event.cancelBubble = true;
        }
    },

    selectOne: function(e) {
        var ids=[];
        var pids=[];
        if(this.$('td input:checked').length === this.$('td input').length) {
            this.$('th input').prop('checked', true);
        } else {
            this.$('th input').prop('checked', false);
            $(".publishGroup:checked").each(function(i, o){
                ids.push($(o).val());
            });
            for(var i=0;i<ids.length;i++){
                pids.push(groups.get(Object(ids[i])));
            }
            $(".publishBox").prop('checked', false);
            if(pids.length!=0){
                for(var a=0;a<pids.length;a++){
                    for(var j=0;j<pids[a].attributes.boxes.length;j++){
                        var $id=pids[a].attributes.boxes[j];
                        $(".publishBox[value='" + $id +  "']").prop('checked', true);
                    };
                }
            }
        }
    }
});


BoxView = Backbone.View.extend({
    tagName: 'tr',
    template: _.template($('#box-template').html()),

    initialize: function() {
    },

    render: function() {
        var p = this.model.toJSON();
        p.ip = p.net_set.ip || '';
        p.online = (p.online === true ? 'online' : 'offline');
        this.$el.html(this.template(p));
        return this;
    }
});


BoxListView = Backbone.View.extend({
    el: '#box-list',
    events: {
        'click th input': 'selectAll',
        'click td input': 'selectOne',
        'click .sortById': 'sortById',
        'click .sortByName': 'sortByName',
        'click .sortByIp': 'sortByIp',
        'click .sortByOnline': 'sortByOnline'
    },

    initialize: function() {
        this.listenTo(boxes, 'add', this.addOne);
        boxes.fetch();
    },

    render: function() {
        // 若做排序，重写此方法。

        var data = this.model.toJSON();

        console.log(data)

        var that = this;
        this.$el.html(that.format(
          $('#box-template').html(),
          data.name,
          data.id,
          data.ip,
          data.online
        ));
        return this;

    },


    sortById: function(){
        this.sortBy('Id')
    },
    sortByName:function() {
        this.sortBy('Name')
    },
    sortByIp:function() {
        this.sortBy('Ip')
    },

    sortByAlias:function() {
        this.sortBy('Alias')
    },
    sortByOnline:function() {
        this.sortBy('Online')
    },

    /**
     * 排序算法
     * @param sortColNname
     */
    sortBy: function(sortColNname) {
        var taget = '#publishModal .sortBy'+sortColNname;
        $(taget).find('.caret').show();
        $(taget).siblings().removeClass('dropup').find('.caret').hide();
        if(!$(taget).hasClass('dropup')) {
            $(taget).addClass('dropup');
        } else {
            $(taget).removeClass('dropup');
        }
        var tmpBoxes = boxes.sortBy(function (box) {
            return box.get(sortColNname.toLowerCase());
        });

        var query = $('#searchInput').val().trim();
        if(query !== '') {
            tmpBoxes = tmpBoxes.filter(function(box) {
                return box.toJSON().name.indexOf(query) > -1 || box.toJSON().alias.indexOf(query) > -1;
            });
        } else {
            tmpBoxes = tmpBoxes.filter(function() {
                return true;
            });
        }

        tmpBoxes = tmpBoxes.filter(function(){
            return true;
        });

        this.render(tmpBoxes);
        $('#allBoxes').prop('checked',false);
    },

    addOne: function(box) {
        var view = new BoxView({model:box});
        this.$('tbody').append(view.render().el);
    },

    selectAll: function(e) {
        if(this.$('th input:checked').length > 0) {
            this.$('td input').prop('checked', true);
        } else {
            this.$('td input').prop('checked', false);
        }
        if (e && e.stopPropagation) {
            //支持W3C
            e.stopPropagation();
        } else {
            //IE的方式
            window.event.cancelBubble = true;
        }
    },

    selectOne: function(e) {
        if(this.$('td input:checked').length === this.$('td input').length) {
            this.$('th input').prop('checked', true);
        } else {
            this.$('th input').prop('checked', false);
        }
    }
});


FastPublishView = Backbone.View.extend({
    el:'#fastPublish',
    events:{
        'click #fastPublishNext':'next'
    },
    /*initialize: function() {
        var boxListView = new BoxListView;
        var groupListView = new GroupListView;
    },*/
    initialize : function(options){
    Backbone.on('documentEdit', this.onDocumentEdit, this);
    },
    next:function(){
        console.log('111');
        var fastPublishName = $('#fastPublishNameBack').val().trim();
        var fastPublishWeight = parseInt($('#fastPublishWeight').val()); 
        var fastPublishHeight = parseInt($('#fastPublishHeight').val());
        if(!fastPublishName){
            return popBy("#fastPublishNext", false, '请先输入快速发布排期的名称');
        }
        if(!fastPublishWeight || !fastPublishHeight){
            return popBy("#fastPublishNext", false, '快速发布排期的宽高不可以为空');
        }
        $('#fastPublish').modal('hide');
        $('#publishModal').modal('show');
    }
})
var fastpublishView = new FastPublishView;


PublishView = Backbone.View.extend({
    el: '#publishModal',
    events: {
        'click #publishBtn': 'publish'
    },

    initialize: function() {
        var boxListView = new BoxListView;
        var groupListView = new GroupListView;
    },

    publish: function(e) {
        var size = 0;
        for(var i=0;i<playlistchildren.length;i++){
            size +=parseInt(playlistchildren[i].size);
        }
        //size=filesize(size, {base: 2}).toUpperCase();
        console.log(size);
        settings.fetch({async:false});
        var scene_height,scene_width;
        /*if(settings.length<1){
            scene_height = 720;
            scene_width = 1280;
        }else{
            switch(settings.models[0].attributes.publishscene){
                case 720 : scene_height = 720; scene_width = 1280; break;
                case 1080 : scene_height = 1080; scene_width = 1920; break;
                default : scene_height = 720; scene_width = 1280;
            }
        }*/
        scene_width = parseInt($('#fastPublishWeight').val());
        scene_height = parseInt($('#fastPublishHeight').val());
        var $playlist=Guid.NewGuid().toString();
        var stamp=new Date().getTime();
        var name= $('#fastPublishNameBack').val().trim();
        var schedule,scheduleid,url;
    	var tmpPlaylist={
        id:null,
        name:name,
        type:'relativePlaylist',
        stamp: stamp.toString(),
        size: size,
        children:[ 
        {
            "children" : playlistchildren,
            "type" : "relativePlaylist",
            "name" : "relativePlaylist",
            "stamp" : stamp.toString(),
            "id" : $playlist
        }, 
        {
            "children" : [ 
                {
                    "url" : "/images/component/meitiqu.png",
                    "source" : {
                        "height" : 50,
                        "width" : 50,
                        "src" : "/images/component/meitiqu.png"
                    },
                    "playlist" : $playlist,
                    "duration" : durations,
                    "coverLevel" : 1,
                    "opacity" : 1,
                    "border" : "blue",
                    "background" : {
                        "image" : "",
                        "color" : "#ff000000"
                    },
                    "isSelected" : false,
                    "tag" : "媒体",
                    "height" : scene_height,
                    "width" : scene_width,
                    "name" : "mediaZone0",
                    "type" : "mediaZone",
                    "id" : "",
                    "bottom" : scene_height,
                    "right" : scene_width,
                    "top" : 0,
                    "left" : 0
                }
            ],
            "ratio" : 0.9,
            "height" : scene_height,
            "width" : scene_width,
            "duration" : durations,
            "type" : "scene",
            "background" : {
                "image" : "",
                "color" : "#ffffffff"
            },
            "name" : "scene0",
            "id" : "0"
        }
    ]
    }
    	playlist =new Playlist(tmpPlaylist);    
        var groups = [],
            boxes = [],
            data = {},
            that = this;
        this.$('#group-list td input:checked').each(function(index, dom) {
            groups.push(that.$(dom).val());
        });
        this.$('#box-list td input:checked').each(function(index, dom) {
            boxes.push(that.$(dom).val());
        });
        if(groups.length === 0 && boxes.length === 0)  return popBy("#publishBtn", false, '请先选择您要发布到的分组或播放器');
        data.groups = [], data.boxes = boxes,data.stamp=new Date().getTime();
        if(confirm("确认发布吗？")) {
        	playlist.save().done(function(json){
        		var tempSchedule={
        			id:null,
        			name: name,
        			type: 'absolutePlaylist',
        			stamp: stamp.toString(),
        			children: [json.id],
        			schedule:{"timeTo" : "23:59:59",
        						"timeFrom" : "00:00:00",
        						"type" : "everyday"}
    			}
        		schedule=new Schedule(tempSchedule);
        		schedule.save().done(function(json1) {
           		isSave = true;
           		scheduleid=json1.id;
           		url='/publish/' + scheduleid;           		
           		$.ajax({
               		type: 'POST',
                	url: '/publish/' + scheduleid,
                	data: JSON.stringify(data),
                	contentType: 'application/json; charset=utf-8',
                	success: function(message, status, jqXHR) {
                    if(jqXHR.status === 200) {
                        window.location.href = '/task';
                    }
                },
                error: function(jqXHR,status,message) {
                    if(jqXHR.status === 400) {
                        alert('未知错误，请联系管理员');
                    } else if(jqXHR.status === 404) {
                        alert('部分资源未找到，发布中断');
                    }
                }
            });
        		}).fail(function(jqXHR, b, c) {
            		if(jqXHR.status === 409) {
               		 alert('保存失败，相同名称的排期已存在');
           		 } else if(jqXHR.status === 404) {
                	alert('提交有误，找不到对应的资源');
           		 } else {
                	alert('未知错误，请联系管理员');
            	}
       			 });
           		
        	}).fail(function(jqXHR, b, c) {
                    if(jqXHR.status === 409) {
                     alert('保存失败，相同名称的播放列表已存在');
                 } else if(jqXHR.status === 404) {
                    alert('提交有误，找不到对应的资源');
                 } else {
                    alert('未知错误，请联系管理员');
                }
                 });
        	
        	
            
        }
    }
});

var publishView = new PublishView;
