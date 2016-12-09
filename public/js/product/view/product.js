var categorys = new Categorys;

_.templateSettings = {
    interpolate : /\{\{(.+?)\}\}/g
};

categorys.fetch();

function getCategoryName(id){
    var categorysModels = categorys.models;

    var $name = '';

    for(var i = 0; i<categorysModels.length;i++){
        if(id == categorysModels[i].attributes._id){
            $name = categorysModels[i].attributes.name;
            return $name;
        }
    }
}

/*view start*/
var ProductItemView = Backbone.View.extend({
    tagName:'tr',
    events:{

        'mouseover': 'showOper',
        'mouseout': 'hideOper',

        'click .tdRemoveItem ':'clear',
        'click .tdEditItem ':'edit',
        'click .chkProductItem': 'selectProductItem'

    },
    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.remove);
    },
    render: function() {
        var data = this.model.toJSON();
        var categoryName = getCategoryName(data.category);
        data.id = data._id;
        data.name = data.name;
        data.category = categoryName;
        console.log(this.model)
        $(this.el).html( _.template($('#tmplProduct').html(), data));

        return this.el;
    },
    edit: function() {
        var tmpProduct = this.model.toJSON();
        $('#productCreate').find('h4').html('修改');

        $('#productCreate').prop('tmpProductId', tmpProduct._id);
        $('#nameInputCreate').val(tmpProduct.name);
        $("#selectCategory").val(tmpProduct.category);
        $('#descInputCreate').val(tmpProduct.description);

        console.log($('#productCreate').prop('tmpProductId'));
        $('#productCreate').modal('show');
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
                url: '/wes/product',
                contentType: 'application/json',
                data: JSON.stringify($ids),
            }).done(function(res){
                console.log(res);
            });
        }
    },
    selectProductItem : function() {
        if($('.chkProductItem:checked').length == $('.chkProductItem').length) $('#chkAllItem').prop('checked', true);
        else $('#chkAllItem').prop('checked', false);
    },
    showOper: function() {
        $(this.el).find('.productName').parent().removeClass("col-xs-10").addClass("col-xs-7");
        $(this.el).find('.productOper').show();
    },

    hideOper: function() {
        $(this.el).find('.productName').parent().removeClass("col-xs-7").addClass("col-xs-10");
        $(this.el).find('.productOper').hide();
    }

});

var ProductView = Backbone.View.extend({
    el:'#product',
    events:{
        'click #createBtn': function() {
            $('#productCreate').prop('tmpProductId', null);
            $('#productCreate').find('h4').html('新建');
            $('#nameInputCreate').val('');
            $('#descInputCreate').val('');
            $('#productCreate').modal('show');
        },
        'click #createProduct': 'createProduct',
        'click .sortByName': 'sortByName',
        'click .sortByStamp': 'sortByStamp',
        'click #chkAllItem': 'selectAllItem'
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

        var children = this.$('#selectCategory');
        categorys.fetch().done(function(models,status,jqXHR) {
            var tmpCategorys = categorys.filter(function() {
                return true;
            });
            tmpCategorys.reverse();
            $.each(tmpCategorys,function(i,o){
                children.append('<option value=' + o.get('_id')  + '>' + o.get('name') + '</option>');
            });
        });
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
            var view = new ProductItemView({model: o});
            $('#productArea').children('tbody').append(view.render());

        })
    },
    renderDesc:function(tmpProducts) {
        $.each(tmpProducts, function(i, o) {
            var view = new ProductItemView({model: o});
            $('#productArea').children('tbody').prepend(view.render());


        })
    },
    selectAllItem: function(e) {
        $('.chkProductItem').prop('checked', $('#chkAllItem').prop('checked'));
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
        var tmpProducts = products.sortBy(function (product) {
            return product.get(sortColNname.toLowerCase());
        });

        var query = $('#searchInput').val().trim();
        if(query !== '') {
            tmpProducts = tmpProducts.filter(function(product) {
                return product.toJSON().name.indexOf(query) > -1 ;
            });
        } else {
            tmpProducts = tmpProducts.filter(function() {
                return true;
            });
        }

        $('#chkAllItem').prop('checked', false);
        this.render(tmpProducts);
    },
    createProduct: function() {
        var tmpproductId = $('#productCreate').prop('tmpProductId');
        var productName = $('#nameInputCreate').val(),
            productDesc = $('#descInputCreate').val(),
            category = $('#selectCategory').val();
        console.log(category);
        var thisModel ;
        if(!tmpproductId) {
            thisModel = new Product({
                name:productName,
                category:category,
                description:productDesc});

            thisModel.save().done(function (json) {
                if (json.rtn === 0) {
                    location.reload();
                    $('#productCreate').modal('hide');
                    $('#nameInputCreate').val('');
                    $('#descInputCreate').val('');
                }
            });
        } else {
            var data = {};
            data._id = tmpproductId;
            data.name = productName;
            data.category = category;
            data.description = productDesc;
            $.ajax({
                type: "PUT",
                url: "/wes/product",
                data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (json) {
                    console.log(json);
                    if(json.rtn === 0) {
                        location.reload();
                        $('#productCreate').modal('hide');
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
var productView = new ProductView;

function delProduct() {
    var $ids = [];
    $.each($('.chkProductItem:checked'), function(i, o) {
        $ids.push($(o).val());
    });

    if($ids.length == 0) return popBy("#deleteBtn", false, '请先选择您要删除的类别');
    if(confirm("确认删除吗？")) {
        $.ajax({
            type: "DELETE",
            url: "/wes/product",
            data: JSON.stringify($ids),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
                console.log(json);
                if(json.rtn === 0) {
                    $.each($ids,function(i,o) {
                        var $temp = products.get(o);
                        products.remove($temp);
                    })
                    $(".chkProductItem:checked").parents('tr').remove();
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
function searchProducts() {
    var query = $('#searchInput').val().trim();
    var sortColNname = $('#productArea').find('.caret:visible').attr('sortColName') ?
        $('#productArea').find('.caret:visible').attr('sortColName') : 'stamp';
    var tmpProducts = products.sortBy(function (schedule) {
        return schedule.get(sortColNname);
    });
    if(query !== '') {
        tmpProducts = tmpProducts.filter(function(product) {
            return product.toJSON().name.indexOf(query) > -1 ;
        });
        productView.render(tmpProducts);
    } else {
        tmpProducts = tmpProducts.filter(function() {
            return true;
        });
        productView.render(tmpProducts);
    }

    $('#chkAllItem').prop('checked', false);
}
