var hostaddr = 'http://'+window.location.hostname+':'+window.location.port;


function uploadFile()
 {
 	/**
 	* Upload a file selected with an input file type element id="fimg" and do an ajax post to nodeio which will save it in the appropriate directory
 	*/
              var fdata = new FormData();
              var fileid = document.getElementById("fimg");
              var files = fileid.files;
              for (var i=0;i<files.length;i++) {
              	var ifile = files[i];
              	fdata.append("imgfiles", ifile);
           		}
              $.ajax({
						  url: hostaddr+"/uploadplaylist",
						  type: "POST",
						  data: fdata,
						  processData: false,  // tell jQuery not to process the data
						  contentType: false})   // tell jQuery not to set contentType
						  .done(function() {
							//alert( "success" );
							 loadResources();
							})
							.fail(function() {
							alert( "error" );
							})
							.always(function() {
							//alert( "complete" );
							});
						
 }
 
function openPlaylist(el)
{
	selecteddir = el.getAttribute('data-filename');
	var win = window.open(hostaddr+'/playlists/'+selecteddir+'/'+selecteddir+'.html', '_blank');
	if(win){
	    //Browser has allowed it to be opened
	    win.focus();
	}else{
	    //Broswer has blocked it
	    alert('Please allow popups for this site');
	}
}
 
function loadPlaylists()
{
	/**
	* Load the uploaded playlists by doing a get ajax call to nodeio
	*/ 
		$('#playlistspace').empty();
				$.getJSON( hostaddr+"/getplaylists", function( data ) {
					//var items = [];
					$.each( data, function(index,item ) {
						//console.log(item);
						$('<div class="tablerow"><div class="titlecell">'+item+'</div><div class="buttoncell"><button class="actionbutton"  data-filename="'+item+'" onclick="openPlaylist(this)">open</button></div></div></div>').appendTo( '#playlistspace' );

					}); 
				});
						

}

function setup()
{
	loadPlaylists();

}