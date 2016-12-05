/**
 * Created by shgbit on 14-1-16.
 */
var modifyuser;
var userGet;
function modalIputFocus($modalid,$txtid) {
    var id = $.cookie('token');
    userGet = $.get('/user/'+id).done(function(result) {
        $('#descriptionTxt').val(result.result.result.description);
        modifyuser = result.result.result;
        $($modalid).modal('show');
        $($modalid).on('shown.bs.modal', function (e) {
            $($txtid).focus();
        })
    }).error(function(){alert('未知错误请联系管理员！')});
}

function validateBlank(inputId) {
    if($(inputId).val().trim() === '') return {status:false,message:"不能为空"}
    return {status:true,message:""}
}

function validatePassword(inputId) {
    var password = $(inputId).val().trim();
    if(password.length < 4) return {status:false,message:"不能小于4"}
    else if(password.length> 20) return {status:false,message:"不能大于20"}
    return {status:true,message:""}
}

function validateOriginalPassword(inputId) {
    var result = validateBlank(inputId);
    if(!result.status) return popBy(inputId, result.status,'原始密码'+result.message);
    result =validatePassword(inputId);
    if(!result.status) return popBy(inputId, result.status,'原始密码'+result.message);
    return result.status;
}

function validateoNewPassword(inputId) {
    var result = validateBlank(inputId);
    if(!result.status) return popBy(inputId, result.status,'新密码'+result.message);
    result =validatePassword(inputId);
    if(!result.status) return popBy(inputId, result.status,'新密码'+result.message);
    return result.status;
}
function validateComfirmPassword(newPassInputId,comfirmPassInputId) {
    var newPassword = $(newPassInputId).val().trim();
    var comfirmPassword = $(comfirmPassInputId).val().trim();
    if(newPassword !== comfirmPassword)  return popBy(comfirmPassInputId, false,'两次输入密码不同') ;
    return true;
}

function modifyPassword() {
    if(!validateOriginalPassword("#originalPasswordTxt")  ||  !validateoNewPassword("#newPasswordTxt") || !validateComfirmPassword("#newPasswordTxt","#comfirmPasswordTxt")) {
        return;
    }
    var originalPassword = $("#originalPasswordTxt").val().trim();
    var newPassword = $("#newPasswordTxt").val().trim();
    $.ajax({
        type: "PUT",
        url: "/user/"+ $.cookie('token')+"/password",
        data: JSON.stringify({oldpassword: hex_md5(originalPassword), newpassword: hex_md5(newPassword)}),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (json) {
            if(!json)  return alert('未知的错误');
            if(json.status === 'failed') {
                popBy('#modifyPasswordBtn',false,json.result);//result为错误信息
            } else {
                popBy('#modifyPasswordBtn',false,'修改成功');
                setTimeout(function() {
                    $("#modifyPersonalModal").modal('hide')
                    $("#originalPasswordTxt").val('');
                    $("#newPasswordTxt").val('');
                    $("#comfirmPasswordTxt").val('');
                },500)

            }
        },
        error: function (err) {
            alert(err.responseText)
        }
    });

}

function modifyDescription() {
    var description = $("#descriptionTxt").val().trim();
    var reg = /[<>]/ig;

    if(reg.test(description)) return popBy('#descriptionTxt',false,'个人描述含有特殊字符\"<\"，\">\"');

    $.when(userGet).then(function() {
        var tmpUser = new User(modifyuser);
        tmpUser.id = tmpUser.get('id');
        tmpUser.set({description:description});
        tmpUser.save().done(function(){
            popBy('#modifyDescriptionBtn',false,'修改成功');
            setTimeout(function() {
                $('#modifyPersonalModal').modal('hide');
                $("#descriptionTxt").val('');
            },500)

        }).error(function() {
                alert('未知错误，请联系管理员');
            });
    },function() {
        alert('error')
    });
}
//obj (DOM元素的id或者class，flag（是否显示pop），message（pop提示打信息）)
function popBy(obj,flag,message){
    $(obj).popover('destroy');
    $(obj).popover({
        placement:'bottom',
        trigger:'manual',
        content:message
    });
    if(!flag) {
        $(obj).popover('show');
        setTimeout(function(){$(obj).popover('hide');},3000);
        return false;
    }
    else {
        $(obj).popover('hide');
        return true;
    }
}
function weekday(obj) {
    if($(obj).hasClass('btn-default')) {
        $(obj).addClass('btn-primary').removeClass('btn-default');
    }else {
        $(obj).addClass('btn-default').removeClass('btn-primary');
    }
}

function datePick(stId,edId,isStart){
    $(edId).datetimepicker('remove');
    var tmpdateSt = new Date();
    var tmpdateEd = null;
    var tmpdateInit = new Date();
    if($(edId).val() !== '') {
        if(!isStart) {
            tmpdateSt = new Date($(edId).val()) < new Date() ? new Date() :new Date($(edId).val());
            tmpdateInit = new Date($(edId).val());
        } else {
            tmpdateEd= new Date($(edId).val());
        }
    }
    $(stId).datetimepicker({
        format: 'yyyy-mm-dd',
        language:  'zh-CN',
        weekStart: 1,
        autoclose: 1,
        startDate:tmpdateSt,
        endDate:tmpdateEd,
        initialDate:tmpdateInit,
        startView: 2,
        minView: 2,
        forceParse: 0
    });
    $(stId).datetimepicker('show');
}

function timePick(stId,edId,isStart){
    $(edId).datetimepicker('remove');
    var now = new Date();
    var month = parseInt(now.getMonth())+1;
    var dateFomat = now.getFullYear()+'/'+month+'/'+now.getDate()+' ';
    var dateFomatEd = dateFomat+'23:59:59';
    var tmpdateSt = new Date(dateFomat);
    var tmpdateEd = new Date(dateFomatEd);
    var tmpdateInit = new Date(dateFomat);
    var timeFormat = isStart ? "hh:ii:00" : "hh:ii:59";
    if($(edId).val() !== '') {
        if(!isStart) {
            tmpdateSt = new Date(dateFomat+$(edId).val());
            tmpdateInit = new Date(dateFomat+$(edId).val());
        } else {
            tmpdateEd= new Date(dateFomat+$(edId).val());
        }
    }
    $(stId).datetimepicker({
        format: timeFormat,
        minuteStep:1,
        startDate:tmpdateSt,
        endDate:tmpdateEd,
        initialDate:tmpdateInit,
        language:  'zh-CN',
        autoclose: 1,
        startView: 1,
        minView: 0,
        maxView: 1,
        forceParse: 0
//        pickerPosition:'top-right'
    }).on('show',function(ev) {
            if($('#basicSettingModal').length>0) {
                var rootSTop = basicSettingModal.scrollTop;
                console.log(rootSTop)
                var rootTop = parseFloat( $('.datetimepicker:visible').css('top'));
                console.log(rootTop)
                $('.datetimepicker:visible').data('rootSTop', rootSTop);
                $('.datetimepicker:visible').data('rootTop', rootTop);
            }
            console.log('show')
            var height = $('#basicSettingModal .modal-dialog').height()
            height = height+500;
            $('#basicSettingModal .modal-dialog').css('height',height)
        }).on('hide',function(ev) {
            console.log('hide')
            var height = $('#basicSettingModal .modal-dialog').height()
            height = height-500;
            $('#basicSettingModal .modal-dialog').css('height',height)
      })
    $(stId).datetimepicker('show');

}



function clearDateTime(obj) {
    $(obj).val('');
    $(obj).datetimepicker('remove');
}
//

function validatePublicName(name) {
    var reg = /[<>\*\?:\^|"]/ig;
//    var reg = /^[a-zA-Z0-9_\(\)\-\u4e00-\u9fa5]+$/ig;
    var result = {status:true,message:""};
    if(name === '') return result;
    else if(name.getRealLength() > 40) {
        result.status = false;
        result.message = "长度不能超过40字节";
    }
    else if(name.match(reg))    {
        result.status = false;
        result.message = "格式不正确";
    }
    return result;
}

//''.getLength()

String.prototype.getRealLength = function() {
    var len = this.length;
    var ret = 0;
    for (var i = 0; i < len; i++) {
        var a = this.charAt(i);
        ret++;
        if (escape(a).length > 4) ret++;
    }
    return ret;
}

//flag :是否添加 "..." 后缀
String.prototype.cutString = function(len) {

    var flag = arguments[1] || false;
    var str_length = 0;
    var str_cut = '';

    for (var i = 0, length = this.length; i < length; i++) {
        var p = this.charAt(i);

        str_length++;
        if (escape(p).length > 4) str_length++;
        str_cut = str_cut.concat(p);
        if (str_length >= len) return flag ? str_cut.concat("...") : str_cut;

    }
    //如果给定字符串小于指定长度，则返回源字符串；
   return this;
}

window.onscroll = function() {
    var sTop = getScrollTop();
    sTop > 350 ? $('#div-scroll').show(): $('#div-scroll').hide();
}

$('.modal').scroll(function() {
    var sTop = this.scrollTop;

    var rootSTop = $('.datetimepicker:visible').data('rootSTop');
    var rootTop = $('.datetimepicker:visible').data('rootTop');
    if($('.datetimepicker:visible').length == 0) return;

    var top = parseFloat( $('.datetimepicker:visible').css('top'));

    var xx = rootSTop + rootTop - sTop;

    $('.datetimepicker:visible').css('top', xx);

})



