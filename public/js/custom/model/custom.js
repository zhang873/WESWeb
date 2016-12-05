/*model start*/
var Custom = Backbone.Model.extend({
    urlRoot:'/wes/custom',
    default:{
        id:'',
        name:'',
        description:''
    },
});
/*model end*/

/*collection start*/
var Customs = Backbone.Collection.extend({
    url:'/wes/customs',
    model: Custom
});
var customs = new Customs;
/*collection end*/