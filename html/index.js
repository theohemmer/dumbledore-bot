function checkpoint() {
    jQuery.get("/getpoint", function(data) {
        $("#gryfondor .point h1").html(data.red);
        $("#serpentar .point h1").html(data.green);
        $("#poufsouffle .point h1").html(data.yellow);
        $("#serdaigle .point h1").html(data.blue);
        total_point = data.red + data.green + data.yellow + data.blue;
        if (total_point == 0) {
            $("#gryfondor .progressbar").width("0vw");
            $("#serpentar .progressbar").width("0vw");
            $("#poufsouffle .progressbar").width("0vw");
            $("#serdaigle .progressbar").width("0vw");
        } else {
            $("#gryfondor .progressbar").width((data.red / total_point * 100) + "vw");
            $("#serpentar .progressbar").width((data.green / total_point * 100) + "vw");
            $("#poufsouffle .progressbar").width((data.yellow / total_point * 100) + "vw");
            $("#serdaigle .progressbar").width((data.blue / total_point * 100) + "vw");
            var sortable = [];
            for (var equipe in data)
                sortable.push([equipe, data[equipe]]);
            sortable.sort(function(a, b) {
                return (b[1] - a[1]);
            });
            for (var i = 0; i < 4; i++) {
                if (sortable[i][0] == "red")
                    $("#gryfondor").css({top: ((i * 25) + "vh")});
                if (sortable[i][0] == "green")
                    $("#serpentar").css({top: ((i * 25) + "vh")});
                if (sortable[i][0] == "yellow")
                    $("#poufsouffle").css({top: ((i * 25) + "vh")});
                if (sortable[i][0] == "blue")
                    $("#serdaigle").css({top: ((i * 25) + "vh")});
            }
        }
    });
}

function notifDisapear() {
    $(".notif").css({visibility: "visible", opacity: "0"});
}

function checknotif() {
    jQuery.get("/notif", function(data) {
        checkpoint();
        if (data.type == "nothing")
            return;
        else {
            $(".notif .notif_wrapper .content h1").html(data.point + " points for");
            if (data.team == "red") {
                $(".notif .notif_wrapper .content h1.team_name").html("Gryffindor");
                $(".notif .notif_wrapper .content img").attr("src", "Gryfondor.png");
            }
            if (data.team == "yellow") {
                $(".notif .notif_wrapper .content h1.team_name").html("Hufflepuff");
                $(".notif .notif_wrapper .content img").attr("src", "Poufsoufle.png");
            }
            if (data.team == "blue") {
                $(".notif .notif_wrapper .content h1.team_name").html("Slytherin");
                $(".notif .notif_wrapper .content img").attr("src", "Slytherin.png");
            }
            if (data.team == "green") {
                $(".notif .notif_wrapper .content h1.team_name").html("Ravenclaw");
                $(".notif .notif_wrapper .content img").attr("src", "Serdaigle.png");
            }
            $(".notif .notif_wrapper h2").html(data.reason);
            $(".notif").css({visibility: "visible", opacity: "1"});
            setTimeout(notifDisapear, 5000);
        }
    });
}

setInterval(checknotif, 500);