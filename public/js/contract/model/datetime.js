function DateTimeText(left, top, right, bottom, tag, background, border, id, name,  text ) {
    var args = Array.prototype.slice.call(arguments, 0);
    TextRect.apply(this,args);
    this.type = 'dateTime';
    this.name = name || this.createName();
    this.style =  'yyyy年MM月dd日 HH:mm:ss';
    this.width =  230;
    this.height = 30;
    this.text = 'yyyy年MM月dd日 HH:mm:ss';
    this.formatByStyle();
    this.editEnable = false;
}

extend(DateTimeText, TextRect);

DateTimeText.prototype.showDetail = function() {
    var p = new this.constructor.superClass();
    var json = JSON.parse(JSON.stringify(this));
    json.type = p.type;
    var x = Rect.create(json);
    x.showDetail();
    $('#detailarea ul li').last().hide();
    var li = '<li class="input-group"><span class="input-group-addon span-description">样式：</span>'+$('#tmplDateTime').html()+'</li>';
    $('#detailarea ul').append(li);

    $('#detailarea .selDateTime').val(this.style);
}

DateTimeText.prototype.formatByStyle = function() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();

    var weekDay = ''
    var week = ''
    switch(date.getDay())
    {
        case 0: weekDay = "周日"; week =  "星期日"; break;
        case 1: weekDay = "周一"; week =  "星期一"; break;
        case 2: weekDay = "周二"; week =  "星期二"; break;
        case 3: weekDay = "周三"; week =  "星期三"; break;
        case 4: weekDay = "周四"; week =  "星期四"; break;
        case 5: weekDay = "周五"; week =  "星期五"; break;
        case 6: weekDay = "周六"; week =  "星期六"; break;
        default : '周一'; '星期一'; break;
    }
    this.text = this.style.replace(/yyyy/, year).replace(/MM/, month).replace(/dd/, day)
        .replace(/HH/, hour > 9 ? hour : '0' + hour )
        .replace(/mm/, min > 9 ? min : '0' + min)
        .replace(/ss/, sec > 9 ? sec : '0' + sec).replace(/周./, weekDay).replace(/星期./, week);
}
