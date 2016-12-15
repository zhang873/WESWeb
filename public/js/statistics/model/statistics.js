/*model start*/
var Category = Backbone.Model.extend({
    urlRoot:'/wes/category',
    default:{
        id:'',
        name:'',
        category:'',
        description:''
    },
});
/*model end*/

/*collection start*/
var Categorys = Backbone.Collection.extend({
    url:'/wes/categorys',
    model: Category
});
var categorys = new Categorys;
/*collection end*/