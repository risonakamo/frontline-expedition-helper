const blessed=require("blessed");
const stripAnsi=require("strip-ansi");

import MainExpeditionList from "./mainexpeditionlist";
import CurrentExpeditionList2 from "./currentexpeditionlist2";

async function main3()
{
    var screen:Screen=makeScreen();

    var mainlist=new MainExpeditionList();
    await mainlist.loadAllExpeditions();
    var currentlist=mainlist.currentList;

    mainlist.calcDifferenceInitial();
    var mainlistContent:string[]=mainlist.outputTextTableSorted("name",false,true).split("\n");

    var mainlistHeaderElement:BlessList=blessed.Text({
        content:mainlistContent.shift(),
        parent:screen
    });

    var mainlistElement:BlessList=blessed.List({
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

    var currentlistElement:BlessList=blessed.List({
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
    currentlistElement.on("select",(e:any)=>{
        applyDifference(
            convertChoiceToName(e.content),
            mainlist,
            mainlistElement,
            screen,
            currentlist,
            mainlistHeaderElement
        );
    });

    mainlistElement.on("select",(e:any)=>{
        swapNewExpedition(
            convertChoiceToName(e.content),
            mainlistElement,
            screen,
            currentlist,
            currentlistElement
        );
    });

    screen.render();
}

function makeScreen():Screen
{
    var screen:Screen=blessed.screen({
        smartCSR:true,
        autoPadding:true
    });

    screen.key(["q"],()=>{
        return process.exit();
    })

    return screen;
}

//given a choice from the CurrentExpeditionList, return the name extracted from that choice
function convertChoiceToName(choice:string):string
{
    return stripAnsi(choice.match(/\S+/)[0]);
}

//given a bunch of stuff, use a choice to apply a difference to the mainlist, and update the main list element.
function applyDifference(choice:string,mainlist:MainExpeditionList,
    mainlistElement:BlessElement,screen:Screen,currentlist:CurrentExpeditionList2,
    mainlistHeaderElement:BlessElement):void
{
    if (choice=="total")
    {
        return;
    }

    currentlist.setLastChosen(choice);
    mainlist.calcDifferenceChoice(choice);

    var newcontent:string[]=mainlist.outputTextTableSorted("parts",true,true).split("\n");

    mainlistHeaderElement.setContent(newcontent.shift());

    mainlistElement.setItems(newcontent);
    mainlistElement.interactive=true;
    mainlistElement.focus();
    screen.render();
}

// given a choice, swap in the choice into the current expedition list, switching it with the last
// chosen choice. switches focus back to the current expedition list.
function swapNewExpedition(choice:string,mainlistElement:BlessElement,screen:Screen,
    currentlist:CurrentExpeditionList2,currentlistElement:BlessElement):void
{
    currentlist.swapWithLastChoice(choice);

    var newcontent=currentlist.outputTextTable().split("\n");

    mainlistElement.interactive=false;
    currentlistElement.setItems(newcontent);
    currentlistElement.focus();
    screen.render();
}

// main();
// main2();
main3();