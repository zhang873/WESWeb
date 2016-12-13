/**
 * Created by xc.zhang on 2016/12/10.
 */
/** Payment Model**/
Payment = Backbone.Model.extend({
    defaults: {
        date: '',
        receive: '',
        method:'',
        bank:''
    }
});
/** Payment Collection**/
Payments = Backbone.Collection.extend({
    model: Payment
});