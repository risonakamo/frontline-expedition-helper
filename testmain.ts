function main4()
{
    var screen=makeScreen();

    var atext=blessed.text({
        content:"hello",
        top:4,
        parent:screen
    });

    var atext2=blessed.text({
        content:"a",
        bottom:-1,
        parent:atext
    });

    var abox=blessed.box({
        parent:atext2,
        bottom:-1,
        width:"30%",
        height:5,
        border:{
            type:"line"
        }
    });

    var textinbox=blessed.box({
        parent:abox,
        content:"hi"
    });

    var listbar=blessed.listbar({
        parent:screen,
        height:1,
        width:"100%",
        bottom:0,
        items:{
            "hello":{
                keys:"a",
                callback:()=>{
                    console.log("a");
                }
            },
            "hello2":{
                keys:"C-a",
                callback:()=>{
                    console.log("b");
                }
            }
        },
        style:{
            selected:{
                bg:"white",
                fg:"black"
            },
            item:{
                bg:"white",
                fg:"blue"
            }
        }
    });

    screen.render();
}

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