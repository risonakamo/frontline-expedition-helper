export default class CurrentExpeditionList2
{
    allExpeditions:ExpeditionData[] //reference to list of all expeditions, from parent
    currentExpeditions:CurrentExpeditions //dict of current expeditions

    constructor(allExpeditions:ExpeditionData[])
    {
        this.allExpeditions=allExpeditions;
    }
}