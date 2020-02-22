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
    lastChosen:string

    constructor(allExpeditionsDict:KeyedExpeditionList)
    {
        this.allExpeditionsDict=allExpeditionsDict;
        this.currentExpeditions=getCurrentExpeditions(this.allExpeditionsDict);
        this.lastChosen=null;
    }

    // return text table of the current expeditions
    outputTextTable():string
    {
        return table([
            ..._.map(this.currentExpeditions,(x:ExpeditionData)=>{
                return convertExpeditionDataToArray(x);
            }).sort(),
            calcCurrentExpeditionTotal(this.currentExpeditions)
        ]);
    }

    // given the name of a new expedition and an old expedition, swap out the old expedition
    // does nothing if the old expedition does not exist
    swapExpedition(newExpedition:string,replacedExpedition:string):void
    {
        if (!this.currentExpeditions[replacedExpedition])
        {
            console.log("attempted to swap with non valid expedition",replacedExpedition);
            return;
        }

        else if (this.currentExpeditions[newExpedition])
        {
            return;
        }

        delete this.currentExpeditions[replacedExpedition];
        this.currentExpeditions[newExpedition]=this.allExpeditionsDict[newExpedition];
    }

    // given a new expedition, swap with the last chosen expedition
    swapWithLastChoice(newExpedition:string):void
    {
        this.swapExpedition(newExpedition,this.lastChosen);
    }

    // set the last chosen expedition
    setLastChosen(chosenExpedition:string):void
    {
        if (!this.currentExpeditions[chosenExpedition])
        {
            console.log("attempted to set last chosen to non valid expedition",chosenExpedition);
            console.log(this.currentExpeditions);
            return;
        }

        this.lastChosen=chosenExpedition;
    }
}

// calculate an array of totals from the current epxeditions list
function calcCurrentExpeditionTotal(currentExpeditions:CurrentExpeditions):FlatExpeditionData
{
    var objecttotal:ExpeditionData=_.reduce(currentExpeditions,(r:any,x:ExpeditionData)=>{
        return _.extendWith(r,x,(rv:number,xv:number,i:string)=>{
            if (!rv)
            {
                return xv;
            }

            return rv+xv;
        });
    },{});

    objecttotal["name"]="total";

    return convertExpeditionDataToArray(objecttotal);
}