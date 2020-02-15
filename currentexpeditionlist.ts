const table=require("text-table");
const _=require("lodash");
const fs=require("fs");
const csv=require("csv-parser");
const blessed=require("blessed");

export default class MainExpeditionList
{
    expeditionList:BlessList
    currentExpeditions:ExpeditionData[]

    constructor()
    {
        this.expeditionList=blessed.List({
            style:{
                selected:{
                    bg:"white"
                }
            },
            keys:true
        });

        this.currentExpeditions=null;
    }

    // bless function, focus this list
    focus():void
    {
        this.expeditionList.focus();
    }

    // needs to be called to load the initial current expeditions
    async loadInitialCurrentExpeditions():Promise<void>
    {
        this.currentExpeditions=await getInitialCurrentExpeditions();
        this.syncCurrentExpeditionsList();
    }

    // synchronises the currentexpedition list with the Bless list
    private syncCurrentExpeditionsList():void
    {
        this.loadExpeditions(this.currentExpeditions);
    }

    // load the given expedition list
    loadExpeditions(data:ExpeditionData[]):void
    {
        var flatexpeditiondatas:FlatExpeditionData=_.map(data,(x:ExpeditionData):FlatExpeditionData=>{
            return convertExpeditionDataToArray(x);
        });

        this.expeditionList.setItems(table(flatexpeditiondatas).split("\n"));
    }
}

// grabs the expedition data from the file, returns a promise
function getInitialCurrentExpeditions():Promise<ExpeditionData[]>
{
    return new Promise((resolve:Function)=>{
        var thedata:ExpeditionData[]=[];

        fs.createReadStream("data/currentexpeditions.csv")
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

// convert an ExpeditionData into FlatExpeditionData
function convertExpeditionDataToArray(data:ExpeditionData):FlatExpeditionData
{
    return [
        data.name,
        data.gas,
        data.ammo,
        data.mre,
        data.parts,
        data.doll,
        data.equip,
        data.gas+data.ammo+data.mre+data.parts+data.doll+data.equip
    ];
}