/** model */
Log = Backbone.Model.extend({
    urlRoot:'/log',
    default: {
//        id:null,
        name:'',
        size:'',
        mtime:'',
        atime:''
    },
    initialize: function() {
    }
});

/** Collection */
Logs = Backbone.Collection.extend({
    url:'/logs',
    model: Log
});
