/*model start*/
var Product = Backbone.Model.extend({
    urlRoot:'/wes/product',
    default:{
        id:'',
        name:'',
        description:''
    },
});
/*model end*/

/*collection start*/
var Products = Backbone.Collection.extend({
    url:'/wes/products',
    model: Product
});
var products = new Products;
/*collection end*/