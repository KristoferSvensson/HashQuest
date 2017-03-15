<?php

if(isset($_GET['docs'])){
?>
<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
<style>
body{padding:0px 20px;}
</style>

<h1>Dokumentation</h1>

<p>I detta exempel antar vi att adressen till <code>twitter.php</code> är <code>127.0.0.1/twitter.php</code>. Hit skickar man tre parametrar:</p>
<ul>
	<li><strong>url</strong> (sträng), t.ex. <em>search/tweets.json</em></li>
	<li><strong>bearer</strong> (sträng), t.ex. <em>AAAAAAAAAAAAAAAAAAAAAMMazgAAAAAAJqM...</em>etc.</li>
	<li><strong>query</strong> (array), t.ex. <em>query[]=<b>q=Elfsborg</b></em> (där <b>q=Elfsborg</b> är varje parameter vi vill skicka med. Här kan vi alltså skicka med flera parametrar)</li>
</ul>

<h2>Exempelanrop</h2>
<h3>Tweets</h3>
<p>Låt säga att vi vill söka efter en användare, då behöver vi ange följande:
<ul>
	<li><strong>url</strong>=<em>search/tweets.json</em></li>
	<li><strong>bearer</strong>=<em>AAAAAAAAAAAAAAAAAAAAAMMazgAAAAAAJqM...</em></li>
	<li><strong>query[]</strong>=<em>q=Elfsborg</em></li>
</ul>
<p>... och den totala söksträngen blir då: <code>127.0.0.1/twitter.php?bearer=AAAAAAAAAAAAAAAAAAAAAMM...&url=search/tweets.json&query[]=q=Elfsborg</code></p>

<h3>Timeline</h3>
<p>Låt säga att vi vill söka efter en användares timeline, då behöver vi ange följande:
<ul>
	<li><strong>url</strong>=<em>statuses/user_timeline.json</em></li>
	<li><strong>bearer</strong>=<em>AAAAAAAAAAAAAAAAAAAAAMMazgAAAAAAJqM...</em></li>
	<li><strong>query[]</strong>=<em>screen_name=Tibbelit</em></li>
</ul>
<p>... och den totala söksträngen blir då: <code>127.0.0.1/twitter.php?bearer=AAAAAAAAAAAAAAAAAAAAAMM...&url=statuses/user_timeline.json&query[]=screen_name=Tibbelit</code></p>

<h2>Testa anrop</h2>

<form action="twitter.php">
	<label>
		url: <input type="text" name="url" placeholder="search/tweets.json" class="form-control">
	</label>
	<label>
		bearer: <input type="text" name="bearer" placeholder="AAAAAAAAAAAAAAAAAAAAAMMazgAAAAAAJqM..." class="form-control">
	</label>
	<label>
		query: <input type="text" name="query[]" placeholder="q=Elfsborg" class="form-control">
	</label>
	<input type="submit" value="Testa!" class="btn btn-success">
</form>

<h2>Testa med flera parametrar</h2>
<form action="twitter.php">
	<label>
		url: <input type="text" name="url" placeholder="statuses/user_timeline.json" class="form-control">
	</label>
	<label>
		bearer: <input type="text" name="bearer" placeholder="AAAAAAAAAAAAAAAAAAAAAMMazgAAAAAAJqM..." class="form-control">
	</label>
	<label>
		query(1): <input type="text" name="query[]" placeholder="screen_name=Tibbelit" class="form-control">
	</label>
	<label>
		query(2): <input type="text" name="query[]" placeholder="count=5" class="form-control">
	</label>
	<label>
		query(3): <input type="text" name="query[]" placeholder="contributor_details=false" class="form-control">
	</label>
	<input type="submit" value="Testa!" class="btn btn-success">
</form>
<?php

}else{
	$bearer = $_GET['bearer'];
	$url = "https://api.twitter.com/1.1/".$_GET['url']."?";
	foreach($_GET['query'] as $query){
		$url .= explode("=",$query)[0]."=".urlencode(explode("=",$query)[1])."&";
	}

	// Create a stream
	$opts = array(
	  'http'=>array(
		'method'=>"GET",
		'header'=>"Authorization: Bearer $bearer"
	  )
	);

	$context = stream_context_create($opts);

	// Open the file using the HTTP headers set above
	$file = file_get_contents($url, false, $context);

	echo $file;
}
?>