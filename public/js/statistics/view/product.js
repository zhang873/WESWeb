/**
 * Created by xc.zhang on 2016/12/21.
 */
_.templateSettings = {
    interpolate : /\{\{(.+?)\}\}/g
};

var CategoryItemView = Backbone.View.extend({
    tagName:'tr',
    events: {
        'click .categoryChoice': 'selectOne',
    },
    initialize: function() {

    },

    render: function() {
        var data = this.model.toJSON();
        data.id = data._id;
        //console.log(this.model);
        $(this.el).html( _.template($('#category-template').html(), data));

        return this.el;
    },

    selectOne: function (e) {
        var that = this;
        var check = this.$('.categoryChoice:checked').length == 1? 'checked': '';

        $.each($('.productChoice'), function(i, o) {
            console.log($(o).prop('title'));
            console.log(that.$('.categoryChoice').val());
            if ($(o).prop('title') == that.$('.categoryChoice').val()) {
                $(o).prop('checked', check);
            }
            //console.log($(o).prop('name'));
        });
    }
});

var CategoryView = Backbone.View.extend({
    el:'#productModal',
    events: {
        'click #chkAllCategoryItem': 'selectAllCategoryItem'
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
        $('#category-list').children('tbody').empty();
        var $sortFlag = $('#category-list').find('.caret:visible').parents('.sortBy').hasClass('dropup');
        if(!$sortFlag) {
            this.renderDesc(tmpCategorys);
        } else {
            this.renderAsc(tmpCategorys);
        }
    },

    renderAsc:function(tmpCategorys) {
        $.each(tmpCategorys, function(i, o) {
            var view = new CategoryItemView({model: o});
            $('#category-list').children('tbody').append(view.render());
        })
    },
    renderDesc:function(tmpCategorys) {
        $.each(tmpCategorys, function(i, o) {
            var view = new CategoryItemView({model: o});
            $('#category-list').children('tbody').prepend(view.render());
        })
    },

    selectAllCategoryItem: function(e) {
        $('.categoryChoice').prop('checked', $('#chkAllCategoryItem').prop('checked'));
        $('.productChoice').prop('checked', $('#chkAllCategoryItem').prop('checked'));
        $('#chkAllProductItem').prop('checked', $('#chkAllCategoryItem').prop('checked'));
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

new CategoryView;




var ProductItemView = Backbone.View.extend({
    tagName:'tr',
    events: {

    },
    initialize: function() {

    },

    render: function() {
        var data = this.model.toJSON();
        data.id = data._id;
        console.log(this.model);
        $(this.el).html( _.template($('#product-template').html(), data));

        return this.el;
    },

});

var ProductView = Backbone.View.extend({
    el:'#productModal',
    events: {
        'click .productBtn': 'confirm',
        'click #chkAllProductItem': 'selectAllProductItem'
    },
    initialize: function() {

        var that = this;
        products.fetch()
            .done(function(collection) {
                that.collection = products;
                var tmpProducts = products.filter(function() {
                    return true;
                });
                that.render(tmpProducts);
            })
            .fail(function(jqXHR) {
                if(jqXHR.status === '404') {
                    alert('请求失败');
                }
            });
    },

    render: function(tmpProducts) {
        $('#product-list').children('tbody').empty();
        var $sortFlag = $('#product-list').find('.caret:visible').parents('.sortBy').hasClass('dropup');
        if(!$sortFlag) {
            this.renderDesc(tmpProducts);
        } else {
            this.renderAsc(tmpProducts);
        }
    },

    renderAsc:function(tmpProducts) {
        $.each(tmpProducts, function(i, o) {
            var view = new ProductItemView({model: o});
            $('#product-list').children('tbody').append(view.render());
        })
    },
    renderDesc:function(tmpProducts) {
        $.each(tmpProducts, function(i, o) {
            var view = new ProductItemView({model: o});
            $('#product-list').children('tbody').prepend(view.render());
        })
    },

    selectAllProductItem: function(e) {
        $('.productChoice').prop('checked', $('#chkAllProductItem').prop('checked'));
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
        $.each($('.productChoice:checked'), function(i, o) {
            $ids.push($(o).val());
            names += $(o).prop('name') + ' ';
        });
        console.log(names);

        $('#productsTxt').prop('selected_id', $ids);
        $('#productsTxt').val(names);

        $('#productModal').modal('hide');

    }

});


new ProductView;