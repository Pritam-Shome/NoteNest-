const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');



app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    fs.readdir('./files', (err, files) => {
        
      //  console.log('Files in myFolder:', files);
      //  console.log(files.length);
        res.render('index', { files: files });//this will give files to the index.ejs
    });
});


app.get(`/files/:filename`, (req, res) => {
    fs.readFile(`./files/${req.params.filename}`, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error:', err);
            return;
        }
        res.render('show.ejs', { filename: req.params.filename, filedata: data });

    });
});


app.get(`/edit/:filename`, (req, res) => {
    
        res.render('edit.ejs',{ filename: req.params.filename });
});

app.post(`/edit`, (req, res) => {
    // console.log(req.body);//this will give the data from the form
    fs.rename(`./files/${req.body.previos}`, `./files/${req.body.new}`, (err) => {

       res.redirect('/');//redirect to the home page after creating the file
    
    });
});


app.get(`/delete/:filename`, (req, res) => {
    
    res.render('delete.ejs',{ filename: req.params.filename });
});

app.post(`/delete`, (req, res) => {
    // console.log(req.body);//this will give the data from the form
    fs.unlink(`./files/${req.body.fileToDelete}`,  (err) => {

       res.redirect('/');//redirect to the home page after creating the file
    
    });
});



app.post('/create', (req, res) => {//as the action is /create and the method is post
   // console.log(req.body);//this will give the data from the form

    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.details, (err) => {       
        if (err) {
            console.error('Error:', err);
            return res.status(500).send('Failed to create the file.');
        }
        res.redirect('/');//redirect to the home page after creating the file
    }
    );
});




app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});