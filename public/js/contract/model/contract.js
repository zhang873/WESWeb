/*model start*/
var Contract = Backbone.Model.extend({
    urlRoot:'/contract',
    default:{
        id:'',
        contract_no:'',
        date:'',
        custom:'',
        total: ''
    },
    //copy: function() {
    //    var that = this;
    //    return  $.post('/contract/copy/'+that.get('id'),{})
    //}
});
/*model end*/

/*collection start*/
var Contracts = Backbone.Collection.extend({
    url:'/wes/contracts',
    model: Contract
});
var contracts = new Contracts;
/*collection end*/