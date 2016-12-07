/**
 * Created by shgbit on 14-2-10.
 */

//var contracts = new Contracts;

ContractView = Backbone.View.extend({
    el: '#scheduleEdit',
    events: {
        'change #selectMonthday':'monthday',
        'click #save':'saveSchedule',
        'click #saveAndPublish': 'saveAndPub',
        'click #everyday': 'everyday',
        'click #everymonth': 'everymonth',
        'click #everyweek': 'everyweek',
        'click #once': 'once'
    },

    initialize: function() {

        var that = this;
        var id = this.$el.attr('value');
        var children = this.$('#children');
        playlists.fetch().done(function(models,status,jqXHR) {
            var tmpPlaylists = playlists.filter(function() {
                return true;
            });
            tmpPlaylists.reverse();
            $.each(tmpPlaylists,function(i,o){
                children.append('<option value=' + o.id  + '>' + o.get('name') + '</option>');
            });
            if(!id) {
                that.model = new Schedule();
                that.$('#name').attr('value',today());
            } else {
                var schedule = new Schedule({id: id});
                schedule.fetch({success: function(model, response) {
                    that.model = model;
                    var data = model.toJSON();
                    var scheduleType = data.schedule ? data.schedule.type : 'once';
                    that.scheduleType = that.$('#type [value=' + scheduleType + ']');
                    that.$('#name').attr('value',data.name);
                    that.$('#children').val(data.children[0]);
                    that.scheduleType.attr('checked', true);
                    that.showDetails(scheduleType,true);
                }});
            }
        }).fail(function(jqXHR) {
            if(jqXHR.status === '404') {
                alert('请求失败');
            } else {
                alert('未知错误，请联系管理员');
            }
        });
    },

    renderMonthDay:function(tmpMonthdays) {
        $("#monthDay").empty();
        $.each(tmpMonthdays, function(i, o) {
            var monthDayItemView = new MonthDayItemView({model:o});
            $("#monthDay").append(monthDayItemView.render().el);

        })
    },
    monthday:function() {
        if($('#selectMonthday').val() !== '请选择每月需要的日期') {
            var tmpMonthDay = new MonthDay({id:$('#selectMonthday').val(),name:$('#selectMonthday').val()+'号'});
            var oldLength = monthDays.length;
            monthDays.add(tmpMonthDay);
            var newLength = monthDays.length;
            if(oldLength < newLength) {
                var tmpMonthDays = monthDays.filter(function(){
                    return true;
                });
                this.renderMonthDay(tmpMonthDays);
            }
            $('#selectMonthday').val('请选择每月需要的日期');// = '请选择每月需要的日期'
        }
    },
    showDetails:function(type,isedite) {

        var data = this.model.toJSON();
        switch (type) {
            case 'once':
                $('#date').show();
                $('#time').show();
                $('#week').hide();
                $('#month').hide();
                if(isedite) {

                    $('#startDate').val(data.schedule.dateFrom)
                    $('#endDate').val(data.schedule.dateTo)
                    $('#startTime').val(data.schedule.timeFrom)
                    $('#endTime').val(data.schedule.timeTo)
                }
                break;
            case 'everyday':
                $('#date').hide();
                $('#time').show();
                $('#week').hide();
                $('#month').hide();
                if(isedite) {
                    $('#startTime').val(data.schedule.timeFrom)
                    $('#endTime').val(data.schedule.timeTo)
                }
                break;
            case 'everyweek':
                $('#date').hide();
                $('#time').show();
                $('#week').show();
                $('#month').hide();
                if(isedite) {
                    var week = data.schedule.week;
                    for (var i=1;i<8;i++) {
                        if(week[i] === '1') {
                            $('.weekday[day='+i+']').addClass('btn-primary').removeClass('btn-default');
                        }
                    }

                    $('#startTime').val(data.schedule.timeFrom);
                    $('#endTime').val(data.schedule.timeTo);
                }
                break;
            case 'everymonth':
                $('#date').hide();
                $('#time').show();
                $('#week').hide();
                $('#month').show();
                if(isedite) {
                    var monthday = data.schedule.day;
                    for(var i=0 ;i<monthday.length;i++) {
                        var tmpMonthDay = new MonthDay({id:monthday[i],name:monthday[i]+'号'});
                        monthDays.add(tmpMonthDay);
                    }
                    var tmpMonthDays = monthDays.filter(function(){
                        return true;
                    });
                    this.renderMonthDay(tmpMonthDays);

                    $('#startTime').val(data.schedule.timeFrom);
                    $('#endTime').val(data.schedule.timeTo);
                }
                break;
            default :break;
        }

    },
    saveSchedule:function(e,next) {
        var type = $('.scheduleType:checked').val(); //排期类型
        var data = this.model.toJSON();
        var name = $('#name').val().trim(); //名称
        if(name === '') return  popBy('#name',false,'排期名不能为空');

        else if (this.$('#children').val() === null) return popBy('#name',false,'播放列表不存在');
        var validateName = validatePublicName(name);
        var message = '排期名' +  validateName.message;
        if(!validateName.status) return popBy('#save',false,message);
        data.name = name;
        data.children = [];
        data.children.push(this.$('#children').val());
        data.schedule = {};

        switch (type) {
            case 'once':
                if($('#startDate').val() === '' || $('#endDate').val() === ''
                    || $('#startTime').val() === '' ||
                    $('#endTime').val() === '' ) {
                    popBy('#name',false,'排期时间不完整');
                    return;
                }
                data.schedule.type = type;
                data.schedule.dateFrom = $('#startDate').val();
                data.schedule.dateTo = $('#endDate').val();
                data.schedule.timeFrom = $('#startTime').val();
                data.schedule.timeTo = $('#endTime').val();
                break;
            case 'everyday':
                if($('#startTime').val() === '' || $('#endTime').val() === '' ) {
                    popBy('#name',false,'排期时间不完整');
                    return;
                }
                data.schedule.type = type;
                data.schedule.timeFrom = $('#startTime').val();
                data.schedule.timeTo = $('#endTime').val();
                break;
            case 'everyweek':
                var tmpweek = '0'
                var count = 0;
                $.each($('.weekday'),function(i,o){
                    if($(o).hasClass('btn-primary')) {
                        tmpweek = tmpweek + '1';
                        count ++;
                    } else {
                        tmpweek = tmpweek + '0';
                    }
                });
                if($('#startTime').val() === '' || $('#endTime').val() === '' || count === 0) {
                    popBy('#name',false,'排期时间不完整');
                    return;
                }
                data.schedule.type = type;
                data.schedule.week =tmpweek;
                data.schedule.timeFrom = $('#startTime').val();
                data.schedule.timeTo = $('#endTime').val();
                break;
            case 'everymonth':
                if($('#startTime').val() === '' || $('#endTime').val() === '' || monthDays.length === 0) {
                    popBy('#name',false,'排期时间不完整');
                    return;
                }
                data.schedule.type = type;
                data.schedule.day = [];
                var tmpMonthDays = monthDays.filter(function(){
                    return true;
                });
                var that = this;
                $.each(tmpMonthDays, function(i, o) {

                    data.schedule.day.push(o.toJSON().id);
                })
                data.schedule.timeFrom = $('#startTime').val();
                data.schedule.timeTo = $('#endTime').val();
                break;
            default :alert('default');break;
        }
        data.stamp = new Date().getTime().toString();
        this.model.save(data).done(function() {
            isSave = true;
            if(next) {
                next();
            } else {
                location.href = '/schedule';
            }
        }).fail(function(jqXHR, b, c) {
            if(jqXHR.status === 409) {
                alert('保存失败，相同名称的排期已存在');
            } else if(jqXHR.status === 404) {
                alert('提交有误，找不到对应的资源');
            } else {
                alert('未知错误，请联系管理员');
            }
        });
    },

    saveAndPub: function(e) {
        var that = this;
        function callback() {
            $('#publishModal').modal('show');
            $('#publishModal').attr('schedule', that.model.get('id'));
        };
        this.saveSchedule(e, callback);
    },


    everyday: function() {
        this.showDetails('everyday',false);
    },

    everyweek: function() {
        this.showDetails('everyweek',false);
    },

    everymonth: function() {
        this.showDetails('everymonth',false);
    },

    once: function() {
        this.showDetails('once',false);
    }
})


/** Model*/
MonthDay = Backbone.Model.extend({
    initialize: function() {
    },
    defaults: {
        id:'1',
        name: '1号'
    }

});


/** Collection */
MonthDays = Backbone.Collection.extend({
    model: MonthDay,
    comparator:'id'
});
var monthDays = new MonthDays;


/** View **/
MonthDayItemView = Backbone.View.extend({
    tagName:'div',
    events: {
        'click .curpointer': 'removeMonthday'
    },

    initialize: function() {
        _.templateSettings = {
            interpolate : /\{\{(.+?)\}\}/g
        };
        this.model.bind('change',this.render);
    },
    render: function() {
        var tempMode = this.model.toJSON();
        var $temp = _.template($('#monthDayItemTemplate').html(),
            {id:tempMode.id, name: tempMode.name});
        $(this.el).html($temp);
        return this;
    },
    removeMonthday:function() {
        this.el.remove();
        monthDays.remove(this.model);
    }
});

new ContractView();
