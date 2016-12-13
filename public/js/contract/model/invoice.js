/**
 * Created by xc.zhang on 2016/12/10.
 */
/** Invoice Model**/
Invoice = Backbone.Model.extend({
    defaults: {
        date: '',
        no_start: '',
        no_end:''
    }
});
/** Invoice Collection**/
Invoices = Backbone.Collection.extend({
    model: Invoice
});