var express = require('express')
var app = express()
var path = require('path')

var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())

app.set('view engine', 'html')
app.engine('html', require('ejs').renderFile)

app.use(express.static(__dirname + '/public'));


app.get('/', (req, res)=>{
	res.render('index.html')
})

app.get('/about', (req, res)=>{
	res.render('about.html')
})

app.get('/create', (req, res)=>{
	res.render('createbook.html')
})


app.get('/viewbooks', (req, res)=>{

	//get all books from 'notebooks'
	var newdb = new sqlite3.Database('notesapp.db', (err) => {
                 if (err) {
                         console.log("Getting error " + err);
                         exit(1);

                 }
         });
	
	var sql = `SELECT * FROM notebooks`;
	
	const notebooks=new Array();

	newdb.all(sql, [], (err, rows)=>{
		if(err) console.error(err.message)
		rows.forEach((row)=>{
		
			//console.log(row.name)
			notebooks.push([row.name, row.desc])
			

		})

		console.log(notebooks)	
		res.render('notebooks.html', {notebooks : notebooks});

	})
	
	//res.render('notebooks.html', {notebooks : notebooks});
})

app.post('/createbook', (req, res)=>{
	let book = req.body.bname;
	let desc = req.body.desc;
	console.log(book + ":" + desc);
	//insert into books table
	 var newdb = new sqlite3.Database('notesapp.db', (err) => {
		 if (err) {
			 console.log("Getting error " + err);
            		 exit(1);
       	 	
		 }
	 });
	
	
	//newdb.exec(`INSERT INTO notebooks(name, desc) VALUES(${book}, ${desc})`);
	var sql = `INSERT INTO notebooks(name, desc) VALUES(?,?)`;
	newdb.run(sql, [book, desc], (err)=>{
		if(err) console.error(err.message)
		console.log(`Book '${book}' created succesfully!!`)
	})
	res.redirect('/viewbooks');


	
});





var sqlite3 = require('sqlite3');
var db;
new sqlite3.Database('./notesapp.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err && err.code == "SQLITE_CANTOPEN") {
        createDatabase();
        return;
        } else if (err) {
            console.log("Getting error " + err);
            exit(1);
    }
    //runQueries(db);
});

function createDatabase() {
    var newdb = new sqlite3.Database('notesapp.db', (err) => {
        if (err) {
            console.log("Getting error " + err);
            exit(1);
        }
     //   console.log('next create table with newdb')
//	createTables(newdb)
    });

}


function createTables(){
	
	   var newdb = new sqlite3.Database('notesapp.db', (err) => {
                 if (err) {
                         console.log("Getting error " + err);
                         exit(1);

                 }
	   })


	newdb.exec(`
    CREATE TABLE IF NOT EXISTS  notebooks(
    nb_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name  CHAR(100) NOT NULL,
    desc TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);

	CREATE TABLE IF NOT EXISTS  notes(
    n_id INTEGER PRIMARY KEY AUTOINCREMENT,
    note_name TEXT NOT NULL,
    book_id INTEGER NOT NULL,
    notes TEXT ,
    note_type TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(book_id) REFERENCES notebooks(nb_id)
	);`);

}
createTables();



app.listen(5000, ()=>{
        console.log('Running...')
})



