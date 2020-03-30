
var ObjectID = require('mongodb').ObjectID;

module.exports = function(app, db) {
app.get('/',(req,res)=> res.render('home'))
app.get('/subject',(req,res)=> {
  db.collection('subjects').find({}).toArray((err, sub) => {
    if (err) {
      res.send({ 'error': 'An error has occurred' });
    } else {
      res.render('subject.ejs', { "sub": sub })
    }
  });
})
app.get('/showsub',(req,res)=> {
  db.collection('subjects').find({}).toArray((err, sub) => {
    if (err) {
      res.send({ 'error': 'An error has occurred' });
    } else {
      res.render('showsub.ejs', { "sub": sub })
    }
  });
})

app.post('/subject_del', (req, res) => {
   const id = req.body.id;
   console.log(id);
   const subDel = { '_id': new ObjectID(id) };
   db.collection('subjects').remove(subDel, (err, item) => {
     if (err) {
       res.send({'error':'An error has occurred'});
     } else {
       res.redirect('/showsub')
     }
   });
 });

 app.get('/tutors/:id',(req,res)=> {
   const id = req.params.id;
   const subID = { '_id': new ObjectID(id) };
   db.collection('subjects').findOne(subID, (err, sub) => {
     if (err) {
       res.send({'error':'An error has occurred'});
     } else {
       res.render('tutors',{"sub":sub});
     }
   });
 })
app.post('/add_tutor',(req, res)=>{
  var id = req.body.subID
  var tutorid = ObjectID();
  db.collection('subjects').update({ _id: ObjectID(req.body.subID) }, { $push: { "tutors": { _id: tutorid, name: req.body.name} } }, (error, post) => {
    res.redirect('/tutors/' + id);
    console.log('done');
  });
})

app.get('/add_units/:id',(req, res)=>{
  const id = req.params.id;
  const subID = { '_id': new ObjectID(id) };
  db.collection('subjects').findOne(subID, (err, sub) => {
    if (err) {
      res.send({'error':'An error has occurred'});
    } else {
      db.collection('units').find({subjectid:ObjectID(id)}).toArray((err, uni) => {
        if (err) {
          res.send({'error':'An error has occurred'});
        } else {
          console.log(uni);
          res.render('unit', {"sub":sub, "uni":uni})
        }
      });
      }
    });
  })

app.post('/add_units/:id',(req,res)=>{
  var id = req.params.id
  var inUni = {subjectid:ObjectID(req.body.subjectid), tutorid:ObjectID(req.body.tutorid), title: req.body.title, unitno:req.body.unitno, description:req.body.description, urlID:req.body.urlID}
  console.log(inUni);
  db.collection('units').insert(inUni,(err, subject)=>{
    if (err) {
      res.send({ 'error': 'An error has occurred' });
    } else {
      res.redirect("/add_units/"+id);
    }
  })
})

app.get('/add_live/:id',(req, res)=>{
  const id = req.params.id;
  const subID = { '_id': new ObjectID(id) };
  db.collection('subjects').findOne(subID, (err, sub) => {
    if (err) {
      res.send({'error':'An error has occurred'});
    } else {
      db.collection('live').find({subjectid:ObjectID(id)}).toArray((err, uni) => {
        if (err) {
          res.send({'error':'An error has occurred'});
        } else {
          console.log(uni);
          res.render('live', {"sub":sub, "uni":uni})
        }
      });
      }
    });
  })

app.post('/add_live/:id',(req,res)=>{
  var id = req.params.id
  var inUni = {subjectid:ObjectID(req.body.subjectid), tutorid:ObjectID(req.body.tutorid), title: req.body.title, unitno:req.body.unitno, description:req.body.description, urlID:req.body.urlID}
  console.log(inUni);
  db.collection('live').insert(inUni,(err, subject)=>{
    if (err) {
      res.send({ 'error': 'An error has occurred' });
    } else {
      res.redirect("/add_live/"+id);
    }
  })
})



  app.post('/add_subject',(req,res)=>{
    console.log(req.body);
    db.collection('subjects').insert(req.body,(err, subject)=>{
      if (err) {
        res.send({ 'error': 'An error has occurred' });
      } else {
        res.redirect("/subject");
      }
    })
  })

  app.get('/admin', function(req,res){
    const data = db.collection('subjects').find().toArray((err, subjects) => {
      if (err){
        res.send({'error':'An error has occurred'});
      } else {
        // res.send(units);
        const tutorData = db.collection('tutors').find().toArray((err, tutors)=>{
          if (err){
            res.send({'error':'An error has occurred'});
          }else {
              res.render('index.ejs', { "subjects": subjects, "tutors":tutors })
          }
        })
      }
    });
  });
  //=====//====//==
 app.get('/units/:id', (req, res) => {
   const id = req.params.id;
   const details = { '_id': new ObjectID(id) };
   db.collection('units').findOne(details, (err, item) => {
     if (err) {
       res.send({'error':'An error has occurred'});
     } else {
       res.send(item);
     }
   });
  });

app.get('/gg', (req, res)=> {
  const data = db.collection('units').find({}).toArray((err, units) => {
    if (err){
      res.send({'error':'An error has occurred'});
    } else {
      // res.send(units);
      res.render('hi.ejs', { "units": units })
    }
  });
})

 app.delete('/units/:id', (req, res) => {
    const id = req.params.id;
    const unitDetails = { '_id': new ObjectID(id) };
    db.collection('units').remove(unitDetails, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send('Unit ' + id + ' deleted!');
      }
    });
  });

  app.put('/units/:id', (req, res) => {
     const id = req.params.id;
     const details = { '_id': new ObjectID(id) };
     const note = { text: req.body.text, title: req.body.title };
     db.collection('units').update(details, note, (err, result) => {
       if (err) {
           res.send({'error':'An error has occurred'});
       } else {
           res.send(note);
       }
     });
   });

app.post('/units', (req, res) => {
   const note = { description: req.body.text, title: req.body.title, subjectid: req.body.subID, unitno: req.body.uniID, tutorid: req.body.teachID, urlid: req.body.urlID };
   console.log(note);
   db.collection('units').insert(note, (err, result) => {
     if (err) {
       res.send({ 'error': 'An error has occurred' });
     } else {
       res.send(result.ops[0]);
     }
   });
 });

var subid
 // subject page

 app.get('/subject', (req, res)=>{
   const data = db.collection('subjects').find({}).toArray((err, subjects) => {
     if (err){
       res.send({'error':'An error has occurred'});
     } else {
       // res.send(units);
       res.render('subject.ejs', { "subjects": subjects })
     }
   });
 });
 app.post('/subject',(req, res)=>{
   subid = req.body.subject;
   console.log(subid);
   console.log('hello22');
 });

 app.get('/tutor', (req, res)=>{
   const data = db.collection('tutors').find({subjectid:subid}).toArray((err, tutors) => {
     if (err){
       res.send({'error':'An error has occurred'});
     } else {
       // res.send(units);
       res.render('tutors.ejs', { "tutors": tutors })
     }
   });
 });

var tuid;

app.post('/tutor',(req, res)=>{
  tubid = req.body.tutor;
  console.log(tubid);
  console.log('hello2');
});


 app.get('/syllabus', (req, res)=>{
   var query = {'subjectid':subid,'tutorid':tubid}
   const data = db.collection('units').find({subjectid:subid}).toArray((err, units) => {
     if (err){
       res.send({'error':'An error has occurred'});
     } else {
       // res.send(units);
       res.render('syllabus.ejs', { "units": units })
     }
   });
 });


 app.get('/unit', (req, res)=>{
   const data = db.collection('units').find({subjectid:"sub01"}).toArray((err, units) => {
     if (err){
       res.send({'error':'An error has occurred'});
     } else {
       // res.send(units);
       res.render('units.ejs', { "units": units })
     }
   });
 });


};
