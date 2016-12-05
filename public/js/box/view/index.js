var boxes = new Boxes;
var groups = new Groups;
var num=0;
_.templateSettings = {
    interpolate: /\{\{(.+?)\}\}/g
};

function loading(){
    $('#loading').hide();
}
loading();

function hasEle(par,chil){
  var has = false ;
  for(var k in par){
    if (chil==k){
      has = true;
      return has;
    } 

  }
  return has;
}
/** boxView **/
BoxScheduleView = Backbone.View.extend({
    tagName: 'div',
    events:{

    },
    initialize:function() {
        this.$el.addClass('row alert alert-info');
        this.$el.css('padding-bottom','0px');
        this.$el.css('padding-top','0px');
    },
    render:function() {
        var data = this.model;
        //console.log(data);
        var that = this;
        this.$el.html(that.format($('#boxSchedule-template').html(),data.name,data.playListName,that.showScheduleType(data.schedule.type),that.showScheduleDetail(data.schedule),that.showPlayStatus(data.playStatus),that.showDownloadStatus(data.downloadStatus),data.download));
        return this;
    },
    showScheduleType:function(scheduleType) {
        var message = '';
        switch (scheduleType) {
            case 'once':message = '一次';break;
            case 'everyday':message = '每天';break;
            case 'everyweek':message = '每周';break;
            case 'everymonth':message = '每月';break;
            default :break;
        }
        return message;
    },
    showScheduleDetail:function(scheduledetail) {
        var data=scheduledetail;
       // console.log(data);
        var scheduleType = '';
        var scheduleDetail = '';
        switch(data.type) {
            case 'once':
                scheduleType = '一次';
                scheduleDetail = ''+data.dateFrom+'至'+data.dateTo+'<br/>'
                    +'时间:'+data.timeFrom+'至'+data.timeTo;
                break;
            case 'everyday':
                scheduleType = '每天';
                scheduleDetail = '时间:'+data.timeFrom+'至'+data.timeTo;
                break;
            case 'everyweek':
                scheduleType = '每周';
                var week = data.week;
                week = week.substring(1, week.length);
                var weekCN = ['周一','周二','周三','周四','周五','周六','周日'];
                for (var i = 0;i < 8;i++) {
                    if(week[i] === '1') {
                        scheduleDetail += weekCN[i]+' ';
                    }
                }
                scheduleDetail += '<br/>'+'时间:'+data.timeFrom+'至'+data.timeTo;
                break;
            case 'everymonth':
                scheduleType = '每月';
                var monthDay = data.day;
                for (var i = 0;i < monthDay.length;i++) {
                    scheduleDetail += monthDay[i] +'号 '
                }
                scheduleDetail +='<br/>' +'时间:'+data.timeFrom+'至'+data.timeTo;
                break;
            default :break;
        }
        return scheduleDetail;
    },
    showDownloadStatus:function(downloadStatus) {
        var message = '';
        switch (downloadStatus) {
            case 1:message = '下载中';break;
            case 2:message = '下载完成';break;
            case 9:message = '<font color="red">下载异常</font>';break;
            default :message ='<font color="red">异常</font>';break;
        }
        return message;
    },
    showPlayStatus:function(playStatus) {
        var message = '';
        switch (playStatus) {
            case 1:message = '待播放';break;
            case 2:message = '播放中';break;
            case 9:message = '<font color="red">播放异常</font>';break;
            default :message ='<font color="red">异常</font>';break;
        }
        return message;
    },
    format:function() {
        if (arguments.length == 0)
            return null;

        var str = arguments[0];
        for (var i = 1; i < arguments.length; i++) {
            var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
            str = str.replace(re, arguments[i]);
        }

        return str;
    }
});

function showError(errMessage){
    $('#errMessage').modal('show');
    $('.err_message').empty();
    $('.err_message').append(errMessage);
}
/** boxView **/
BoxView = Backbone.View.extend({
    tagName: 'tr',

    template: _.template($('#box-template').html()),

    events: {
        'mouseover': 'showOperation',
        'mouseout': 'hideOperation',
        'click .loadBasicSetting' : 'loadBasicSetting',
        'click .loadNetSetting'   : 'loadNetSetting',
        'click .detail'    : 'detail',
        'click .snapshot' : 'snapshot',
        'click .delete'    : 'clear',
        'click .outOfGroup'   : 'outOfGroup'

    },

    initialize: function() {
        this.listenTo(this.model, 'destroy', this.remove);
        this.listenTo(this.model, 'remove', this.remove);
        this.listenTo(this.model, 'change', this.render);
    },
    //渲染数据
    render: function() {
        //console.log("11")
      if($('#boxViewBtn').hasClass('btn-primary')) {
        $('.showOnList-detail').hide();
          this.renderView();
      } else if($('#showBoxDetails').hasClass('btn-primary')){
        $('.showOnList-detail').show();
        this.renderDetail();
      }else {
          //var t1=new Date().getTime();
          //$('.showOnList-detail').hide();
          var data = this.model.toJSON();
          //console.log(data)
          //console.log(this.$el)   //this.$el指的是tr
          this.$el.html(this.template({id: data.id , name: data.name, alias: data.alias,
              ip: data.net_set.ip || '', online: (data.online === true ? 'online' : 'offline'), screen: (data.screen === 'on' ? 'screenOn': 'screenOff')}));

          this.input = this.$('.rename');
          var width = $('.h3-head').width()/5 || 120;
          if($.cookie('type') === 'normal') this.$el.find('.delbox-li').hide();
          this.$el.find('.td-alias').css('width',width);
      }$('#loading').hide();

        //var t2=new Date().getTime();
        //console.log(t2-t1);
      return this;
    },
    renderDetail: function() {
      var templatedetail = _.template($('#box-template-detail').html());
      if($('#boxViewBtn').hasClass('btn-primary')) {
          this.renderView();
      } else {
          var data = this.model.toJSON();  
          var schedule_cur='';
          for(var i=0;i<data.schedule.length;i++){
            if(data.schedule[i].playStatus==2 || data.schedule[i].playStatus==9){
                schedule_cur=data.schedule[i].name;
                break;
            }
          }

          if(data.lastLinkTime == null){
              var lastLinkTime = ''
          }
          else{
              var lastLinkTime= new Date(data.lastLinkTime);
              var month = lastLinkTime.getMonth() + 1;
              month = month<10?'0'+month:month;
              lastLinkTime=lastLinkTime.getFullYear()+'/'+month+'/'+(lastLinkTime.getDate()<10?'0'+lastLinkTime.getDate():lastLinkTime.getDate())+'/'+(lastLinkTime.getHours()<10?'0'+lastLinkTime.getHours():lastLinkTime.getHours())+':'+(lastLinkTime.getMinutes()<10?'0'+lastLinkTime.getMinutes():lastLinkTime.getMinutes());

          }
          if (data.schedule == ''){
              var boxdownload = 0;
              var boxplay = 0;
          }
          else{
              for(var a = 0 ; a < data.schedule.length; a ++){
                  if (data.schedule[a].playStatus==2 || data.schedule[a].playStatus==9){
                      var boxdownload = data.schedule[a].downloadStatus;
                      var boxplay = data.schedule[a].playStatus;

                      //播放异常的时候 传递数据
                      var playerrorinfo = '';
                      
                    
                      if (!data.schedule[a].playError || data.schedule[a].playError == null){

                          var playerrorinfo = 'Error Not Upload';
                          
                          playerrorinfo = playerrorinfo.replace(/\s/g,"&nbsp;");

                      }
                      else{
                          for(var i = 0; i <data.schedule[a].playError.length; i++){
                              var tag = data.schedule[a].playError[i].tag.substr(15,100);
                              playerrorinfo = playerrorinfo + tag + ':' +data.schedule[a].playError[i].result + ';';
                              console.log(playerrorinfo);
                              playerrorinfo = playerrorinfo.replace(/\s/g,"&nbsp;");
                              console.log(playerrorinfo);

                          }
                      }

                      //判断是否有download字段 （字段改变 显示不全）
                      if(!hasEle(data.schedule[a],'result')){
                      }else{

                        if(data.schedule[a].result.length == 0){
                           data.schedule[a].result.push('');
                      }
                        if (!data.schedule[a].result[0]){
                          var downloaderrorinfo = 'Error Not Upload';
                          downloaderrorinfo = downloaderrorinfo.replace(/\s/g,"&nbsp;");
                      }
                      else{
                          var downloaderrorinfo = '';
                          for (var i = 0; i < data.schedule[a].result.length; i ++){
                              if(data.schedule[a].result[i].result !== '100%'){
                                  downloaderrorinfo = downloaderrorinfo + data.schedule[a].result[i].result + ';';
                              }
                          }
                          downloaderrorinfo = downloaderrorinfo.replace(/\s/g,"&nbsp;");

                      }
                      }
                      
                  }

                  }

          }
          var downloadstate = function(){
              var message = '';
              switch(boxdownload) {
                  case 0:message = '';break;
                  case 1:message = '下载中';break;
                  case 2:message = '下载完成';break;
                  case 9:message = '<font color="red" style="cursor:pointer" onClick = showError("'+downloaderrorinfo+'")>下载异常</font>';break;
                  default :message ='下载中';break;
              }
              return message;
          };

          var playstate = function(){
              var message = '';
              switch(boxplay) {
                  case 0:message = '';break;
                  case 1:message = '待播放';break;
                  case 2:message = '播放中';break;
                  case 9:message = '<font color="red" style="cursor:pointer" onClick = showError("'+playerrorinfo+'")>播放异常</font>';break;
                  default :message ='待播放';break;
              }
              return message;
          };

          var compareDisk = function(){
              var disk_str=data.disk;
              var disk1=disk_str.split(' ');
              var disk1one= parseFloat(disk1[0]);
              var b=80;
              //console.log(cpu1one);
              if(disk1one>=b){

                  disk_str = "<a href='javascript:void(0)' class='strong'><font color='red'>"+ disk_str+"</font></a>";

              }else{
                  disk_str= disk_str
              }
              return disk_str;
              //console.log(cpu1[0]);
          };

          var compareCpu = function(){
              var cpu_str=data.cpu;
              var cpu1=cpu_str.split(' ');
              var cpu1one= parseFloat(cpu1[0]);
              var b=80;
              //console.log(cpu1one);
              if(cpu1one>=b){

                  cpu1[0] = "<a href='javascript:void(0)' class='strong'><font color='red'>"+ cpu1[0]+"</font></a>";

              }else{
                  cpu1[0]= cpu1[0];
              }
              return cpu1[0];
              //console.log(cpu1[0]);
          };
         this.$el.html(templatedetail({num: num , id: data.id , name: data.name, banben: data.version.code,
              mingcheng: data.alias || '', cipan:compareDisk(), cpu:compareCpu(), schedule:schedule_cur, bofang:playstate(),xiazai:downloadstate(),online: (data.online === true ? 'online' : 'offline'),shangchuanshijian:lastLinkTime}));
          this.input = this.$('.rename');

      }
      return this;
    },
    renderView:function() {
        var viewtemplate = _.template($('#boxView-template').html());
        var that = this;
        this.$el.addClass('col-xs-4');
        var data = this.model.toJSON();
        this.$el.html(viewtemplate({id: data.id , name: data.name, alias: data.alias,
            ip: data.net_set.ip || '', online: (data.online === true ? 'online' : 'offline'), screen: (data.screen === 'on' ? 'screenOn': 'screenOff'),snapshot:data.snapshot}));
        var image = new Image();
        image.onload = function() {
            if(image.width > image.height) {
                that.$el.find('.imageBox').children().attr('width','100%');
            } else {
                that.$el.find('.imageBox').children().attr('height','100%');
            }
        }
        image.onerror = function() {
            that.$el.find('.imageBox').children().attr('width','100%');
            that.$el.find('.imageBox').children().attr('height','100%');
        }
        image.src = 'data:image/png;base64,' + data.snapshot;
        return this;
    },
    
    showOperation: function() {
        if($('#boxListBtn').hasClass('btn-primary')) {
            $(this.el).find('.name').parent().removeClass("col-xs-10").addClass("col-xs-5");
            $(this.el).find('.operation').show();
        }

    },

    hideOperation: function() {
        if($('#boxListBtn').hasClass('btn-primary')) {
            $(this.el).find('.name').parent().removeClass("col-xs-5").addClass("col-xs-10");
            $(this.el).find('.operation').hide();
        }

    },

    loadBasicSetting: function() {
        var data = this.model.toJSON();
        timeSettings.reset();
        $('#basicSettingModal').show();
        $('#nameSettingInput').val(data.name);
        $('#aliasSettingInput').val(data.alias);
        $('#basicSettingModal .modal-dialog .modal-content .modal-body .row .col-xs-4 .row .input-group #auto_snapshot').val(data.auto_snapshot);
        $('#basicSettingModal .modal-dialog .modal-content .modal-body .row .col-xs-4 .row .input-group #interval').val(data.interval);
        $('#debugSetting').val(data.debug);
        $('#timeSetting').empty();
        for(var i = 0; i < data.auto_screen.length ; i++) {
            var obj = {from:data.auto_screen[i].from,
                to:data.auto_screen[i].to,
                week:data.auto_screen[i].week
            }
            var timeSetting = new TimeSetting(obj);
            timeSetting.set({id:timeSetting.cid});
            timeSettings.add(timeSetting);
            var timeSettingItemView = new TimeSettingItemView({model:timeSetting});
            $('#timeSetting').append(timeSettingItemView.render().el);

        }
        
        $('#basicSettingModal').attr('boxId',data.id);
        $('#basicSettingModal').prop('isBoxes',false);
        $('#basicSettingModal').modal('show');

        console.log(data.id);
        $.ajax({
            type: "GET",
            url: "/box/authority/"+data.id,
            contentType: "text/html; charset=utf-8"
        }).done(function(result){
                if(result.flag == true) {
                    $('#saveBasicSetting').show();
                } if(result.flag == false) {
                    $('#saveBasicSetting').hide();
                }
                $('#basicSettingModal').modal('show');
            });
    },

    loadNetSetting: function() {
        var data = this.model.toJSON();
        $('#serviceInput').val('');
        $('#maskInput').val('');
        $('#ipInput').val('');
        $('#gwInput').val('');
        // ToDo load data
        $('#netSettingModal').attr('boxId',data.id);
        $('#netSettingModal').prop('isBoxes',false);
        $('.netBoxes').show();
        $('#netSettingModal').modal('show');
        $.ajax({
            type: "GET",
            url: "/box/authority/"+data.id,
            contentType: "text/html; charset=utf-8"
        }).done(function(result){
            if(result.flag == true) {
                $('#saveNetSetting').show();
            } if(result.flag == false) {
                $('#saveNetSetting').hide();
            }
            $('#netSettingModal').modal('show');
        });
    },
    snapshot:function(){
        var data = this.model.toJSON();
        console.log(data.id);
        var ids =[];
        ids.push(data.id);
        content = {command: "snapshot", boxes: ids};
        console.log(content);
        $.ajax({
            type: "PUT",
            url: "/command",
            data: JSON.stringify(content),
            contentType: "text/html; charset=utf-8"
        }).done(function (jqXHR) {
            //$(".boxChk:checked").prop('checked', false);
            //$('#allBoxes').prop('checked',false);
            alert('命令已发送');
        }).fail(function(a,b,c) {
            console.log('error',a,b,c);
        });

    },

    detail: function() {
        var data = this.model.toJSON();


        var cutStringLength = 150;
        var compareDisk = function(){
            var disk_str=data.disk;
            var disk1=disk_str.split(' ');
            var disk1one= parseFloat(disk1[0]);
            var b=80;
            //console.log(cpu1one);
            if(disk1one>=b){

                disk_str = "<a href='javascript:void(0)' class='strong'><font color='red'>"+ disk_str+"</font></a>";

            }else{
                disk_str= disk_str
            }
            return disk_str;
            //console.log(cpu1[0]);
        };

        var compareCpu = function(){
            var cpu_str=data.cpu;
            var cpu1=cpu_str.split(' ');
            var cpu1one= parseFloat(cpu1[0]);
            var b=80;
            //console.log(cpu1one);
            if(cpu1one>=b){

                cpu_str = "<a href='javascript:void(0)' class='strong'><font color='red'>"+ cpu_str+"</font></a>";

            }else{
                cpu_str= cpu_str;
            }
            return cpu_str;
            //console.log(cpu1[0]);
        };

        $('#boxSchedule').empty();
        $('#boxSchedule').hide();
        $('#boxName').html(data.name.cutString(cutStringLength,true)).attr('title',data.name);
        $('#boxAlias').html(data.alias.cutString(cutStringLength,true)).attr('title',data.alias);
        $('#boxOs').html(data.os.cutString(cutStringLength,true)).attr('title',data.os);
        $('#boxVersionCode').html(data.version.code || '');//.cutString(15,true)).attr('title',(data.version.code || ''));
        $('#boxVersionName').html((data.version.name || '').cutString(cutStringLength,true)).attr('title',(data.version.code || ''));;
        $('#boxDsmversionCode').html(data.dsmversion.code || '');//.cutString(15,true)).attr('title',(data.dsmversion.code || ''));
        $('#boxDsmversionName').html((data.dsmversion.name || '').cutString(cutStringLength,true)).attr('title',(data.dsmversion.name || ''));
        $('#boxBoot').html(data.boot.cutString(cutStringLength,true)).attr('title',data.boot);
        $('#boxService').html(data.service.cutString(cutStringLength,true)).attr('title',data.service);
        $('#boxIP').html((data.net_set.ip || '').cutString(cutStringLength,true)).attr('title',(data.net_set.ip || ''));
        $('#boxMAC').html((data.net_set.mac || '').cutString(cutStringLength,true)).attr('title',(data.net_set.mac || ''));
        $('#boxMASK').html((data.net_set.mask || '').cutString(cutStringLength,true)).attr('title',(data.net_set.mask || ''));;
        $('#boxGW').html((data.net_set.gw || '').cutString(cutStringLength,true)).attr('title',(data.net_set.gw || ''));;;
        $('#boxInterval').html(data.interval.cutString(cutStringLength,true)).attr('title',data.interval);
        $('#boxAuto_snapshot').html(data.auto_snapshot.cutString(cutStringLength,true)).attr('title',data.auto_snapshot);
        $('#boxDisk').html(compareDisk().cutString(cutStringLength,true)).attr('title',data.disk);
        $('#boxPixel').html(data.pixel.cutString(cutStringLength,true)).attr('title',data.pixel);
        $('#boxCpu').html(compareCpu().cutString(cutStringLength,true)).attr('title',data.cpu);
        $('#boxMemory').html(data.memory.cutString(cutStringLength,true)).attr('title',data.memory);
        $('#boxScreen').html(data.screen.cutString(cutStringLength,true)).attr('title',data.screen);
        $('#snapshot').attr('src','data:image/png;base64,' + data.snapshot);
        var image = new Image();
        image.onload = function() {
            if(image.width > image.height) {
                $('#snapshot').attr('width','100%');
                $('#snapshot').attr('height','');
            } else {
                $('#snapshot').attr('width','');
                $('#snapshot').attr('height','100%');
            }
        }
        image.onerror = function() {
            $('#snapshot').attr('width','100%');
            $('#snapshot').attr('height','100%');
        }
        image.src = 'data:image/png;base64,' + data.snapshot;
        if(data.os.toLowerCase().indexOf('android') > -1 ) {
            $(".boxDsmversion").show();
        } else {
            $(".boxDsmversion").hide();
        }
        //console.log(data.schedule);
        if(data.schedule.length > 0) {

            for(var i =0;i<data.schedule.length;i++) {
                var scheduleInfo = data.schedule[i];
                //console.log(scheduleInfo.id);

                $.ajax({
                    type: "GET",
                    url: "/schedule/"+ data.schedule[i].id,
                    contentType: "text/html; charset=utf-8"
                }).done(function (result) {

                   // console.log(result);
                    if(!result.children){
                        console.log(result.message);
                    }else if(result.children.length != 0){
                        scheduleInfo.schedule = result.schedule;

                        $.ajax({
                            type: "GET",
                            url: "/contract/" + result.children[0],
                            contentType: "text/html; charset=utf-8"
                        }).done(function (result) {
                            $("#boxScheduleBtn").show();
                            scheduleInfo.playListName = result.name;
                            var boxScheduleView = new BoxScheduleView({model:scheduleInfo});
                            $('#boxSchedule').append(boxScheduleView.render().el);

                        }).fail(function(a,b,c) {

                            console.log('error',a,b,c);
                        });

                    }


                }).fail(function(a,b,c) {

                    console.log('NO SCHEDULE!',a,b,c);
                });

            }
        } else {
            $("#boxScheduleBtn").hide();
        }
        $('#boxDetail').modal('show');
    },


    clear: function() {
        if(confirm("确认删除吗？")) {
            this.model.destroy();
            return this;
        }

    },

    outOfGroup: function() {
        var groupId = $('#group-list-index').val();

        if(groupId === 'all') return;
        else {
            var that = this;
            var boxId = $(this.el).find('.boxChk').val();
            var tmpGroup = groups.get(groupId);
            var data = tmpGroup.toJSON();
            data.boxes = _.without(data.boxes,boxId);
            tmpGroup.save(data).done(function(a,b,c){
                that.$el.remove();
            }).error(function(model, jqXHR, o){
                    if(jqXHR.status === 400) {
                        alert('未知错误，请联系管理员')
                    }

                });
        }
        // ToDo remove this box out of group
    }
});


/** boxesView **/
BoxesView = Backbone.View.extend({
    el: '#box',
    events: {
        'click #createBtn': function() {
            $('#boxCreate').modal('show');            
        },
        'click #commandBtn': function() {
            if($.cookie('type')!='admin'){
                $('#powerOnCommand').remove();
                $('.powerOnCommand').remove();
                $('#powerOffCommand').remove();
                $('.powerOffCommand').remove();
            }
        },
        'click #createBox': 'createBox',
        'click #deleteBoxes': 'deleteBoxes',
        'click #createGroupModal': 'createGroupModal',
        'click #createGroup': 'createGroup',
        'click #deleteGroupModal': 'deleteGroupModal',
        'click #deleteGroups': 'deleteGroups',
        'click #addToGroupModal': 'addToGroupModal',
        'click #addToGroup': 'addToGroup',
        'click #boxesOutOfGroup': 'boxesOutOfGroup',
        'click #nameBtnGroupEdit': 'nameGroupEdit',
        //设置运行模式
        'click #loadBasicSettingsMode': 'loadBasicSettingsMode',
        'click #saveBasicSettingsMode': 'saveBasicSettingsMode',
        //设置截屏周期
        'click #loadBasicSettingsScreenshot': 'loadBasicSettingsScreenshot',
        'click #saveBasicSettingsScreenshot': 'saveBasicSettingsScreenshot',
        //设置更新周期
        'click #loadBasicSettingsUpdate': 'loadBasicSettingsUpdate',
        'click #saveBasicSettingsUpdate': 'saveBasicSettingsUpdate',
        //设置开屏时间段
        'click #loadBasicSettingsScreen': 'loadBasicSettingsScreen',
        'click #saveBasicSettingsScreen': 'saveBasicSettingsScreen',
        // 基本设置
        'click #loadBasicSettings': 'loadBasicSettings',
        'click #saveBasicSetting': 'saveBasicSetting',
        // 网络设置
        'click #loadNetSettings': 'loadNetSettings',
        'click #saveNetSetting': 'saveNetSetting',
        'click #boxScheduleBtn': 'showBoxSchedule',
        'click #allBoxes': 'selectAll',
        'click #allBoxesSet':'selectAllSet',
        'click .boxChk': 'selectOne',
        'click .boxChkSet' :'selectOneSet',
        'click #allGroups': 'selectAllGroups',
        'change #group-list-index':'renderGroupBoxes',
        'click .groupChk': 'selectOneGroup',
        // 排序
        'click .sortByIp': 'sortByIp',     //地址
        'click .sortByName': 'sortByName',  //设备ID
        'click .sortByAlias': 'sortByAlias',   //名称
        'click .sortByOnline': 'sortByOnline',  //在线状态
        'click .sortByScreen': 'sortByScreen',  //屏幕状态
        'click .sortByVersion': 'sortByVersion',
        'click .sortByBofang': 'sortByBofang',
        'click .sortByXiazai': 'sortByXiazai',
        'input #searchInput': 'searchBoxes',   //搜索框
        'prototypechange #searchInput': 'searchBoxes',
        'click #refreshBtn':'refreshBoxes',   //刷新
        'click #boxListBtn': 'boxList',
        'click #showBoxDetails': 'showBoxDetails',
        'click #boxViewBtn': 'boxView',
        'click #snapshotCommand': 'sendSnapshot',
        'click #screenOnCommand': 'sendScreenOn',
        'click #screenOffCommand': 'sendScreenOff',
        'click #powerOnCommand': 'sendPowerOn',
        'click #powerOffCommand': 'sendPowerOff',
        'click #rebootCommand': 'sendReboot',
        'click #resetCommand': 'sendReset'
    },
    showBoxDetails:function() {
        if(!$('#showBoxDetails').hasClass('btn-primary')) {
            $('.showOnList-detail').show();
            $('.showOnList').hide();
            //$('#searchInput').val('');
            $('#showBoxDetails').removeClass('btn-default').addClass('btn-primary')
        }
        $('#boxListBtn').removeClass('btn-primary').addClass('btn-default');
        $('#boxViewBtn').removeClass('btn-primary').addClass('btn-default');
        this.renderToggle();
    },

    boxList:function() {
        if(!$('#boxListBtn').hasClass('btn-primary')) {
            $('.showOnList').show();
            $('.showOnList-detail').hide();
            //$('#searchInput').val('');
            $('#boxListBtn').removeClass('btn-default').addClass('btn-primary')
        }
        $('#showBoxDetails').removeClass('btn-primary').addClass('btn-default');
        $('#boxViewBtn').removeClass('btn-primary').addClass('btn-default');
        this.renderToggle();
    },
    boxView:function() {
        if(!$('#boxViewBtn').hasClass('btn-primary')) {
            $('.showOnList').hide();
            $('.showOnList-detail').hide();
            //$('#searchInput').val('');
            $('#boxViewBtn').removeClass('btn-default').addClass('btn-primary');
        }
        $('#showBoxDetails').removeClass('btn-primary').addClass('btn-default');
        $('#boxListBtn').removeClass('btn-primary').addClass('btn-default');
        this.renderToggle();
    },
    renderToggle:function() {

        var query = $('#searchInput').val().trim();
        var sortColNname = $('#box-list').find('.caret:visible').attr('sortColName') ?
            $('#box-list').find('.caret:visible').attr('sortColName') : 'name';
        var tmpBoxes = boxes.filter(function (box) {
            return true;
        }).reverse();
        if(query !== '') {
            tmpBoxes = tmpBoxes.filter(function(box) {
                return box.toJSON().name.indexOf(query) > -1 || box.toJSON().alias.indexOf(query) > -1;
            });
        } else {
            tmpBoxes = tmpBoxes.filter(function(box) {
                return true;
            });
        }
        var groupId = $('#group-list-index').val();
        if(groupId !== 'all') {
            var tmpGroup = groups.get(groupId);
            var tmpBoxIds = tmpGroup.toJSON().boxes;
            tmpBoxes = tmpBoxes.filter(function(box){
                return _.contains(tmpBoxIds,box.toJSON().id);
            });
        } else {
            tmpBoxes = tmpBoxes.filter(function(){
                return true;
            });
        }
        this.render(tmpBoxes);
    },
    initialize: function() {

        this.listenTo(boxes, 'add', this.addOne);
        this.listenTo(groups, 'remove', this.renderGroupBoxes);
        var that = this;
        boxes.fetch();
        if($("#group-list-index").length>0) {
            groups.fetch().done(function() {
                var tmpGroups = groups.filter(function(){
                    return true;
                });
                that.renderGroup(tmpGroups);
            });
        }

    },
    sortByIp: function(){
        this.sortBy('Ip')
    },
    sortByName:function() {
        this.sortBy('Name')
    },
    sortByAlias:function() {
        this.sortBy('Alias')
    },
    sortByOnline:function() {
        this.sortBy('Online')
    },
    sortByScreen:function() {
        this.sortBy('Screen')
    },
    sortByVersion:function() {
        this.sortBy('Version')
    },
    sortByBofang:function() {
        this.sortBy('Bofang')
    },
    sortByXiazai:function() {
        this.sortBy('Xiazai')
    },

    /**
     * 排序算法
     * @param sortColNname
     */
    sortBy: function(sortColNname) {
        var taget ='.sortBy'+sortColNname;
        //控制小三角的状态
        $(taget).find('.caret').show();
        $(taget).siblings().removeClass('dropup').find('.caret').hide();
        if(!$(taget).hasClass('dropup')) {
            $(taget).addClass('dropup');
        } else {
            $(taget).removeClass('dropup');
        }
        if(sortColNname=='Version')sortColNname='version.code';
        if(sortColNname=='Bofang')sortColNname='schedule.playStatus';
        if(sortColNname=='Xiazai')sortColNname='schedule.download';
        var tmpBoxes = boxes.sortBy(function (box) {
            return box.get(sortColNname.toLowerCase()); //toLowerCase()转换成小写
        });



        var query = $('#searchInput').val().trim();  //输入框中的值
        if(query !== '') {  //不是空值
            tmpBoxes = tmpBoxes.filter(function(box) {
                return box.toJSON().name.indexOf(query) > -1 || box.toJSON().alias.indexOf(query) > -1;
            });
        } else {    //空值
            tmpBoxes = tmpBoxes.filter(function() {
                return true;
            });
        }
        var groupId = $('#group-list-index').val(); //当前分组选择”全部“
        if(groupId !== 'all') {
            var tmpGroup = groups.get(groupId);
            var tmpBoxIds = tmpGroup.toJSON().boxes;
            tmpBoxes = tmpBoxes.filter(function(box){
                return _.contains(tmpBoxIds,box.toJSON().id);
            });
        } else {
            tmpBoxes = tmpBoxes.filter(function(){
                return true;
            });
        }

        this.render(tmpBoxes);
        $('#allBoxes').prop('checked',false);
    },
    searchBoxes:function() {
        //var that=this;
        var query = $('#searchInput').val().trim();//取到搜索框中的值
        var sortColNname = $('#box-list').find('.caret:visible').attr('sortColName') ?
            $('#box-list').find('.caret:visible').attr('sortColName') : 'name';//找到排序的那个sortColName的类型
            //console.log(sortColNname);

        /*var tmpBoxes = boxes.filter(function(){
            return true;
        }).reverse();//reverse()颠倒数组*/
        var tmpBoxes = boxes.sortBy(function (box) {
            //console.log(box.get(sortColNname.toLowerCase()));
            return box.get(sortColNname.toLowerCase()); //toLowerCase()转换成小写
        });
        //如果搜索框中有输入值;
        if(query !== '') {
            tmpBoxes = tmpBoxes.filter(function(box) {
                return box.toJSON().name.indexOf(query) > -1 || box.toJSON().alias.indexOf(query) > -1;
            });
        } else {//没有输入值;
            tmpBoxes = tmpBoxes.filter(function(box) {
                return true;
            });
        }
        var groupId = $('#group-list-index').val();
        if(groupId !== 'all') {
            var tmpGroup = groups.get(groupId);
            var tmpBoxIds = tmpGroup.toJSON().boxes;
            tmpBoxes = tmpBoxes.filter(function(box){
                return _.contains(tmpBoxIds,box.toJSON().id);
            });
        } else {
            tmpBoxes = tmpBoxes.filter(function(){
                return true;
            });
        }
        this.render(tmpBoxes);
        $('#allBoxes').prop('checked',false);

    },
    //box 刷新按钮
    refreshBoxes:function() {
        var that = this;
        boxes.fetch().done(function(){
            if($("#group-list-index").length>0) { //如果有分组
                groups.fetch().done(function() {
                    var tmpGroups = groups.filter(function(){
                        return true;
                    });
                });
            }
            //console.log(that);
            //that.sortBy();
            that.searchBoxes();
        });

    },
    render: function(tmpBoxes) {
        $('#box-list').children('tbody').empty();
        $('#box-view').empty();
        $('#box-list-details').children('tbody').empty();
        num=0;
        var $sortFlag;
        $sortFlag = $('#box-list').find('.caret:visible').parents('.sortBy').hasClass('dropup');
        if($('#showBoxDetails').hasClass('btn-primary')) {            
           $sortFlag = $('#box-list-details').find('.caret:visible').parents('.sortBy').hasClass('dropup');
        }
        if($sortFlag) {
            this.renderDesc(tmpBoxes);
        } else {
            this.renderAsc(tmpBoxes);
        }
        var groupId = $('#group-list-index').val();
        //控制“加入分组”和“移出分组”两个按钮
        if(groupId === 'all') {
            $('.outOfGroup').hide();
            $('.boxesOutOfGroup').hide();
        } else {
            $('.outOfGroup').show();
            $('.boxesOutOfGroup').show();
        }
        $('#allBoxes').prop('checked', false);  //不勾选

    },
    renderAsc:function(tmpBoxes) {
        if($('#boxListBtn').hasClass('btn-primary')) {
            $.each(tmpBoxes, function(i, o) {
                var view = new BoxView({model: o});
                $('#box-list').children('tbody').append(view.render().el);

            })
        } else if($('#showBoxDetails').hasClass('btn-primary')){
            $.each(tmpBoxes, function(i, o) {
            	num++;
                var view = new BoxView({model: o});
                $('#box-list-details').children('tbody').append(view.renderDetail().el);
            })
        }else {
            $.each(tmpBoxes, function(i, o) {
                var view = new BoxView({model: o});
                $('#box-view').append(view.renderView().el);
                $('#box-view').append(view.renderView().el);

            })
        }

    },
    renderDesc:function(tmpBoxes) {
    	num=tmpBoxes.length+1;
        if($('#boxListBtn').hasClass('btn-primary')) {
            $.each(tmpBoxes, function(i, o) {
                var view = new BoxView({model: o});
                $('#box-list').children('tbody').prepend(view.render().el);
            })
        }else if($('#showBoxDetails').hasClass('btn-primary')){
            $.each(tmpBoxes, function(i, o) {
            	num--;
                var view = new BoxView({model: o});
                $('#box-list-details').children('tbody').prepend(view.renderDetail().el);
            })
        } else {
            $.each(tmpBoxes, function(i, o) {
                var view = new BoxView({model: o});
                $('#box-view').prepend(view.renderView().el);
            })

        }

    },
    renderGroupBoxes:function() {
      var groupId = $('#group-list-index').val();
      if( groupId == '') return;
      $('#searchInput').val('');
      if(groupId !== 'all') {
          var tmpGroup = groups.get(groupId);
          var tmpBoxIds = tmpGroup.toJSON().boxes;
          var tmpBoxes = boxes.filter(function(box){
              return _.contains(tmpBoxIds,box.toJSON().id);
          });
          var tempBoxes=[];
      for(var i=0;i<tmpBoxes.length;i++){
      	tempBoxes[i]=tmpBoxes[i].id;
 };
          
          tmpGroup.update({boxes:tempBoxes});
      } else {
          var tmpBoxes = boxes.filter(function(){
              return true;
          });
      }
      this.render(tmpBoxes);
    },
    renderGroup:function(tmpGroups) {
        var that = this;
        $.each(tmpGroups, function(i, o) {
            var view = new GroupView({model:o});
            var groupSelectViewIndex = new GroupSelectView({model:o});
            var groupSelectViewAdd = new GroupSelectView({model:o});
            $('#group-list').children('tbody').append(view.render().el);
            $("#group-list-index").append(groupSelectViewIndex.render().el);
            $("#group-list-add").append(groupSelectViewAdd.render().el);
        })
    },
    addOne: function(model, collection) {
        var boxView = new BoxView({model: model});
        this.$("#box-list").prepend(boxView.render().el);
    },
    createBox: function() {
        var that  = this;
        var data = {};
        var createName = $('#nameInputCreate'),
            createAlias = $('#aliasInputCreate');
        data.name = createName.val().trim();
        data.alias = createAlias.val().trim();
        if(data.name === '') return popBy('#nameInputCreate',false,'设备ID不能为空');
        else if(data.name.getRealLength() > 40) return popBy('#nameInputCreate',false,'设备ID长度不能超过40字节');
        var reg = /^[a-zA-Z0-9\_\-]+$/ig;
        if(!data.name.match(reg)) return popBy('#nameInputCreate',false,'设备ID只能为数字、英文、下划线和减号');
        var validateName = validatePublicName(data.alias);
        var message = '名称' +  validateName.message;
        if(!validateName.status) return popBy('#aliasInputCreate',false,message);
        boxes.create(data, {
            success: function(model, json, jqXHR) {

                if(json.status=='existed'){
                    createName.val('');
                    createAlias.val('');
                    boxes.remove(model);
                    return popBy('#createBox',false,'分组名已存在');
                }
                $("#group-list-index").val('all');
                that.renderGroupBoxes();
                $('#boxCreate').modal('hide');
                createName.val('');
                createAlias.val('');
            },
            error: function(model, jqXHR, o) {
                boxes.remove(model);
                if(jqXHR.status === 409) {
                    return popBy('#createBox',false,'设备已存在，创建失败');
                } else {
                    alert('未知错误，请联系管理员');
                }
            }
        });
        return this;
    },

    deleteBoxes: function() {
        // ToDo get selected boxes and delete them

        var $ids = [];//已勾选的播放器
        $(".boxChk:checked").each(function(i, o) {
            $ids.push($(o).val());
        });
        if($ids.length == 0) return popBy("#deleteBoxes", false, '请先选择您要删除的播放器');
        models = [];
        $.each($ids,function(i,o) {
            models.push(boxes.get(o));
        });
        if(confirm("确认删除吗？")) {
            $.ajax({
                type: "DELETE",
                url: "/devices",
                data: JSON.stringify($ids),
                contentType: "application/json; charset=utf-8"
            }).done(function (jqXHR) {
                boxes.remove(models);
                $(".boxChk:checked").parents('tr').remove();
                $('#allBoxes').prop('checked',false);
            }).fail(function(a,b,c) {
                console.log('error',a,b,c);
            });
        }
    },

    createGroupModal: function() {
        var $ids = [];
        $(".boxChk:checked").each(function(i, o) {
            $ids.push($(o).val());
        })
        if($ids.length == 0) return popBy("#createGroupModal", false, '请先选择您要加入分组的播放器');
        $('#groupCreateModal').modal('show');

        // ToDo get the group name and validate it to be unique, then post /group
    },
    createGroup:function() {

        var that = this;
        var data = {};
        var $ids = [];
        $(".boxChk:checked").each(function(i, o) {
            $ids.push($(o).val());
        })
        data.name = $('#groupInputCreate').val().trim();
        data.boxes = $ids;
        data.owner = $.cookie('token');
        if(data.name === '') return popBy('#groupInputCreate',false,'分组名不能为空');
        var validateName = validatePublicName(data.name);
        var message = '组名' +  validateName.message;
        if(!validateName.status) return popBy('#groupInputCreate',false,message);
        groups.create(data, {
            success: function(model, json, jqXHR) {
                if(json.status=='existed'){
                    return popBy('#createGroup',false,'分组名已存在');
                }
                $('#groupCreateModal').modal('hide');
                var view = new GroupView({model:model});
                var groupSelectViewIndex = new GroupSelectView({model:model});
                var groupSelectViewAdd = new GroupSelectView({model:model});
                $('#group-list').children('tbody').append(view.render().el);
                $("#group-list-index").append(groupSelectViewIndex.render().el);
                $("#group-list-add").append(groupSelectViewAdd.render().el);
                $('#groupInputCreate').val('');
                $('#group-list-index').val(model.toJSON().id);
                that.renderGroupBoxes();
            },
            error: function(model, jqXHR, o) {
                boxes.remove(model);
                if(jqXHR.status === 409) {
                    return popBy("#groupInputCreate",false,"分组名已存在");
                } else {
                    alert('未知错误，请联系管理员');
                }
            }
        });
    },
    deleteGroupModal:function() {

        $('#groupDeleteModal').modal('show');
    },
    deleteGroups:function() {
        var that = this;
        var $ids = [];
        $(".groupChk:checked").each(function(i, o) {
            $ids.push($(o).val());
        })
        if($ids.length == 0) return  $('#groupDeleteModal').modal('hide');
        models = [];
        $.each($ids,function(i,o) {
            models.push(groups.get(o));
        });
        if(confirm("确认删除吗？")) {
            $.ajax({
                type: "DELETE",
                url: "/groups",
                data: JSON.stringify($ids),
                contentType: "application/json; charset=utf-8"
            }).done(function (jqXHR) {
                    groups.remove(models);
//                    $('#groupDeleteModal').modal('hide');
                    $('#allGroups').prop('checked',false);
                    that.renderGroupBoxes();

                }).fail(function(a,b,c) {
                    console.log('error',a,b,c);
                });
        }

    },
    addToGroupModal:function() {
        var $ids = [];
        $(".boxChk:checked").each(function(i, o) {
            $ids.push($(o).val());
        })
        if($ids.length == 0) return popBy("#addToGroupModal", false, '请先选择您要加入分组的播放器');
        models = [];
        $.each($ids,function(i,o) {
            models.push(boxes.get(o));
        });
        $('#groupAddModal').modal('show');
    },
    addToGroup:function() {
        var that = this;
        var groupid = $('#group-list-add').val();
        var tmpGroup = groups.get(groupid);
        var data = tmpGroup.toJSON();
        var $ids = [];
        $(".boxChk:checked").each(function(i, o) {
            $ids.push($(o).val());
        })
        data.boxes = _.union($ids, data.boxes);
        tmpGroup.save(data).done(function(a,b,c){
            $('#groupAddModal').modal('hide');
            $('#group-list-index').val(groupid);
            that.renderGroupBoxes();
        }).error(function(model, jqXHR, o){
                if(jqXHR.status === 400) {
                    alert('未知错误，请联系管理员')
                }

            });
    },
    boxesOutOfGroup:function() {
        var groupId = $('#group-list-index').val();
        if(groupId === 'all') return;
        else {
            var ids = [];
            $(".boxChk:checked").each(function(i, o) {
                ids.push($(o).val());
            })
            if(ids.length == 0) return popBy("#boxesOutOfGroup", false, '请先选择您要移出分组的播放器');
            else {
                var that = this;
                var tmpGroup = groups.get(groupId);
                var data = tmpGroup.toJSON();
                data.boxes = _.difference(data.boxes,ids);
                tmpGroup.save(data).done(function(a,b,c){
                    $('.boxChk:checked').parent().parent().parent().remove();
                }).error(function(model, jqXHR, o){
                        if(jqXHR.status === 400) {
                            alert('未知错误，请联系管理员')
                        }

                    });
            }
        }
    },
    nameGroupEdit:function() {
        var id = $('#groupNameEditModal').prop('groupId');
        var tmpGroupName = $('#nameInputGroupEdit').val().trim();
        var oldName = $('#groupNameEditModal').prop('oldName');
        if(oldName === tmpGroupName) return $('#groupNameEditModal').modal('hide');
        if(tmpGroupName === '') return popBy('#nameInputGroupEdit',false,'分组名不能为空');

        var validateName = validatePublicName(tmpGroupName);
        var message = '分组名' +  validateName.message;
        if(!validateName.status) return popBy('#nameInputGroupEdit',false,message);
        var tmpGroup = groups.get(id);
        tmpGroup.save({name:tmpGroupName}).done(function(a,b,c){
            $('#groupNameEditModal').modal('hide');
        }).error(function(jqXHR,o, status){
                tmpGroup.set({name:oldName});
                if(jqXHR.status === 409) {
                    return popBy("#nameInputGroupEdit",false,"分组名已存在");
                } else {
                        alert('未知错误，请联系管理员')
                    }

                });
    },

    // 模式设置

    loadBasicSettingsMode: function() {
        var $ids = [];
        $(".boxChk:checked").each(function(i, o) {
            $ids.push($(o).val());
        })
        if($ids.length == 0) return popBy("#loadBasicSettingsMode", false, '请先选择您要设置的播放器');
        timeSettings.reset();
        $('.nameSettingDiv').hide();
        $('#aliasSettingInput').val('');
        $('#debugSetting').val('0');
        $('#timeSetting').empty();
        $('#auto_snapshot').val('60');
        $('#interval').val('30');
        $('#basicSettingModeModal').prop('isBoxes',true);


        $('#basicSettingModeModal').modal('show');
    },

    saveBasicSettingsMode: function(){


        var isBoxes =  $("#basicSettingModeModal").prop('isBoxes');
        var data = {};

        data.debug = $('#debugSettingMode').val();

        if(isBoxes) {
            putDate = _.pick(data, 'debug');
            var $ids = [];
            $(".boxChk:checked").each(function(i, o) {
                $ids.push($(o).val());
            })
            if(confirm("确认批量修改吗？")) {
                $.ajax({
                    type: "put",
                    url: "/devices",
                    data: JSON.stringify({ids:$ids,data:putDate}),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (json) {
                        if(json.status === 'success') {
                            $.each($ids,function(i,o) {
                                boxes.get(o).set(putDate);
                            })
                            $('#basicSettingModeModal').modal('hide');
                            $('#allBoxes').prop('checked', false);
                            $(".boxChk:checked").prop('checked', false);
                        }
                    },
                    error: function (err) {
                        alert(err.responseText)
                    }
                });
            }

        } else {
            var id = $("#basicSettingModeModal").attr('boxId');
            boxes.get(id).save(data).done(function(json,status,jqXHR) {
                $('#basicSettingModeModal').modal('hide');
                $('#allBoxes').prop('checked', false);
                $(".boxChk:checked").prop('checked', false);
            }).fail(function() {
                alert('未知错误');
            });
        }

    },

    // 截屏周期设置
    loadBasicSettingsScreenshot: function() {
        var $ids = [];
        $(".boxChk:checked").each(function(i, o) {
            $ids.push($(o).val());
        })
        if($ids.length == 0) return popBy("#loadBasicSettingsScreenshot", false, '请先选择您要设置的播放器');
        timeSettings.reset();
        $('.nameSettingDiv').hide();
        $('#aliasSettingInput').val('');
        $('#debugSetting').val('0');
        $('#timeSetting').empty();
        $('#auto_snapshot').val('60');
        $('#interval').val('30');
        $('#basicSettingScreenshotModal').prop('isBoxes',true);


        $('#basicSettingScreenshotModal').modal('show');
    },

    saveBasicSettingsScreenshot: function(){

        var isBoxes =  $("#basicSettingScreenshotModal").prop('isBoxes');
        var data = {};

        data.auto_snapshot = $('#auto_snapshot').val().trim();

        var int_auto_snapshot = parseInt(data.auto_snapshot);
        var regNumber = /^\d+$/
        if(!regNumber.test(data.auto_snapshot)) return popBy('#auto_snapshot',false,'截屏周期格式不对');
        else if(!(int_auto_snapshot >= 60 && int_auto_snapshot <= 300) && !(int_auto_snapshot === 0)) return popBy('#auto_snapshot',false,'截屏周期必须大于60小于300秒或等于0(不截屏)');

        if(isBoxes) {
            putDate = _.pick(data, 'auto_snapshot');
            var $ids = [];
            $(".boxChk:checked").each(function(i, o) {
                $ids.push($(o).val());
            })
            if(confirm("确认批量修改吗？")) {
                $.ajax({
                    type: "put",
                    url: "/devices",
                    data: JSON.stringify({ids:$ids,data:putDate}),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (json) {
                        if(json.status === 'success') {
                            $.each($ids,function(i,o) {
                                boxes.get(o).set(putDate);
                            })
                            $('#basicSettingScreenshotModal').modal('hide');
                            $('#allBoxes').prop('checked', false);
                            $(".boxChk:checked").prop('checked', false);
                        }
                    },
                    error: function (err) {
                        alert(err.responseText)
                    }
                });
            }

        } else {
            var id = $("#basicSettingScreenshotModal").attr('boxId');
            boxes.get(id).save(data).done(function(json,status,jqXHR) {
                $('#basicSettingScreenshotModal').modal('hide');
                $('#allBoxes').prop('checked', false);
                $(".boxChk:checked").prop('checked', false);
            }).fail(function() {
                //todo
                alert('未知错误');
            });
        }

    },



    // 更新周期设置
    loadBasicSettingsUpdate: function() {
        var $ids = [];
        $(".boxChk:checked").each(function(i, o) {
            $ids.push($(o).val());
        })
        if($ids.length == 0) return popBy("#loadBasicSettingsUpdate", false, '请先选择您要设置的播放器');
        timeSettings.reset();
        $('.nameSettingDiv').hide();
        $('#aliasSettingInput').val('');
        $('#debugSetting').val('0');
        $('#timeSetting').empty();
        $('#auto_snapshot').val('60');
        $('#interval').val('30');
        $('#basicSettingUpdateModal').prop('isBoxes',true);


        $('#basicSettingUpdateModal').modal('show');
    },

    saveBasicSettingsUpdate: function(){

        var isBoxes =  $("#basicSettingUpdateModal").prop('isBoxes');
        var data = {};
        data.interval = $('#interval').val().trim();
        var int_interval = parseInt(data.interval);
        var regNumber = /^\d+$/

        if(!regNumber.test(data.interval)) return popBy('#interval',false,'更新周期格式不对');
        else if(int_interval < 30 || int_interval > 150) return popBy('#interval',false,'更新周期必须大于30小于150秒');
        if(isBoxes) {
            putDate = _.pick(data, 'interval');
            var $ids = [];
            $(".boxChk:checked").each(function(i, o) {
                $ids.push($(o).val());
            })
            if(confirm("确认批量修改吗？")) {
                $.ajax({
                    type: "put",
                    url: "/devices",
                    data: JSON.stringify({ids:$ids,data:putDate}),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (json) {
                        if(json.status === 'success') {
                            $.each($ids,function(i,o) {
                                boxes.get(o).set(putDate);
                            })
                            $('#basicSettingUpdateModal').modal('hide');
                            $('#allBoxes').prop('checked', false);
                            $(".boxChk:checked").prop('checked', false);
                        }
                    },
                    error: function (err) {
                        alert(err.responseText)
                    }
                });
            }

        } else {
            var id = $("#basicSettingUpdateModal").attr('boxId');
            boxes.get(id).save(data).done(function(json,status,jqXHR) {
                $('#basicSettingUpdateModal').modal('hide');
                $('#allBoxes').prop('checked', false);
                $(".boxChk:checked").prop('checked', false);
            }).fail(function() {
                alert('未知错误');
            });
        }
    },

    // 开屏时间设置
    loadBasicSettingsScreen: function() {
        var $ids = [];
        $(".boxChk:checked").each(function(i, o) {
            $ids.push($(o).val());
        })
        if($ids.length == 0) return popBy("#loadBasicSettingsScreen", false, '请先选择您要设置的播放器');
        timeSettings.reset();
        $('.nameSettingDiv').hide();
        $('#aliasSettingInput').val('');
        $('#debugSetting').val('0');
        $('#timeSetting').empty();
        $('#auto_snapshot').val('60');
        $('#interval').val('30');
        $('#basicSettingScreenModal').prop('isBoxes',true);


        $('#basicSettingScreenModal').modal('show');
    },

    saveBasicSettingsScreen: function(){
        var isBoxes =  $("#basicSettingScreenModal").prop('isBoxes');
        var data = {};
        var tmpauto_screen = [];
        var weekdays =$("#timeSettingScreen").children('div');
        var flag = true;
        $.each(weekdays,function(i,o) {
            var tmpauto_screenItem = {};
            var tmpweek = '0'
            var count = 0;
            var weekItem = $(o).find('.weekItem').children('.weekday');
            var timeItem = $(o).find('.timeItem');
            $.each(weekItem,function(i,o){
                if($(o).hasClass('btn-primary')) {
                    tmpweek = tmpweek + '1';
                    count ++;
                } else {
                    tmpweek = tmpweek + '0';
                }
            });
            if(timeItem.children('input').first().val() === '' ||
              timeItem.children('input').last().val() === '' ||
              tmpweek === '00000000') return flag = false;
            tmpauto_screenItem.from = timeItem.children('input').first().val();
            tmpauto_screenItem.to = timeItem.children('input').last().val();
            tmpauto_screenItem.week = tmpweek;
            tmpauto_screen.push(tmpauto_screenItem);
        });
        if(!flag) return popBy('#saveBasicSettingsScreen',flag,'显示时间设置不完整');

        data.auto_screen = tmpauto_screen;
        if(isBoxes) {
            putDate = _.pick(data, 'auto_screen');
            var $ids = [];
            $(".boxChk:checked").each(function(i, o) {
                $ids.push($(o).val());
            })
            if(confirm("确认批量修改吗？")) {
                $.ajax({
                    type: "put",
                    url: "/devices",
                    data: JSON.stringify({ids:$ids,data:putDate}),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (json) {
                        if(json.status === 'success') {
                            $.each($ids,function(i,o) {
                                boxes.get(o).set(putDate);
                            })
                            $('#basicSettingScreenModal').modal('hide');
                            $('#allBoxes').prop('checked', false);
                            $(".boxChk:checked").prop('checked', false);
                        }
                    },
                    error: function (err) {
                        alert(err.responseText)
                    }
                });
            }

        } else {
            var id = $("#basicSettingScreenModal").attr('boxId');
            boxes.get(id).save(data).done(function(json,status,jqXHR) {
                $('#basicSettingScreenModal').modal('hide');
                $('#allBoxes').prop('checked', false);
                $(".boxChk:checked").prop('checked', false);
            }).fail(function() {
                alert('未知错误');
            });
        }

    },



    // 基本设置
    loadBasicSettings: function() {
        var $ids = [];
        $(".boxChk:checked").each(function(i, o) {
            $ids.push($(o).val());
        })
        if($ids.length == 0) return popBy("#loadBasicSettings", false, '请先选择您要设置的播放器');
        timeSettings.reset();
        $('.nameSettingDiv').hide();
        $('#aliasSettingInput').val('');
        $('#debugSetting').val('0');
        $('#timeSetting').empty();
        $('#auto_snapshot').val('60');
        $('#interval').val('30');
        $('#basicSettingModal').prop('isBoxes',true);


        $('#basicSettingModal').modal('show');
    },

    saveBasicSetting: function() {
        var isBoxes =  $("#basicSettingModal").prop('isBoxes');
        var data = {};
        var tmpauto_screen = [];
        var weekdays =$("#timeSetting").children('div');
        var flag = true;
        $.each(weekdays,function(i,o) {
            var tmpauto_screenItem = {};
            var tmpweek = '0'
            var count = 0;
            var weekItem = $(o).find('.weekItem').children('.weekday');
            var timeItem = $(o).find('.timeItem');
            $.each(weekItem,function(i,o){
                if($(o).hasClass('btn-primary')) {
                    tmpweek = tmpweek + '1';
                    count ++;
                } else {
                    tmpweek = tmpweek + '0';
                }
            });
            if(timeItem.children('input').first().val() === '' ||
                timeItem.children('input').last().val() === '' ||
                tmpweek === '00000000') return flag = false;
            tmpauto_screenItem.from = timeItem.children('input').first().val();
            tmpauto_screenItem.to = timeItem.children('input').last().val();
            tmpauto_screenItem.week = tmpweek;
            tmpauto_screen.push(tmpauto_screenItem);
        });
        if(!flag) return popBy('#saveBasicSetting',flag,'显示时间设置不完整');
        data.alias = $('#aliasSettingInput').val().trim();
        var validateName = validatePublicName(data.alias);
        var message = '名称' +  validateName.message;
        if(!validateName.status) return popBy('#saveBasicSetting',false,message);
        data.debug = $('#debugSetting').val();
        data.auto_snapshot =$('#basicSettingModal .modal-dialog .modal-content .modal-body .row .col-xs-4 .row .input-group #auto_snapshot').val().trim();
        
        data.interval = $('#basicSettingModal .modal-dialog .modal-content .modal-body .row .col-xs-4 .row .input-group #interval').val().trim();
        data.auto_screen = tmpauto_screen;
        var int_auto_snapshot = parseInt(data.auto_snapshot);
        var int_interval = parseInt(data.interval);
        var regNumber = /^\d+$/
        if(!regNumber.test(data.auto_snapshot)) return popBy('#auto_snapshot',false,'截屏周期格式不对');
        else if(!(int_auto_snapshot >= 60 && int_auto_snapshot <= 300) && !(int_auto_snapshot === 0)) return popBy('#auto_snapshot',false,'截屏周期必须大于60小于300秒或等于0(不截屏)');
        if(!regNumber.test(data.interval)) return popBy('#interval',false,'更新周期格式不对');
        else if(int_interval < 30 || int_interval > 150) return popBy('#interval',false,'更新周期必须大于30小于150秒');
        if(isBoxes) {
            putDate = _.pick(data, 'debug', 'auto_snapshot', 'interval', 'auto_screen');
            var $ids = [];
            $(".boxChk:checked").each(function(i, o) {
                $ids.push($(o).val());
            })
            if(confirm("确认批量修改吗？")) {
                $.ajax({
                    type: "put",
                    url: "/devices",
                    data: JSON.stringify({ids:$ids,data:putDate}),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (json) {
                        if(json.status === 'success') {
                            $.each($ids,function(i,o) {
                                boxes.get(o).set(putDate);
                            })
                            $('#basicSettingModal').modal('hide');
                            $('#allBoxes').prop('checked', false);
                            $(".boxChk:checked").prop('checked', false);
                        }
                    },
                    error: function (err) {
                        alert(err.responseText)
                    }
                });
            }

        } else {
            var id = $("#basicSettingModal").attr('boxId');
            boxes.get(id).save(data).done(function(json,status,jqXHR) {
                $('#basicSettingModal').modal('hide');
                $('#allBoxes').prop('checked', false);
                $(".boxChk:checked").prop('checked', false);
            }).fail(function() {
                    alert('error');
                });
        }
    },

    loadNetSettings: function() {
        var $ids = [];
        $(".boxChk:checked").each(function(i, o) {
            $ids.push($(o).val());
        })
        if($ids.length == 0) return popBy("#loadNetSettings", false, '请先选择您要设置的播放器');
        $('#serviceInput').val('');
        $('#maskInput').val('');
        $('#ipInput').val('');
        $('#gwInput').val('');
        $('.netBoxes').hide();
        $('#netSettingModal').prop('isBoxes',true);
        $('#netSettingModal').modal('show');
    },

    saveNetSetting: function() {

        var isBoxes =  $("#netSettingModal").prop('isBoxes');
        var data = {},
            network = {};
        data.service = $('#serviceInput').val().trim();


        var regNet = /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/;
        if( data.service === '')  return popBy('#serviceInput',false,'服务器地址不能为空');
        var strRegex = "^((https|http|ftp|rtsp|mms)?://)"
            + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@
            + "(([0-9]{1,3}.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
            + "|" // 允许IP和DOMAIN（域名）
            + "([0-9a-z_!~*'()-]+.)*" // 域名- www.
            + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]." // 二级域名
            + "[a-z]{2,6})" // first level domain- .com or .museum
            + "(:[0-9]{1,5})?" // 端口- :80
            + "((/?)|" // a slash isn't required if there is no file name
            + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
        var re=new RegExp(strRegex);
        if(!re.test(data.service)) return popBy('#serviceInput',false,'服务器地址格式错误');
        if(isBoxes) {
            var $ids = [];
            $(".boxChk:checked").each(function(i, o) {
                $ids.push($(o).val());
            })
            data.ids=$ids;
            if(confirm("确认批量修改吗？")) {
                $.ajax({
                    type: "PUT",
                    url: "/command",
                    data: JSON.stringify(data),
                    contentType: "text/html; charset=utf-8"
                }).done(function (jqXHR) {
                    alert('命令已发送');
                    $('#netSettingModal').modal('hide');
                }).fail(function(a,b,c) {
                    console.log('error',a,b,c);
                });
            }

        } else {
            network.ip = $('#ipInput').val().trim();
            network.mask = $('#maskInput').val().trim();
            network.gw = $('#gwInput').val().trim();
            data.network = network;
            if(network.ip == ''&&network.mask == ''&&network.gw == ''){
            }else if(network.ip != ''&&network.mask != ''&&network.gw != ''){
                if(!regNet.test(network.ip) )  return popBy('#ipInput',false,'IP地址格式错误');
                if(!regNet.test(network.mask ) )  return popBy('#maskInput',false,'子网掩码格式错误');
                if(!regNet.test(network.gw) )  return popBy('#gwInput',false,'网关格式错误');
            }else{
                return alert('网络信息不能部分为空！');
            }
            var id = $("#netSettingModal").attr('boxId');
            data.ids=[];
            data.ids.push(id);
            $.ajax({
                type: "PUT",
                url: "/command",
                data: JSON.stringify(data),
                contentType: "text/html; charset=utf-8"
            }).done(function (jqXHR) {
                alert('命令已发送');
                $('#netSettingModal').modal('hide');
            }).fail(function(a,b,c) {
                console.log('error',a,b,c);
            });
           
        }
    },

    showBoxSchedule:function() {
        $('#boxSchedule').show();
        $('#boxScheduleBtn').hide();
    },

    selectAll: function(e) {
        if($('#allBoxes:checked').length > 0) {
            $('.boxChk').prop('checked', true);
        } else {
            $('.boxChk').prop('checked', false);
            $('#allBoxesSet').prop('checked', false);
            $('.boxChkSet').prop('checked', false);
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
    selectAllSet:function(e) {
        if($('#allBoxesSet:checked').length > 0) {
            $('.boxChk').prop('checked', true);
            $('#allBoxes').prop('checked', true);
            $('.boxChkSet').prop('checked', true);
        } else {
            $('.boxChkSet').prop('checked', false);
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
        if($(".boxChk:checked").length === $('.boxChk').length) {
            $('#allBoxes').prop('checked', true);
        } else {
            $('#allBoxes').prop('checked', false);
            $('#allBoxesSet').prop('checked', false);
           // $('.boxChk').parent('span').siblings('span .boxChkSet').prop('checked',false);
            $(e.target).parent('span').siblings('span').find('.boxChkSet').prop('checked',false);
            //console.log(e.target.parent('span'));

        }
    },
    selectOneSet: function(e) {
        if($(".boxChkSet:checked").length === $('.boxChkSet').length) {
            $('#allBoxesSet').prop('checked', true);
            $('.boxChkSet').closest('td').find('.boxChk').prop('checked',true)
            $('#allBoxes').prop('checked', true);
        } else {
            $('#allBoxesSet').prop('checked', false);
            $('#selectOneSet').prop('checked', false);
            $(".boxChkSet:checked").each(function(i,o){
                $(o).closest('td').find('.boxChk').prop('checked',true)

            })
        }
    },
    selectAllGroups:function(e) {
        if($('#allGroups:checked').length > 0) {
            $('.groupChk').prop('checked', true);
        } else {
            $('.groupChk').prop('checked', false);
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
    selectOneGroup:function(e) {
        if($(".groupChk:checked").length === $('.groupChk').length) {
            $('#allGroups').prop('checked', true);
        } else {
            $('#allGroups').prop('checked', false);
        }
    },
    sendCommand: function(command) {
        var ids = [];
        var content = {};
        $(".boxChk:checked").each(function(i, o) {
            ids.push($(o).val());
        })
        content = {command: command, boxes: ids};
        var msg = command == 'startup'?'开机命令仅适用于windows播放器，确认发送命令吗？':'确认发送命令吗？';
        if(confirm(msg)) {
            $.ajax({
                type: "PUT",
                url: "/command",
                data: JSON.stringify(content),
                contentType: "text/html; charset=utf-8"
            }).done(function (jqXHR) {
                $(".boxChk:checked").prop('checked', false);
                $('#allBoxes').prop('checked',false);
                alert('命令已发送');
            }).fail(function(a,b,c) {
                console.log('error',a,b,c);
            });
        }
    },

    sendSnapshot: function(e) {
        if($(".boxChk:checked").length == 0) return popBy("#snapshotCommand", false, '请先选择您要控制的播放器');
        this.sendCommand('snapshot');
    },
    sendScreenOn: function(e) {
        if($(".boxChk:checked").length == 0) return popBy("#screenOnCommand", false, '请先选择您要控制的播放器');
        this.sendCommand('screenon');
    },
    sendScreenOff: function(e) {
        if($(".boxChk:checked").length == 0) return popBy("#screenOffCommand", false, '请先选择您要控制的播放器');
        this.sendCommand('screenoff');
    },
    sendPowerOn: function(e) {
        if($(".boxChk:checked").length == 0) return popBy("#powerOnCommand", false, '请先选择您要控制的播放器');
        this.sendCommand('startup');
    },
    sendPowerOff: function(e) {
        if($(".boxChk:checked").length == 0) return popBy("#powerOffCommand", false, '请先选择您要控制的播放器');
        this.sendCommand('shutdown');
    },
    sendReboot: function(e) {
        if($(".boxChk:checked").length == 0) return popBy("#rebootCommand", false, '请先选择您要控制的播放器');
        this.sendCommand('reboot');
    },
    sendReset: function(e) {
        if($(".boxChk:checked").length == 0) return popBy("#resetCommand", false, '请先选择您要控制的播放器');
        this.sendCommand('reset');
    }

});
var boxesView = new BoxesView;
/** groupView **/

/** groupsView **/

function displaySetting() {
    var timeSetting = new TimeSetting();
    timeSetting.set({id:timeSetting.cid});
    timeSettings.add(timeSetting);
    var timeSettingItemView = new TimeSettingItemView({model:timeSetting});
    $('#timeSetting').append(timeSettingItemView.render().el);
}

function displaySettingScreen() {

    var timeSetting = new TimeSetting();
    timeSetting.set({id:timeSetting.cid});
    timeSettings.add(timeSetting);
    var timeSettingItemView = new TimeSettingItemView({model:timeSetting});

    $('#timeSettingScreen').append(timeSettingItemView.render().el);
}


/** TimeSetting Model**/
TimeSetting = Backbone.Model.extend({
    defaults: {
        from: '',
        to: '',
        week:"00000000"
    }
});
/** TimeSetting Collection**/
TimeSettings = Backbone.Collection.extend({
    model: TimeSetting
});
var timeSettings = new TimeSettings;
/** TimeSetting View**/
TimeSettingItemView = Backbone.View.extend({
    tagName:'div',
    template: _.template($('#timeSetting-template').html()),
    events:{
        'click .removeTimeSetting': 'removeTimeSetting'

    },
    initialize:function() {

    },
    render:function() {
        var data = this.model.toJSON();
        var btnCLass =[];
        for(var i =1; i < 8;i++) {
            if(data.week[i] === '0') {
                btnCLass[i] = "btn-default";
            } else {
                btnCLass[i] = "btn-primary";
            }
        }
        this.$el.addClass('alert alert-info')
        this.$el.html(this.template({id: data.id , from: data.from, to: data.to,
            btnClass1:btnCLass[1], btnClass2:btnCLass[2], btnClass3:btnCLass[3],
            btnClass4:btnCLass[4], btnClass5:btnCLass[5],btnClass6:btnCLass[6],
            btnClass7:btnCLass[7]}));
        return this;
    },
    
    removeTimeSetting:function() {
        timeSettings.remove(this.model);
        $(this.el).remove();
    }
});


