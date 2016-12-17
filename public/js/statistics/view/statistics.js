_.templateSettings = {
    interpolate : /\{\{(.+?)\}\}/g
};

/*view start*/
var CategoryItemView = Backbone.View.extend({
    tagName:'tr',
    events:{

        'mouseover': 'showOper',
        'mouseout': 'hideOper',

        'click .tdRemoveItem ':'clear',
        'click .tdEditItem ':'edit',
        'click .chkCategoryItem': 'selectCategoryItem'

    },
    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.remove);
    },
    render: function() {
        var data = this.model.toJSON();
        data.id = data._id;
        data.name = data.name;
        console.log(this.model)
        $(this.el).html( _.template($('#tmplCategory').html(), data));

        return this.el;
    },
    edit: function() {
        var tmpCategory = this.model.toJSON();
        $('#categoryCreate').find('h4').html('修改');

        $('#categoryCreate').prop('tmpCategoryId', tmpCategory._id);
        $('#nameInputCreate').val(tmpCategory.name);
        $('#descInputCreate').val(tmpCategory.description);

        console.log($('#categoryCreate').prop('tmpCategoryId'));
        $('#categoryCreate').modal('show');
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
                url: '/wes/category',
                contentType: 'application/json',
                data: JSON.stringify($ids),
            }).done(function(res){
                console.log(res);
            });
        }
    },
    selectCategoryItem : function() {
        if($('.chkCategoryItem:checked').length == $('.chkCategoryItem').length) $('#chkAllItem').prop('checked', true);
        else $('#chkAllItem').prop('checked', false);
    },
    showOper: function() {
        $(this.el).find('.categoryName').parent().removeClass("col-xs-10").addClass("col-xs-7");
        $(this.el).find('.categoryOper').show();
    },

    hideOper: function() {
        $(this.el).find('.categoryName').parent().removeClass("col-xs-7").addClass("col-xs-10");
        $(this.el).find('.categoryOper').hide();
    }

});

var CategoryView = Backbone.View.extend({
    el:'#category',
    events:{
        'click #createBtn': function() {
            $('#categoryCreate').prop('tmpCategoryId', null);
            $('#categoryCreate').find('h4').html('新建');
            $('#nameInputCreate').val('');
            $('#descInputCreate').val('');
            $('#categoryCreate').modal('show');
        },
        'click #createCategory': 'createCategory',
        'click .sortByName': 'sortByName',
        'click .sortByStamp': 'sortByStamp',
        'click #chkAllItem': 'selectAllItem'
    },
    initialize: function() {
        var that = this;
        categorys.fetch()
            .done(function(collection) {
                that.collection = categorys;
                var tmpCategorys = categorys.filter(function() {
                    return true;
                });
                that.render(tmpCategorys);
            })
            .fail(function(jqXHR) {
                if(jqXHR.status === '404') {
                    alert('请求失败');
                }
            });
    },

    render: function(tmpCategorys) {
        $('#categoryArea').children('tbody').empty();
        var $sortFlag = $('#categoryArea').find('.caret:visible').parents('.sortBy').hasClass('dropup');
        if(!$sortFlag) {
            this.renderDesc(tmpCategorys);
        } else {
            this.renderAsc(tmpCategorys);
        }
    },
    renderAsc:function(tmpCategorys) {
        $.each(tmpCategorys, function(i, o) {
            var view = new CategoryItemView({model: o});
            $('#categoryArea').children('tbody').append(view.render());

        })
    },
    renderDesc:function(tmpCategorys) {
        $.each(tmpCategorys, function(i, o) {
            var view = new CategoryItemView({model: o});
            $('#categoryArea').children('tbody').prepend(view.render());


        })
    },
    selectAllItem: function(e) {
        $('.chkCategoryItem').prop('checked', $('#chkAllItem').prop('checked'));
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
        var tmpCategorys = categorys.sortBy(function (category) {
            return category.get(sortColNname.toLowerCase());
        });

        var query = $('#searchInput').val().trim();
        if(query !== '') {
            tmpCategorys = tmpCategorys.filter(function(category) {
                return category.toJSON().name.indexOf(query) > -1 ;
            });
        } else {
            tmpCategorys = tmpCategorys.filter(function() {
                return true;
            });
        }

        $('#chkAllItem').prop('checked', false);
        this.render(tmpCategorys);
    },
    createCategory: function() {
        var tmpcategoryId = $('#categoryCreate').prop('tmpCategoryId');
        var categoryName = $('#nameInputCreate').val(),
            categoryDesc = $('#descInputCreate').val();
        var thisModel ;
        if(!tmpcategoryId) {
            thisModel = new Category({
                name:categoryName,
                description:categoryDesc});

            thisModel.save().done(function (json) {
                if (json.rtn === 0) {
                    location.reload();
                    $('#categoryCreate').modal('hide');
                    $('#nameInputCreate').val('');
                    $('#descInputCreate').val('');
                }
            });
        } else {
            var data = {};
            data._id = tmpcategoryId;
            data.name = categoryName;
            data.description = categoryDesc;
            $.ajax({
                type: "PUT",
                url: "/wes/category",
                data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (json) {
                    console.log(json);
                    if(json.rtn === 0) {
                        location.reload();
                        $('#categoryCreate').modal('hide');
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
var categoryView = new CategoryView;

function showCustom() {
    $('#customModal').modal('show');
}
function searchCategorys() {
    var query = $('#searchInput').val().trim();
    var sortColNname = $('#categoryArea').find('.caret:visible').attr('sortColName') ?
        $('#categoryArea').find('.caret:visible').attr('sortColName') : 'stamp';
    var tmpCategorys = categorys.sortBy(function (schedule) {
        return schedule.get(sortColNname);
    });
    if(query !== '') {
        tmpCategorys = tmpCategorys.filter(function(category) {
            return category.toJSON().name.indexOf(query) > -1 ;
        });
        categoryView.render(tmpCategorys);
    } else {
        tmpCategorys = tmpCategorys.filter(function() {
            return true;
        });
        categoryView.render(tmpCategorys);
    }

    $('#chkAllItem').prop('checked', false);
}
