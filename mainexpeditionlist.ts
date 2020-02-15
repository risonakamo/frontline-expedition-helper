const _=require("lodash");
const table=require("text-table");
const chalk=require("chalk");

import {getExpeditionsFile} from "./expeditionloaders";
import {convertExpeditionDataToArray} from "./currentexpeditionlist";

const _expeditionDataHeader=[
    "name",
    chalk.green("gas"),
    chalk.yellow("ammo"),
    chalk.cyan("mre"),
    chalk.magentaBright("parts"),
    "doll",
    "equip",
    chalk.red("total")
];

export default class MainExpeditionList
{
    private allExpeditions:ExpeditionData[] //list of all expeditions

    constructor()
    {
        this.allExpeditions=null;
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
    }

    // return text string of expedition list
    outputTextTable():string
    {
        var flatdata=_.map(this.allExpeditions,(x:ExpeditionData)=>{
            return convertExpeditionDataToArray(x);
        });

        flatdata.unshift(_expeditionDataHeader);

        return table(flatdata);
    }
}