_.templateSettings = {
    interpolate : /\{\{(.+?)\}\}/g
};

var ProductListItemView = Backbone.View.extend({
    tagName:'tr',
    events: {

    },
    initialize: function() {

    },

    render: function() {
        var data = this.model//.toJSON();

        if (!data) {
            return;
        }
        $(this.el).html( _.template($('#product-list-template').html(), data[0]))
        return this.el;
    }

});

var ProductListView = Backbone.View.extend({
    el:'#statistics',
    events: {
    },
    initialize: function() {

    },

    render: function(tmpProducts) {
        $('#productArea').children('tbody').empty();
        var $sortFlag = $('#productArea').find('.caret:visible').parents('.sortBy').hasClass('dropup');
        if(!$sortFlag) {
            this.renderDesc(tmpProducts);
        } else {
            this.renderAsc(tmpProducts);
        }
    },

    renderAsc:function(tmpProducts) {
        $.each(tmpProducts, function(i, o) {
            var view = new ProductListItemView({model: o});
            $('#productArea').children('tbody').append(view.render());
        })
    },
    renderDesc:function(tmpProducts) {
        $.each(tmpProducts, function(i, o) {
            var view = new ProductListItemView({model: o});
            $('#productArea').children('tbody').prepend(view.render());
        })
    },


});

function showCustom() {
    var selected_id = $('#customsTxt').prop('selected_id');
    console.log(selected_id);
    $('#customModal').modal('show');
}

function showUser() {
    var selected_id = $('#usersTxt').prop('selected_id');
    console.log(selected_id);
    $('#userModal').modal('show');
}

function showProduct() {
    var selected_id = $('#productsTxt').prop('selected_id');
    console.log(selected_id);
    $('#productModal').modal('show');
}

function search() {

    var limit = {};
    if ($('#startDate').val()){
        limit.startDate = $('#startDate').val();
    }
    if ($('#endDate').val()){
        limit.endDate = $('#endDate').val();
    }
    if ($('#customsTxt').prop('selected_id')){
        limit.customs = $('#customsTxt').prop('selected_id');
    }
    if ($('#usersTxt').prop('selected_id')){
        limit.users = $('#usersTxt').prop('selected_id');
    }
    if ($('#productsTxt').prop('selected_id')){
        limit.products = $('#productsTxt').prop('selected_id');
    }

    console.log(limit);

    $.ajax({
        type: "POST",
        url: "/wes/statistics",
        data: JSON.stringify(limit),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (json) {
            console.log(json);

            if (json.rtn == 0) {
                $('#saleTxt').val(json.total);
                $('#profitTxt').val(json.profit);
                $('#balanceTxt').val(json.balance);

                productView = new ProductListView();
                productView.render(json.products);
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}