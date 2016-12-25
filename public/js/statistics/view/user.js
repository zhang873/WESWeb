/**
 * Created by xc.zhang on 2016/12/21.
 */
_.templateSettings = {
    interpolate : /\{\{(.+?)\}\}/g
};

var DepartmentItemView = Backbone.View.extend({
    tagName:'tr',
    events: {
        'click .departmentChoice': 'selectOne',
    },
    initialize: function() {

    },

    render: function() {
        var data = this.model.toJSON();
        data.id = data._id;
        console.log(this.model);
        $(this.el).html( _.template($('#department-template').html(), data));

        return this.el;
    },

    selectOne: function (e) {
        var that = this;
        var check = this.$('.departmentChoice:checked').length == 1? 'checked': '';

        $.each($('.userChoice'), function(i, o) {
            console.log($(o).prop('title'));
            console.log(that.$('.departmentChoice').val());
            if ($(o).prop('title') == that.$('.departmentChoice').val()) {
                $(o).prop('checked', check);
            }
            //console.log($(o).prop('name'));
        });
    }
});

var DepartmentView = Backbone.View.extend({
    el:'#userModal',
    events: {
        'click #chkAllDepartmentItem': 'selectAllDepartmentItem'
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
        $('#department-list').children('tbody').empty();
        var $sortFlag = $('#department-list').find('.caret:visible').parents('.sortBy').hasClass('dropup');
        if(!$sortFlag) {
            this.renderDesc(tmpDepartments);
        } else {
            this.renderAsc(tmpDepartments);
        }
    },

    renderAsc:function(tmpDepartments) {
        $.each(tmpDepartments, function(i, o) {
            var view = new DepartmentItemView({model: o});
            $('#department-list').children('tbody').append(view.render());
        })
    },
    renderDesc:function(tmpDepartments) {
        $.each(tmpDepartments, function(i, o) {
            var view = new DepartmentItemView({model: o});
            $('#department-list').children('tbody').prepend(view.render());
        })
    },

    selectAllDepartmentItem: function(e) {
        $('.departmentChoice').prop('checked', $('#chkAllDepartmentItem').prop('checked'));
        $('.userChoice').prop('checked', $('#chkAllDepartmentItem').prop('checked'));
        $('#chkAllUserItem').prop('checked', $('#chkAllDepartmentItem').prop('checked'));
        if (e && e.stopPropagation) {
            //支持W3C
            e.stopPropagation();
        }
        else {
            //IE的方式
            window.event.cancelBubble = true;
        }
    },



});

new DepartmentView;




var UserItemView = Backbone.View.extend({
    tagName:'tr',
    events: {

    },
    initialize: function() {

    },

    render: function() {
        var data = this.model.toJSON();
        data.id = data._id;
        //console.log(this.model);
        $(this.el).html( _.template($('#user-template').html(), data));

        return this.el;
    },

});

var UserView = Backbone.View.extend({
    el:'#userModal',
    events: {
        'click .userBtn': 'confirm',
        'click #chkAllUserItem': 'selectAllUserItem'
    },
    initialize: function() {

        var that = this;
        users.fetch()
            .done(function(collection) {
                that.collection = users;
                var tmpUsers = users.filter(function() {
                    return true;
                });
                that.render(tmpUsers);
            })
            .fail(function(jqXHR) {
                if(jqXHR.status === '404') {
                    alert('请求失败');
                }
            });
    },

    render: function(tmpUsers) {
        $('#user-list').children('tbody').empty();
        var $sortFlag = $('#user-list').find('.caret:visible').parents('.sortBy').hasClass('dropup');
        if(!$sortFlag) {
            this.renderDesc(tmpUsers);
        } else {
            this.renderAsc(tmpUsers);
        }
    },

    renderAsc:function(tmpUsers) {
        $.each(tmpUsers, function(i, o) {
            var view = new UserItemView({model: o});
            $('#user-list').children('tbody').append(view.render());
        })
    },
    renderDesc:function(tmpUsers) {
        $.each(tmpUsers, function(i, o) {
            var view = new UserItemView({model: o});
            $('#user-list').children('tbody').prepend(view.render());
        })
    },

    selectAllUserItem: function(e) {
        $('.userChoice').prop('checked', $('#chkAllUserItem').prop('checked'));
        if (e && e.stopPropagation) {
            //支持W3C
            e.stopPropagation();
        }
        else {
            //IE的方式
            window.event.cancelBubble = true;
        }

    },

    confirm: function () {
        var $ids = [];
        var names = '';
        $.each($('.userChoice:checked'), function(i, o) {
            $ids.push($(o).val());
            names += $(o).prop('name') + ' ';
        });
        console.log(names);

        $('#usersTxt').prop('selected_id', $ids);
        $('#usersTxt').val(names);

        $('#userModal').modal('hide');

    }

});


new UserView;