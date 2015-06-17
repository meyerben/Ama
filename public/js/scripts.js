function setunderline(elementid) {
    document.getElementById(elementid).style.textDecoration='underline';
    if (elementid == 'date'){
        document.getElementById('popularity').style.textDecoration='none';
        }
    if (elementid == 'popularity'){
        document.getElementById('date').style.textDecoration='none';
        }
}

function arrowhover(elementid, elementclass, action) {
    if (action == 'over') {
        if (elementclass.includes('up')) {
            document.getElementById(elementid).src='img/clickeduparrow.png';
        }
        if (elementclass.includes('down')) {
            document.getElementById(elementid).src='img/clickeddownarrow.png';
        }
    }
    else {
        if (elementclass.includes('up')) {
            document.getElementById(elementid).src='img/uparrow.png';
        }
        if (elementclass.includes('down')) {
            document.getElementById(elementid).src='img/downarrow.png';
        }
    }
}

function smallarrowhover(elementid, elementclass, action) {
    if (action == 'over') {
        if (elementclass.includes('up')) {
            document.getElementById(elementid).src='img/clickedsmalluparrow.png';
        }
        if (elementclass.includes('down')) {
            document.getElementById(elementid).src='img/clickedsmalldownarrow.png';
        }
    }
    else {
        if (elementclass.includes('up')) {
            document.getElementById(elementid).src='img/smalluparrow.png';
        }
        if (elementclass.includes('down')) {
            document.getElementById(elementid).src='img/smalldownarrow.png';
        }
    }
}

function answerbuttonhover(comment_id, marked, action){
    console.log(comment_id);
    if (action){
        if (marked){
            document.getElementById(comment_id).src='img/checkmark.png';
        }
        else {
            document.getElementById(comment_id).src='img/checkedcheckmark.png';
        }
    }
    else {
        if (marked){
            document.getElementById(comment_id).src='img/checkedcheckmark.png';
        }
        else {
            document.getElementById(comment_id).src='img/checkmark.png';
        }
    }
}

function answerbuttonclick(comment_id, marked, question_id){
    $("#markanswer_" + comment_id).attr("onmouseover", "");
    $("#markanswer_" + comment_id).attr("onmouseout", "");
    console.log(marked);
    if (marked){
        $("#markanswer_" + comment_id).attr("src", "img/checkmark.png");
        $.ajax({
            url: "/api/answers/" + question_id + "/" + comment_id,
            type: 'DELETE'
        });
        $("#comment_" + comment_id).css("background", "");
    }
    else {
        $("#markanswer_" + comment_id).attr("src", "img/checkedcheckmark.png");
        $("#comment_" + comment_id).siblings().children(".markanswerbutton").attr("src", "img/checkmark.png");
        $("#comment_" + comment_id).siblings().children(".markanswerbutton").attr("onmouseover", "answerbuttonhover(this.id, false, true);");
        $("#comment_" + comment_id).siblings().children(".markanswerbutton").attr("onmouseout", "answerbuttonhover(this.id, false, false);");
        $("#comment_" + comment_id).siblings().css("background", "");
            var oldanswerid = $("#comment_" + comment_id).siblings().children(".markanswerbutton[answered='true']").attr('id')
            if (oldanswerid != null){
            var idobject = /(\d+)/.exec(oldanswerid);
            var newid = idobject[1];
            $.ajax({
                url: "/api/answers/" + question_id + "/" + newid,
                type: 'DELETE',
                complete: (function(){console.log("completed delete");$.post("/api/answers/" + question_id + "/" + comment_id);
                })
            });
            }
            else {
                $.post("/api/answers/" + question_id + "/" + comment_id);
            }
        $("#comment_" + comment_id).css("background", "#ffffff");
        }
}
    
function trashhover(id, over){
    if (over){
        $("#" + id).attr("src", "/img/opentrash.png");
    }
    else {
        $("#" + id).attr("src", "/img/trash.png");
    }
}

function flaghover(id, over){
    if (over){
        $("#" + id).attr("src", "/img/redflag.png");
    }
    else {
        $("#" + id).attr("src", "/img/flag.png");
    }
}

function redflaghover(id, over){
    if (over){
        $("#" + id).attr("src", "/img/flag.png");
    }
    else {
        $("#" + id).attr("src", "/img/redflag.png");
    }
}

function showError(time){
    $("#errorcontainer").css('opacity', 1)
    $("#errorcontainer").animate({top: '50px'}, 250).delay(time).animate({top: '0px', opacity: 0}, 250);
}

function redflagclick(question_id, votes){
    $.ajax({
        url: url_for('raise_flag', {entry_type : 'questions', entry_id : question_id}),
        type: 'DELETE',
        dataType: 'json'
   })
   .done(function(data) {
       console.log(data);
        if (data == null){
            console.log('Showing error')
           $("#errorcontainer").html("Error");
           showError(3000);
        }
        else {
            if (data.error != null) {
                $("#errorcontainer").html("Error: " + data.error);
            }
            else {
                $("#flag_" + question_id).attr('src', '/img/flag.png');
                $("#flag_" + question_id).attr('onmouseover', 'flaghover(this.id, true)');
                $("#flag_" + question_id).attr('onmouseout', 'flaghover(this.id, false)');
                $("#flag_" + question_id).attr('title', 'Unflag Question');
                $("#questiontitle_" + question_id).css('background', '');
                $("#vote_" + question_id).css('display', 'block');
                $("#flaggedcount_" + question_id).remove();
                $("#reply_" + question_id).css('display', 'block');
                $("#countcontainer_" + question_id).css('display', 'block');
                $("#flagcontainer_" + question_id).unbind('click');
                $("#flagcontainer_" + question_id).click(function(){flagclick(question_id, votes)});
            }
        }
       
    });
}

function flagclick(question_id, votes){
    console.log('into post');
    $.post(url_for('raise_flag', {entry_type : 'questions', entry_id : question_id}))
    .done(function(data) {
        console.log(data);
        if (data == null){
           $("#errorcontainer").html("Error");
           showError(3000);
        }
        else {
            if (data.error != null) {
                $("#errorcontainer").html("Error: " + data.error);
            }
            else {
                $("#flag_" + question_id).attr('src', '/img/redflag.png');
                $("#flag_" + question_id).attr('onmouseover', 'redflaghover(this.id, true)');
                $("#flag_" + question_id).attr('onmouseout', 'redflaghover(this.id, false)');
                $("#flag_" + question_id).attr('title', 'Unflag Question');
                $("#questiontitle_" + question_id).css('background', '#000000');
                $("#vote_" + question_id).css('display', 'none');
                $("#reply_" + question_id).css('display', 'none');
                $("#countcontainer_" + question_id).css('display', 'none');
                $("#questionbuttoncontainer_" + question_id).prepend("<div id='flaggedcount_" + question_id + "' class='flaggedcount'><p class='countnumber'>" + votes + "</p></div>");
                $("#flagcontainer_" + question_id).unbind('click');
                $("#flagcontainer_" + question_id).click(function(){redflagclick(question_id, votes)});
            }
        }
    });
}