var bearer = "AAAAAAAAAAAAAAAAAAAAAFQFzgAAAAAAlo069eeiv9pE38ndp0JFqkCQaGc%3DRYRor8IQOf4LCjW4aEwmB4ET0KvoUnMyCFDE1vziWnuxOdlHe4";
var server = "twitter.php";


$(".addUser").on("click", function(){
	$(".searchUserBox").toggle();
});

$("#btnSearch").on("click", function(){
	$(".searchedUsers").toggle();
});

$(".user").on("click", function(){
	getTimeLine(event.target.id);
});


function getTimeLine(screen_name){
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
		}
		console.log(data);
	}).fail(function(data){
		console.log("Något gick fel");
		console.log(JSON.stringify(data));
	});
}