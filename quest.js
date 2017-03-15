var bearer = "AAAAAAAAAAAAAAAAAAAAAFQFzgAAAAAAlo069eeiv9pE38ndp0JFqkCQaGc%3DRYRor8IQOf4LCjW4aEwmB4ET0KvoUnMyCFDE1vziWnuxOdlHe4";
var server = "twitter.php";


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


function getTimeLine(screen_name){
	$(".twitterResults").remove();
	var URL = "statuses/user_timeline.json";	
	var querys = new Array("screen_name=" + screen_name, "count=10");
	$.ajax({
		url: server,
		data: { 
			'url': URL, 
			'bearer': bearer,
			'query': querys
		},
		dataType: 'JSON'
	}).done(function(data){
		var tweet = $(".tweet").clone();
		for (var i = 0;i< data.length;i++){
			var tweet = $("#tweet").clone().show();
			tweet.children(".tweetHeader").children(".tweetImg").attr("src", data[i].user.profile_image_url);
			tweet.children(".tweetHeader").children(".media-heading").text(data[i].user.name);
			tweet.children(".tweetBody").text(data[i].text);
			tweet.appendTo("#main1");
			tweet.addClass("twitterResults");
		}
		console.log(data);
	}).fail(function(data){
		console.log("Något gick fel");
		console.log(JSON.stringify(data));
	});
}