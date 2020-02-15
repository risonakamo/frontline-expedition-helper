const blessed=require("blessed");

import CurrentExpeditionList from "./currentexpeditionlist";
import MainExpeditionList from "./mainexpeditionlist";

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
    elist.sortByField("gas",true);
    console.log(elist.outputTextTable());
}

function makeScreen():Screen
{
    var screen:Screen=blessed.screen({
        smartCSR:true
    });

    screen.title="hello";

    screen.key(["q"],()=>{
        return process.exit();
    })

    return screen;
}

// main();
main2();