var boxes = new Boxes;
var groups = new Groups;

_.templateSettings = {
    interpolate : /\{\{(.+?)\}\}/g
};

//分组信息
GroupView = Backbone.View.extend({
    tagName: 'tr',
    template: _.template($('#group-template').html()),

    initialize: function() {
    },

    render: function() {
        var p = this.model.toJSON();  //获取分组信息
        this.$el.html(this.template(p));
        return this;
    }
});

//分组信息的勾选
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

        boxes.fetch();
        var publishGroups = function(m){
            for(var a=0;a<groups.models.length;a++){
                for(var j=0;j<groups.models[a].attributes.boxes.length;j++){
                    var $id=groups.models[a].attributes.boxes[j];
                    $(".publishBox[value='" + $id +  "']").prop('checked', m);
                    boxes.models.forEach(function (item) {

                        if(item.id == $id){

                            item.attributes.checked = m;
                        }
                    });
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
        var ids=[];//组--勾选
        var pids=[];//勾选的组的信息
        boxes.fetch();
        if(this.$('td input:checked').length === this.$('td input').length) {
            this.$('th input').prop('checked', true);
        } else {
            this.$('th input').prop('checked', false);
        }

        $(".publishGroup:checked").each(function(i, o) {

                ids.push($(o).val());
        });
        for(var i=0;i<ids.length;i++){
            pids.push(groups.get(Object(ids[i])));
        }
        $(".publishBox").prop('checked', false);
        boxes.models.forEach(function (item) {

            item.attributes.checked = false;

        });

        if(pids.length!=0){
            for(var a=0;a<pids.length;a++){
                for(var j=0;j<pids[a].attributes.boxes.length;j++){
                    var $id=pids[a].attributes.boxes[j];//组里的播放器id
                    $(".publishBox[value='" + $id +  "']").prop('checked', true);
                    boxes.models.forEach(function (item) {

                        if(item.id == $id){

                            item.attributes.checked = true;
                        }
                    });

                };
            }
        }

    }
});

//播放器列表
BoxView = Backbone.View.extend({
    tagName: 'tr',
    template: _.template($('#box-template').html()),

    initialize: function() {
    },

    render: function() {
        var p = this.model.toJSON();
        p.ip = p.net_set.ip || '';
        p.online = (p.online === true ? 'online' : 'offline');
        this.$el.html(this.template({id: p.id , name: p.name, alias: p.alias, ip: p.ip || '', online: p.online}));
        return this;
    }
});


BoxListView = Backbone.View.extend({
    el: '#box-list',
    events: {
        'click th input': 'selectAll',
        'click td input': 'selectOne',
        'click .sortByName': 'sortByName',
        'click .sortByAlias': 'sortByAlias',
        'click .sortByIp': 'sortByIp',
        'click .sortByOnline': 'sortByOnline'
    },

    initialize: function() {
        this.listenTo(boxes, 'add', this.addOne);
        boxes.fetch();
    },
    render: function(tmpBoxes) {
        $('#box-list').children('tbody').empty();
        var $sortFlag;
        $sortFlag = this.$el.find('.caret:visible').parents('.sortBy').hasClass('dropup');
        if($sortFlag) {
            $.each(tmpBoxes, function(i, o) {

                var view = new BoxView({model: o});
                $('#box-list').children('tbody').append(view.render().el);
            })
        } else {
            $.each(tmpBoxes, function(i, o) {
                var view = new BoxView({model: o});
                $('#box-list').children('tbody').prepend(view.render().el);
            })
        }
        $('#allBoxes').prop('checked', false);  //不勾选
    },
    sortByName:function() {
        this.sortBy('Name')
    },
    sortByAlias:function() {
        this.sortBy('Alias')
    },
    sortByIp:function() {
        this.sortBy('Ip')
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
        //控制小三角的状态
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

        var query = $('#schedulesearchInput').val().trim();
        if(query !== '') {
            tmpBoxes = tmpBoxes.filter(function(box) {
                return box.toJSON().name.indexOf(query) > -1 || box.toJSON().alias.indexOf(query) > -1;
            });
        } else {
            tmpBoxes = tmpBoxes.filter(function() {
                return true;
            });
        }
        this.render(tmpBoxes);
        $('#allBoxes').prop('checked',false);
    },

    addOne: function(box) {
        var view = new BoxView({model:box});
        this.$('tbody').append(view.render().el);
    },
    checkedList: function(){//上一次勾选的状态；

        var checkedBoxesId = [];
        boxes.models.forEach(function (item) {

            if(item.attributes.checked == true){
                var checkedId = item.id;
                checkedBoxesId.push(checkedId);
            }
        });
        return checkedBoxesId;
    },

    selectAll: function(e) {
        boxes.fetch();

        if(this.$('th input:checked').length > 0) {
            this.$('td input').prop('checked', true);
            boxes.models.forEach(function (item) {

                if(item.attributes.checked == false){
                    item.attributes.checked = true;
                }
            });

        } else {
            this.$('td input').prop('checked', false);
            boxes.models.forEach(function (item) {

                if(item.attributes.checked == true){
                    item.attributes.checked = false;
                }
            });
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

        var query = $('#schedulesearchInput').val().trim();
        var sortColNname = $('#box-list').find('.caret:visible').attr('sortColName') ? $('#box-list').find('.caret:visible').attr('sortColName') : 'name';
        var tmpBoxes = boxes.filter(function(){
            return true;
        }).reverse();
        var that = this;
        if(this.$('td input:checked').length === this.$('td input').length) {

            this.$('th input').prop('checked', true);
        } else {
            this.$('th input').prop('checked', false);
        }
        var currentId = [];//当前选中的id


        //当输入框中有值时；
        if(query !== '') {
            console.log("********输入框内有值*********");
            tmpBoxes = tmpBoxes.filter(function(box) {

                return box.toJSON().name.indexOf(query) > -1 || box.toJSON().alias.indexOf(query) > -1;
            });

            var checkedTrueBoxes = [];
            tmpBoxes.forEach(function(item){

                if(item.attributes.checked == true){
                    checkedTrueBoxes.push(item.id);
                }
            });

            var boxes_selected = [];
            $('#box-list td input:checked').each(function (index, dom) {
                boxes_selected.push(that.$(dom).val());//已勾选的播放器
             });

            if(checkedTrueBoxes.length > boxes_selected.length){

                checkedTrueBoxes.forEach(function(im){
                    var num = im;
                    var isExist = false;
                    for(var a=0;a<boxes_selected.length;a++){
                        var check_id = boxes_selected[a];
                        if( num == check_id ){
                            isExist = true;
                            break;
                        }
                    }
                    if(isExist == false){
                        currentId.push(im);
                    }
                })

                boxes.models.forEach(function (item) {

                    if(item.id == currentId[0]){

                        item.attributes.checked = false;

                    }
                })

            };

            if(checkedTrueBoxes.length <= boxes_selected.length){

                boxes_selected.forEach(function(im){
                    var num = im;
                    var isExist = false;
                    for(var a=0;a<checkedTrueBoxes.length;a++){
                        var check_id = checkedTrueBoxes[a];
                        if( num == check_id ){
                            isExist = true;
                            break;
                        }
                    }
                    if(isExist == false){
                        currentId.push(im);
                    }
                })

                boxes.models.forEach(function (item) {

                    if(item.id == currentId[0]){
                        item.attributes.checked = true;

                    }
                })
            };


        } else {
            console.log("********输入框内mei值*********");

            var checkedBoxesId = that.checkedList();
            var ids=[];//box--勾选
            $(".publishBox:checked").each(function(i, o) {

                ids.push($(o).val());
            });

            checkedBoxesId.sort();
            ids.sort();
            tmpBoxes = tmpBoxes.filter(function(box) {
                return true;
            });
            if(checkedBoxesId.length > ids.length){

                checkedBoxesId.forEach(function(im){
                    var num = im;
                    var isExist = false;
                    for(var a=0;a<ids.length;a++){
                        var check_id = ids[a];
                        if( num == check_id ){
                            isExist = true;
                            break;
                        }
                    }
                    if(isExist == false){
                        currentId.push(im);
                    }
                })

                boxes.models.forEach(function (item) {

                    if(item.id == currentId[0]){

                        item.attributes.checked = false;

                    }
                })

            };

            if(checkedBoxesId.length < ids.length){

                ids.forEach(function(im){
                    var num = im;
                    var isExist = false;
                    for(var a=0;a<checkedBoxesId.length;a++){
                        var check_id = checkedBoxesId[a];
                        if( num == check_id ){
                            isExist = true;
                            break;
                        }
                    }
                    if(isExist == false){
                        currentId.push(im);
                    }
                })

                boxes.models.forEach(function (item) {

                    if(item.id == currentId[0]){

                        item.attributes.checked = true;

                    }
                })
            };
        }




    }
});

//拿到播放列表的总size,单位全部转换为KB;
function playlistSize(data){
    var size = 0;
    if(data){
        if(data.indexOf("KB")){

            size += Number(data.substring(0, data.indexOf("KB")))* 1024;
        }
        if(data.indexOf("MB")){

            size += Number(data.substring(0, data.indexOf("MB"))) * 1024* 1024;
        }
        if(data.indexOf("GB")){

            size += Number(data.substring(0, data.indexOf("GB"))) * 1024 * 1024* 1024;
        }
    }
    return parseInt(size);
};

//拿到勾选播放器的总size,单位全部转换为B;
function getBoxesDisk(item){
    if(item==''){
        return 0;
    }else{
        var diskArr = item.split(' ');
        var disk = diskArr[1];
        var diskSize = playlistSize(disk);
        return diskSize;
    }

};

//发布弹框
function ConfirmPublish(data){
    var schedule = $('#publishModal').attr('schedule');
    //console.log(data);
    $.ajax({
        type: 'POST',
        url: '/publish/' + schedule,
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
};



//警告弹框
AlertPublishView = Backbone.View.extend({
    el: '#myAlert',
    events: {
        'click #btnClose': 'close'
    },
    render: function(temBoxs) {
        $('#myAlert .modal-body').empty();
        var boxesArr = temBoxs;
        var row_box = '';
        var temp = '';
        boxesArr.forEach(function(im){

            row_box += ' [ ' + im + ' ]；';
            //temp += _.template($('#myAlerttemplate').html(), {rowBoxes: '<p>该播放列表的总容量大于<strong>'+row_box+'</strong>播放器！</p></br>'});
        });
        temp += _.template($('#myAlerttemplate').html(), {rowBoxes: '<p>此排期的容量过大，将会导致以下播放器无法播放：</p>'+row_box});
        //console.log(temp);
        return temp;
    },
    close: function(){

        window.location.href = '/schedule';

    }
});
//var alertPublishView = new AlertPublishView;



PublishView = Backbone.View.extend({
    el: '#publishModal',
    events: {
        'click #publishBtn': 'publish',
        'input #schedulesearchInput': 'searchBoxes',
        'prototypechange #schedulesearchInput': 'searchBoxes'
    },

    initialize: function() {
        var boxListView = new BoxListView;
        var groupListView = new GroupListView;
    },

    render: function(tmpBoxes) {
        $('#box-list').children('tbody').empty();
        var $sortFlag;
        $sortFlag = this.$('#box-list').find('.caret:visible').parents('.sortBy').hasClass('dropup');
        if($sortFlag) {

            $.each(tmpBoxes, function(i, o) {

                var view = new BoxView({model: o});
                $('#box-list').children('tbody').append(view.render().el);
            })
        } else {
            $.each(tmpBoxes, function(i, o) {

                var view = new BoxView({model: o});
                $('#box-list').children('tbody').prepend(view.render().el);
            })
        }
        $('#allBoxes').prop('checked', false);  //不勾选
    },

    publish: function(e) {
        var groups = [],
            data = {},
            that = this;
        var schedule = this.$el.attr('schedule');
        var playSize = this.$el.attr('size');//播放列表的总size
        var playlist_size = playlistSize(playSize);//拿到播放列表的总size,单位全部转换为B;

        this.$('#group-list td input:checked').each(function (index, dom) {
            groups.push(that.$(dom).val());//已勾选的组
        });

        var boxListView = new BoxListView;
        var checkedBoxesId = boxListView.checkedList();
        if (groups.length === 0 && checkedBoxesId.length === 0)  return popBy("#publishBtn", false, '请先选择您要发布到的分组或播放器');
        data.groups = [], data.boxes = checkedBoxesId, data.stamp = new Date().getTime();

        boxes.fetch();
        var boxes_info = []; //存放勾选播放器的信息
        boxes.models.forEach(function (item) {

            checkedBoxesId.forEach(function (im) {
                if (im == item.id) {
                    boxes_info.push(item);
                }
            })
        });

        var rowerBoxes = []; //存放超过服务器存储的播放器名字

        boxes_info.forEach(function (item) {
            var boxesDisk = item.attributes.disk;
            var boxes_disk = getBoxesDisk(boxesDisk);
            if (playlist_size > boxes_disk) {
                rowerBoxes.push(item.attributes.name);
            }
        });

        if (rowerBoxes.length != 0) {
            $('#publishModal').modal('hide');
            $('#myAlert').modal('show');

            var view = new AlertPublishView;
            $('#myAlert .modal-body').append(view.render(rowerBoxes));
            $('#myAlert #forcePublishBtn').click(function(){
                $('#myAlert').modal('hide');
                $('#confirmPublish').modal('show');
                $('#confirmPublish #publishConfirmBtn').click(function(){
                    ConfirmPublish(data);
                });
                $('#confirmPublish #publishCloseBtn').click(function(){
                    $('#confirmPublish').modal('hide');
                    $('#publishModal').modal('show');

                });
            });


        }else {
            $('#publishModal').modal('hide');
            $('#confirmPublish').modal('show');
            $('#confirmPublish #publishConfirmBtn').click(function(){
                ConfirmPublish(data);
            });
            $('#confirmPublish #publishCloseBtn').click(function(){
                $('#confirmPublish').modal('hide');
                $('#publishModal').modal('show');

            });

        }
    },

    searchBoxes: function() {
        //console.log(111);
        var groups = [],
            that = this;
        var query = $('#schedulesearchInput').val().trim();
        var sortColNname = $('#box-list').find('.caret:visible').attr('sortColName') ? $('#box-list').find('.caret:visible').attr('sortColName') : 'name';
        var tmpBoxes = boxes.filter(function(){
            return true;
        }).reverse();
        this.$('#group-list td input:checked').each(function (index, dom) {
            groups.push(that.$(dom).val());//已勾选的组
        });
        var boxListView = new BoxListView;
        var checkedBoxesId = boxListView.checkedList();

        if(query !== '') {
             tmpBoxes = tmpBoxes.filter(function(box) {

                 return box.toJSON().name.indexOf(query) > -1 || box.toJSON().alias.indexOf(query) > -1;
             });
        } else {
             tmpBoxes = tmpBoxes.filter(function(box) {
                return true;
             });
        }
        var boxes_info = []; //存放勾选播放器的信息
        tmpBoxes.forEach(function (item) {

            checkedBoxesId.forEach(function (im) {
                if (im == item.id) {
                    boxes_info.push(item);
                }
            })
        });

        this.render(tmpBoxes);
        if(boxes_info.length!=0){
            for(var a=0;a<boxes_info.length;a++){
                var $id=boxes_info[a].id;//组里的播放器id
                $(".publishBox[value='" + $id +  "']").prop('checked', true);
            }
        }
        $('#allBoxes').prop('checked',false);
    }
});

var publishView = new PublishView;
