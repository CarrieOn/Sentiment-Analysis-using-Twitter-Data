function newCommit(){
    var ele = document.getElementById("aaa");
    var comment = ele.value;
    ajaxPostRequest2(comment);
}

function ajaxPostRequest2(data){
    $.ajax({
        type: "GET",
        url: "/polls/",
        data: {
            "check_this": data,
        },
        success: function(data){
            console.log("success");
            console.log(data);
        },
        failure: function(data){
            console.log("failure");
            console.log(data);
        },
    });
}
