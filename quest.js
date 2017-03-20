var bearer = "AAAAAAAAAAAAAAAAAAAAAFQFzgAAAAAAlo069eeiv9pE38ndp0JFqkCQaGc%3DRYRor8IQOf4LCjW4aEwmB4ET0KvoUnMyCFDE1vziWnuxOdlHe4";
var server = "twitter.php";
var searchedScreenName;


$("#btnSearch").on("click", function(){
	getUser($('#search').val());
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
	$(".active").attr("id", searchedScreenName);
	$(".active").removeClass("active");
});


function getUser(screen_name){
	var URL = "users/lookup.json";	
	var querys = new Array("screen_name=" + screen_name);
	$.ajax({
		url: server,
		data: { 
			'url': URL, 
			'bearer': bearer,
			'query': querys
		},
		dataType: 'JSON'
	}).done(function(data){
		$("#searchedUserImage").attr("src", data[0].profile_image_url);
		$("#searchedUserName").text(data[0].name);
		searchedScreenName = data[0].screen_name;
		$(".searchedUsers").toggle();
		console.log(data);
	}).fail(function(data){
		console.log("Något gick fel");
		console.log(JSON.stringify(data));
	});
}


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
			tweet.children(".tweetHeader").children("#tweetText").text(data[i].text);
			var hashtags = data[i].entities.hashtags;
			for (var j = 0;j< hashtags.length;j++){
				var thelink = $('<a>',{
					text: "#" + hashtags[j].text + "  ",
					href: '#',
					id: hashtags[j].text,
					click: function(){
     					hashtagQuest(event.target.id);
  					}
				}).appendTo(tweet.children(".tweetBody"));
			} 	
			tweet.appendTo("#main1");
			tweet.addClass("twitterResults");
		}
		console.log(data);
	}).fail(function(data){
		console.log("Något gick fel");
		console.log(JSON.stringify(data));
	});
}

function hashtagQuest(hashtag){
	alert(hashtag.toString());
}
