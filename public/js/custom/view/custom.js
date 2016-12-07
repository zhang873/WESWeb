_.templateSettings = {
    interpolate : /\{\{(.+?)\}\}/g
};

/*view start*/
var PlaylistItemView = Backbone.View.extend({
    tagName:'tr',
    events:{

        'mouseover': 'showOper',
        'mouseout': 'hideOper',

        'click .tdRemoveItem ':'clear',
        'click .tdEditItem ':'edit',
        'click .tdCopyItem ':'copy',
        'click .chkMediaItem': 'selectMediaItem'

    },
    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.remove);
    },
    render: function() {
        var data = this.model.toJSON();
        console.log(this.model)
        data.id = data._id;
        data.name = data.name;
        $(this.el).html( _.template($('#tmplCustom').html(), data));

        return this.el;
    },
    edit: function() {
        var tmpCustom = this.model.toJSON();
        $('#customCreate').find('h4').html('修改');

        $('#customCreate').prop('tmpCustomId', tmpCustom._id);
        $('#nameInputCreate').val(tmpCustom.name);
        $('#descInputCreate').val(tmpCustom.description);

        console.log($('#customCreate').prop('tmpCustomId'));
        $('#customCreate').modal('show');
    },
    clear: function() {
        if(confirm("确认删除吗？")) {
            var data = this.model.toJSON();
            this.model.destroy();
            console.log(data);
            var $ids = [];
            $ids.push(data._id);
            $.ajax({
                type:'DELETE',
                url: '/wes/custom',
                contentType: 'application/json',
                data: JSON.stringify($ids),
            }).done(function(res){
                console.log(res);
            });
        }
    },
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

var CustomView = Backbone.View.extend({
    el:'#custom',
    events:{
        'click #createBtn': function() {
            $('#customCreate').prop('tmpCustomId', null);
            $('#customCreate').find('h4').html('新建');
            $('#nameInputCreate').val('');
            $('#descInputCreate').val('');
            $('#customCreate').modal('show');
        },
        'click #createCustom': 'createCustom',
        'click .sortByName': 'sortByName',
        'click .sortByStamp': 'sortByStamp',
        'click #chkAllItem': 'selectAllItem'
    },
    initialize: function() {
        var that = this;
        customs.fetch()
            .done(function(collection) {
                that.collection = customs;
                var tmpCustoms = customs.filter(function() {
                    return true;
                });
                that.render(tmpCustoms);
            })
            .fail(function(jqXHR) {
                if(jqXHR.status === '404') {
                    alert('请求失败');
                }
            });
    },

    render: function(tmpCustoms) {
        $('#mediaArea').children('tbody').empty();
        var $sortFlag = $('#mediaArea').find('.caret:visible').parents('.sortBy').hasClass('dropup');
        if(!$sortFlag) {
            this.renderDesc(tmpCustoms);
        } else {
            this.renderAsc(tmpCustoms);
        }
    },
    renderAsc:function(tmpCustoms) {
        $.each(tmpCustoms, function(i, o) {
            var view = new PlaylistItemView({model: o});
            $('#mediaArea').children('tbody').append(view.render());

        })
    },
    renderDesc:function(tmpCustoms) {
        $.each(tmpCustoms, function(i, o) {
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
        var tmpCustoms = customs.sortBy(function (custom) {
            return custom.get(sortColNname.toLowerCase());
        });

        var query = $('#searchInput').val().trim();
        if(query !== '') {
            tmpCustoms = tmpCustoms.filter(function(custom) {
                return custom.toJSON().name.indexOf(query) > -1 ;
            });
        } else {
            tmpCustoms = tmpCustoms.filter(function() {
                return true;
            });
        }

        $('#chkAllItem').prop('checked', false);
        this.render(tmpCustoms);
    },
    createCustom: function() {
        var tmpcustomId = $('#customCreate').prop('tmpCustomId');
        var customName = $('#nameInputCreate').val(),
            customDesc = $('#descInputCreate').val();
        var thisModel ;
        console.log("########################");
        console.log(tmpcustomId);
        if(!tmpcustomId) {
            thisModel = new Custom({
                name:customName,
                description:customDesc});

            thisModel.save().done(function (json) {
                if (json.rtn === 0) {
                    location.reload();
                    $('#customCreate').modal('hide');
                    $('#nameInputCreate').val('');
                    $('#descInputCreate').val('');
                }
            });
        } else {
            var data = {};
            data._id = tmpcustomId;
            data.name = customName;
            data.description = customDesc;
            $.ajax({
                type: "PUT",
                url: "/wes/custom",
                data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (json) {
                    console.log(json);
                    if(json.rtn === 0) {
                        location.reload();
                        $('#customCreate').modal('hide');
                        $('#nameInputCreate').val('');
                        $('#descInputCreate').val('');
                    }
                },
                error: function (err) {
                    console.log(err);
                }
            });
        }
    },

});

/*view end*/
var customView = new CustomView;

function delCustom() {
    var $ids = [];
    $.each($('.chkMediaItem:checked'), function(i, o) {
        $ids.push($(o).val());
    });

    if($ids.length == 0) return popBy("#deleteBtn", false, '请先选择您要删除的播放列表');
    if(confirm("确认删除吗？??")) {
        $.ajax({
            type: "DELETE",
            url: "/wes/custom",
            data: JSON.stringify($ids),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
                console.log(json);
                if(json.rtn === 0) {
                    $.each($ids,function(i,o) {
                        var $temp = customs.get(o);
                        customs.remove($temp);
                    })
                    $(".chkMediaItem:checked").parents('tr').remove();
                }
            },
            error: function (err) {
                console.log(err);
                //alert("错误:" + err)
            }
        });
    }
    //location.reload();
}
function searchCustoms() {
    var query = $('#searchInput').val().trim();
    var sortColNname = $('#mediaArea').find('.caret:visible').attr('sortColName') ?
        $('#mediaArea').find('.caret:visible').attr('sortColName') : 'stamp';
    var tmpCustoms = customs.sortBy(function (schedule) {
        return schedule.get(sortColNname);
    });
    if(query !== '') {
        tmpCustoms = tmpCustoms.filter(function(custom) {
            return custom.toJSON().name.indexOf(query) > -1 ;
        });
        customView.render(tmpCustoms);
    } else {
        tmpCustoms = tmpCustoms.filter(function() {
            return true;
        });
        customView.render(tmpCustoms);
    }

    $('#chkAllItem').prop('checked', false);
}
