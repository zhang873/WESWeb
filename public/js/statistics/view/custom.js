/**
 * Created by xc.zhang on 2016/12/21.
 */
_.templateSettings = {
    interpolate : /\{\{(.+?)\}\}/g
};

var CustomItemView = Backbone.View.extend({
    tagName:'tr',
    events: {

    },
    initialize: function() {

    },

    render: function() {
        var data = this.model.toJSON();
        data.id = data._id;
        //console.log(this.model);
        $(this.el).html( _.template($('#custom-template').html(), data));

        return this.el;
    }

});

var CustomView = Backbone.View.extend({
    el:'#customModal',
    events: {
        'click .customBtn': 'confirm',
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
        $('#custom-list').children('tbody').empty();
        var $sortFlag = $('#custom-list').find('.caret:visible').parents('.sortBy').hasClass('dropup');
        if(!$sortFlag) {
            this.renderDesc(tmpCustoms);
        } else {
            this.renderAsc(tmpCustoms);
        }
    },

    renderAsc:function(tmpCustoms) {
        $.each(tmpCustoms, function(i, o) {
            var view = new CustomItemView({model: o});
            $('#custom-list').children('tbody').append(view.render());
        })
    },
    renderDesc:function(tmpCustoms) {
        $.each(tmpCustoms, function(i, o) {
            var view = new CustomItemView({model: o});
            $('#custom-list').children('tbody').prepend(view.render());
        })
    },

    selectAllItem: function(e) {
        $('.customChoice').prop('checked', $('#chkAllItem').prop('checked'));
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
        $.each($('.customChoice:checked'), function(i, o) {
            $ids.push($(o).val());
            names += $(o).prop('name') + ' ';
        });
        console.log(names);

        $('#customsTxt').prop('selected_id', $ids);
        $('#customsTxt').val(names);

        $('#customModal').modal('hide');

    }

});

new CustomView;