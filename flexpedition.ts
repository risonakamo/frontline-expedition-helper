const blessed=require("blessed");

import CurrentExpeditionList from "./currentexpeditionlist";
import MainExpeditionList from "./mainexpeditionlist";
import CurrentExpeditionList2 from "./currentexpeditionlist2";

async function main()
{
    var screen:Screen=makeScreen();
    var currentExpeditionList:CurrentExpeditionList=new CurrentExpeditionList();
    await currentExpeditionList.loadInitialCurrentExpeditions();

    currentExpeditionList.focus();
    screen.append(currentExpeditionList.expeditionList);

    screen.render();
}

async function main2()
{
    var elist=new MainExpeditionList();
    await elist.loadAllExpeditions();

    elist.testCalcDifference();

    console.log(elist.outputTextTableSorted("parts"));

    var currentlist=new CurrentExpeditionList2(elist.allExpedtionsDict);
    console.log(currentlist.outputTextTable());
}

async function main3()
{
    var screen=makeScreen();

    var mainlist=new MainExpeditionList();
    await mainlist.loadAllExpeditions();

    var currentlist=new CurrentExpeditionList2(mainlist.allExpedtionsDict);
    mainlist.calcDifference(Object.values(currentlist.currentExpeditions)[0] as IndexExpeditionData);

    var mainlistContent=mainlist.outputTextTableSorted("name").split("\n");

    var mainlistHeaderElement=blessed.Text({
        content:mainlistContent.shift()
    });

    var mainlistElement=blessed.List({
        items:mainlistContent,
        top:1,
        style:{
            selected:{
                bg:"white",
                fg:"black"
            }
        },
        keys:true
    });

    var currentlistElement=blessed.List({
        items:currentlist.outputTextTable().split("\n"),
        top:32,
        style:{
            selected:{
                bg:"white",
                fg:"black"
            }
        },
        keys:true
    });

    screen.append(mainlistHeaderElement);
    screen.append(mainlistElement);
    screen.append(currentlistElement);
    currentlistElement.focus();

    screen.render();
}

function makeScreen():Screen
{
    var screen:Screen=blessed.screen({
        smartCSR:true,
        autoPadding:true
    });

    screen.title="hello";

    screen.key(["q"],()=>{
        return process.exit();
    })

    return screen;
}

// main();
// main2();
main3();