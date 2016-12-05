Box = Backbone.Model.extend({
    urlRoot: '/device',

    initialize: function() {
    },

    defaults: {
        // persistent attributes
        id: null,
        name: '',
        alias: '',
        auto_screen: [],
        auto_snapshot: '0',
        debug: '0',
        network: {},
        net_set: {},
        service: '',
        interval: '30',
        // normal attributes
        os: '',
        version: {},
        dsmversion: {},
        cpu: '',
        memory: '',
        disk: '',
        boot: '',
        lastLinkTime:'',
        schedule: [],
        snapshot: '',
        pixel: '',
        client_info: '',
        publish: [],
        commands: [],
        screen: 'off',
        online: false,
        checked: false
    },

    update: function(arg) {
        this.save({
            alias: arg.alias || this.get('alias'),
            auto_screen: arg.auto_screen || this.get('auto_screen'),
            auto_snapshot: arg.auto_snapshot || this.get('auto_snapshot'),
            debug: arg.debug || this.get('debug'),
            network: arg.network || this.get('network'),
            net_set: arg.net_set || this.get('net_set'),
            service: arg.service || this.get('service'),
            interval: arg.interval || this.get('interval')
        });
    }
});

Boxes = Backbone.Collection.extend({
    url: '/devices',
    model: Box
});