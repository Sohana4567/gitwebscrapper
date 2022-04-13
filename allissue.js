const cheerio = require('cheerio');
const request = require('request');
//const pdfDocument=require('pdfkit');
const { PDFDocument, rgb, componentsToColor } = require('pdf-lib')
const fs = require('fs');
const path = require('path');
//const doc=new pdfDocument();
let t = [];
let c = 0;
function getallissue(url) {
    request(url, cb);
}
function cb(err, res, body) {
    if (err) {
        console.log(err);
    } else {
        allissue(body);
    }
}

async function allissue(html) {
    let selectTool = cheerio.load(html);
    let reponame = selectTool(".mr-2.flex-self-stretch  a[data-pjax='#repo-content-pjax-container']").text();
    //console.log("repo",reponame.text())
    let anchortitle = selectTool(".flex-auto.min-width-0.p-2.pr-3.pr-md-2  a[data-hovercard-type='issue']");

    for (let i = 0; i < 5; i++) {
        let titleanchor = selectTool(anchortitle[i]).text();
        t.push(titleanchor.trim())
        console.log("issue=", titleanchor);
        console.log("----------------->", titleanchor);
        let p = await processpdf(reponame, titleanchor, i);
    }

}

async function processpdf(reponame, titleanchor, i) {
    return new Promise(async(resolve, reject) => {
        let issuefolder = path.join(__dirname, 'Git_Topics');
        let folderpath = fs.readdirSync(issuefolder);
        // console.log("public folder",folderpath);
        // let deepfolderpath=fs.readdirSync(folderpath);
        //  console.log("deepfolderpath",deepfolderpath);
        // console.log(typeof reponame);
        let topic = "";
        console.log("IN processpdf--------->", titleanchor);
        for (let i = 0; i < folderpath.length; i++) {
            if (fs.existsSync(path.join(issuefolder, folderpath[i], reponame.trim()))) {
                topic = folderpath[i];
                break;
            }
        }

        let paths = path.join(path.join(issuefolder, topic), path.join(reponame.trim(), reponame.trim() + ".pdf"));

        if (i==0)
            try {
                console.log("CALLING GENERATE PDF ***************************");
               await generatepdf(paths, titleanchor);
                resolve(topic);
            }
            catch (err) {
                console.log("**********Error occured while creating pdf*****")
                reject();
            }
        else {
            console.log("Writing file!!")
            try {
               await readDataAndWrite(paths, titleanchor, i);
                resolve(topic)
            }
            catch (err) {
                console.log("**********Error occured while writing pdf*****", err.message)
                reject()
            }
        }
        
    })

}
async function readDataAndWrite(paths, titleanchor, i) {
    let existingPdfBytes;
    console.log("In readDataAndWrite--------->", titleanchor);
    try {

        existingPdfBytes = fs.readFileSync(paths);
        console.log("Hello",existingPdfBytes.toString);
    }
    catch (err) {
       console.log(err.message);
    }
    const pdfDoc = await PDFDocument.load(existingPdfBytes)
    const pages = pdfDoc.getPages()
    const firstPage = pages[0]

    // Get the width and height of the first page
    const { width, height } = firstPage.getSize()
    try {
        firstPage.drawText(titleanchor, {
            x: 5,
            y: height / 2 + 50 * i,
            size: 25,
            color: rgb(0.95, 0.1, 0.1),
        })
    }
    catch (err) {
        console.log(err.message);
    }

    fs.writeFileSync(paths, await pdfDoc.save())
}

async function generatepdf(paths, titleanchor) {

    // doc.pipe(fs.createWriteStream('output.pdf'));
    // doc.text("Hello",100,100);
    // doc.save();
    // doc.end();
    console.log("In generatepdf--------->", titleanchor);
    const doc = await PDFDocument.create()
    const page = doc.addPage()
    const { width, height } = page.getSize()
    try {
        page.drawText(titleanchor, {
            x: 5,
            y:height/2,
            size: 25,
            color: rgb(0.95, 0.1, 0.1),
        })
    }
    catch (err) {
        console.log(err.message);
    }

    fs.writeFileSync(paths, await doc.save())


}
module.exports = {
    getallissue: getallissue
}