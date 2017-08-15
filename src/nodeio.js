var serveraddr;

var app = require('http'),
    io = require('socket.io'),
    os = require('os'),
    url = require("url"),
    path = require("path"),
    qs = require("querystring"),
    fs = require('fs'),
    formidable = require('formidable'),
	 sqlite3 = require("sqlite3").verbose();
	

//create resources and playlist directories if they do not exist
	fs.mkdir(__dirname + '/resources/', function(err) {
     if (err) {
         if (err.code == 'EEXIST') {// ignore the error if the folder already exists
         } 
         else console.log(err); // something else went wrong
     } 
     else {// successfully created folder
        		console.log('created dir resources');	
     } 
  });

	fs.mkdir(__dirname + '/playlists/', function(err) {
     if (err) {
         if (err.code == 'EEXIST') {// ignore the error if the folder already exists
         } 
         else console.log(err); // something else went wrong
     } 
     else {// successfully created folder
        		console.log('created dir playlists');	
     } 
  });

	 
var dbfile = "livlab.sqlite";
var dbexists = fs.existsSync(dbfile);
var db = new sqlite3.Database(dbfile);  //create or open if exists

db.serialize(function() {
  console.log(dbexists);	
  if(!dbexists) {
    db.run("CREATE TABLE Projects (id INTEGER PRIMARY KEY, name TEXT, createdate TEXT, lastdate TEXT, creator TEXT, json TEXT)",function(err) { console.log('Projects',err);});

    db.run("CREATE TABLE Resources (id INTEGER PRIMARY KEY, name TEXT, type TEXT, jsonstate TEXT)",function(err) { console.log('Resources',err);});  //library table

  }

});

db.close();

function getIPAddress(idx) {

    var addresses = [],
        interfaces = os.networkInterfaces(),
        name, ifaces, iface;

    for (name in interfaces) {
        if(interfaces.hasOwnProperty(name)){
            ifaces = interfaces[name];
            if(!/(loopback|vmware|internal)/gi.test(name)){
                for (var i = 0; i < ifaces.length; i++) {
                    iface = ifaces[i];
                    if (iface.family === 'IPv4' &&  !iface.internal && iface.address !== '127.0.0.1') {
                        addresses.push(iface.address);
                    }
                }
            }
        }
    }

    // if an index is passed only return it.
    if(idx >= 0)
        return addresses[idx];
    return addresses;
}

function makeScreen(scrname) {

	var htmlstr = '<!DOCTYPE HTML><html><head>';
	htmlstr = htmlstr + '<meta name="viewport" content="width=device-width, initial-scale=1" />';
	htmlstr = htmlstr + '<script type="text/javascript" src="kinetic-v5.1.0.min.js"></script>';
	htmlstr = htmlstr + '<script type="text/javascript" src="jquery-2.1.1.min.js"></script>';
	htmlstr = htmlstr + '<script src="/socket.io/socket.io.js"></script>';
	htmlstr = htmlstr + '<script src="llcore.js"></script>';			
	htmlstr = htmlstr + '<script src="arrows.js"></script>';			
	htmlstr = htmlstr + '<script src="actions.js"></script>';			
	htmlstr = htmlstr + '<script src="screen.js"></script>';		
	//htmlstr = htmlstr + '<script src="scrmin.js"></script>';  
   htmlstr = htmlstr + '<style>body {margin: 0px;padding: 0px;} #container {position: relative;} #message {position: relative;}</style>';
   htmlstr = htmlstr + '<script type="text/javascript" >';
   htmlstr = htmlstr + 'var socketmessage = "'+scrname+'";'; //name of the screen
	htmlstr = htmlstr + '</script></head>';
   htmlstr = htmlstr + '<body>';
   //htmlstr = htmlstr + '<h3>This is screen:'+scrname+'</h3>';
   htmlstr = htmlstr + '<div id="container">';
   htmlstr = htmlstr + '</div></body></html>';	
	
	return htmlstr;
}

function copyFile(source, target) {
    return new Promise(function(resolve, reject) {
        var rd = fs.createReadStream(source);
        rd.on('error', reject);
        var wr = fs.createWriteStream(target);
        wr.on('error', reject);
        wr.on('finish', resolve);
        rd.pipe(wr);
    });
}

function writePlayfileandImages(fname,htmlstr,imglist)
{
 	fs.writeFile(__dirname + '/playlists/'+fname+'/'+fname+'.html', htmlstr,  function(err) {
		if (err) {
 			return console.error(err);
		}
	});
	//make image directory
	fs.mkdir(__dirname + '/playlists/'+fname+'/images/', function(err) {
     if (err) {
         if (err.code == 'EEXIST') {// ignore the error if the folder already exists
         	for (var imn=0;imn<imglist.length;imn++) { 
         		imgfilename = imglist[imn];
           		copyFile(__dirname+'/resources/'+imgfilename, __dirname + '/playlists/'+fname+'/images/'+imgfilename);	
           	}	 
         } 
         else console.log(err); // something else went wrong
     } 
     else {// successfully created folder
      	for (var imn=0;imn<imglist.length;imn++) { 
      		imgfilename = imglist[imn];
        		copyFile(__dirname+'/resources/'+imgfilename, __dirname + '/playlists/'+fname+'/images/'+imgfilename);	
        	}	 
  			
     } 
  });

}

function loadpage(req,res) {
	
	var contentType = 'text/html';
	var filePath = '.' + req.url;
	//console.log(req.url);
	var extname = path.extname(filePath);
	switch (extname) {
		case '.html':
			contentType = 'text/html';
			break;
		case '.js':
			contentType = 'text/javascript';
			break;
		case '.css':
			contentType = 'text/css';
			break;
	}
	fs.exists(filePath, function(exists) {
	  	//console.log(filePath);
		if (exists) {
			fs.readFile(filePath, function(error, content) {
				if (error) {
					res.writeHead(500);
					res.end();
				}
				else {
					res.writeHead(200, { 'Content-Type': contentType });
					res.end(content, 'utf-8');
				}
			});
		}
		else if (extname == '.html') {
			res.writeHead(200, { 'Content-Type': contentType });
			var scrcontent = makeScreen(path.basename(filePath,'.html'));
			res.end(scrcontent, 'utf-8');
		}
		else {
			res.writeHead(404);
			res.end();
		}
	});

} 	
 	    
var urlMap = {
  '/' : function (req, res) {
 
  },
  '/getaddress' : function (req, res) {
  	 serveraddr = getIPAddress();
  	 console.log(serveraddr);
 
    res.end(JSON.stringify(serveraddr));  
  },
  '/uploadresource' : function (req, res) {
   if (req.method == 'POST') {
   			 
   	       	var form = new formidable.IncomingForm();
   	       	form.keepExtensions = true;
   	       	//form.uploadDir = __dirname + "/resources";	
   	       	form.parse(req);
   	       	
					
   	       	form.on('file', function(name, file) {
   	       		var newfname = __dirname + "/resources/"+file.name;
   	       		fs.rename(file.path,newfname , function (err) {
						  if ( err ) {console.log('ERROR: ' + err);}
						});
					});
					
					form.on('progress', function(bytesReceived, bytesExpected) {
						var p = (bytesReceived/bytesExpected) * 100;
				  		res.write("Uploading " + parseInt(p)+ " %\n");
        	
					});
					
					form.on('end', function() {
				 		res.end("File Upload Complete");
				 		
					});
				 	
        		
    } 
    else {
        
        res.end();
    }	    
  },  
  '/getresources' : function (req, res) {
  	  var resp = new Array();
	  fs.readdir(__dirname + "/resources", function(error,files) {
  			jsonresp = JSON.stringify(files);
  			//console.log(jsonresp);
			res.end(jsonresp);
  
	  });



  },
  '/addproject' : function (req, res) {
      if (req.method == 'POST') {
        var body = '';
        req.on('data', function (data) {
            body += data;
//            console.log("Partial body: " + body);
        });
        req.on('end', function () {
     		  var decodedBody = qs.parse(body);
			  var pid = decodedBody.id;
		  	  var pname = decodedBody.name;
		  	  var pcdate = decodedBody.cdate;
		  	  var pldate = decodedBody.ldate;
		  	  var pcreator = decodedBody.creator;
		  	  var pstate = decodedBody.state;
  				
	
/*  	  var pid = (url.parse(req.url,true)).query.id;
  	  var pname = (url.parse(req.url,true)).query.name;
  	  var pcdate = (url.parse(req.url,true)).query.cdate;
  	  var pldate = (url.parse(req.url,true)).query.ldate;
  	  var pcreator = (url.parse(req.url,true)).query.creator;
  	  var pstate = (url.parse(req.url,true)).query.state;
*/  	  
			  var insid = 0;
			  var db = new sqlite3.Database(dbfile);
			  //check if project exists
		  	  var sql = "SELECT name,createdate,lastdate,creator,json FROM Projects WHERE id='"+pid+"'";
		
			  db.each(sql, function (error, row) {
			  	 //console.log(row.name);
			  	
		  		}, function(err, rows) {
		  				//console.log(rows);
		  				if (rows>0) {
						  sql = "UPDATE Projects SET name='"+pname+"',createdate='"+pcdate+"',lastdate='"+pldate+"',creator='"+pcreator+"',json='"+pstate+"' WHERE id='"+pid+"'";
						  //console.log(sql);
						  db.run(sql, function (error) {
						  				insid = pid;
								 	 	db.close();
							  			res.end(insid.toString());
						  	});						  
		  				
		  				}
		  				else {
						  sql = "INSERT INTO Projects (name,createdate,lastdate,creator,json) VALUES ('"+pname+"','"+pcdate+"','"+pldate+"','"+pcreator+"','"+pstate+"')";
		
						  db.run(sql, function (error) {
						  		db.each("SELECT last_insert_rowid() AS id FROM Projects", function(err, row) {
			      				insid = row.id;
			  						}, function(err, rows) {
								 	 	db.close();
							  			res.end(insid.toString());
			  						});
						  	});						  
						}  				
		  		});
        });
//        res.writeHead(200, {'Content-Type': 'text/html'});
  		}	  
  },
  '/removeproject' : function (req, res) {
  	  var pid = (url.parse(req.url,true)).query.id;
	  var db = new sqlite3.Database(dbfile);
	  sql = "DELETE FROM Projects WHERE id='"+pid+"'";
	  db.run(sql, function (error) {
	  		console.log('deleted '+pid);
	 	 	db.close();
	  		res.end();	
	  	});						  
  },
  '/getprojects' : function (req, res) {
  	  var resp = new Array();
	  var db = new sqlite3.Database(dbfile);
  	  var sql = "SELECT id,name,createdate,lastdate,creator,json FROM Projects";

	  db.each(sql, function (error, row) {
			resp.push(row);	
			//console.log(row);  	
	  	
  		}, function(err, rows) {
			  	  		jsonresp = JSON.stringify(resp);
  						//console.log(jsonresp);
	  					db.close();		
						res.end(jsonresp);
  		});
	

  },
  '/getobjects' : function (req, res) {
  	  var filterstr = (url.parse(req.url,true)).query.filter;
  	  var resp = new Array();
	  var db = new sqlite3.Database(dbfile);
	  if (filterstr == 'all') {
	  	var sql = "SELECT id,name,type,jsonstate FROM Resources";
	  }
	  else {
	   var sql = "SELECT id,name,type,jsonstate FROM Resources WHERE name LIKE '%"+filterstr+"%'";
	  }

	  db.each(sql, function (error, row) {
			resp.push(row);	
			//console.log(row);  	
	  	
  		}, function(err, rows) {
			  	  		jsonresp = JSON.stringify(resp);
  						//console.log(jsonresp);
	  					db.close();		
						res.end(jsonresp);
  		});
	

  },
  '/addlibobj' : function (req, res) {
  	  var rname = (url.parse(req.url,true)).query.name;
  	  var rtype = (url.parse(req.url,true)).query.type;
  	  var rstate = (url.parse(req.url,true)).query.jsonstate;
  	  //console.log(rname,rtype,rstate);
	  var db = new sqlite3.Database(dbfile);
	  sql = "INSERT INTO Resources (name,type,jsonstate) VALUES ('"+rname+"','"+rtype+"','"+rstate+"')";
	  db.run(sql, function (error) {
	 	 	db.close();
	  		res.end();	
	  	});						  
  },
  '/removelibobj' : function (req, res) {
  	  var rid = (url.parse(req.url,true)).query.id;
	  var db = new sqlite3.Database(dbfile);
	  sql = "DELETE FROM Resources WHERE id='"+rid+"'";
	  db.run(sql, function (error) {
	 	 	db.close();
	  		res.end();	
	  	});						  
  },
  '/saveplaylist' : function (req, res) {
/*  		var fname = (url.parse(req.url,true)).query.projectname;
  		var playstate = (url.parse(req.url,true)).query.playlist;
  		var playobj = JSON.parse(playstate);
  		var imglist = playobj.playimages;
*/  		
    if (req.method == 'POST') {
        var body = '';
        req.on('data', function (data) {
            body += data;
//            console.log("Partial body: " + body);
        });
        req.on('end', function () {
        		var decodedBody = qs.parse(body);
            //console.log("Body: " + body);
            var fname = decodedBody.projectname;
            var playstate = decodedBody.playlist;
		  		var playobj = JSON.parse(playstate);
  				var imglist = playobj.playimages;

		  		console.log(fname,imglist);
		 // 		var imglistobj = JSON.parse(imglist);
		  		//console.log(playstate);
		  		//serveraddr = getIPAddress();
				var htmlstr = '<!DOCTYPE HTML><html><head>';
				htmlstr = htmlstr + '<meta name="viewport" content="width=device-width, initial-scale=1" />';
				htmlstr = htmlstr + '<link rel="stylesheet" href="../../playscreen.css">';
				htmlstr = htmlstr + '<script src="../../jquery-2.1.1.min.js"></script>';
				htmlstr = htmlstr + '<script src="../../kinetic-v5.1.0.min.js"></script>';
				htmlstr = htmlstr + '<script src="../../socket.io/socket.io.js"></script>';
		
			   htmlstr = htmlstr + '<script type="text/javascript" >';
			   htmlstr = htmlstr + 'peinfo='+playstate+';';
				htmlstr = htmlstr + '</script></head>';
				htmlstr = htmlstr + '<script src="../../playscreen.js"></script>';  
			   htmlstr = htmlstr + '<body><div id="page">';
			   htmlstr = htmlstr + '<div id="functionbox"><input id="playaction" type="checkbox" onchange="setPlaymode()" >play mode<button  type="button" id="nextbutton" onclick="gonextEvent()">next</button></div>';
			   htmlstr = htmlstr + '<div id="playspace"></div></div></body></html>';
				htmlstr = htmlstr + '<script> $( document ).ready(setup());</script>';
			     		
				fs.mkdir(__dirname + '/playlists/'+fname+'/', function(err) {
		        if (err) {
		            if (err.code == 'EEXIST') {// ignore the error if the folder already exists
		            	writePlayfileandImages(fname,htmlstr,imglist);
				   				 
		            } 
		            else console.log(err); // something else went wrong
		        } 
		        else {// successfully created folder
		            	writePlayfileandImages(fname,htmlstr,imglist);
		    	  		
		 		 }
		 		 });
		 		 
        });
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('post received');
    }
 		 
  },
  
  '/getplaylists' : function (req, res) {
  	  var resp = new Array();
	  fs.readdir(__dirname + "/playlists", function(error,files) {
  			jsonresp = JSON.stringify(files);
  			//console.log(jsonresp);
			res.end(jsonresp);
  
	  });
  }  
      
}

var NOT_FOUND = "Not Found\n";

function notFound(req, res) {
  res.writeHead(404, [ ["Content-Type", "text/plain"]
                      , ["Content-Length", NOT_FOUND.length]
                      ]);
  res.write(NOT_FOUND);
  res.end();
}


httpServer = app.createServer(function (req, res) {
  // Get the url and associate the function to the handler
  // or
  // Trigger the 404
  
  handler  = urlMap[url.parse(req.url).pathname] || loadpage || notFound;

  		
  handler(req, res);
    
}).listen(1337);


var webSocket = io(httpServer);
//webSocket.set('log level', 1);
webSocket.on('connection', function(socket){
  socket.on('updateEvents', function(msg){
    socket.broadcast.emit('updateEvents', msg);
    //console.log(msg);
  }); 
  socket.on('designmsg', function(msg){
    socket.broadcast.emit('designmsg', msg);
    //console.log(msg);    
  });
  socket.on('screenmsg', function(msg){
  	 var scrmsg = JSON.parse(msg);
  	 //console.log(msg);
  	 var viewname = scrmsg.view;
  	 //console.log(viewname);
  	 var txmsg = JSON.stringify(scrmsg.scrtxmsg);	
    socket.broadcast.emit(viewname, txmsg);
    //console.log(txmsg);    
  });
});

