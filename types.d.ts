declare const require:any;
declare const process:any;
declare const __dirname:string;

interface Screen
{
    [key:string]:any
}

type BlessList=any;

// data object for expedition data
interface ExpeditionData
{
    name:string
    gas:number
    ammo:number
    mre:number
    parts:number
    doll:number
    equip:number
    total?:number
}

// array version of expedition data. items need to appear in the same order
type FlatExpeditionData=(string|number)[];