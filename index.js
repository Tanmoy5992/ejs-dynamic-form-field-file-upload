const express = require("express");
const multer = require("multer");
const path = require('path')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, `${file.originalname}-${Date.now()}${path.extname(file.originalname)}`)
  }
})
const upload = multer({ storage: storage });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine','ejs')

app.get("/upload", renderUploadFiles);

function renderUploadFiles(req, res) {
  res.render("upload")
}

app.post("/upload_files",upload.any(), uploadFiles);

function uploadFiles(req, res) {

  let addObj = []; 
  const counter = req.body.counter;
  const fileLength = req.files.length

  for(let i=0; i<counter;i++ ){
    var fileName=req.files.filter(obj => obj.fieldname == `file${i}`);
    if (fileName.length > 0) {
        console.log('file present'); 
        addDataD = {
            name:req.body.text[i],
            document:fileName[0].filename
          }                    
        addObj.push(addDataD);
    }else{
        console.log("file not present");
        addDataD = {
            name:req.body.text[i]                        
          }
        addObj.push(addDataD);
    }
  }

  res.json({ addObj:addObj,message: "Successfully uploaded files" });
}

app.listen(5000, () => {
    console.log(`Server started...`);
});