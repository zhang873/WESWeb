User = Backbone.Model.extend({
    urlRoot:'/wes/user',
    default: {
        id:null,
        type:'',
        username:'',
        name:'',
        password:'',
        department:''
    },
    initialize: function() {
    }
});

/** Collection */
Users = Backbone.Collection.extend({
    url:'/wes/users',
    model: User
});
