const blessed=require("blessed");

import CurrentExpeditionList from "./currentexpeditionlist";
import MainExpeditionList from "./mainexpeditionlist";
import CurrentExpeditionList2 from "./currentexpeditionlist2";

async function main3()
{
    var screen=makeScreen();

    var mainlist=new MainExpeditionList();
    await mainlist.loadAllExpeditions();

    var currentlist=new CurrentExpeditionList2(mainlist.allExpedtionsDict);
    mainlist.calcDifference(Object.values(currentlist.currentExpeditions)[0] as IndexExpeditionData);

    var mainlistContent=mainlist.outputTextTableSorted("name").split("\n");

    var mainlistHeaderElement=blessed.Text({
        content:mainlistContent.shift(),
        parent:screen
    });

    var mainlistElement=blessed.List({
        items:mainlistContent,
        parent:mainlistHeaderElement,
        width:"100%",
        height:mainlistContent.length,
        bottom:-1,
        style:{
            selected:{
                bg:"white",
                fg:"black"
            }
        },
        keys:true,
        interactive:false
    });

    var currentlistElement=blessed.List({
        items:currentlist.outputTextTable().split("\n"),
        bottom:-6,
        width:55,
        height:5,
        style:{
            selected:{
                bg:"white",
                fg:"black"
            }
        },
        keys:true
    });
    mainlistElement.append(currentlistElement);

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