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
        'click #save':'save',
    },

    initialize: function() {

        var that = this;
        var id = this.$el.attr('value');
        var userChildren = that.$('#selectUser');
        users.fetch().done(function(models,status,jqXHR) {
            var tmpUsers = users.filter(function() {
                return true;
            });
            tmpUsers.reverse();
            $.each(tmpUsers,function(i,o){
                userChildren.append('<option value=' + o.get('_id')  + '>' + o.get('name') + '</option>');
            });

            var customChildren = that.$('#selectCustom');
            customs.fetch().done(function(models,status,jqXHR) {
                var tmpCustoms = customs.filter(function() {
                    return true;
                });
                tmpCustoms.reverse();
                $.each(tmpCustoms,function(i,o){
                    customChildren.append('<option value=' + o.get('_id')  + '>' + o.get('name') + '</option>');
                });

                if (id) {
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
                        that.$('#receivablesTxt').val(data.total);
                        that.$('#paymentTxt').val(data.payment_provision);

                        that.$('#totalCostTxt').val(data.total_cost);
                        that.$('#costDisplayTxt').val(data.total_cost);
                        that.$('#totalReceivedTxt').val(data.total_received);
                        that.$('#balanceTxt').val(data.balance);
                        that.$('#profitTxt').val(data.profit);
                        that.$('#deadlineDate').val(data.deadline);

                        for (var i = 0; i < data.product.length; i++)
                        {
                            displayProduct(data.product[i])
                        }

                        for (var i = 0; i < data.logistics.length; i++)
                        {
                            displayLogistics(data.logistics[i], data.product)
                        }

                        for (var i = 0; i < data.invoice.length; i++)
                        {
                            displayInvoice(data.invoice[i])
                        }

                        for (var i = 0; i < data.payment.length; i++)
                        {
                            displayPayment(data.payment[i])
                        }

                    }});
                }
            });
        });
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
        data.total_cost = $('#totalCostTxt').val();
        data.total_received = $('#totalReceivedTxt').val();
        data.balance = $('#balanceTxt').val();
        data.profit = $('#profitTxt').val();
        data.deadline = $('#deadlineDate').val();
        data.product = [];
        data.logistics = [];
        data.invoice = [];
        data.payment = [];

        var products =$("#productSetting").children('div');
        $.each(products,function(i,dom) {
            var product = {};
            product.category = $(dom).find("#selectCategory").val();
            product.id = $(dom).find("#selectProduct").val();
            product.name = $(dom).find("#selectProduct option:selected").text();
            product.unit = $(dom).find("#unitTxt").val();
            product.number = $(dom).find("#numberTxt").val();
            product.price = $(dom).find("#priceTxt").val();
            product.sum = $(dom).find("#sumTxt").val();
            data.product.push(product);
        });

        var logistics =$("#logisticsSetting").children('div');
        $.each(logistics,function(i,dom) {
            var logis = {};
            logis.date = $(dom).find("#logisDate").val();
            logis.product = $(dom).find("#selectProductLogis").val();
            logis.number = $(dom).find("#numberLogisTxt").val();
            logis.price = $(dom).find("#priceLogisTxt").val();
            logis.sale_tax_rate = $(dom).find("#saleTaxRateTxt").val();
            logis.sale_tax = $(dom).find("#saleTaxTxt").val();
            logis.sale_tax_sum = $(dom).find("#saleTaxSumTxt").val();
            logis.cost = $(dom).find("#costLogisTxt").val();
            logis.tariff_rate = $(dom).find("#tariffRateTxt").val();
            logis.tariff = $(dom).find("#tariffTxt").val();
            logis.tariff_sum = $(dom).find("#tariffSumTxt").val();
            logis.bg_price = $(dom).find("#bgPriceTxt").val();
            logis.vat_rate = $(dom).find("#VATRateTxt").val();
            logis.vat = $(dom).find("#VATTxt").val();
            logis.vat_sum = $(dom).find("#VATSumTxt").val();
            logis.total_cost = $(dom).find("#costTxt").val();

            data.logistics.push(logis);
        });

        var invoice =$("#invoiceSetting").children('div');
        $.each(invoice,function(i,dom) {
            var inv = {};
            inv.date = $(dom).find("#invoiceDate").val();
            inv.no_start = $(dom).find("#invoiceNoStartTxt").val();
            inv.no_end = $(dom).find("#invoiceNoEndTxt").val();

            data.invoice.push(inv);
        });

        var payment =$("#paymentSetting").children('div');
        $.each(payment,function(i,dom) {
            var p = {};
            p.date = $(dom).find("#paymentDate").val();
            p.receive = $(dom).find("#receivedTxt").val();
            p.method = $(dom).find("#selectPaymentMethod").val();
            p.bank = $(dom).find("#bankTxt").val();

            data.payment.push(p);
        });

        if (!this.$el.attr('value')) {
            data.belong = $.cookie('token');
            $.ajax({
                type: "POST",
                url: "/wes/sales",
                data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (json) {
                    if (json.rtn === 0) {
                        location.href = '/contract';
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
                    if (json.rtn === 0) {
                        location.href = '/contract';
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
    render:function(data) {
        this.$el.addClass('alert alert-info')
        this.$el.html(this.template(data));
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
            total += parseFloat(val);
        });
        $("#saleAmountTxt").val(total.toFixed(2));
        $("#receivablesTxt").val(total.toFixed(2))

        calculateBalance();
    }
});

function displayNewProduct() {

    var data = {};
    data.unit = '';
    data.number = '0';
    data.price = '0';
    data.sum = '0';
    displayProduct(data)

}

function displayProduct(product) {

    var optionCategory, optionProduct;
    categorys.fetch().done(function (models, status, jqXHR) {
        var tmpCategorys = categorys.filter(function () {
            return true;
        });

        tmpCategorys.reverse();
        optionCategory = '';
        $.each(tmpCategorys, function (i, o) {
            if ((product.category) && o.get('_id') == product.category) {
                optionCategory += '<option value="' + o.get('_id') + '" selected="selected">' + o.get('name') + '</option>';
            } else {
                optionCategory += '<option value=' + o.get('_id') + '>' + o.get('name') + '</option>';
            }
        });

        products.fetch().done(function (models, status, jqXHR) {
            var category_id = (product.category)? (product.category):tmpCategorys[0].get('_id');
            var tmpProducts = products.filter(function (p) {
                return (p.get('category') == category_id);
            });

            tmpProducts.reverse();
            optionProduct = '';
            $.each(tmpProducts, function (i, o) {
                if ((product.id) && o.get('_id') == product.id) {
                    optionProduct += '<option value="' + o.get('_id') + '" selected="selected">' + o.get('name') + '</option>';
                } else {
                    optionProduct += '<option value=' + o.get('_id') + '>' + o.get('name') + '</option>';
                }

            });

            var productSetting = new ProductSetting();
            productSetting.set({id: productSetting.cid});
            productSettings.add(productSetting);
            var productSettingItemView = new ProductSettingItemView({model: productSetting});

            var data = product;
            data.optionCategory = optionCategory;
            data.optionProduct = optionProduct;
            $('#productSetting').append(productSettingItemView.render(data).el);
        });

    });
}

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
        'change #costTxt' : 'onCostChange',
    },
    initialize:function() {

    },
    render:function(data) {
        this.$el.addClass('alert alert-info')
        this.$el.html(this.template(data));
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
        calculateBalance();
    },

    onCostChange : function () {
        calculateBalance();
    },
});

function displayNewLogistics() {

    var data = {};
    data.date = '';
    data.number = '0';
    data.price = '0';
    data.sale_tax_rate = '0';
    data.sale_tax = '0';
    data.sale_tax_sum = '0';
    data.cost = '0';
    data.tariff_rate = '0';
    data.tariff = '0';
    data.tariff_sum = '0';
    data.bg_price = '0';
    data.vat_rate = '0';
    data.vat = '0';
    data.vat_sum = '0';
    data.total_cost = '0';

    var products = [];
    var productSetting =$("#productSetting").children('div');
    $.each(productSetting,function(i,dom) {
        var product = {};
        product.name = $(dom).find("#selectProduct option:selected").text();
        product.id =$(dom).find("#selectProduct").val();
        products.push(product);
    });
    displayLogistics(data, products)

}

function displayLogistics(data, products) {
    var optionProduct = '';
    $.each(products,function(i,o) {
        var text = o.name;//$(dom).find("#selectProduct option:selected").text();
        var id = o.id;//$(dom).find("#selectProduct").val();
        if ((data.product) && data.product == id) {
            optionProduct += '<option value="' + id + '" selected="selected">' + text + '</option>';
        } else {
            optionProduct += '<option value=' + id + '>' + text + '</option>';
        }
    });
    data.productOption = optionProduct;
    var logisSetting = new LogisSetting();
    logisSetting.set({id:logisSetting.cid});
    logisSettings.add(logisSetting);
    var logisSettingItemView = new LogisSettingItemView({model:logisSetting});
    $('#logisticsSetting').append(logisSettingItemView.render(data).el);
}

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
    render:function(data) {
        this.$el.addClass('alert alert-info')
        this.$el.html(this.template(data));
        return this;
    },

    removeInvoice:function() {
        invoices.remove(this.model);
        $(this.el).remove();
    }
});

function displayNewInvoice() {

    var data = {};
    data.date = '';
    data.no_start = '';
    data.no_end = '';
    displayInvoice(data)
}

function displayInvoice(data) {

    var invoice = new Invoice();
    invoice.set({id:invoice.cid});
    invoices.add(invoice);
    var invoiceItemView = new InvoiceItemView({model:invoice});
    $('#invoiceSetting').append(invoiceItemView.render(data).el);
}

var payments = new Payments;
/** LogisSetting View**/
PaymentItemView = Backbone.View.extend({
    tagName:'div',
    template: _.template($('#payment-template').html()),
    events:{
        'click .removePayment': 'removePayment',
        'change #receivedTxt' : 'onReceivedChange',
    },
    initialize:function() {

    },
    render:function(data) {
        this.$el.addClass('alert alert-info')
        this.$el.html(this.template(data));
        return this;
    },

    removePayment:function() {
        payments.remove(this.model);
        $(this.el).remove();
    },

    onReceivedChange:function() {
        var payments =$("#paymentSetting").children('div');
        var total = 0;
        $.each(payments,function(i,dom) {
            var val = $(dom).find("#receivedTxt").val();
            total += parseFloat(val);
        });
        $("#totalReceivedTxt").val(total.toFixed(2));

        calculateBalance();
    }
});

function displayNewPayment() {

    var data = {};
    data.date = '';
    data.receive = '0';
    data.method = '';
    data.bank = '';
    displayPayment(data)
}

function displayPayment(data) {
    var optionPayment = '';
    if (data.method == 'TT') {
        optionPayment += '<option value="TT" selected="selected">TT</option>';
    } else {
        optionPayment += '<option value="TT">TT</option>';
    }
    if (data.method == 'CASH') {
        optionPayment += '<option value="CASH" selected="selected">现金</option>';
    } else {
        optionPayment += '<option value="CASH">现金</option>';
    }
    if (data.method == 'BA') {
        optionPayment += '<option value="BA" selected="selected">承兑</option>';
    } else {
        optionPayment += '<option value="BA">承兑</option>';
    }
    if (data.method == 'LC') {
        optionPayment += '<option value="LC" selected="selected">LC</option>';
    } else {
        optionPayment += '<option value="LC">LC</option>';
    }

    data.optionPayment = optionPayment;

    var payment = new Payment();
    payment.set({id:payment.cid});
    payments.add(payment);
    var paymentItemView = new PaymentItemView({model:payment});
    $('#paymentSetting').append(paymentItemView.render(data).el);
}

function calculateBalance() {

    var saleAmount = parseFloat($("#saleAmountTxt").val());
    var balance = saleAmount - parseFloat($("#totalReceivedTxt").val());
    $("#balanceTxt").val(balance.toFixed(2));

    var logistics =$("#logisticsSetting").children('div');
    var total_cost = 0;
    $.each(logistics,function(i,dom) {
        var val = $(dom).find("#costTxt").val();
        total_cost += parseFloat(val);
    });
    $("#totalCostTxt").val(total_cost.toFixed(2));
    $("#costDisplayTxt").val(total_cost.toFixed(2));

    var profit =  saleAmount - total_cost;
    $("#profitTxt").val(profit.toFixed(2));
}

