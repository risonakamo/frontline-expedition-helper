const blessed=require("blessed");
const table=require("text-table");
const _=require("lodash");

const _sampleExpeditionData:ExpeditionData[]=[
    {
        name:"3-1",
        gas:150,
        ammo:0,
        mre:225,
        parts:0,
        doll:0,
        equip:0
    },
    {
        name:"0-2",
        gas:183.33,
        ammo:0,
        mre:0,
        parts:116.66,
        doll:.33,
        equip:0
    }
]

function main()
{
    var screen:Screen=blessed.screen({
        smartCSR:true
    });

    screen.title="hello";

    screen.key(["q"],()=>{
        return process.exit();
    })

    var mainExpeditionList:MainExpeditionList=new MainExpeditionList();

    mainExpeditionList.loadExpeditions(_sampleExpeditionData);

    mainExpeditionList.focus();
    screen.append(mainExpeditionList.expeditionList);

    screen.render();
}

class MainExpeditionList
{
    expeditionList:BlessList

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
    }

    focus():void
    {
        this.expeditionList.focus();
    }

    loadExpeditions(data:ExpeditionData[]):void
    {
        var flatexpeditiondatas:FlatExpeditionData=_.map(data,(x:ExpeditionData):FlatExpeditionData=>{
            return convertExpeditionDataToArray(x);
        });

        this.expeditionList.setItems(table(flatexpeditiondatas).split("\n"));
    }
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

main();