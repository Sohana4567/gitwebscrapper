const cheerio=require("cheerio");
const request=require("request");
const topics=require("./topics");
const fs=require('fs');
const path=require('path');
let url="https://github.com/topics"
request(url,cb);
function  cb(err,req,body) {
    if(err){
        console.log(err);
    }else{
        gethandle(body)
    }
}
let gittopics=path.join(__dirname,"Git_Topics");
if(!fs.existsSync(gittopics)){
    fs.mkdirSync(gittopics);
}
function  gethandle(html) {
    let selectTool=cheerio.load(html);
    let anchor=selectTool(".no-underline.flex-1.d-flex.flex-column");
//    console.log(selectTool(anchor[0]).text());
   for(let i=0;i<3;i++){
    let primary=selectTool(anchor[i]).find("p.Link--primary").text();
    console.log("primary",primary)
    let anchorElem=selectTool(anchor[i]).attr("href");
    let fulllink="https://github.com/"+anchorElem;
   // console.log(fulllink)
    topics.alltopics(fulllink);
    makegittopicfolder(primary);
  //  break;
   
   }
}

function makegittopicfolder(primary){
   let alltopics=path.join(__dirname,'Git_Topics',primary);

    if(!fs.existsSync(alltopics)){
        fs.mkdirSync(alltopics);
    }
}

// function  exportData (){
//     return alltopics;
// }

// module.exports={
//     alltopics:exportData
// }

