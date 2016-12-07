/**
 * Created by xc.zhang on 2016/12/6.
 */
/** LogisSetting Model**/
LogisSetting = Backbone.Model.extend({
    defaults: {
        from: '',
        to: '',
        week:"00000000"
    }
});
/** LogisSetting Collection**/
LogisSettings = Backbone.Collection.extend({
    model: LogisSetting
});