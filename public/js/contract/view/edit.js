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
    events:{
        'click .removeProductSetting': 'removeProductSetting'

    },
    initialize:function() {
        //var categoryChildren = $('#productSetting-template').find('selectCategory');
        //var categoryChildren = this.$('#selectCategory');
        //console.log(categoryChildren);
        //categorys.fetch().done(function(models,status,jqXHR) {
        //    var tmpCategorys = categorys.filter(function() {
        //        return true;
        //    });
        //    console.log(tmpCategorys);
        //    tmpCategorys.reverse();
        //    $.each(tmpCategorys,function(i,o){
        //        categoryChildren.append('<option value=' + o.get('_id')  + '>' + o.get('name') + '</option>');
        //    });
        //});
    },
    render:function() {
        //var data = this.model.toJSON();
        //var btnCLass =[];
        //for(var i =1; i < 8;i++) {
        //    if(data.week[i] === '0') {
        //        btnCLass[i] = "btn-default";
        //    } else {
        //        btnCLass[i] = "btn-primary";
        //    }
        //}
        //this.$el.addClass('alert alert-info')
        //this.$el.html(this.template({id: data.id , from: data.from, to: data.to,
        //    btnClass1:btnCLass[1], btnClass2:btnCLass[2], btnClass3:btnCLass[3],
        //    btnClass4:btnCLass[4], btnClass5:btnCLass[5],btnClass6:btnCLass[6],
        //    btnClass7:btnCLass[7],
        //    categoryOption: '1111111111'}));
        //return this;

        //var temp = _.template($('#productSetting-template').html(), {categoryOption: '<option value="CNY">人民币</option>'});
        //console.log(temp);
        this.$el.html(this.template({categoryOption: '111'}));
        return this;
    },

    removeProductSetting:function() {
        productSettings.remove(this.model);
        $(this.el).remove();
    }
});

function displayProduct() {
    var productSetting = new ProductSetting();
    productSetting.set({id:productSetting.cid});
    productSettings.add(productSetting);
    var productSettingItemView = new ProductSettingItemView({model:productSetting});
    $('#productSetting').append(productSettingItemView.render().el);


}

function categoryChange() {

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

