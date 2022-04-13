const cheerio=require('cheerio');
const request=require('request');
const issue=require('./allissue');
function topicissue(url){
    request(url,cb);   
}

function cb(err,req,body){
if(err){
    console.log(err);
}else{
    gettopicissue(body);
}
    
}

function gettopicissue(html){
let  selectTool=cheerio.load(html);
let  dataanchor=selectTool("a[id='issues-tab']");
let dataanchorhref=dataanchor.attr("href");
// console.log("data",dataanchorhref);
let fulllink="https://github.com"+dataanchorhref;
 issue.getallissue(fulllink);
}






module.exports={
    topicissue:topicissue
}