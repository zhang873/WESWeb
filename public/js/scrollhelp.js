function getScrollTop() {
    var scrollTop = 0;
    if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop;
    }
    else if (document.body) {
        scrollTop = document.body.scrollTop;
    }
    return scrollTop;
}

function getScrollTopBy(name) {
    var tag = document.getElementById(name);
    return tag.scrollTop;
}



function getClientHeight() {
    var clientHeight = 0;
    if (window.ActiveXObject) {//ie
        clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
    }
    else {
        clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
    }
    return clientHeight;
}


function getClientHeightBy(name) {

    var tag = document.getElementById(name);
    var clientHeight = 0;

    return tag.clientHeight;
}

function getScrollHeight() {
    return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
}

function getScorllHeightBy(name) {
    var tag = document.getElementById(name);
    return tag.scrollHeight;
}


function reachBottom() {
    if ((getScrollTop() + getClientHeight() >= getScrollHeight()-20) && getScrollTop()>0) {
        return true;
    } else {
        return false;
    }

}

function reachBottomBy(name) {
    return (getScrollTopBy(name)+ getClientHeightBy(name)>=getScorllHeightBy(name) && getScrollTopBy(name)>0)
}
