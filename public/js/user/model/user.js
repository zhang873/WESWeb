User = Backbone.Model.extend({
    urlRoot:'/user',
    default: {
        id:null,
        type:'',
        name:'',
        password:'',
        boxes:[]
    },
    initialize: function() {
    }
});

/** Collection */
Users = Backbone.Collection.extend({
    url:'/users',
    model: User
});
