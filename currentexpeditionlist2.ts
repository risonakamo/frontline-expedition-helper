const _=require("lodash");
const table=require("text-table");

import {getCurrentExpeditions} from "./expeditionloaders";
import {convertExpeditionDataToArray} from "./mainexpeditionlist";

/* displays the current expeditions. takes in the KeyedExpeditionList containing all the expeditions,
   attempts to load the current expeditions from a file.*/
export default class CurrentExpeditionList2
{
    allExpeditionsDict:KeyedExpeditionList //reference to list of all expeditions, from parent
    currentExpeditions:CurrentExpeditions //dict of current expeditions

    constructor(allExpeditionsDict:KeyedExpeditionList)
    {
        this.allExpeditionsDict=allExpeditionsDict;
        this.currentExpeditions=getCurrentExpeditions(this.allExpeditionsDict);
    }

    // return text table of the current expeditions
    outputTextTable():string
    {
        return table(_.map(this.currentExpeditions,(x:ExpeditionData)=>{
            return convertExpeditionDataToArray(x);
        }));
    }
}