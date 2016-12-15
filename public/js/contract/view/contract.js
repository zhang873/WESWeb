_.templateSettings = {
    interpolate : /\{\{(.+?)\}\}/g
};

var users = new Users;
var customs = new Customs;

users.fetch();
customs.fetch();

function getUserName(id){
    var usersModels = users.models;
    var $name = '';
    for(var i = 0; i<usersModels.length;i++){
        if(id == usersModels[i].attributes._id){
            $name = usersModels[i].attributes.name;
            return $name;
        }
    }
}

function getCustomName(id){
    var customsModels = customs.models;
    var $name = '';
    for(var i = 0; i<customsModels.length;i++){
        if(id == customsModels[i].attributes._id){
            $name = customsModels[i].attributes.name;
            return $name;
        }
    }
}

/*view start*/
var ContractItemView = Backbone.View.extend({
    tagName:'tr',
    events:{

        //'mouseover': 'showOper',
        //'mouseout': 'hideOper',

        'click .tdRemoveItem ':'clear',

        //'click .tdCopyItem ':'copy',
        'click .chkContractItem': 'selectContractItem'

    },
    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.remove);
    },
    render: function() {
        var data = this.model.toJSON();
        console.log(this.model)
        data.id = data._id;
        data.date = data.date;
        data.contract_no = data.contract_no;
        data.custom = getCustomName(data.custom);
        //data.seller = getUserName(data.seller);
        data.belong = getUserName(data.belong);

        if (data.total == '') {
            data.total = '0';
        }

        if (data.currency == 'USD') {
            data.total = '$' + data.total;
        }else {
            data.total = '￥' + data.total;
        }
        switch (data.status){
            case 0:
                data.status = '发货中';
                break;
            case 1:
                data.status = '收款中';
                break;
            case 2:
                data.status = '已结束';
                break;
        }
        $(this.el).html( _.template($('#tmplContract').html(), data));

        return this.el;
    },
    clear: function() {

        if(confirm("确认删除吗？")) {
            var data = this.model.toJSON();
            this.model.destroy();
            console.log(data);
            var $ids = [];
            $ids.push(data._id);
            $.ajax({
                type:'DELETE',
                url: '/wes/contract',
                contentType: 'application/json',
                data: JSON.stringify($ids),
            }).done(function(res){
                console.log(res);
            });
        }
    },
    selectContractItem : function() {
        if($('.chkContractItem:checked').length == $('.chkContractItem').length) $('#chkAllItem').prop('checked', true);
        else $('#chkAllItem').prop('checked', false);
    },
    //showOper: function() {
    //    $(this.el).find('.playlistName').parent().removeClass("col-xs-10").addClass("col-xs-7");
    //    $(this.el).find('.playlistOper').show();
    //},
    //
    //hideOper: function() {
    //    $(this.el).find('.playlistName').parent().removeClass("col-xs-7").addClass("col-xs-10");
    //    $(this.el).find('.playlistOper').hide();
    //}

});

var ContractView = Backbone.View.extend({
    el:'#contractArea',
    events:{
        'click .sortByName': 'sortByName',
        'click .sortByStamp': 'sortByStamp',
        'click #chkAllItem': 'selectAllItem'
    },
    initialize: function() {
        //console.log(playlists);
        var that = this;
        contracts.fetch()
            .done(function(collection) {
                that.collection = contracts;
                var tmpContracts = contracts.filter(function() {
                    return true;
                });
                that.render(tmpContracts);
            })
            .fail(function(jqXHR) {
                if(jqXHR.status === '404') {
                    alert('请求失败');
                }
            });
    },

    render: function(tmpContracts) {
        $(this.el).children('tbody').empty();
        var $sortFlag = $('#contractArea').find('.caret:visible').parents('.sortBy').hasClass('dropup');
        if(!$sortFlag) {
            this.renderDesc(tmpContracts);
        } else {
            this.renderAsc(tmpContracts);
        }
    },
    renderAsc:function(tmpContracts) {
        $.each(tmpContracts, function(i, o) {
            var view = new ContractItemView({model: o});
            $('#contractArea').children('tbody').append(view.render());

        })
    },
    renderDesc:function(tmpContracts) {
        $.each(tmpContracts, function(i, o) {
            var view = new ContractItemView({model: o});
            $('#contractArea').children('tbody').prepend(view.render());


        })
    },
    selectAllItem: function(e) {
        $('.chkContractItem').prop('checked', $('#chkAllItem').prop('checked'));
        if (e && e.stopPropagation) {
            //支持W3C
            e.stopPropagation();
        }
        else {
            //IE的方式
            window.event.cancelBubble = true;
        }

    },
    sortByName:function() {
        this.sortBy('Name');
    },
    sortByStamp:function() {
        this.sortBy('Stamp');
    },
    sortBy: function(sortColNname) {
        var taget ='.sortBy'+sortColNname;
        $(taget).find('.caret').show();
        $(taget).siblings().removeClass('dropup').find('.caret').hide();
        if(!$(taget).hasClass('dropup')) {
            $(taget).addClass('dropup');
        } else {
            $(taget).removeClass('dropup');
        }
        var tmpContracts = contracts.sortBy(function (contract) {
            return contract.get(sortColNname.toLowerCase());
        });

        var query = $('#searchInput').val().trim();
        if(query !== '') {
            tmpContracts = tmpContracts.filter(function(contract) {
                return contract.toJSON().name.indexOf(query) > -1 ;
            });
        } else {
            tmpContracts = tmpContracts.filter(function() {
                return true;
            });
        }

        $('#chkAllItem').prop('checked', false);
        this.render(tmpContracts);
    }
});

/*view end*/
var contractView = new ContractView;

function delContracts() {
    var $ids = [];
    $.each($('.chkContractItem:checked'), function(i, o) {
        $ids.push($(o).val());
    });

    if($ids.length == 0) return popBy("#deleteBtn", false, '请先选择您要删除的合同');
    if(confirm("确认删除吗？")) {
        $.ajax({
            type: "DELETE",
            url: "/wes/contract",
            data: JSON.stringify($ids),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
                console.log(json);
                if(json.rtn === 0) {
                    $.each($ids,function(i,o) {
                        var $temp = contracts.get(o);
                        contracts.remove($temp);
                    })
                    $(".chkContractItem:checked").parents('tr').remove();
                }
            },
            error: function (err) {
                console.log(err);
                //alert("错误:" + err)
            }
        });
    }
    //location.reload();
}

//function delContracts() {
//    var $ids = [];
//    $.each($('.chkContractItem:checked'), function(i, o) {
//        $ids.push($(o).val());
//    });
//
//    if($ids.length == 0) return popBy("#deleteBtn", false, '请先选择您要删除的播放列表');
//    if(confirm("确认删除吗？")) {
//        $.ajax({
//            type: "DELETE",
//            url: "/contracts",
//            data: JSON.stringify($ids),
//            contentType: "application/json; charset=utf-8",
//            dataType: "json",
//            success: function (json) {
//                if(json.status === 'success') {
//                    $.each($ids,function(i,o) {
//                        var $temp = contracts.get(o);
//                        contracts.remove($temp);
//                    })
//                    $(".chkContractItem:checked").parents('tr').remove();
//                }
//            },
//            error: function (err) {
//                alert(err.responseText)
//            }
//        });
//    }
//    //location.reload();
//}
function searchContracts() {
    var query = $('#searchInput').val().trim();
    var sortColNname = $('#contractArea').find('.caret:visible').attr('sortColName') ?
        $('#contractArea').find('.caret:visible').attr('sortColName') : 'stamp';
    var tmpContracts = contracts.sortBy(function (schedule) {
        //return schedule.get(sortColNname);
        return true
    });
    console.log(query);
    if(query !== '') {
        tmpContracts = tmpContracts.filter(function(contract) {
            console.log(contract.toJSON())
            return (contract.toJSON().contract_no.indexOf(query) > -1 || contract.toJSON().contract_no.indexOf(query) > -1);
        });
        contractView.render(tmpContracts);
    } else {
        tmpContracts = tmpContracts.filter(function() {
            return true;
        });
        contractView.render(tmpContracts);
    }

    $('#chkAllItem').prop('checked', false);
}
