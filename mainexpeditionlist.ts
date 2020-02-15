const _=require("lodash");
const table=require("text-table");
const chalk=require("chalk");

import {getExpeditionsFile} from "./expeditionloaders";
import {convertExpeditionDataToArray} from "./currentexpeditionlist";

// default initial expedition data header
const _expeditionDataHeader2:ExpeditionDataHeader={
    name:"name",
    gas:chalk.green("gas"),
    ammo:chalk.yellow("ammo"),
    mre:chalk.cyan("mre"),
    parts:chalk.magentaBright("parts"),
    doll:"doll",
    equip:"equip",
    total:chalk.red("total")
};

export default class MainExpeditionList
{
    private allExpeditions:ExpeditionData[] //list of all expeditions
    private currentHeader:string[] //the header of the expedition table based on the sort

    constructor()
    {
        this.allExpeditions=null;
        this.currentHeader=outputSortedHeader("name");
    }

    // load in expeditions from data file
    async loadAllExpeditions():Promise<void>
    {
        this.allExpeditions=await getExpeditionsFile("data/expeditiondata.csv");
    }

    // sort expeditions by the specified field as a string, reverse to have a reverse sort
    sortByField(field:string,reverse?:boolean):void
    {
        if (!this.allExpeditions)
        {
            return;
        }

        this.allExpeditions.sort((a:IndexExpeditionData,b:IndexExpeditionData)=>{
            if (a[field]>b[field])
            {
                return -1;
            }

            else if (a[field]<b[field])
            {
                return 0;
            }

            return 1;
        });

        if (reverse)
        {
            _.reverse(this.allExpeditions);
        }

        this.currentHeader=outputSortedHeader(field,reverse);
    }

    // return text string of expedition list
    outputTextTable():string
    {
        var flatdata=_.map(this.allExpeditions,(x:ExpeditionData)=>{
            return convertExpeditionDataToArray(x);
        });

        flatdata.unshift(this.currentHeader);

        return table(flatdata);
    }
}

// given some sort fields, output a header that represents the sort
function outputSortedHeader(field:string,reverse?:boolean):string[]
{
    var expeditionheader={..._expeditionDataHeader2};
    var sortcharacter=reverse?" ʌ":" v";

    expeditionheader[field]=expeditionheader[field]+sortcharacter;

    return [
        expeditionheader.name,
        expeditionheader.gas,
        expeditionheader.ammo,
        expeditionheader.mre,
        expeditionheader.parts,
        expeditionheader.doll,
        expeditionheader.equip,
        expeditionheader.total
    ];
}