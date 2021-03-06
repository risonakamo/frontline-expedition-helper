const table=require("text-table");
const _=require("lodash");
const blessed=require("blessed");
const chalk=require("chalk");

import {getExpeditionsFile} from "./expeditionloaders";
import {convertExpeditionDataToArray} from "./mainexpeditionlist";

export default class CurrentExpeditionList
{
    expeditionList:BlessList //the bless list
    private currentExpeditions:ExpeditionData[] //list of expedition data

    constructor()
    {
        this.expeditionList=blessed.List({
            style:{
                selected:{
                    bg:"white",
                    fg:"black"
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
        this.currentExpeditions=await getExpeditionsFile("data/currentexpeditions.csv");
        this.syncCurrentExpeditionsList();
    }

    // synchronises the currentexpedition list with the Bless list
    private syncCurrentExpeditionsList():void
    {
        this.loadExpeditions(this.currentExpeditions);
    }

    // load the given expedition list into the bless list
    loadExpeditions(data:ExpeditionData[]):void
    {
        var flatexpeditiondatas:FlatExpeditionData=_.map(data,(x:ExpeditionData):FlatExpeditionData=>{
            return convertExpeditionDataToArray(x);
        });

        this.expeditionList.setItems(table(flatexpeditiondatas).split("\n"));
    }
}