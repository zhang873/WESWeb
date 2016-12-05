_.templateSettings = {
    interpolate : /\{\{(.+?)\}\}/g
};


//var users = new Users;


//PlaylistUnionUser = Backbone.Model.extend({
//    initialize: function() {
//    },
//    defaults: {
//        playlistId: '',
//        departId:''
//    }
//});
//PlaylistUnionUsers = Backbone.Collection.extend({
//    url:'/playlistunionuser',
//    model: PlaylistUnionUser
//});
//var playlistunionusers = new PlaylistUnionUsers;
//playlistunionusers.fetch();
//users.fetch();

//function getUsername(playlistid){
//    var puuModels=playlistunionusers.models;
//    var userModels = users.models;
//    var departid='';
//    var $username='';
//    for(var i = 0; i<puuModels.length;i++){
//        if(playlistid==puuModels[i].attributes.playlistId){
//            departid = puuModels[i].attributes.departId;
//            break;
//        }
//    }
//    for(var j=0;j<userModels.length;j++){
//        if(departid==userModels[j].attributes.departId){
//            $username=userModels[j].attributes.name;
//            return $username;
//        }
//    }
//    return $username;
//}
//
//function getSize(data){
//    if(data){
//        var datasize = parseInt(data);
//        var sizenum = filesize(datasize, {base: 2}).toUpperCase();
//        return sizenum;
//    }else{
//        return "0B";
//    }
//
//}

/*view start*/
var PlaylistItemView = Backbone.View.extend({
    tagName:'tr',
    events:{

        'mouseover': 'showOper',
        'mouseout': 'hideOper',

        'click .tdRemoveItem ':'clear',

        'click .tdCopyItem ':'copy',
        'click .chkMediaItem': 'selectMediaItem'

    },
    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.remove);
    },
    render: function() {
        var data = this.model.toJSON();
        //var data = this.model.attributes.sales;
        console.log(this.model)
        data.id = data._id;
        data.date = data.date;
        data.contract_no = data.contract_no;
        data.custom = data.custom;
        data.total = data.total;
        //data.stamp = new moment(parseInt(data.stamp)).lang('zh-cn').from();
        //data.userName = getUsername(data.id);
        //if(!data.userName) data.userName='admin';
        //data.size = getSize(data.size);
        $(this.el).html( _.template($('#tmplPlaylist').html(), data));

        return this.el;
    },
    clear: function() {
        if(confirm("确认删除吗？")) {
            this.model.destroy();
        }
    },
    //copy: function() {
    //    var id = this.model.get('id');
    //    $.post('/contract/copy/' + id, {stamp:Date.now()})
    //        .done(function(data) {
    //            var duplicate = new Playlist(data);
    //            playlists.add(duplicate);
    //            var itemView = new PlaylistItemView({model:duplicate});
    //            $('#mediaArea tbody').prepend(itemView.render());
    //        })
    //        .fail(function(jqXHR) {
    //            if(jqXHR.status === 404) {
    //                alert('提交有误，找不到对应的排期');
    //            } else {
    //                alert('未知错误，请联系管理员');
    //            }
    //        });
    //},
    selectMediaItem : function() {
        if($('.chkMediaItem:checked').length == $('.chkMediaItem').length) $('#chkAllItem').prop('checked', true);
        else $('#chkAllItem').prop('checked', false);
    },
    showOper: function() {
        $(this.el).find('.playlistName').parent().removeClass("col-xs-10").addClass("col-xs-7");
        $(this.el).find('.playlistOper').show();
    },

    hideOper: function() {
        $(this.el).find('.playlistName').parent().removeClass("col-xs-7").addClass("col-xs-10");
        $(this.el).find('.playlistOper').hide();
    }

});

var ContractView = Backbone.View.extend({
    el:'#mediaArea',
    events:{
        'click .sortByName': 'sortByName',
        'click .sortByStamp': 'sortByStamp',
        'click #chkAllItem': 'selectAllItem'
    },
    initialize: function() {
        //console.log(playlists);
        var that = this;
        contracts.fetch()
            .done(function(collection) {
                that.collection = contracts;
                var tmpContracts = contracts.filter(function() {
                    return true;
                });
                that.render(tmpContracts);
            })
            .fail(function(jqXHR) {
                if(jqXHR.status === '404') {
                    alert('请求失败');
                }
            });
    },

    render: function(tmpContracts) {
        $(this.el).children('tbody').empty();
        var $sortFlag = $('#mediaArea').find('.caret:visible').parents('.sortBy').hasClass('dropup');
        if(!$sortFlag) {
            this.renderDesc(tmpContracts);
        } else {
            this.renderAsc(tmpContracts);
        }
    },
    renderAsc:function(tmpContracts) {
        $.each(tmpContracts, function(i, o) {
            var view = new PlaylistItemView({model: o});
            $('#mediaArea').children('tbody').append(view.render());

        })
    },
    renderDesc:function(tmpContracts) {
        $.each(tmpContracts, function(i, o) {
            var view = new PlaylistItemView({model: o});
            $('#mediaArea').children('tbody').prepend(view.render());


        })
    },
    selectAllItem: function(e) {
        $('.chkMediaItem').prop('checked', $('#chkAllItem').prop('checked'));
        if (e && e.stopPropagation) {
            //支持W3C
            e.stopPropagation();
        }
        else {
            //IE的方式
            window.event.cancelBubble = true;
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
        var tmpContracts = contracts.sortBy(function (contract) {
            return contract.get(sortColNname.toLowerCase());
        });

        var query = $('#searchInput').val().trim();
        if(query !== '') {
            tmpContracts = tmpContracts.filter(function(contract) {
                return contract.toJSON().name.indexOf(query) > -1 ;
            });
        } else {
            tmpContracts = tmpContracts.filter(function() {
                return true;
            });
        }

        $('#chkAllItem').prop('checked', false);
        this.render(tmpContracts);
    }
});

/*view end*/
var contractView = new ContractView;

function delPlaylists() {
    var $ids = [];
    $.each($('.chkMediaItem:checked'), function(i, o) {
        $ids.push($(o).val());
    });

    if($ids.length == 0) return popBy("#deleteBtn", false, '请先选择您要删除的播放列表');
    if(confirm("确认删除吗？")) {
        $.ajax({
            type: "DELETE",
            url: "/playlists",
            data: JSON.stringify($ids),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
                if(json.status === 'success') {
                    $.each($ids,function(i,o) {
                        var $temp = playlists.get(o);
                        playlists.remove($temp);
                    })
                    $(".chkMediaItem:checked").parents('tr').remove();
                }
            },
            error: function (err) {
                alert(err.responseText)
            }
        });
    }
    //location.reload();
}
function searchPlaylists() {
    var query = $('#searchInput').val().trim();
    var sortColNname = $('#mediaArea').find('.caret:visible').attr('sortColName') ?
        $('#mediaArea').find('.caret:visible').attr('sortColName') : 'stamp';
    var tmpPlaylists = playlists.sortBy(function (schedule) {
        return schedule.get(sortColNname);
    });
    if(query !== '') {
        tmpPlaylists = tmpPlaylists.filter(function(playlist) {
            return playlist.toJSON().name.indexOf(query) > -1 ;
        });
        playlistView.render(tmpPlaylists);
    } else {
        tmpPlaylists = tmpPlaylists.filter(function() {
            return true;
        });
        playlistView.render(tmpPlaylists);
    }

    $('#chkAllItem').prop('checked', false);
}
