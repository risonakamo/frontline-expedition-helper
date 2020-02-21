const _=require("lodash");
const table=require("text-table");
const chalk=require("chalk");
const stripAnsi=require("strip-ansi");

import {getExpeditionsFile} from "./expeditionloaders";

// default initial expedition data header
const _expeditionDataHeader2:ExpeditionDataHeader={
    name:chalk.white("name"),
    gas:chalk.green("gas"),
    ammo:chalk.yellow("ammo"),
    mre:chalk.cyan("mre"),
    parts:chalk.magenta("parts"),
    doll:chalk.white("doll"),
    equip:chalk.white("equip"),
    total:chalk.yellowBright("total")
};

export default class MainExpeditionList
{
    allExpeditions:ExpeditionData[] //list of all expeditions
    allExpedtionsDict:KeyedExpeditionList //list of all expeditions, with keys
    private differenceExpeditions:ExpeditionData[] //mirror of expedition data that is calculated from a difference

    constructor()
    {
        this.allExpeditions=null;
        this.differenceExpeditions=null;
        this.allExpedtionsDict=null;
    }

    // load in expeditions from data file
    async loadAllExpeditions():Promise<void>
    {
        this.allExpeditions=await getExpeditionsFile("data/expeditiondata.csv");
        this.allExpedtionsDict=_.keyBy(this.allExpeditions,(x:ExpeditionData)=>{
            return x.name;
        });
    }

    // output expedition list and difference list with specified sort settings
    outputTextTableSorted(field:string,difference?:boolean,reversed?:boolean):string
    {
        var combinedData:DoubleExpeditionData[]=_.map(this.allExpeditions,(x:ExpeditionData,i:number)=>{
            return {
                data:x,
                diff:this.differenceExpeditions[i]
            };
        });

        combinedData.sort((a:DoubleExpeditionData,b:DoubleExpeditionData)=>{
            var a2:IndexExpeditionData;
            var b2:IndexExpeditionData;

            if (!difference)
            {
                a2=a.data as IndexExpeditionData;
                b2=b.data as IndexExpeditionData;
            }

            else
            {
                a2=a.diff as IndexExpeditionData;
                b2=b.diff as IndexExpeditionData;
            }

            if (a2[field]>b2[field])
            {
                return -1;
            }

            else if (a2[field]<b2[field])
            {
                return 1;
            }

            return 0;
        });

        if (reversed)
        {
            _.reverse(combinedData);
        }

        var arraycombinedData:string[][]=_.map(combinedData,(x:DoubleExpeditionData)=>{
            return _.concat(
                convertExpeditionDataToArray(x.data),
                convertDifferenceDataToArray(x.diff)
            );
        });

        arraycombinedData.unshift(outputSortedHeader2(field,difference,reversed));

        return table(arraycombinedData,{
            stringLength:(x:string)=>{
                return stripAnsi(x).length;
            }
        });
    }

    // updates the difference table given an expedition
    calcDifference(expedition:IndexExpeditionData):void
    {
        this.differenceExpeditions=_.map(this.allExpeditions,(x:ExpeditionData)=>{
            return _.mapValues(x,(y:number,i:string)=>{
                if (i=="name")
                {
                    return y;
                }

                return y-(expedition[i] as number);
            });
        });
    }

    testCalcDifference():void
    {
        this.calcDifference(this.allExpeditions[0] as IndexExpeditionData);
    }
}

// output a string array that can serve as a header for the combined output text table of
// the expedition list and difference list
function outputSortedHeader2(field:string,diff?:boolean,reversed?:boolean):string[]
{
    var mainheader:IndexExpeditionData={..._expeditionDataHeader2} as IndexExpeditionData;
    var diffheader:IndexExpeditionData={..._expeditionDataHeader2} as IndexExpeditionData;
    delete diffheader.name;
    var sortcharacter:string=reversed?" ʌ":" v";

    if (!diff)
    {
        mainheader[field]=mainheader[field]+sortcharacter;
    }

    else
    {
        diffheader[field]=diffheader[field]+sortcharacter;
    }

    var headerarray:(string|number)[]=expeditionDataToArrayPlain(mainheader);
    headerarray.push("     ");
    return _.concat(headerarray,expeditionDataToArrayPlain(diffheader));
}

// converts expedition data to array in order without any special formatting
function expeditionDataToArrayPlain(data:ExpeditionData):(string|number)[]
{
    var plainarray:(string|number)[]=[
        data.gas,
        data.ammo,
        data.mre,
        data.parts,
        data.doll,
        data.equip,
        data.total
    ];

    if (data.name)
    {
        plainarray.unshift(data.name);
    }

    return plainarray;
}

// do the same thing as convert expedition data to array, except with special things
// for difference data version of ExpeditionData
function convertDifferenceDataToArray(data:ExpeditionData):FlatExpeditionData
{
    var arraydata:(string|number)[]=[
        data.gas,
        data.ammo,
        data.mre,
        data.parts,
        data.doll,
        data.equip,
        data.gas+data.ammo+data.mre+data.parts+data.doll+data.equip
    ];

    arraydata=_.map(arraydata,(x:number)=>{
        if (x>0)
        {
            return chalk.greenBright("+"+parseFloat(x.toFixed(2)));
        }

        else if (x<0)
        {
            return chalk.red(parseFloat(x.toFixed(2)));
        }

        return chalk.white(0);
    });

    arraydata.unshift("  >  ");

    return arraydata;
}

// convert an ExpeditionData into FlatExpeditionData
export function convertExpeditionDataToArray(data:ExpeditionData):FlatExpeditionData
{
    var formattedData:ExpeditionData=_.mapValues(data,(x:string|number,i:string)=>{
        if (i=="name")
        {
            return x;
        }

        return parseFloat((x as number).toFixed(2));
    });

    formattedData.total=parseFloat((data.gas+data.ammo+data.mre+data.parts+data.doll+data.equip).toFixed(2));

    return [
        data.name,
        chalk.green(formattedData.gas),
        chalk.yellow(formattedData.ammo),
        chalk.cyan(formattedData.mre),
        chalk.magenta(formattedData.parts),
        chalk.white(formattedData.doll),
        chalk.white(formattedData.equip),
        chalk.yellowBright(formattedData.total)
    ];
}