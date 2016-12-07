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
        $(this.el).html( _.template($('#tmplDepartment').html(), data));

        return this.el;
    },
    edit: function() {
        var tmpDepartment = this.model.toJSON();
        $('#departmentCreate').find('h4').html('修改');

        $('#departmentCreate').prop('tmpDepartmentId', tmpDepartment._id);
        $('#nameInputCreate').val(tmpDepartment.name);
        $('#descInputCreate').val(tmpDepartment.description);

        console.log($('#departmentCreate').prop('tmpDepartmentId'));
        $('#departmentCreate').modal('show');
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
                url: '/wes/department',
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

var DepartmentView = Backbone.View.extend({
    el:'#department',
    events:{
        'click #createBtn': function() {
            $('#departmentCreate').prop('tmpDepartmentId', null);
            $('#departmentCreate').find('h4').html('新建');
            $('#nameInputCreate').val('');
            $('#descInputCreate').val('');
            $('#departmentCreate').modal('show');
        },
        'click #createDepartment': 'createDepartment',
        'click .sortByName': 'sortByName',
        'click .sortByStamp': 'sortByStamp',
        'click #chkAllItem': 'selectAllItem'
    },
    initialize: function() {
        var that = this;
        departments.fetch()
            .done(function(collection) {
                that.collection = departments;
                var tmpDepartments = departments.filter(function() {
                    return true;
                });
                that.render(tmpDepartments);
            })
            .fail(function(jqXHR) {
                if(jqXHR.status === '404') {
                    alert('请求失败');
                }
            });
    },

    render: function(tmpDepartments) {
        $('#mediaArea').children('tbody').empty();
        var $sortFlag = $('#mediaArea').find('.caret:visible').parents('.sortBy').hasClass('dropup');
        if(!$sortFlag) {
            this.renderDesc(tmpDepartments);
        } else {
            this.renderAsc(tmpDepartments);
        }
    },
    renderAsc:function(tmpDepartments) {
        $.each(tmpDepartments, function(i, o) {
            var view = new PlaylistItemView({model: o});
            $('#mediaArea').children('tbody').append(view.render());

        })
    },
    renderDesc:function(tmpDepartments) {
        $.each(tmpDepartments, function(i, o) {
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
        var tmpDepartments = departments.sortBy(function (department) {
            return department.get(sortColNname.toLowerCase());
        });

        var query = $('#searchInput').val().trim();
        if(query !== '') {
            tmpDepartments = tmpDepartments.filter(function(department) {
                return department.toJSON().name.indexOf(query) > -1 ;
            });
        } else {
            tmpDepartments = tmpDepartments.filter(function() {
                return true;
            });
        }

        $('#chkAllItem').prop('checked', false);
        this.render(tmpDepartments);
    },
    createDepartment: function() {
        var tmpdepartmentId = $('#departmentCreate').prop('tmpDepartmentId');
        var departmentName = $('#nameInputCreate').val(),
            departmentDesc = $('#descInputCreate').val();
        var thisModel ;
        console.log("########################");
        console.log(tmpdepartmentId);
        if(!tmpdepartmentId) {
            thisModel = new Department({
                name:departmentName,
                description:departmentDesc});

            thisModel.save().done(function (json) {
                if (json.rtn === 0) {
                    location.reload();
                    $('#departmentCreate').modal('hide');
                    $('#nameInputCreate').val('');
                    $('#descInputCreate').val('');
                }
            });
        } else {
            var data = {};
            data._id = tmpdepartmentId;
            data.name = departmentName;
            data.description = departmentDesc;
            $.ajax({
                type: "PUT",
                url: "/wes/department",
                data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (json) {
                    console.log(json);
                    if(json.rtn === 0) {
                        location.reload();
                        $('#departmentCreate').modal('hide');
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
var departmentView = new DepartmentView;

function delDepartment() {
    var $ids = [];
    $.each($('.chkMediaItem:checked'), function(i, o) {
        $ids.push($(o).val());
    });

    if($ids.length == 0) return popBy("#deleteBtn", false, '请先选择您要删除的播放列表');
    if(confirm("确认删除吗？??")) {
        $.ajax({
            type: "DELETE",
            url: "/wes/department",
            data: JSON.stringify($ids),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
                console.log(json);
                if(json.rtn === 0) {
                    $.each($ids,function(i,o) {
                        var $temp = departments.get(o);
                        departments.remove($temp);
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
function searchDepartments() {
    var query = $('#searchInput').val().trim();
    var sortColNname = $('#mediaArea').find('.caret:visible').attr('sortColName') ?
        $('#mediaArea').find('.caret:visible').attr('sortColName') : 'stamp';
    var tmpDepartments = departments.sortBy(function (schedule) {
        return schedule.get(sortColNname);
    });
    if(query !== '') {
        tmpDepartments = tmpDepartments.filter(function(department) {
            return department.toJSON().name.indexOf(query) > -1 ;
        });
        departmentView.render(tmpDepartments);
    } else {
        tmpDepartments = tmpDepartments.filter(function() {
            return true;
        });
        departmentView.render(tmpDepartments);
    }

    $('#chkAllItem').prop('checked', false);
}
