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



// ---view all books-----
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
			notebooks.push([row.name, row.desc, row.nb_id])
			

		})

		console.log(notebooks)	
		res.render('notebooks.html', {notebooks : notebooks});

	})
	
})


// ---create book----
app.post('/createbook', (req, res)=>{
	let book = req.body.bname;
	let desc = req.body.desc; // book, desc from 'form'
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

app.get('/deletebook:id', (req, res)=>{
	let bid = req.params.id
	var sql = `DELETE FROM  books WHERE  nb_id = `

	db = db_conn()
	
})


//database connection
function db_conn(){
	 var newdb = new sqlite3.Database('notesapp.db', (err) => {
                 if (err) {
                         console.log("Getting error " + err);
                         exit(1);

                 }
         });

	return newdb
}



//----- createnotes page ------
app.get('/createnotes/:id', (req, res)=>{
	
	db = db_conn(); //database connection
	var sql = `SELECT * FROM notes WHERE book_id = ?`; //query
	var bid = req.params.id //book id
	const notes = new Array();
	
	db.all(sql, [bid], (err, rows)=>{
		if(err) console.error(err.message)

		rows.forEach((row)=>{
			notes.push([row.n_id, row.note_name, row.book_id, row.notes])
		})
		let book_name;
		let sql2 = `SELECT * FROM notebooks WHERE nb_id = ?`;
		db.all(sql2, [bid], (err,rows)=>{
			if(err) console.log('err')
			rows.forEach((row)=>{
				book_name = row.name;
			})
		
			//render after second query
			res.render('notes/createnotes.html', {notes: notes, bname:book_name})

		})
	})
	
})


//---- createnote----
/**
app.get('/createnote', (res, res)=>{
	
	db = db_conn();
	
	let notes_val = req.body.notes;
        let note_id  = req.body.id;
	console.log(notes + ":" + note_id);
	
	var sql = `UPDATE notes SET notes = ? WHERE n_id = ? `;
	db.all(sql, [notes_val, note_id],  (err) => {
                
		if (err) console.error(err.message)
		console.log(`Note created successfully!!`)
	})
	
	let bid;
	var sql2 = `SELECT book_id FROM notes WHERE n_id = ?`;
	db.all(sql, [note_id], (err, rows)=>{
		if(err) console.error(err.message)
		row.forEach((row)=>{
			bid = row.book_id	
		})
		res.redirect('/createnotes/'+bid)
	})
})
**/



//----- view notes -------
app.get('/viewnotes/:id', (req, res)=>{
	
	db = db_conn(); //database connection
	var sql = `SELECT * FROM notes WHERE book_id = ?`; //query
	var bid = req.params.id //book id
	var notes = new Array();

	db.all(sql, [bid], (err, rows)=>{
                if(err) console.error(err.message)
		 rows.forEach((row)=>{
		 	notes.push([row.n_id, row.note_name, row.book_id, row.notes ])
		 })

		res.render('notes/viewnotes.html', {notes:notes, b_id:bid})
	})


})




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



