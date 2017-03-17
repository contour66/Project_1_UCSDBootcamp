var player;
var video = "";
var playlist = "";
// var searchType = "track";
// var tempArtist = "";
// var tempMusicName = "";

sessionStorage.setItem('tempArtist', ""); //sessionStorage.getItem('tempArtist')
sessionStorage.setItem('searchType', "track"); //sessionStorage.getItem('searchType')
sessionStorage.setItem('tempMusicName', ""); //sessionStorage.getItem('tempMusicName')
//sessionStorage.setItem('playerExists', 'false');
var playerExists = false;
var PossibleSongs;

//Creates a songlist in the dom which the user can add songs contained in the list to the current Playlist
//
//@searchTerm is [artist, musicName] @typeOfSearch determines if searchTerm is for album or artist
var SongList = function(searchTerm,typeOfSearch){
	console.log("passed here");
    //Single input for album

    this.search = searchTerm[0];
    this.searchNext = searchTerm[1];

    this.artistName = [];
    this.portrait = [];

    //Always an array
    this.songName = [];
    this.streamPage = [];

    self = this;

    this.addSong = function(e){
        
        console.log(e.attr("songName"));
    }

    this.createTable = function(){
        console.log("Attempting to add songlist", self.songName);

        $("#songList").empty();

        var labels = $("<tr>").append($("<th>").html("Icon"))
							.append($("<th>").html("Artist"))
							.append($("<th>").html("Stream Page"))
							.append($("<th>").html("Add to Playlist"))
		$("#songList").append(labels);

        if(typeOfSearch === "artist"){
        	console.log("For artist");
            for (var i = 0; i < self.songName.length; i++) {
            	
                var tempRow = $("<tr>")
                tempRow.append($("<th>").html("<image src = '" + self.portrait[i] + "'>"));
                tempRow.append($("<th>").html(self.artistName[i]));
                tempRow.append($("<th>").html(self.songName[i]));
                tempRow.append($("<th>").html("<a href='" + self.streamPage[i] + "'>LastFM Song Page</a>"));
                tempRow.append($("<th>").html("<span class='add-song' id='" + self.songName[i] + i +"'' songName='" + self.songName[i] + "' artistName='" + self.artistName[i] + "'>" + "+" + "</span>"));
                $("#songList").children().append(tempRow);
            }

            $(".add-song").click(function(){
            	YoutubePlaylist.addSong($(this).attr("songName"), $(this).attr("artistName"));
            });

            initYoutubeSearchButtons();
        }
        else if(typeOfSearch === "album"){
        	console.log("For album");
        	console.log(self.songName.length);
            for (var i = 0; i < self.songName.length; i++) {
                var tempRow = $("<tr>")
                tempRow.append($("<th>").html("<image src = '" + self.portrait + "'>"));
                tempRow.append($("<th>").html(self.artistName));
                tempRow.append($("<th>").html(self.songName[i]));
                tempRow.append($("<th>").html("<a href='" + self.streamPage[i] + "'>LastFM Song Page</a>"));
                tempRow.append($("<th>").html("<span class='add-song' id='" + self.songName[i] + i +"'' songName='" + self.songName[i] + "' artistName='" + self.artistName + "'>" + "+" + "</span>"));
                $("#songList").children().append(tempRow);
            }

            $(".add-song").click(function(){
            	YoutubePlaylist.addSong($(this).attr("songName"), $(this).attr("artistName"));
            	YoutubePlaylist.refreshPlaylist();
            });

            initYoutubeSearchButtons();
        }
        else{
        	
        }
    }

    this.fillSongList = function(){
        if(typeOfSearch === "artist"){
            var artistURL = "http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=" + self.search + "&api_key=932e4c349b7caae7626ea15a10649e1f&format=json";
            
            $.ajax({
                url: artistURL, 
                method: 'GET'
            }).done(function(response){
            	var forControl = response.toptracks.track.length;
            	console.log(response);
            	if(response.toptracks.track.length > 5){
            		forControl = 5;
            	}

                for(var i = 0; i < forControl; i++)
                {
                    self.songName.push(response.toptracks.track[i].name);
                    self.artistName.push(response.toptracks.track[i].artist.name);
                    //Gets the medium sized portrait
                    self.portrait.push(response.toptracks.track[i].image[1]["#text"]);
                    self.streamPage.push(response.toptracks.track[i].url);
                }
                $("#songList").removeClass("hidden");
        		self.createTable();
        		
            });
        }
        else if(typeOfSearch === "album"){
            var albumURL = "http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=932e4c349b7caae7626ea15a10649e1f&artist="+ self.search + "&album=" + self.searchNext + "&format=json";

            $.ajax({
                url: albumURL, 
                method: 'GET'
            }).done(function(response){
            	var forControl = response.album.tracks.track.length;
            	console.log(response);
            	if(response.album.tracks.track.length > 5){
            		forControl = 5;
            	}

                self.artistName = response.album.artist;
                self.portrait = response.album.image[1]["#text"];

                for(var i = 0; i < forControl; i++)
                {
                    self.songName.push(response.album.tracks.track[i].name);
                    self.streamPage.push(response.album.tracks.track[i].url);
                }
                $("#songList").removeClass("hidden");
        		self.createTable();
        		
            });
        }
        else{
            console.log("<<<!!!Error At SongList: typeOfSearch was not within bounds!!!>>>");
        }
    }();

    // this.clearSongList = function(){
    //     this.songName = [];
    //     this.artistName = [];
    //     this.portrait = [];
    //     this.streamPage = [];
    //     $("#songList").empty();
    //     $("#songList").addClass("hidden");
    // }   
}

var Song = function(name, artist){
	this.songName = name;
	this.artistName = artist;
	// if(this.songName !== ""){
	// 	this.songName = sessionStorage.getItem('tempMusicName');
	// }
	// this.artistName;
	// if(this.artistName === ""){
	// 	this.artistName = sessionStorage.getItem('tempArtist');
	// }
	// else{

	// 	this.artistName = "Unknown";
	// }
	sessionStorage.setItem('tempMusicName', '');
	sessionStorage.setItem('tempArtist', '');

	self = this;

	this.getSongId = function(){
		var search = self.songName + " " + self.artistName + " Acoustic";

		console.log("What the fucK: " + search);

		if(search === ""){
			search = "Acoustic Kitty"
		}

		//https://www.googleapis.com/youtube/v3/search?&q=cat&part=snippet&type=video&key=AIzaSyC6KOmJ_6LXQJg_fa5qwpl1L20JWwW-NiY

		var apiKey = "AIzaSyAdyUe4SKUg4MAl4qpKhHu3ZnWnJTtiy_k";
		var queryURL = "https://www.googleapis.com/youtube/v3/search?" + 
		//Search query
        "&q=" + encodeURI(search) +
        //part type
        "&part=snippet" +
        //Api key
        "&type=video" +
        "&videoEmbeddable=true" +
        "&videoSyndicated=true" +
        "&order=viewCount" +
        "&topicId=/m/04rlf" +
        "&key=" + apiKey;

        console.log(queryURL);

		$.ajax({
			url: queryURL, 
			method: 'GET'
		}).done(function(response){
			$.ajax({
				url: "https://www.googleapis.com/youtube/v3/videos?part=statistics&id=" + response.items[0].id.videoId + "&key=" + apiKey, 
				method: 'GET'
			}).done(function(data){
				console.log
				self.id = response.items[0].id.videoId;
				YoutubePlaylist.refreshPlaylist();
			});
		});
	}();
}

var Playlist = function(){
	this.playlistItems = [];
	self = this;
	//


	// this.removeSong = function(id){
	// 	for(var i = 0; i > playlistItems.length; i++){
	// 		if()
	// 	}
	// }

	//Refreshes playlist table with current song values
	this.refreshPlaylist = function(){
		$("#playlistTable").empty();

		//Default labels for after empty
		var labels = $("<tr>").append($("<th>").html("Title"))
							.append($("<th>").html("Artist"))
							.append($("<th>").html("X"))
		$("#playlistTable").append(labels);

		//Populate playlist table with playlistItems content
		for (var i = 0; i < this.playlistItems.length; i++) {
			$("#playlistTable").append($("<tr>").append($("<th>").html(this.playlistItems[i].songName))
												.append($("<th>").html(this.playlistItems[i].artistName))
												.append($("<th>").html(this.playlistItems[i].id))
			);
		}
	}

	//Refreshes player with current playlist
	this.addPlaylist = function(){
		var playlistCondensed = "";
		for (var i = 0; i < this.playlistItems.length; i++) {
			playlistCondensed += "," + this.playlistItems[i].id;
		}
		loadPlaylist(playlistCondensed);
	}

	//@song: Get from SearchList artist and song
	this.addSong = function(song, artist){
		this.playlistItems.push(new Song(song, artist));;	
	}
}

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
      height: '390',
      width: '640',
      videoId: video,
      playerVars: {		modestbranding: 1, autoplay: 0, showinfo: 1	},
      events: {
        'onReady': function (event) {
	        event.target.playVideo();
	      },
        'onStateChange': function (event) {
	        if (event.data == YT.PlayerState.PLAYING && !done) {
	          setTimeout(function () {
		        player.stopVideo();
		      }, 6000);
	          done = true;
	        }
	      }
      }

    });
}

var slideOutTop = function(){
	$("#cat-image").addClass("slide-out hidden");
	$("#info").addClass("slide-out hidden");
}

var addPlayer = function(){
			// 2. This code loads the IFrame Player API code asynchronously.
	      // console.log(playlist);
	      var tag = document.createElement('script');

	      tag.src = "https://www.youtube.com/iframe_api";
	      var firstScriptTag = document.getElementsByTagName('script')[0];
	      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

	      // 3. This function creates an <iframe> (and YouTube player)
	      //    after the API code downloads.
	      var done = false;

	      //todo use the playlist arg instead
			
		  onYouTubeIframeAPIReady(playlist,video);
	      
	      // 4. The API will call this function when the video player is ready.
	      

	      // 5. The API calls this function when the player's state changes.
	      //    The function indicates that when playing a video (state=1),
	      //    the player should play for six seconds and then stop.
	      
	      $('body').append(tag);
}

var searchYoutube = function(){
	var search = $("#search").val();

	if(playerExists){
		disableSearchButton();
		console.log("Player already Exists", sessionStorage.getItem('searchType'));
		if(sessionStorage.getItem('searchType') === "artist" || sessionStorage.getItem('searchType') === "album"){
			PossibleSongs = new SongList([sessionStorage.getItem('tempArtist'),sessionStorage.getItem('tempMusicName')],sessionStorage.getItem('searchType'));
		}
		else{
			if(sessionStorage.getItem("artistName") !== ''){
				YoutubePlaylist.addSong(sessionStorage.getItem("tempMusicName"), sessionStorage.getItem("tempArtist"));
			}
			else{
				YoutubePlaylist.addSong(search);
			}
			initYoutubeSearchButtons();
		}
	}
	else{
		loadPlaylist();
		disableSearchButton();
		console.log("Player does not exist", sessionStorage.getItem('searchType'));
		if(sessionStorage.getItem('searchType') === "artist" || sessionStorage.getItem('searchType') === "album"){
			PossibleSongs = new SongList([sessionStorage.getItem('tempArtist'),sessionStorage.getItem('tempMusicName')],sessionStorage.getItem('searchType'));
		}
		else{
			if(sessionStorage.getItem("artistName") !== ''){
				YoutubePlaylist.addSong(sessionStorage.getItem("tempMusicName"), sessionStorage.getItem("tempArtist"));
			}
			else{
				YoutubePlaylist.addSong(search);
			}
			initYoutubeSearchButtons();
		}
	}
}

var mutePlayer = function(){
	player.mute();
}

var loadPlaylist = function(playlistVal){
	var search = $("#search").val() + " Acoustic";
	if(playerExists){
		player.loadPlaylist(playlistVal);
	}
	else{
		//player.loadPlaylist(playlistVal);
		if(search === ""){
			search = "Acoustic Kitty"
		}

		var apiKey = "AIzaSyAdyUe4SKUg4MAl4qpKhHu3ZnWnJTtiy_k";
		var queryURL = "https://www.googleapis.com/youtube/v3/search?" + 
		//Search query
	    "&q=" + encodeURI(search) +
	    //part type
	    "&part=snippet" +
	    //Api key
	    "&type=video" +
	    "&videoEmbeddable=true" +
	    "&videoSyndicated=true" +
	    "&topicId=/m/04rlf" +
	    "&key=" + apiKey;

	    //addPlayer('NS0txu_Kzl8,5dsGWM5XGdg,tntOCGkgt98,M7lc1UVf-VE');
		$.ajax({
			url: queryURL, 
			method: 'GET'
		}).done(function(response){
			playerExists = true;
			$("loading").removeClass("hidden");
			playlist = response.items[0].id.videoId;
			video = response.items[0].id.videoId;
			for (var i = 1; i < response.items.length; i++) {
				playlist += "," + response.items[i].id.videoId;
			}
			console.log(playlist);
			addPlayer(playlist, video);
		});
	}
}

// var p = 'NS0txu_Kzl8,5dsGWM5XGdg,tntOCGkgt98,M7lc1UVf-VE';
// addPlayer(p);

var YoutubePlaylist = new Playlist();

var initYoutubeSearchButtons = function(){
	$("#search").val("");

	$("#submit").click(function(e){
		e.preventDefault();
		searchYoutube();
		if(!playerExists){
			slideOutTop();
		}
		//YoutubePlaylist.addPlaylist();
	});

}

var disableSearchButton = function(){
	$("#submit").off();
	//$("#search").off();
}

$(document).ready(function(){
	initYoutubeSearchButtons();

	$("#mute").click(function(e){
		e.preventDefault();
		mutePlayer();
		player.setPlaybackQuality("suggestedQuality:", "large");
	});

	$("#load").click(function(e){
		e.preventDefault();
		// loadPlaylist('NS0txu_Kzl8,5dsGWM5XGdg,tntOCGkgt98,M7lc1UVf-VE');
		YoutubePlaylist.addPlaylist();
	});
	
})