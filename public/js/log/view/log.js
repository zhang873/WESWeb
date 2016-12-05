var logs = new Logs;
_.templateSettings = {
    interpolate: /\{\{(.+?)\}\}/g
};

LogView = Backbone.View.extend({
    tagName: 'tr',

    template: _.template($('#log-template').html()),

    events: {
        'mouseover': 'showOperation',
        'mouseout': 'hideOperation',
        'click .clear':'deleteLog'

    },

    initialize: function() {
        this.listenTo(this.model, 'remove', this.remove);
    },
    showOperation: function() {
        $(this.el).find('.name').parent().removeClass("col-xs-10").addClass("col-xs-6");
        $(this.el).find('.operation').show();
    },

    hideOperation: function() {
        $(this.el).find('.name').parent().removeClass("col-xs-6").addClass("col-xs-10");
        $(this.el).find('.operation').hide();
    },
    render: function() {
        var data = this.model.toJSON();
        this.$el.html(this.template({name: data.name , size: data.size, mtime: data.mtime}));
        return this;
    },
    deleteLog:function() {
        var that = this;
        var ids = [];
        ids.push(this.model.toJSON().name);
        if(confirm("确认删除吗？")) {
            $.ajax({
                type: "DELETE",
                url: "/log",
                data: JSON.stringify(ids),
                contentType: "application/json; charset=utf-8",
                success: function (data, message,jqXHR) {
                    logs.remove(that.model);

                },
                error: function (datta,jqXHR,message) {

                    alert('未知错误，请联系管理员');

                }
            });
        }
    }

});

LogsView = Backbone.View.extend({
    el: '#log',
    events: {
        'click .log': 'selectOne',
        'click #allLogs': 'selectAll',
        'click #deleteLogs': 'deleteLogs',
        'click .sortByName': 'sortByName',
        'click .sortBySize': 'sortBySize',
        'click .sortByMtime': 'sortByMtime',
        'input #searchInput': 'searchLogs',
        'prototypechange #searchInput': 'searchLogs'
    },
    sortByName: function() {
        this.sortBy('Name');
    },
    sortBySize: function() {
        this.sortBy('Size');
    },
    sortByMtime: function() {
        this.sortBy('Mtime');
    },
    searchLogs: function() {
        var query = $('#searchInput').val().trim();
        var sortColNname = $('#log').find('.caret:visible').attr('sortColName') ?
            $('#log').find('.caret:visible').attr('sortColName') : 'atime';
        var xLogs = logs.sortBy(function (log) {
            return log.get(sortColNname.toLowerCase());
        });

        if(query !== '') {
            xLogs = xLogs.filter(function(log) {
                return log.get('name').indexOf(query) > -1
            });
            this.render(xLogs);
        } else {
            xLogs = xLogs.filter(function(log) {
                return true
            });
            this.render(xLogs);
        }

    },
    deleteLogs:function() {
        var ids = [];
        if($(".log:checked").length == 0) {
            return popBy("#deleteLogs", false, '请先选择您要删除的日志');
        }
        $(".log:checked").each(function(i, o) {
            ids.push($(o).val());
        })
        if(confirm("确认删除吗？")) {
            $.ajax({
                type: "DELETE",
                url: "/log",
                data: JSON.stringify(ids),
                contentType: "application/json; charset=utf-8",
                success: function (data, message,jqXHR) {
                    var xLogs = logs.filter(function (log) {
                        return _.contains(ids,log.toJSON().name);
                    });
                    logs.remove(xLogs);
                    $('#allLogs').prop('checked',false);
                },
                error: function (datta,jqXHR,message) {
                    alert('未知错误，请联系管理员');
                }
            });
        }
    },


    initialize: function() {
        this.listenTo(logs, 'add', this.addOne);
        logs.fetch();
    },
    render: function(users) {
        $('#log-list').children('tbody').empty();

        var $sortFlag = $('#log-list').find('.caret:visible').parents('.sortBy').hasClass('dropup');
        if(!$sortFlag) {
            this.renderDesc(users);
        } else {
            this.renderAsc(users);
        }
        $('#allLogs').prop('checked',false);

    },

    renderAsc:function(logs) {
        $.each(logs, function(i, o) {
            var view = new LogView({model: o});
            $('#log-list').children('tbody').append(view.render().el);

        })
    },
    renderDesc:function(logs) {
        $.each(logs, function(i, o) {
            var view = new LogView({model: o});
            $('#log-list').children('tbody').prepend(view.render().el);

        })
    },

    addOne: function(model, collection) {
        var view = new LogView({model:model});
        $('#log-list').children('tbody').append(view.render().el);
    },


    sortBy: function(sortColName) {
        var target ='.sortBy'+sortColName;
        $(target).find('.caret').show();
        $(target).siblings().removeClass('dropup').find('.caret').hide();
        if(!$(target).hasClass('dropup')) {
            $(target).addClass('dropup');
        } else {
            $(target).removeClass('dropup');
        }

        var xLogs = logs.sortBy(function (log) {
            return log.get(sortColName.toLowerCase());
        });

        var query = $('#searchInput').val().trim();

        if(query !== '') {
            xLogs = xLogs.filter(function(log) {
                return log.get('action').indexOf(query) > -1 || log.get('source').indexOf(query) > -1 || log.get('msg').indexOf(query) > -1;
            });
        } else {
            xLogs = xLogs.filter(function(log) {
                return true
            });
        }

        this.render(xLogs);
    },
    selectAll: function(e) {
        if($('#allLogs:checked').length > 0) {
            $('.log').prop('checked', true);
        } else {
            $('.log').prop('checked', false);
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
        if($(".log:checked").length === $('.log').length) {
            $('#allLogs').prop('checked', true);
        } else {
            $('#allLogs').prop('checked', false);
        }
    }
});

logsView = new LogsView;