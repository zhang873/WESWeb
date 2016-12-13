/**
 * Created by xc.zhang on 2016/12/6.
 */
/** LogisSetting Model**/
LogisSetting = Backbone.Model.extend({
    defaults: {
        date: '',
        number: '0',
        price: '0',
        sale_tax_rate: '0',
        sale_tax: '0',
        sale_tax_sum: '0',
        cost: '0',
        tariff_rate: '0',
        tariff: '0',
        tariff_sum: '0',
        bg_price: '0',
        vat_rate: '0',
        vat: '0',
        vat_sum: '0',
        total_cost: '0',
    }
});
/** LogisSetting Collection**/
LogisSettings = Backbone.Collection.extend({
    model: LogisSetting
});