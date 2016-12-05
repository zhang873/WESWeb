Group = Backbone.Model.extend({
    urlRoot: '/group',

    initialize: function() {
    },

    defaults: {
        id: null,
        name: '',
        boxes: []
    },
    update: function(arg) {
        this.save({
            id: arg.id || this.get('id'),
            name: arg.name || this.get('name'),
            boxes: arg.boxes || this.get('boxes')

        });
    }
});

Groups = Backbone.Collection.extend({
    url: '/groups',
    model: Group
});