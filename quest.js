var bearer = "AAAAAAAAAAAAAAAAAAAAAFQFzgAAAAAAlo069eeiv9pE38ndp0JFqkCQaGc%3DRYRor8IQOf4LCjW4aEwmB4ET0KvoUnMyCFDE1vziWnuxOdlHe4";
var server = "twitter.php";
var searchedScreenName;
var ballPressed;
window.onload = updateUsers();

$("#btnSearch").on("click", function(){
	getUser($('#search').val());
});

$(".user").on("click", function(){
	if($(this).hasClass("addUser")){
		$(".twitterResults").remove();
		$("#btnDeleteUser").hide();
		$("#deleteUserWarning").hide();
		$(".searchUserBox").show();
		$(".addUser").removeClass("active");
		$(this).addClass("active");
	}else{
		ballPressed = $(this);
		$(".searchUserBox").hide();
		$(".searchedUsers").hide();
		$("#deleteUserWarning").hide();
		$("#btnDeleteUser").show();
		getTimeLine(event.target.id);
	}
});

$(".addUser").on("click", function(){
	if($(this).hasClass("user")){
		ballPressed = $(this);
		$(".searchUserBox").hide();
		$(".searchedUsers").hide();
		$("#deleteUserWarning").hide();
		$("#btnDeleteUser").show();
		getTimeLine(event.target.id);
	}else{
		$(".twitterResults").remove();
		$("#btnDeleteUser").hide();
		$("#deleteUserWarning").hide();
		$(".searchUserBox").show();
		$(".addUser").removeClass("active");
		$(this).addClass("active");
	}
});

$("#btnAddUser").on("click", function(){
	$(".active").toggleClass("addUser user");
	var profileImg = $(".profilePicture");
	$(".active").css("background-image", "url(" + profileImg.attr('src') + ")");
	$(".active").attr("id", searchedScreenName);
	saveUser($(".active").attr('class').split(' ')[0] , searchedScreenName, profileImg.attr('src'));
	$(".active").find("img").hide();
	$(".active").removeClass("active");
	$(".searchUserBox").hide();
	$(".searchedUsers").hide();
	
});

$("#btnDeleteUser").on("click", function(){
	
	if(	$("#deleteUserWarning").is(":visible") ){
		ballPressed.toggleClass("user addUser");
		ballPressed.css("background-image", "");
		ballPressed.attr("id", "");
		localStorage.removeItem(ballPressed.attr('class').split(' ')[0]);
		$("#btnDeleteUser").hide();
		$("#deleteUserWarning").hide();
		ballPressed.find("img").show();
		$(".twitterResults").remove();
	}else{
		$("#deleteUserWarning").show();
	}
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
		$(".searchedUsers").show();
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
			if (hashtags.length>0){
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
				$('<br>').appendTo(tweet.children(".tweetBody"));
			}
			var userMentions = data[i].entities.user_mentions;
			for (var j = 0;j< userMentions.length;j++){
				var thelink = $('<a>',{
					text: "@" + userMentions[j].screen_name + "  ",
					href: '#',
					id: userMentions[j].screen_name,
					click: function(){
						getTimeLine(event.target.id);
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
	$(".twitterResults").remove();
	var URL = "search/tweets.json";	
	var querys = new Array("q=" + hashtag, "count=10");
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
		var object = data.statuses;
		for (var i = 0;i< object.length;i++){
			var tweet = $("#tweet").clone().show();
			tweet.children(".tweetHeader").children(".tweetImg").attr("src", object[i].user.profile_image_url);
			tweet.children(".tweetHeader").children(".media-heading").text(object[i].user.name);
			tweet.children(".tweetHeader").children("#tweetText").text(object[i].text);
			var hashtags = object[i].entities.hashtags;
			if (hashtags.length>0){
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
				$('<br>').appendTo(tweet.children(".tweetBody"));
			}
			var userMentions = object[i].entities.user_mentions;		
			for (var j = 0;j< userMentions.length;j++){
				var thelink = $('<a>',{
					text: "@" + userMentions[j].screen_name + "  ",
					href: '#',
					id: userMentions[j].screen_name,
					click: function(){
						getTimeLine(event.target.id);
					}
				}).appendTo(tweet.children(".tweetBody"));
			} 	

			tweet.appendTo("#main1");
			tweet.addClass("twitterResults");
		}
		console.log(object);
	}).fail(function(data){
		console.log("Något gick fel");
		console.log(JSON.stringify(data));
	});
}


function updateUsers(){
	var i;
	for(i = 1; i<9; i++){
		var users = getUsers("ball" + i);
		if(users != null){
			$(".ball" + i).toggleClass("addUser user");
			$(".ball" + i).css("background-image", "url(" + users.image + ")");
			$(".ball" + i).attr("id", users.name);
			$(".ball" + i).find("img").hide();
		}
	}
}

function saveUser(ball, user, img){
	var userObj = '{"users":{"name":"' + user + '","image":"' + img +'"}}';
	obj = JSON.parse(userObj);
	var stringJson = JSON.stringify(obj);
    localStorage.setItem(ball, stringJson);    
}

function getUsers(ball){
	var user = localStorage.getItem(ball);
	
    if(user != null){
		
		var data = JSON.parse(user);
		return data.users;
    }else{
		return;
    }
}
