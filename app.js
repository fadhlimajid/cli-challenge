#!/usr/bin/env node

const prog = require('caporal');
const {exec} = require('child_process');
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const webshot = require('webshot');
const xlsx = require('node-xlsx');

prog
//1. String Transformation
    //lowercase
    .command('lowercase', 'Convert String into lowercase')
    .argument('<string>', 'string')
    .action(function(args) {
        let abc = args['string'].toLowerCase();
        console.log(abc);
    })
    //UPPERCASE
    .command('uppercase', 'Convert String into UPPERCASE')
    .argument('<string>', 'string')
    .action(function(args) {
        let abc = args['string'].toUpperCase();
        console.log(abc);
    })
    //Capitalize
    .command('capitalize', 'Capitilize String')
    .argument('<string>', 'string')
    .action(function(args) {
        let abc = args['string']
        let def = abc.split(' ');
        let ghi = []
        for(i=0 ; i < def.length ; i++){
            ghi[i] = def[i].charAt(0).toUpperCase() + def[i].slice(1).toLowerCase();
        }
        console.log(ghi.join(' '));
    })

//2. Arithmetic
    //Addtion
    .command('add', 'Add the Numbers')
    .argument('[num...]', 'Insert Number')
    .action(function(args){
        let more = args['num'].map(x => parseInt(x,10));
        let abc = more.reduce((a, b) => a + b, 0);
        console.log(abc);
    })
    //Subtraction
    .command('subtract', 'Subtract the Numbers')
    .argument('<numbone>', '1st Number')
    .argument('[nummore...]', 'More Number')
    .action(function(args){
        let more = args['nummore'].map(x => parseInt(x,10));
        let abc = parseInt(args['numbone'],10) - more.reduce((a, b) => a + b, 0);
        console.log(abc);
    })
    //Multiplication
    .command('multiply', 'Multiply the Numbers')
    .argument('[num...]', 'Insert Number')
    .action(function(args){
        let more = args['num'].map(x => parseInt(x,10));
        let abc = more.reduce((a, b) => a * b, 1);
        console.log(abc);
    })
    //Division
    .command('divide', 'Divide the Numbers')
    .argument('<numbone>', '1st Number')
    .argument('[nummore...]', 'More Number')
    .action(function(args){
        let more = args['nummore'].map(x => parseInt(x,10));
        let abc = parseInt(args['numbone'],10) / more.reduce((a, b) => a * b, 1);
        console.log(abc);
    })

//3. Palindrome
    .command('palindrome', 'Decide whether the String is palindrome')
    .argument('<str>', 'the String')
    .action(function(args){
        console.log(`String: ${args['str']}`)
        let str = args['str'].toLowerCase();
        let x = () => {
            let a = 0;
            let b = str.length-1
            for (let len = Math.floor((str.length)/2) ; len<=str.length ; len++){
                if (str[a]==str[b]){x = "Yes"}else{x = "No"; break;}
                a++
                b--
            }
            return x
        }
        console.log("Is Palindrome? " + x());
    })

//4. Obfuscator
    .command('obfuscate', 'Obfuscate the String')
    .argument('<str>', 'the String')
    .action(function(args){
        let abc = args['str'];
        let def = "";
        for (let i = 0; i< abc.length; i++){
            def += "&#"+abc[i].charCodeAt()+";"
        };
        console.log(def)
    })

//5. Random String
    .command('random', 'Generate Random Alphanumeric')
    .option('--length [len]', 'Define the Alphanumeric length; default: 32 Characters',prog.INT, 32)
    .option('--letters [letter]', 'Whether to use letter; default: true',prog.BOOL,true)
    .option('--numbers [number]', 'Whether to use number; default:true',prog.BOOL,true)
    .option('--uppercase', 'use just uppercase characters')
    .option('--lowercase', 'use just lowercase characters')
    .action(function(args,options){
        let ltr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let pt = '';
        let i = options.length;
        if (!options.letters){ltr = ltr.replace(/[A-Za-z]/g,'')};
        if (!options.numbers){ltr = ltr.replace(/[0-9]/g,'')};
        if (options.uppercase){ltr = ltr.replace(/[a-z]/g,'')};
        if (options.lowercase){ltr = ltr.replace(/[A-Z]/g,'')};
        let random = (lr,i)=>{
            while(i--){
                let a = Math.floor(Math.random() * Math.floor(ltr.length))
                pt+=lr[a];
            }
            return pt
        }   
    console.log(random(ltr,i));
    })

//6. Get IP Address in private network
    .command('ip', 'Get IP Address in private network')
    .action(function(args){
        exec("ip route get 8.8.8.8 | awk '{print $NF; exit}'", (err, stdout, stderr) => {
            console.log(stdout);
        });
    })

//7. Get External IP Address
    .command('ip-external', 'Get External IP Address')
    .action(function(args){
        exec("curl ipinfo.io/ip", (err, stdout, stderr) => {
            console.log(stdout);
        });
    })

//8. Get headlines from https://www.kompas.com/
    .command('headlines', 'Get headlines from https://www.kompas.com/')
    .action(function(args){
        request('https://www.kompas.com', function (error, response, html) {
            if (!error && response.statusCode == 200) {
                let $ = cheerio.load(html);
                $('h2.headline__thumb__title').each(function(i, element){
                    let title = $(this).text();
                    let url = $(this).parent().attr('href');
                    console.log(`Title: ${title}`);
                    console.log(`URL: ${url}\n`);
                })
            }
        })
    })

//9. Import/Export CSV/XLS/XLSX file
    .command('convert', 'Import/Export CSV/XLS/XLSX file')
    .argument('<ffile>', 'Type your file')
    .argument('<tfile>', 'Type your new file name and extension')
    .action(function(args){
        let obj = xlsx.parse('./' + args['ffile']);
        let rows = [];
        let writeStr = "";
        for(let i = 0; i < obj.length; i++){
            let sheet = obj[i];
            for(let j = 0; j < sheet['data'].length; j++){
                rows.push(sheet['data'][j]);
            }
        }
        for(let i = 0; i < rows.length; i++){
            writeStr += rows[i].join(",") + "\n";
        }
        fs.writeFile('./' + args['tfile'], writeStr, function(err) {
            if(err) {
                return console.log(err);
            }
        });
    })

//10. Get a screenshot from a URL
    .command('screenshot', 'Get a screenshot from a URL')
    .argument('<url>', 'insert the url')
    .option('--format [format]', 'insert preferred format', prog.STRING, 'png')
    .option('--output [output]', "write screenshot's name and format", prog.STRING)
    .action(function(args,options){
        let link = args['url'];
        let name = '';
        let num = -6;
        fs.readdirSync('./').forEach(a => {
            if(a.includes(name)){
                num++
            }
        })
        let i = ("000" + num).slice(-3);
        link = link.replace(/https/,'http')
        if (options.output){
            if (i=='001'){name = options.output}
            else{
                let ug = options.output.split('.')
                name = ug[0] + num + '.' + ug[1]
            }
        }
        else {name = `screenshot-${i.toString()}.${options.format}`}
        webshot(link, name, options, (err) => {
            if(err){
                console.log("An error ocurred ", err);
            }
        });
    })

//11. Get screenshots from a list of file
    .command('screenshot-list', 'Get screenshots from a list of file')
    .argument('[list]', 'insert the name of the list', prog.STRING, 'list.txt')
    .option('--format [format]', 'insert preferred format', prog.STRING, 'png')
    .action(function(args,options){
        fs.readFile(`./${args['list']}`, 'utf8', function (err,data) {
            if (err) {
                return console.log(err);
            }
            data = data.replace(/https/g,'http');
            data = data.split('\n');
            for(let x = 0 ; x < data.length ; x++) {
                let name = `link-${x+1}.${options.format}`
                webshot(data[x], name, (err) => {
                    if(err){
                        console.log("An error ocurred ", err);
                    }
                });
            }
        });
    })

//12. Get all information about new movies in theaters for today from http://www.21cineplex.com/nowplaying
    .command('movies' , "Get all information about new movies in theaters for today from http://www.21cineplex.com/nowplaying")
    .action(function(args){
        request('http://www.21cineplex.com/the-man-with-iron-heart-movie,4718,15HHHH.htm', function (error, response, html) {

            
        if (!error && response.statusCode == 200) {
                let $ = cheerio.load(html);
                //console.log($('div')[0]);
                console.log(html);
                //console.log($('div.newscontent2').children().attr('src'));
                $('#cont').each(function(i, element){
                    console.log($(this).text())
                    //let title = $(this).children().attr('h2');
                    //console.log(`Attribute ${this.name}: ${this.value}`);
                    // let url = $(this).parent().attr('href');
                    //console.log(`Title: ${title}`);
                    
                    // console.log(`URL: ${url}\n`);}})
                })
            }
        })
    })

prog.parse(process.argv);