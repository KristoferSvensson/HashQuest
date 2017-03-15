$("#btnSearch").on("click", function(){
	$(".searchedUsers").toggle();
});

$(".user").on("click", function(){
	getTimeLine(event.target.id);
});

$(".addUser").on("click", function(){
	if($(this).hasClass("user")){
		getTimeLine(event.target.id);
	}else{
		$(".searchUserBox").toggle();
		$(".addUser").removeClass("active");
		$(this).addClass("active");
	}
});


$("#btnAddUser").on("click", function(){
	$(".active").toggleClass("addUser user");
	var profileImg = $(".profilePicture");
	$(".active").css("background-image", "url(" + profileImg.attr('src') + ")");
	$(".active").attr("id", $(".userName").text());
	$(".active").removeClass("active");
});

