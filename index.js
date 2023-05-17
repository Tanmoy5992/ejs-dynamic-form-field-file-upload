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

    if(fileLength > 0){

      for(let i=0 ; i < counter ; i++){

        for(let y=0 ; y < fileLength ; y++){

          if(req.files[y].fieldname == `file${i}`){

            const newObj = compareArrayObject({name:req.body.text[i],document:req.files[y].path,isFile:'true',index:i},addObj)
            
            if(newObj.delete){

              const indexOfObject = addObj.findIndex(object => {

                return object.index === newObj.deleteIndex;
                
                });
              addObj.splice(indexOfObject, 1)
              addObj.push({name:req.body.text[i],document:req.files[y].path,isFile:'true',index:i})
            
            } else {
              
              if(newObj.newPush){
              
                addObj.push({name:req.body.text[i],document:req.files[y].path,isFile:'true',index:i})
              
              }
            }
          } else {

            const newObj = compareArrayObject({name:req.body.text[i],document:'',isFile:'false',index:i},addObj)
            
            if(newObj.delete){
              
              const indexOfObject = addObj.findIndex(object => {

                return object.index === newObj.deleteIndex;
                
                });
              addObj.splice(indexOfObject, 1)
              addObj.push({name:req.body.text[i],document:'',isFile:'false',index:i})
            
            } else {
              
              if(newObj.newPush){
              
                addObj.push({name:req.body.text[i],document:'',isFile:'false',index:i})
              
              }
            
            }
          
          }
        
        }
        
      }

    } else {
      
      for(let i=0 ; i < counter ; i++){
      
        addObj.push({name:req.body.text[i],document:'',isFile:'false',index:i})
      
      }
    
    }

    res.json({ addObj:addObj,message: "Successfully uploaded files" });
}

const compareArrayObject = (compareObject, existingObject) => {

  if(existingObject.length == 0){
    
    return {delete:false,deleteIndex:0,newPush:true};
  
  } else {

    const results = existingObject.filter(obj => {
      
      return obj.index == compareObject.index;
    
    });

    if(results.length == 0){
      
      return {delete:false,deleteIndex:0,newPush:true};
    
    } else {
      
      if(compareObject.index == results[0].index){
        
        if(compareObject.isFile == results[0].isFile){
          
          return {delete:true,index:results[0].index}
        
        } else {
          
          if(results[0].isFile == 'true' && compareObject.isFile == 'false'){
            
            return {delete:false,deleteIndex:results[0].index,newPush:false}
          
          } else { 
            
            return {delete:true,deleteIndex:results[0].index}
          
          }          
        
        }
      
      } else {
        
        return {delete:false,deleteIndex:0,newPush:true};
      
      }
    
    }
  
  }

}

app.listen(5000, () => {
    console.log(`Server started...`);
});