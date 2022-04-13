const cheerio = require("cheerio");
const request = require("request");
const issue = require("./gitissue");
const fs = require('fs');

const path = require('path');

function alltopics(url) {
    console.log(url);
    request(url, cb);
}
function cb(err, res, body) {
    if (err) {
        console.log(err);
    } else {
        getalltopics(body);
    }
}
function getalltopics(html) {
    let selectTool = cheerio.load(html);
    let topicname = selectTool(".container-lg.d-sm-flex.flex-items-center.p-responsive.py-5  h1");
     console.log("------->", topicname.text());
    let printrepo = selectTool(".h3.color-fg-muted");
    console.log(printrepo.text());
    let anchorelement = selectTool(".d-flex.flex-justify-between.my-3  a[class='text-bold wb-break-word']");
     console.log(anchorelement.text());
  




      for (let j = 0; j < 3; j++) {
         gittopicsname = selectTool(anchorelement[j]).text();
        // console.log("gittopicsname",gittopicsname)
        maketopicdeep(gittopicsname, topicname.text());
        }
   

    for (let i = 0; i < 3; i++) {
        let anchorlink = selectTool(anchorelement[i]).attr("href");
        let fulllink = "https://github.com" + anchorlink;
         console.log(fulllink)
       issue.topicissue(fulllink);
       //  break;
    }
}
function maketopicdeep(gittopicsname, topicname) {
   console.log("I am getting",gittopicsname);

   let fullsrc=path.join(__dirname,'Git_Topics');

  let allfull=fs.readdirSync(fullsrc);



   for(let i=0;i<allfull.length;i++){
       let paths=path.join(path.join(fullsrc,topicname.trim()),gittopicsname.trim());
    
    console.log(paths);
      if(!fs.existsSync(paths)){     
          fs.mkdirSync(paths);
      }
   }
  
}
module.exports = {
    alltopics: alltopics
}


















