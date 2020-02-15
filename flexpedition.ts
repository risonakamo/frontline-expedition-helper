const blessed=require("blessed");

import MainExpeditionList from "./currentexpeditionlist";

async function main()
{
    var screen:Screen=makeScreen();
    var mainExpeditionList:MainExpeditionList=new MainExpeditionList();
    await mainExpeditionList.loadInitialCurrentExpeditions();

    mainExpeditionList.focus();
    screen.append(mainExpeditionList.expeditionList);

    screen.render();
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

main();