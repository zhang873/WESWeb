/**
 * Created by shgbit on 14-2-10.
 */

var categorys = new Categorys;
var products = new Products;
var users = new Users;
var customs = new Customs;

categorys.fetch();
products.fetch();
users.fetch();
customs.fetch();

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

function getUserName(id){
    var usersModels = users.models;
    var $name = '';
    for(var i = 0; i<usersModels.length;i++){
        if(id == usersModels[i].attributes._id){
            $name = usersModels[i].attributes.name;
            return $name;
        }
    }
}

function getCustomName(id){
    var customsModels = customs.models;
    var $name = '';
    for(var i = 0; i<customsModels.length;i++){
        if(id == customsModels[i].attributes._id){
            $name = customsModels[i].attributes.name;
            return $name;
        }
    }
}

function getProductName(id){
    var productsModels = products.models;
    var $name = '';
    for(var i = 0; i<productsModels.length;i++){
        if(id == productsModels[i].attributes._id){
            $name = productsModels[i].attributes.name;
            return $name;
        }
    }
}

ContractView = Backbone.View.extend({
    el: '#contractEdit',
    events: {
        'click #saveSalesBtn':'save',
    },

    initialize: function() {

        var that = this;
        var id = this.$el.attr('value');
        var userChildren = this.$('#selectUser');
        users.fetch().done(function(models,status,jqXHR) {
            var tmpUsers = users.filter(function() {
                return true;
            });
            tmpUsers.reverse();
            $.each(tmpUsers,function(i,o){
                userChildren.append('<option value=' + o.get('_id')  + '>' + o.get('name') + '</option>');
            });
        });

        var customChildren = this.$('#selectCustom');
        customs.fetch().done(function(models,status,jqXHR) {
            var tmpCustoms = customs.filter(function() {
                return true;
            });
            tmpCustoms.reverse();
            $.each(tmpCustoms,function(i,o){
                customChildren.append('<option value=' + o.get('_id')  + '>' + o.get('name') + '</option>');
            });
        });

        if (!id) {
            return;
        }

        var contract = new Contract({id: id});
        contract.fetch({success: function(model, response) {
            that.model = model;
            var data = model.toJSON();

            that.$('#saleNoTxt').val(data.contract_no);
            that.$('#saleDate').val(data.date);
            that.$('#selectUser').val(data.seller);
            that.$('#selectCustom').val(data.custom);
            that.$('#selectCurrency').val(data.currency);
            that.$('#saleAmountTxt').val(data.total);
            that.$('#paymentTxt').val(data.payment_provision);

            for (var i = 0; i < data.product.length; i++)
            {
                displayProduct(data.product[i].category, data.product[i].name)
            }

        }});

    },

    save:function(e,next) {
        var data = {};
        data.contract_no = $('#saleNoTxt').val();
        data.date = $('#saleDate').val();
        data.seller = $('#selectUser').val();
        data.custom = $('#selectCustom').val();
        data.currency = $('#selectCurrency').val();
        data.total = $('#saleAmountTxt').val();
        data.payment_provision = $('#paymentTxt').val();
        data.product = [];
        console.log($('#paymentTxt').val())

        //$('#contractEdit').find('input,textarea,select').attr('readonly',true)

        var products =$("#productSetting").children('div');
        $.each(products,function(i,dom) {
            var product = {};
            product.category = $(dom).find("#selectCategory").val();
            product.name = $(dom).find("#selectProduct").val();
            product.unit = $(dom).find("#unitTxt").val();
            product.number = $(dom).find("#numberTxt").val();
            product.price = $(dom).find("#priceTxt").val();
            product.sum = $(dom).find("#sumTxt").val();
            data.product.push(product);

            console.log(product.name);
        });

        console.log(data);

        if (!this.$el.attr('value')) {
            $.ajax({
                type: "POST",
                url: "/wes/sales",
                data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (json) {
                    console.log(json);
                    if (json.rtn === 0) {

                    }
                },
                error: function (err) {
                    console.log(err);
                }
            });
        }else {
            data._id = this.$el.attr('value');
            $.ajax({
                type: "PUT",
                url: "/wes/sales",
                data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (json) {
                    console.log(json);
                    if (json.rtn === 0) {

                    }
                },
                error: function (err) {
                    console.log(err);
                }
            });
        }

    },


});

var contractView = new ContractView();

///** ProductSetting Model**/
//ProductSetting = Backbone.Model.extend({
//    defaults: {
//        from: '',
//        to: '',
//        week:"00000000"
//    }
//});
///** ProductSetting Collection**/
//ProductSettings = Backbone.Collection.extend({
//    model: ProductSetting
//});
var productSettings = new ProductSettings;
/** ProductSetting View**/
ProductSettingItemView = Backbone.View.extend({
    tagName:'div',
    template: _.template($('#productSetting-template').html()),
    //option : '',
    events:{
        'click .removeProductSetting': 'removeProductSetting',
        'change .selectCategory' : 'onProductChange',
        'change .numberTxt' : 'onPriceChange',
        'change .priceTxt' : 'onPriceChange',
        'change .sumTxt' : 'onSumChange',
    },
    initialize:function() {
    },
    render:function(optCategory, optProduct) {
        this.$el.addClass('alert alert-info')
        this.$el.html(this.template({categoryOption: optCategory, productOption: optProduct}));
        return this;
    },

    removeProductSetting:function() {
        productSettings.remove(this.model);
        $(this.el).remove();
    },

    onProductChange: function () {
        var that = this;
        var category_id = this.$('#selectCategory').val();
        products.fetch().done(function (models, status, jqXHR) {
            var tmpProducts = products.filter(function (p) {
                return (p.get('category') == category_id);
            });

            tmpProducts.reverse();
            that.$('#selectProduct').empty();
            $.each(tmpProducts, function (i, o) {
                that.$('#selectProduct').append('<option value=' + o.get('_id') + '>' + o.get('name') + '</option>');
            });
        });
    },

    onPriceChange: function() {
        var number = this.$('#numberTxt').val();
        var price = this.$('#priceTxt').val();
        var sum = (parseFloat(number) * parseFloat(price)).toFixed(2);
        this.$('#sumTxt').val(sum);

        this.onSumChange();
    },

    onSumChange: function() {
        var products =$("#productSetting").children('div');
        var total = 0;
        $.each(products,function(i,dom) {
            var val = $(dom).find(".sumTxt").val();
            console.log(val);
            total += parseFloat(val);
        });
        console.log(total);
        $("#saleAmountTxt").val(total.toFixed(2))
    }
});

function displayProduct(category, product) {

    var optionCategory, optionProduct;
    categorys.fetch().done(function (models, status, jqXHR) {
        var tmpCategorys = categorys.filter(function () {
            return true;
        });

        tmpCategorys.reverse();
        $.each(tmpCategorys, function (i, o) {
            if (o.get('_id') == category) {
                optionCategory += '<option value="' + o.get('_id') + '" selected="selected">' + o.get('name') + '</option>';
            } else {
                optionCategory += '<option value=' + o.get('_id') + '>' + o.get('name') + '</option>';
            }
        });

        products.fetch().done(function (models, status, jqXHR) {
            var tmpProducts = products.filter(function (p) {
                if ((tmpCategorys) && (tmpCategorys[0]) && (p.get('category') == (category)?category:tmpCategorys[0].get('_id'))) {
                    return true;
                }else {
                    return false;
                }
            });

            tmpProducts.reverse();
            $.each(tmpProducts, function (i, o) {
                if (o.get('_id') == product) {
                    optionProduct += '<option value="' + o.get('_id') + '" selected="selected">' + o.get('name') + '</option>';
                } else {
                    optionProduct += '<option value=' + o.get('_id') + '>' + o.get('name') + '</option>';
                }

            });

            var productSetting = new ProductSetting();
            console.log(productSetting.cid);
            productSetting.set({id: productSetting.cid});
            productSettings.add(productSetting);
            var productSettingItemView = new ProductSettingItemView({model: productSetting});

            $('#productSetting').append(productSettingItemView.render(optionCategory, optionProduct).el);
        });

    });
}


//function categoryChange(selectProduct) {
//    console.log('#################### categoryChange');
//    console.log($('#selectCategory').val());
//    console.log($('#selectProduct').val());
//    console.log(selectProduct);
//}


///** LogisSetting Model**/
//LogisSetting = Backbone.Model.extend({
//    defaults: {
//        from: '',
//        to: '',
//        week:"00000000"
//    }
//});
///** LogisSetting Collection**/
//LogisSettings = Backbone.Collection.extend({
//    model: LogisSetting
//});
var logisSettings = new LogisSettings;
/** LogisSetting View**/
LogisSettingItemView = Backbone.View.extend({
    tagName:'div',
    template: _.template($('#logisSetting-template').html()),
    events:{
        'click .removeLogisSetting': 'removeLogisSetting',
        'change .priceLogisTxt': 'onPriceChange',
        'change .numberLogisTxt':'onNumChange',
        'change .tariffTxt' : 'onTariffChange',
        'change .saleTaxTxt' : 'onSaleTaxChange',
        'change .VATTxt' : 'onVATChange',

        'change .VATSumTxt' : 'onSumChange',
        'change .tariffSumTxt' : 'onSumChange',
        'change .saleTaxSumTxt' : 'onSumChange',
        'change .costLogisTxt' : 'onSumChange',
    },
    initialize:function() {

    },
    render:function( optProduct) {
        this.$el.addClass('alert alert-info')
        this.$el.html(this.template({productOption: optProduct}));
        return this;
    },

    removeLogisSetting:function() {
        logisSettings.remove(this.model);
        $(this.el).remove();
    },

    onPriceChange: function () {
        var number = this.$('#numberLogisTxt').val();
        var price = this.$('#priceLogisTxt').val();
        this.$('#costLogisTxt').val((parseFloat(number) * parseFloat(price)).toFixed(2));
        this.onSumChange();
    },

    onNumChange: function() {
        this.onTariffChange();
        this.onSaleTaxChange();
        this.onVATChange();
    },

    onTariffChange: function() {
        var number = this.$('#numberLogisTxt').val();
        var price = this.$('#tariffTxt').val();
        this.$('#tariffSumTxt').val((parseFloat(number) * parseFloat(price)).toFixed(2));
        this.onSumChange();

    },

    onSaleTaxChange: function() {
        var number = this.$('#numberLogisTxt').val();
        var price = this.$('#saleTaxTxt').val();
        this.$('#saleTaxSumTxt').val((parseFloat(number) * parseFloat(price)).toFixed(2));
        this.onSumChange();
    },

    onVATChange: function() {
        var number = this.$('#numberLogisTxt').val();
        var price = this.$('#VATTxt').val();
        this.$('#VATSumTxt').val((parseFloat(number) * parseFloat(price)).toFixed(2));
        this.onSumChange();
    },

    onSumChange: function() {
        var tariffSum = this.$('#tariffSumTxt').val();
        var saleTaxSum = this.$('#saleTaxSumTxt').val();
        var VATSum = this.$('#VATSumTxt').val();
        var costLogis = this.$('#costLogisTxt').val();
        this.$('#costTxt').val((parseFloat(tariffSum) + parseFloat(saleTaxSum) + parseFloat(VATSum) + parseFloat(costLogis)).toFixed(2));
    },
});
function displayLogistics() {
    var optionProduct = ''
    var products =$("#productSetting").children('div');
    $.each(products,function(i,dom) {
        var text = $(dom).find("#selectProduct option:selected").text();
        var id = $(dom).find("#selectProduct ").val();
        optionProduct += '<option value=' + id + '>' + text + '</option>';
    });

    var logisSetting = new LogisSetting();
    logisSetting.set({id:logisSetting.cid});
    logisSettings.add(logisSetting);
    var logisSettingItemView = new LogisSettingItemView({model:logisSetting});
    $('#logisticsSetting').append(logisSettingItemView.render(optionProduct).el);
}

///** Invoice Model**/
//Invoice = Backbone.Model.extend({
//    defaults: {
//        from: '',
//        to: '',
//        week:"00000000"
//    }
//});
///** Invoice Collection**/
//Invoices = Backbone.Collection.extend({
//    model: Invoice
//});
var invoices = new Invoices;
/** LogisSetting View**/
InvoiceItemView = Backbone.View.extend({
    tagName:'div',
    template: _.template($('#invoice-template').html()),
    events:{
        'click .removeInvoice': 'removeInvoice'

    },
    initialize:function() {

    },
    render:function() {
        var data = this.model.toJSON();

        var btnCLass =[];
        for(var i =1; i < 8;i++) {
            if(data.week[i] === '0') {
                btnCLass[i] = "btn-default";
            } else {
                btnCLass[i] = "btn-primary";
            }
        }
        this.$el.addClass('alert alert-info')
        this.$el.html(this.template({id: data.id , from: data.from, to: data.to,
            btnClass1:btnCLass[1], btnClass2:btnCLass[2], btnClass3:btnCLass[3],
            btnClass4:btnCLass[4], btnClass5:btnCLass[5],btnClass6:btnCLass[6],
            btnClass7:btnCLass[7]}));
        return this;
    },

    removeInvoice:function() {
        invoices.remove(this.model);
        $(this.el).remove();
    }
});
function displayInvoice() {

    var invoice = new Invoice();
    invoice.set({id:invoice.cid});
    logisSettings.add(invoice);
    var invoiceItemView = new InvoiceItemView({model:invoice});
    $('#invoiceSetting').append(invoiceItemView.render().el);
}

