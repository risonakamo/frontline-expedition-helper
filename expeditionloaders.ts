const fs=require("fs");
const csv=require("csv-parser");
const _=require("lodash");
const yaml=require("js-yaml");

// grabs the expedition data from the file, returns a promise with the expedition data
export function getExpeditionsFile(filepath:string):Promise<ExpeditionData[]>
{
    return new Promise((resolve:Function)=>{
        var thedata:ExpeditionData[]=[];

        fs.createReadStream(filepath)
        .pipe(csv())
        .on("data",(datarow:ExpeditionData)=>{
            thedata.push(datarow);
        })
        .on("end",()=>{
            resolve(_.map(thedata,fixExpeditionDataFromCsv));
        });
    });
}

// convert fields that need to be numbers in expedition data to numbers
function fixExpeditionDataFromCsv(data:ExpeditionData):ExpeditionData
{
    return _.mapValues(data,(x:string,i:string):string|number=>{
        if (i!="name")
        {
            return parseFloat(x);
        }

        return x;
    });
}

// get the current expeditions from the yaml file, creates CurrentExpeditions object,
// needs to be given all expeditions.
export function getCurrentExpeditions(allExpeditionsObject:KeyedExpeditionList):CurrentExpeditions
{
    var expeditions:String[];
    try
    {
        expeditions=yaml.safeLoad(fs.readFileSync("data/currentexpeditions.yml"));
    }

    catch (err)
    {
        expeditions=[];
    }

    return _.reduce(expeditions,(r:KeyedExpeditionList,x:string)=>{
        r[x]=allExpeditionsObject[x];
        return r;
    },{});
}