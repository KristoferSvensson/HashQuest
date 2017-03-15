var bearer = "AAAAAAAAAAAAAAAAAAAAAFQFzgAAAAAAlo069eeiv9pE38ndp0JFqkCQaGc%3DRYRor8IQOf4LCjW4aEwmB4ET0KvoUnMyCFDE1vziWnuxOdlHe4";
var server = "twitter.php";
var searchedScreenName;

$("#btnSearch").on("click", function(){
	getUser($('#search').val());
});

$(".addUser").on("click", function(){
	$(".searchUserBox").toggle();
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