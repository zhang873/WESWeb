/**
 * Created by zhu on 2016/10/18.
 */

$(function(){
$.ajax({
    type:'GET',
    url:'/getMediaSize',
    contentType: "application/json; charset=utf-8"
}).done(function(result){
    console.log(result);
    //媒体使用总量
    var media_total = result.mediacap;
    var mediaTotal = parseInt(media_total) +'GB';
    var mediaTotal_B = bytesToB(media_total);
    //媒体使用阈值
    var media_thres = result.mediathreshold;
    var media_thres_B = bytesToB(media_thres);
    var type = $.cookie('type');
    var person_id ={
        "id":$.cookie('token')
    };
    //admin用户
    if(type === 'admin'){

        $.ajax({
            type: "GET",
            url: "/getInitArr",
            contentType: "application/json; charset=utf-8"
        }).done(function (result) {

            if(result.state && result.state == 200){

                console.log('***************Acess info Success************');

                var labelColor = ['#CCCCCC','#f05b4f','#f4c63d','#d17905','#453d3f','#59922b','#0544d3','#6b0392','#f05b4f','#dda458'];
                result.userArr.unshift('yuliang');
                var labels = result.userArr;
                var data = {
                    series : result.userSpace
                };

                var data_series = [];
                data.series.forEach(function(item){
                    var im = parseInt(item);
                    data_series.push(im)
                });


                var sum = function(a, b) { return a + b };
                var media_usage = data_series.reduce(sum);
                var media_magin = mediaTotal_B-media_usage;//余量
                var mediaMagin = bytesToSize(media_magin);
                var mediaUsage = bytesToSize(media_usage);//媒体使用总量
                var options = {
                    //标签值的插值函数
                    labelInterpolationFnc: function(value) {

                        var i= Math.round(value/mediaTotal_B * 100);
                        if(i>=5){
                            return i+ '%';
                        }

                    }
                };
                var responsiveOptions = [
                    ['screen and (min-width: 640px)', {
                        chartPadding: 10,
                        labelOffset: 100,
                        labelDirection: 'explode',

                    }],
                    ['screen and (min-width: 1024px)', {
                        labelOffset: 100,
                        chartPadding: 30,
                        labelDirection: 'explode',
                    }]
                ];

                
                $("#mediaTotal").eq(0).append( '<strong class="numSize">' + mediaTotal + '</strong>');
                $("#mediaUsage").eq(0).append( '<strong class="numSize">' + mediaUsage + '</strong>');
                $("#mediaMagin").eq(0).append( '<strong class="numSize">' + mediaMagin + '</strong>');


                //比较阈值和余量，并发出警报
                if(media_magin > media_thres_B){
                    $(".redAlert").css('display','none');
                }else{
                    $(".redAlert").css('display','block');
                }

                var MediaMagin = media_magin.toString();
                result.userSpace.unshift(MediaMagin);
                var data = {
                    series : result.userSpace
                };

                //console.log(result.userSpace);



                //饼图
                new Chartist.Pie('.ct-chart', data, options, responsiveOptions);







                /*var totalPer = Math.round(media_usage/media_total * 100) + '%';
                 console.log(totalPer);
                 new Chartist.Pie('.ct-chart_total', {
                 labels:totalPer,
                 series: [media_usage,media_magin]
                 }, {
                 donut: true,
                 donutWidth: 60,
                 startAngle: 270,
                 labelOffset: 50,
                 chartPadding: 30,
                 labelDirection: 'explode',
                 total: media_total,
                 showLabel: true
                 });*/





                labels.forEach(function(item,i){
                    //console.log(item);
                    //console.log(i);
                    var color = labelColor[i];
                    var personUsage = data.series[i];
                    //console.log(personUsage);
                    $(".dl-horizontal").eq(0).append('<dt style="padding-right: 10px;">' + item + ': </dt> <dd><span class="spancolor" style="background-color:' + color + '"></span>'+ bytesToSize(personUsage) +' </dd>')
                });

            }else{
                console.log('***********Acess info Failed*************')
            };

        }).fail(function(a,b,c) {

            console.log('error',a,b,c);
        });
        $(".mediaSize").eq(0).css('display','block');
        $("#pieChart").eq(0).css('display','block');


    };
    //normal用户
    if(!type || type === 'normal'){

        $.ajax({
            type:'POST',
            url:'/getPersonInitArr',
            data: person_id
        }).done(function (result) {

            console.log(result);
            var user_size = result.userSize;//当前用户使用量
            var userSIze = bytesToSize(user_size);
            var totalUserSize = result.userSpace;
            var data_series = [];
            totalUserSize.forEach(function(item){
                var im = parseInt(item);
                data_series.push(im)
            });
            var sum = function(a, b) { return a + b };
            var media_usage = data_series.reduce(sum);
            var media_magin = mediaTotal_B-media_usage;
            var mediaMagin = bytesToSize(media_magin);
            //$("#mediaTotal").eq(0).append( '<strong class="numSize">' + mediaTotal + '</strong>');
            $("#mediaNolUsage").eq(0).append( '<strong class="numSize">' + userSIze + '</strong>');
            $("#mediaNolMagin").eq(0).append( '<strong class="numSize">' + mediaMagin + '</strong>');

            //比较阈值和余量，并发出警报
            if(media_magin > media_thres_B){
                $(".redAlert").css('display','none');
            }else{
                $(".redAlert").css('display','block');
            }


        }).fail(function(a,b,c) {

            console.log('error',a,b,c);
        });

        $(".mediaNolSize").eq(0).css('display','block');
    };


    //单位转化
    function bytesToSize(bytes){
        if(bytes === '0'||bytes === 0){
            return '0B';
        }
        var k = 1024;
        var sizes = ['B','KB','MB','GB','TB','PB','EB','ZB','YB'];
        var i = Math.floor(Math.log(bytes)/Math.log(k));
        var res = (bytes/Math.pow(k,i)).toFixed(1);
        return (res + '' + sizes[i]);
    };

    //'G'转'B'单位
    function bytesToB(bytes){
        if(bytes === '0'){
            return '0B';
        }
        var res = parseInt(bytes)*1024*1024*1024;
        return res;
    }
});












});



