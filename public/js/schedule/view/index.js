
var schedules = new Schedules;
var users = new Users;

_.templateSettings = {
    interpolate : /\{\{(.+?)\}\}/g
};

ScheduleUnionUser = Backbone.Model.extend({
    initialize: function() {
    },
    defaults: {
        scheduleId: '',
        departId:''        
    }
});
ScheduleUnionUsers = Backbone.Collection.extend({    
    url:'/scheduleunionuser',
    model: ScheduleUnionUser
});
var scheduleunionusers = new ScheduleUnionUsers;
scheduleunionusers.fetch();
users.fetch();

function getUsername(scheduleid){ 
    var suuModels=scheduleunionusers.models;
    var userModels = users.models;
    var departid='';
    var $username='';
    for(var i = 0; i<suuModels.length;i++){
        if(scheduleid==suuModels[i].attributes.scheduleId){
            departid = suuModels[i].attributes.departId;
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

ScheduleView = Backbone.View.extend( {
    tagName: 'tr',

    events: {
        'mouseover': 'showOperation',
        'mouseout': 'hideOperation',
        'click .edit': 'edit',
        'click .rename': 'rename',
        'click .clear': 'clear',
        'click .publish': 'publish'
    },

    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.remove);
    },

    render: function() {
        var data = this.model.toJSON();
        //console.log(data);
        var scheduleType = '';
        var scheduleDetail = '';
        var playlistId = data.children[0];//播放列表的id
        //console.log(playlistId)
        switch(data.schedule.type) {
            case 'once':
                scheduleType = '一次';
                scheduleDetail = ''+data.schedule.dateFrom+'至'+data.schedule.dateTo+'<br/>'
                    +'时间:'+data.schedule.timeFrom+'至'+data.schedule.timeTo;
                break;
            case 'everyday':
                scheduleType = '每天';
                scheduleDetail = '时间:'+data.schedule.timeFrom+'至'+data.schedule.timeTo;
                break;
            case 'everyweek':
                scheduleType = '每周';
                var week = data.schedule.week;
                week = week.substring(1, week.length);
                var weekCN = ['周一','周二','周三','周四','周五','周六','周日'];
                for (var i = 0;i < 8;i++) {
                    if(week[i] === '1') {
                        scheduleDetail += weekCN[i]+' ';
                    }
                }
                scheduleDetail += '<br/>'+'时间:'+data.schedule.timeFrom+'至'+data.schedule.timeTo;
                break;
            case 'everymonth':
                scheduleType = '每月';
                var monthDay = data.schedule.day;
                for (var i = 0;i < monthDay.length;i++) {
                    scheduleDetail += monthDay[i] +'号 '
                }
                scheduleDetail +='<br/>' +'时间:'+data.schedule.timeFrom+'至'+data.schedule.timeTo;
                break;
            default :break;
        }
        data.stamp = new moment(parseInt(data.stamp)).lang('zh-cn').from();
        var username = getUsername(data.id);
        if(!username)username='admin';
        var temp = _.template($('#scheduleTemplate').html(),
            {id: data.id, name: data.name, children: data.playlistName || '<a href="javascript:void(0)"><font color="red"> 已删除</font></a>',title: data.playlistName || '', scheduleType: scheduleType,
                scheduleDetail:scheduleDetail,stamp: data.stamp, childrenId : data.children[0],userName:username});
        $(this.el).html(temp);

        if(!data.playlistName) this.$el.find('.publish').hide();//如果没有播放列表的名称，就隐藏“发布”按钮
        return this;
    },

    showOperation: function() {
        $(this.el).find('.name').parent().removeClass("col-xs-10").addClass("col-xs-5");
        $(this.el).find('.operation').show();
    },

    hideOperation: function() {
        $(this.el).find('.name').parent().removeClass("col-xs-5").addClass("col-xs-10");
        $(this.el).find('.operation').hide();
    },

    edit: function() {
        var data = this.model.toJSON();
        location.href = '/schedule/edit/' + data.id;
    },

    rename: function() {
        var data = this.model.toJSON();
        $('#renameInput').val(data.name);
        $('#renameModal').modal('show');
        $('#renameConfirmBtn').off('click').on('click',updateName);
        var that = this;
        function updateName() {
            var name = $('#renameInput').val().trim();
            if(name === '') return popBy('#renameInput',false,'排期名不能为空');

            var validateName = validatePublicName(name);
            var message = '排期名' +  validateName.message;
            if(!validateName.status) return popBy('#renameInput',false,message);
            if(data.name === name) return  $('#renameModal').modal('hide');
            data.name = name;
            that.model.save(data, {success:function(json) {
                    $('#renameModal').modal('hide');
                    location.href = '/schedule'
                }, error: function() {
                    $('#renameModal').modal('hide');
                    that.model.fetch();
                    alert('重命名失败');
                }}
            );
        }
    },
    //排期发布弹框
    publish: function() {
        var data = this.model.toJSON();
        $.get('/contract/'+data.children[0],function(result){

            if(result.size && result.size != ''){
                $('#publishModal').attr('size', result.size);
            }else{
                $('#publishModal').attr('size', 0);
            }

        });

        $('#publishModal').modal('show');
        $('#publishModal').attr('schedule', this.model.get('id'));
    },

    clear: function() {
        if(confirm("确认删除吗？")) {
            this.model.destroy();
        }
    }
})


SchedulesView = Backbone.View.extend( {
    el: '#schedules',

    events: {
        'click #allSchedules': 'selectAll',
        'click .scheduleChk': 'selectOne',
        'click .sortByName': 'sortByName',
        'click .sortByStamp': 'sortByStamp'
    },

    initialize: function() {

        var that =  this;
        schedules.fetch({success: function(collection, response) {
            var tmpSchedules = schedules.filter(function() {
                return true;
            });
            that.render(tmpSchedules);
        }, error: function(collection, response) {alert('获取数据失败')}});

//        playlists.fetch().done(function(models,status,jqXHR) {
////            var tmpPlaylists = playlists.filter(function() {
////                return true;
////            });
////            $.each(tmpPlaylists,function(i,o){
////                children.append('<option value=' + o.id  + '>' + o.get('name') + '</option>');
////            });
////            if(id === 'undefined') {
////                that.model = new Schedule();
////            } else {
////                var schedule = new Schedule({id: id});
////                schedule.fetch({success: function(model, response) {
////                    that.model = model;
////                    var data = model.toJSON();
////                    var scheduleType = data.schedule ? data.schedule.type : 'once';
////                    that.scheduleType = that.$('#type [value=' + scheduleType + ']');
////                    that.$('#name').attr('value',data.name);
//////                    that.$('#children').val(data.children[0].id);
////                    that.$('#children').val(data.children[0]);
////                    that.scheduleType.attr('checked', true);
////                    that.showDetails(scheduleType,true);
////                }});
////            }
//        }).fail(function(jqXHR) {
//                if(jqXHR.status === '404') {
//                    alert('请求失败');
//                } else {
//                    alert('未知错误，请联系管理员');
//                }
//            });
    },

    render: function(tmpSchedules) {
        $(this.el).children('tbody').children().remove();
        var $sortFlag = $('#schedules').find('.caret:visible').parents('.sortBy').hasClass('dropup');
        if(!$sortFlag) {
            this.renderDesc(tmpSchedules);
        } else {
            this.renderAsc(tmpSchedules);
        }
    },
    renderAsc:function(tmpSchedules) {
        $.each(tmpSchedules, function(i, o) {
            var view = new ScheduleView({model: o});
            $('#schedules').children('tbody').append(view.render().el);

        })
    },
    renderDesc:function(tmpSchedules) {
        $.each(tmpSchedules, function(i, o) {
            var view = new ScheduleView({model: o});
            $('#schedules').children('tbody').prepend(view.render().el);

        })
    },

    selectAll: function(e) {
        if($('#allSchedules:checked').length > 0) {
            $('.scheduleChk').prop('checked', true);
        } else {
            $('.scheduleChk').prop('checked', false);
        }
        if (e && e.stopPropagation) {
            //支持W3C
            e.stopPropagation();
        }
        else {
            //IE的方式
            window.event.cancelBubble = true;
        }
    },

    selectOne: function(e) {
        if($(".scheduleChk:checked").length === $('.scheduleChk').length) {
            $('#allSchedules').prop('checked', true);
        } else {
            $('#allSchedules').prop('checked', false);
        }
    },
    sortByName:function() {
        this.sortBy('Name');
    },
    sortByStamp:function() {
        this.sortBy('Stamp');
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
        var tmpSchedules = schedules.sortBy(function (schedule) {
            return schedule.get(sortColNname.toLowerCase());
        });

        var query = $('#searchInput').val().trim();
        if(query !== '') {
            tmpSchedules = tmpSchedules.filter(function(schedule) {
                return schedule.toJSON().name.indexOf(query) > -1 || schedule.toJSON().playlistName.indexOf(query) > -1;
            });
        } else {
            tmpSchedules = tmpSchedules.filter(function(schedule) {
                return true;
            });
        }

        $('#allSchedules').prop('checked', false);
        this.render(tmpSchedules);
    }
})


OprateScheduleView = Backbone.View.extend({
    el:"#operateScheduleArea",
    events: {
        'input #searchInput': 'searchSchedules',
        'prototypechange #searchInput': 'searchSchedules',
        'click #searchBtn': 'searchSchedules',
        'click #removeSchedulesBtn': 'removeSchedules'
    },

    initialize: function() {

    },
    render: function() {

    },
    searchSchedules:function() {

        var query = $('#searchInput').val().trim();
        var sortColNname = $('#schedules').find('.caret:visible').attr('sortColName') ?
            $('#schedules').find('.caret:visible').attr('sortColName') : 'stamp';
        var tmpSchedules = schedules.sortBy(function (schedule) {
            return schedule.get(sortColNname);
        });

        if(query !== '') {
            tmpSchedules = tmpSchedules.filter(function(schedule) {
                return schedule.toJSON().name.indexOf(query) > -1 || schedule.toJSON().playlistName.indexOf(query) > -1;

            });
            listView.render(tmpSchedules);
        } else {
            tmpSchedules = tmpSchedules.filter(function(schedule) {
                return true;
            });
            listView.render(tmpSchedules);
        }

        $('#allSchedules').prop('checked', false);

    },
    removeSchedules:function() {
        var $ids = [];
        $(".scheduleChk:checked").each(function(i, o) {
            $ids.push($(o).val());
        });
        if($ids.length == 0) return popBy("#removeSchedulesBtn", false, '请先选择您要删除的排期');
        if(confirm("确认删除吗？")) {
            $.ajax({
                type: "DELETE",
                url: "/schedules/",
                data: JSON.stringify($ids),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (json) {
                    if(json.status === 'success') {
                        $.each($ids,function(i,o) {
                            var $tempschedule = schedules.get(o);
                            schedules.remove($tempschedule);
                        })
                        $(".scheduleChk:checked").parents('tr').remove();
                        $('#allSchedules').prop('checked', false);
                    }
                },
                error: function (err) {
                    alert("error:"+$ids)

                }
            });
        }
    }

})
var listView = new SchedulesView;
var oprateScheduleView = new OprateScheduleView;

