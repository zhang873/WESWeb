/** Model **/

_.templateSettings = {
    interpolate: /\{\{(.+?)\}\}/g
};
TaskUnionUser = Backbone.Model.extend({
    initialize: function(){
        
    },
    defaults:{
        departId:'',
        taskId:''
    }
});
TaskUnionUsers = Backbone.Collection.extend({
    url:'/taskunionuser',
    model:TaskUnionUser
});
var users = new Users;
var taskunionusers = new TaskUnionUsers;
taskunionusers.fetch();
users.fetch();

function getUsername(taskid){
    var tuuModels = taskunionusers.models;
    var userModels = users.models;
    var departid = '';
    var $usersname = '';
    for(var i = 0; i<tuuModels.length; i++){
        if(taskid == tuuModels[i].attributes.taskId){
            departid = tuuModels[i].attributes.departId;
            break;
        }
    }
    for(var j= 0;j<userModels.length;j++){
        if(departid==userModels[j].attributes.departId){
            console.log(userModels[j].attributes.name)
            $username=userModels[j].attributes.name;
            return $username;
        }
    }
    return $usersname;
}

Task = Backbone.Model.extend({
    urlRoot: '/task',
    initialize: function() {
    },
    defaults: {
        id: null,
        stamp:'',
        schedule: '',
        scheduleName: '',
        boxes: [],
        isCancelled: false
    }
});
/** Colection **/
Tasks = Backbone.Collection.extend({
    url: '/tasks',
    model: Task
});
var tasks = new Tasks;

/** View **/
TasksView = Backbone.View.extend({
    el: '#task',

    events: {
        'click .task': 'selectOne',
        'click #allTasks': 'selectAll',
        'click #deleteTasksBtn': 'deleteTasks',
        'click .sortByStamp': 'sortByStamp',
        'click .sortByScheduleName': 'sortByScheduleName',
        'click .sortByStatus': 'sortByStatus',
        'input #searchInput': 'searchTasks',
        'prototypechange #searchInput': 'searchTasks'
    },

    initialize: function() {
        var that =  this;
        tasks.fetch({success: function(collection, response) {
                var tmptasks = tasks.filter(function() {
                    return true;
                });
                that.render(tmptasks);
            }, error: function(t,jqXHR,c) {
                if(jqXHR.status !== 404) {
                    alert('未知错误，请联系管理员');
                }
            }
        });
    },
    sortByStamp:function() {
        this.sortBy('Stamp');
    },

    sortByScheduleName:function() {
        this.sortBy('ScheduleName');
    },

    sortByStatus:function() {
        this.sortBy('Status');
    },
    sortBy: function(sortColNname) {
        var taget ='.sortBy'+ sortColNname;
        $(taget).find('.caret').show();
        $(taget).siblings().removeClass('dropup').find('.caret').hide();
        if(!$(taget).hasClass('dropup')) {
            $(taget).addClass('dropup');
        } else {
            $(taget).removeClass('dropup');
        }
        var tmpTasks = tasks.sortBy(function (task) {
            return task.get(sortColNname.toLowerCase());
        });

        var query = $('#searchInput').val().trim();
        if(query !== '') {
            tmpTasks = tmpTasks.filter(function(task) {
                return task.toJSON().scheduleName.indexOf(query) > -1 ;
            });
        } else {
            tmpTasks = tmpTasks.filter(function() {
                return true;
            });
        }
        this.render(tmpTasks);
    },
    searchTasks:function() {
        var query = $('#searchInput').val().trim();
        var sortColNname = $('#tasks').find('.caret:visible').attr('sortColName') ?
            $('#tasks').find('.caret:visible').attr('sortColName') : 'stamp';
        var tmpTasks = tasks.sortBy(function (task) {
            return task.get(sortColNname.toLowerCase());
        });
        if(query !== '') {
            tmpTasks = tmpTasks.filter(function(task) {
                return task.toJSON().scheduleName.indexOf(query) > -1 ;
            });
            this.render(tmpTasks);
        } else {
            tmpTasks = tmpTasks.filter(function(task) {
                return true;
            });
            this.render(tmpTasks);
        }

    },

//    render: function(tmptasks) {
//        $.each(tmptasks, function(i, o) {
//            var view = new TaskView({model: o});
//            $('#tasks').children('tbody').append(view.render().el);
//
//        });
//    },
    render: function(tmptasks) {
        $('#tasks').children('tbody').empty();
        var $sortFlag = $('#tasks').find('.caret:visible').parents('.sortBy').hasClass('dropup');
        if(!$sortFlag) {
            this.renderDesc(tmptasks);
        } else {
            this.renderAsc(tmptasks);
        }
        $('#allTasks').prop('checked',false);

    },
    renderAsc:function(tmptasks) {
        $.each(tmptasks, function(i, o) {
            var view = new TaskView({model: o});
            $('#tasks').children('tbody').append(view.render().el);

        });
    },
    renderDesc:function(tmptasks) {
        $.each(tmptasks, function(i, o) {
            var view = new TaskView({model: o});
            $('#tasks').children('tbody').prepend(view.render().el);

        });
    },
    selectAll: function(e) {
        if($('#allTasks:checked').length > 0) {
            $('.task').prop('checked', true);
        } else {
            $('.task').prop('checked', false);
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
        if($(".task:checked").length === $('.task').length) {
            $('#allTasks').prop('checked', true);
        } else {
            $('#allTasks').prop('checked', false);
        }
    },
    deleteTasks:function() {
        var ids = [];
//        var isvalidate = true;
        if($(".task:checked").length == 0) {
            return popBy("#deleteTasksBtn", false, '请先选择您要删除的任务');
        }
        $(".task:checked").each(function(i, o) {
//            var tmpModel = tasks.get($(o).val());
//            if(tmpModel.toJSON().isCancelled === false) {
//                isvalidate = false;
//                return ;
//            }
            ids.push($(o).val());
        })
//        if(!isvalidate) return alert('你选中的任务中有未取消的，无法执行删除');

        if(confirm("确认删除吗？")) {
            $.ajax({
                type: "DELETE",
                url: "/tasks",
                data: JSON.stringify(ids),
                contentType: "application/json; charset=utf-8",
                success: function (data, message,jqXHR) {
                    if(jqXHR.status === 200) {
                        $.each(ids,function(i,o) {
                            var tempTask = tasks.get(o);
                            tasks.remove(tempTask);
                        })
                        $(".task:checked").parents('tr').remove();
                        $('#allTasks').prop('checked', false);
                    }
                },
                error: function (datta,jqXHR,message) {
                    if(jqXHR.status === 400) {
                        alert('未知错误，请联系管理员');
                    } else if(jqXHR.status === 404) {
                        alert('部分任务未找到，无法删除')
                    }
//                    else if(jqXHR.status === 423) {
//                        alert('有任务未被取消，无法删除')
//                    }
                }
            });
        }
    }
});


TaskView = Backbone.View.extend({
    tagName: 'tr',
    template: _.template($('#task-Template').html()),
    events: {
        'mouseover': 'showOperation',
        'mouseout': 'hideOperation',
        'click .cancel':'cancelTask',
        'click .clear':'deleteTask',
        'click .detail':'showDetailModal'
    },

    initialize: function() {
        _.bindAll(this,'render');
        this.model.bind('change',this.render);
        this.listenTo(this.model, 'destroy', this.remove);
    },

    showDetailModal: function() {
        $.get('/task/'+ this.model.get('id') +'/boxes', function(data,message,jqXHR) {
            var boxes = data;
            var html ='';
            _.each(boxes, function(o, i) {
                html += String.format($('#box-template').html(), o.id, o.name, o.alias ? o.alias :'');
            })
            $('#box').find('tbody').html(html);
            $('#tastDetailModal').modal('show');
        })
    },

    render: function() {
        var data = this.model.toJSON();
        data.userName = getUsername(data.id);
    	if(!data.userName)data.userName=$.cookie('name');
        data.stamp = new moment(parseInt(data.stamp)).lang('zh-cn').from();
        this.$el.html(this.template({id: data.id , stamp: data.stamp, scheduleName: data.scheduleName,username:data.userName,
            isCancelled: data.isCancelled ?'<font color="gray"> 已取消</font>' :'<font color="red"> 已发布</font>' }));
        if(data.isCancelled) this.$el.find('.cancel').remove();

        return this;
    },
    showOperation: function() {
        $(this.el).find('.stamp').parent().removeClass("col-xs-10").addClass("col-xs-6");
        $(this.el).find('.operation').show();
    },

    hideOperation: function() {
        $(this.el).find('.stamp').parent().removeClass("col-xs-6").addClass("col-xs-10");
        $(this.el).find('.operation').hide();
    },
    cancelTask:function() {
        var isCancelled = this.model.toJSON().isCancelled;
        if(confirm("确认取消任务吗？")) {
            this.model.save({isCancelled:!isCancelled})
                .done(function() {
                })
                .error(function(){alert('未知错误，请联系管理员')});
        }

    },
    deleteTask:function() {
        var data = this.model.toJSON();
//        if(!data.isCancelled) return alert('该任务未取消，无法删除');
        if(confirm("确认删除吗？")) {
            this.model.destroy();
        }
    }
});

String.format = function() {
    if (arguments.length == 0)
        return null;

    var str = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
        var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
        str = str.replace(re, arguments[i]);
    }

    return str;
}

var tasksView = new TasksView;
//var tasksView = new TasksView;


