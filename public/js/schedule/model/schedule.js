/**
 * Created by shgbit on 14-2-10.
 */


/** Model*/
Schedule = Backbone.Model.extend({
    urlRoot:'/schedule',
    initialize: function() {
    },
    defaults: {
        id:null,
        name: '',
        type: 'absolutePlaylist',
        stamp: '',
        children: [],
        schedule:{}
    },

    validate: function(attrs, options) {
        if (attrs.name === 0) {
            return "名称不能为空";
        }
    }
});


/** Collection */
Schedules = Backbone.Collection.extend({
    url: '/schedules',
    model: Schedule
});