/**
 * Created by xc.zhang on 2016/12/10.
 */
/** ProductSetting Model**/
ProductSetting = Backbone.Model.extend({
    defaults: {
        date: '',
        unit:'',
        number:'0',
        price:'0',
        sum:'0',
    }
});
/** ProductSetting Collection**/
ProductSettings = Backbone.Collection.extend({
    model: ProductSetting
});