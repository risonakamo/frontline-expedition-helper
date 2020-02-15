const _=require("lodash");

import {getExpeditionsFile} from "./expeditionloaders";

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

        console.log(this.allExpeditions);
    }

    outputTextTable():void
    {

    }
}