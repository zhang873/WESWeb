_.templateSettings = {
    interpolate: /\{\{(.+?)\}\}/g
};
/** GroupView **/
GroupView = Backbone.View.extend({
    tagName: 'tr',
    template: _.template($('#group-template').html()),
    events: {
        'mouseover': 'showOperation',
        'mouseout': 'hideOperation',
        'click .editGroup'    : 'editGroup',
        'click .deleteGroup'    : 'deleteGroup'
    },

    initialize: function() {
        this.listenTo(this.model, 'destroy', this.remove);
        this.listenTo(this.model, 'remove', this.remove);
        this.listenTo(this.model, 'change', this.render);
    },
    render: function() {
        var data = this.model.toJSON();
        this.$el.html(this.template({id: data.id , name: data.name}));
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
    editGroup:function() {
        var data = this.model.toJSON();
        $('#nameInputGroupEdit').val(data.name);
        $('#groupNameEditModal').prop('groupId',data.id);
        $('#groupNameEditModal').prop('oldName',data.name);
        $('#groupNameEditModal').modal('show');
    },
    deleteGroup:function() {
        if(confirm("确认删除吗？")) {
            this.model.destroy({success: function(model, response) {
            }});

        }
    }
});

GroupSelectView = Backbone.View.extend({
    tagName: 'option',
    template:_.template($('#groupSelect-template').html()),
    initialize: function() {
        this.listenTo(this.model, 'destroy', this.remove);
        this.listenTo(this.model, 'remove', this.remove);
        this.listenTo(this.model, 'change', this.render);
    },
    render: function() {
        var data = this.model.toJSON();
        this.$el.html(this.template({ name: data.name}));
        this.$el.val(data.id);
        return this;
    }
});