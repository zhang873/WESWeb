/*model start*/
var Contract = Backbone.Model.extend({
    urlRoot:'/contract',
    default:{
        id:'',
        contract_no:'',
        date:'',
        custom:'',
        seller:'',
        currency:'',
        total: '',
        payment_provision : '',
        status: ''
    },
});
/*model end*/

/*collection start*/
var Contracts = Backbone.Collection.extend({
    url:'/wes/contracts',
    model: Contract
});
var contracts = new Contracts;
/*collection end*/