var bearer = "AAAAAAAAAAAAAAAAAAAAAFQFzgAAAAAAlo069eeiv9pE38ndp0JFqkCQaGc%3DRYRor8IQOf4LCjW4aEwmB4ET0KvoUnMyCFDE1vziWnuxOdlHe4";
var server = "twitter.php";
var searchedScreenName;
var ballPressed;
window.onload = updateUsers();

$("#btnSearch").on("click", function(){
	$(".twitterResults").remove();
	$("#progressText").text("");
	$("#progressTextWarning").hide();
	if($('#search').val() != ""){
		getUser($('#search').val());
	} else {
		$("#progressText").text("Please write a screen name in the search field");
		$("#progressTextWarning").show();
	}
});

$("#search").bind("enterKey",function(e){
	$("#btnSearch").click();
});
$("#search").keyup(function(e){
    if(e.keyCode == 13)
    {
       $(this).trigger("enterKey");
    }
});

$(".user").on("click", function(){
	if($(this).hasClass("addUser")){
		$("#progressText").text("");
		$("#progressTextWarning").hide();
		$(".twitterResults").remove();
		$("#btnDeleteUser").hide();
		$("#deleteUserWarning").hide();
		$(".searchUserBox").show();
		$("#search").focus();
		$(".active").removeClass("active");
		$(this).addClass("active");
	}else{
		$("#progressText").text("");
		$("#progressTextWarning").hide();
		ballPressed = $(this);
		$(".active").removeClass("active");
		$(this).addClass("active");
		$(".searchUserBox").hide();
		$(".searchedUsers").hide();
		$("#deleteUserWarning").hide();
		$("#btnDeleteUser").show();
		getTimeLine(event.target.id);
	}
});

$(".addUser").on("click", function(){
	if($(this).hasClass("user")){
		$("#progressText").text("");
		$("#progressTextWarning").hide();
		ballPressed = $(this);
		$(".active").removeClass("active");
		$(this).addClass("active");
		$(".searchUserBox").hide();
		$(".searchedUsers").hide();
		$("#deleteUserWarning").hide();
		$("#btnDeleteUser").show();
		getTimeLine(event.target.id);
	}else{
		$("#progressText").text("");
		$("#progressTextWarning").hide();
		$(".twitterResults").remove();
		$("#btnDeleteUser").hide();
		$("#deleteUserWarning").hide();
		$(".searchUserBox").show();
		$("#search").focus();
		$(".active").removeClass("active");
		$(this).addClass("active");
	}
});

$("#btnAddUser").on("click", function(){
	$(".twitterResults").remove();
	$(".active").toggleClass("addUser user");
	var profileImg = $(".profilePicture");
	$(".active").css("background-image", "url(" + profileImg.attr('src') + ")");
	$(".active").attr("id", searchedScreenName);
	saveUser($(".active").attr('class').split(' ')[0] , searchedScreenName, profileImg.attr('src'));
	$(".active").find("img").hide();
	$(".active").removeClass("active");
	$(".searchUserBox").hide();
	$(".searchedUsers").hide();
	$("#search").val("");
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
		$("#pText").text("Press again to delete " + ballPressed.attr("id") + ".");
	}
});


function getUser(screen_name){
	$("#progressIcon").show();
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
		var imgArray = data[0].profile_image_url.split('_');
		var i;
		var imgUrl = imgArray[0];
		for(i = 1; i<imgArray.length ; i++){
			if(imgArray[i].indexOf("normal") == -1){
				imgUrl += "_" + imgArray[i]
			}
		}
		var typeImg = data[0].profile_image_url.split('.');
		imgUrl += "." + typeImg[typeImg.length-1];
		$("#searchedUserImage").attr("src", imgUrl);
		$("#searchedUserName").text(data[0].name);
		searchedScreenName = data[0].screen_name;
		$(".searchedUsers").show();
		console.log(data);
		$("#progressIcon").hide();
	}).fail(function(data){
		console.log(JSON.stringify(data));
		$("#progressText").text("Something went wrong");
		$("#progressTextWarning").show();
		$("#progressIcon").hide();
	});
}



function getTimeLine(screen_name){
	$("#progressIcon").show();
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
		if(data.length == 0){
			$("#progressText").text("No tweets posted");
			$("#progressTextWarning").show();
		}
		for (var i = 0;i< data.length;i++){
			var tweet = $("#tweet").clone().show();
			tweet.children(".tweetHeader").children(".tweetImg").attr("src", data[i].user.profile_image_url);
			tweet.children(".tweetHeader").children(".media-heading").text(data[i].user.name);
			var hashtags = data[i].entities.hashtags;
			var retweet = data[i].retweeted_status;
			if(retweet){
				tweet.children(".tweetHeader").children("#tweetText").text("RT: " + data[i].retweeted_status.text);
				var media = data[i].retweeted_status.entities.media;
				if(media){	
					createTweetImage(data[i].retweeted_status.entities.media[0].media_url).appendTo(tweet.children(".tweetBody"));
					$('<br>').appendTo(tweet.children(".tweetBody"));
				}
			}else{
				tweet.children(".tweetHeader").children("#tweetText").text(data[i].text);
				var media = data[i].entities.media;
				if(media){
					createTweetImage(data[i].entities.media[0].media_url).appendTo(tweet.children(".tweetBody"));;			
					$('<br>').appendTo(tweet.children(".tweetBody"));
				}	 	
			}
			if (hashtags.length>0){
				for (var j = 0;j< hashtags.length;j++){
					createLink(hashtags[j].text, "#").appendTo(tweet.children(".tweetBody"));
				}
				$('<br>').appendTo(tweet.children(".tweetBody"));
			}
			var userMentions = data[i].entities.user_mentions;
			for (var j = 0;j< userMentions.length;j++){
				createLink(userMentions[j].screen_name, "@").appendTo(tweet.children(".tweetBody"));
			} 	 	
			tweet.appendTo("#main1");
			tweet.addClass("twitterResults");
		}
		$("#progressIcon").hide();
	}).fail(function(data){
		console.log(JSON.stringify(data));
		$("#progressText").text("Something went wrong");
		$("#progressTextWarning").show();
		$("#progressIcon").hide();
	});
}

function hashtagQuest(hashtag){
	$("#progressIcon").show();
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
			var retweet = object[i].retweeted_status;
			if(retweet){
				tweet.children(".tweetHeader").children("#tweetText").text("RT: " + object[i].retweeted_status.text);
				var media = object[i].retweeted_status.entities.media;
				if(media){	
					createTweetImage(object[i].retweeted_status.entities.media[0].media_url).appendTo(tweet.children(".tweetBody"));
					$('<br>').appendTo(tweet.children(".tweetBody"));
				}
			}else{
				tweet.children(".tweetHeader").children("#tweetText").text(object[i].text);
				var media = object[i].entities.media;
				if(media){
					createTweetImage(data[i].entities.media[0].media_url).appendTo(tweet.children(".tweetBody"));;				
					$('<br>').appendTo(tweet.children(".tweetBody"));
				}	 	
			}
			var hashtags = object[i].entities.hashtags;
			if (hashtags.length>0){
				for (var j = 0;j< hashtags.length;j++){
					createLink(hashtags[j].text, "#").appendTo(tweet.children(".tweetBody"));
				}
				$('<br>').appendTo(tweet.children(".tweetBody"));
			}
			var userMentions = object[i].entities.user_mentions;		
			for (var j = 0;j< userMentions.length;j++){
				createLink(userMentions[j].screen_name, "@").appendTo(tweet.children(".tweetBody"));
			} 	
			tweet.appendTo("#main1");
			tweet.addClass("twitterResults");
		}
		$("#progressIcon").hide();
	}).fail(function(data){
		console.log(JSON.stringify(data));
		$("#progressText").text("Something went wrong");
		$("#progressTextWarning").show();
		$("#progressIcon").hide();
	});
}

function createLink(linkText, sign){
	var thelink = $('<a>',{
		text: sign + linkText + "  ",
		href: '#',
		id: linkText,
		click: function(){
			if (sign =="#"){
				hashtagQuest(event.target.id);
			} else {
				getTimeLine(event.target.id);
			}
		}
	});
	return thelink;
}

function createTweetImage(imageURL){
	var image = $("#idTweetPhoto").clone().show();	
	image.attr("src", imageURL);
	image.addClass("imageResult");
	return image;
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
