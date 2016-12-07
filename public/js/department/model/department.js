/*model start*/
var Department = Backbone.Model.extend({
    urlRoot:'/wes/department',
    default:{
        id:'',
        name:''
    },
});
/*model end*/

/*collection start*/
var Departments = Backbone.Collection.extend({
    url:'/wes/departments',
    model: Department
});
var departments = new Departments;
/*collection end*/