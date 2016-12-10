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
        //'change #selectMonthday':'monthday',
        'click #save':'save',
        //'click #saveAndPublish': 'saveAndPub',
        //'click #everyday': 'everyday',
        //'click #everymonth': 'everymonth',
        //'click #everyweek': 'everyweek',
        //'click #once': 'once'
    },

    initialize: function() {

        var that = this;

        var userChildren = this.$('#selectUser');
        console.log(userChildren);
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

    },

    save:function(e,next) {
        var weekdays =$("#productSetting").children('div');
        $.each(weekdays,function(i,o) {
            console.log(i);
            console.log(o);
        });
    },


});

var contractView = new ContractView();

/** ProductSetting Model**/
ProductSetting = Backbone.Model.extend({
    defaults: {
        from: '',
        to: '',
        week:"00000000"
    }
});
/** ProductSetting Collection**/
ProductSettings = Backbone.Collection.extend({
    model: ProductSetting
});
var productSettings = new ProductSettings;
/** ProductSetting View**/
ProductSettingItemView = Backbone.View.extend({
    tagName:'div',
    template: _.template($('#productSetting-template').html()),
    //option : '',
    events:{
        'click .removeProductSetting': 'removeProductSetting',
        'change .selectCategory' : 'onChange'
    },
    initialize:function() {
        //this.listenTo($('#selectCategory'), 'change', this.onChange);
    },
    render:function(optCategory, optProduct) {
        this.$el.html(this.template({categoryOption: optCategory, productOption: optProduct}));
        return this;
    },

    removeProductSetting:function() {
        productSettings.remove(this.model);
        $(this.el).remove();
    },

    onChange: function () {
        var that = this;
        var category_id = $('#selectCategory').val();
        $('#productSetting').empty();
        products.fetch().done(function (models, status, jqXHR) {
            var tmpProducts = products.filter(function (p) {
                if (p.get('category') == category_id) {
                    return true;
                }else {
                    return false;
                }
            });

            tmpProducts.reverse();
            var optionProduct = '';
            $.each(tmpProducts, function (i, o) {
                optionProduct += '<option value=' + o.get('_id') + '>' + o.get('name') + '</option>';
            });
            $('#productSetting').append(that.render('', optionProduct).el);
            //this.find('selectProduct').append(optionProduct);
        });
    }
});

function displayProduct() {

    var optionCategory, optionProduct;
    categorys.fetch().done(function (models, status, jqXHR) {
        var tmpCategorys = categorys.filter(function () {
            return true;
        });

        tmpCategorys.reverse();
        $.each(tmpCategorys, function (i, o) {
            optionCategory += '<option value=' + o.get('_id') + '>' + o.get('name') + '</option>';
        });

        products.fetch().done(function (models, status, jqXHR) {
            var tmpProducts = products.filter(function (p) {
                if ((tmpCategorys) && (tmpCategorys[0]) && (p.get('category') == tmpCategorys[0].get('_id'))) {
                    return true;
                }else {
                    return false;
                }
            });

            tmpProducts.reverse();
            $.each(tmpProducts, function (i, o) {
                optionProduct += '<option value=' + o.get('_id') + '>' + o.get('name') + '</option>';
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


function categoryChange(selectProduct) {
    console.log('#################### categoryChange');
    console.log($('#selectCategory').val());
    console.log($('#selectProduct').val());
    console.log(selectProduct);
}


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
        'click .removeLogisSetting': 'removeLogisSetting'

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

    removeLogisSetting:function() {
        logisSettings.remove(this.model);
        $(this.el).remove();
    }
});
function displayLogistics() {

    var logisSetting = new LogisSetting();
    logisSetting.set({id:logisSetting.cid});
    logisSettings.add(logisSetting);
    var logisSettingItemView = new LogisSettingItemView({model:logisSetting});
    $('#logisticsSetting').append(logisSettingItemView.render().el);
}

/** Invoice Model**/
Invoice = Backbone.Model.extend({
    defaults: {
        from: '',
        to: '',
        week:"00000000"
    }
});
/** LogisSetting Collection**/
Invoices = Backbone.Collection.extend({
    model: Invoice
});
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

