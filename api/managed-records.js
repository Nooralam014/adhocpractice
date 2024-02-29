import fetch from "../util/fetch-fill";
import URI from "urijs";
// /records endpoint
window.path = "http://localhost:3000/records";
// Your retrieve function plus any additional functions go here ...
function retrieve(options) {
    var localOptions
    var localPage
    if(options){
        localOptions = options
        if(options.page)
        {
            localPage = options.page
        }
        else 
        {
            localPage = 1
        }
    }
    else{
        localOptions={}
        localPage=1
    }
    var url = URI(window.path).addSearch("limit", 11).addSearch("offset", (localPage * 10)-10);
    if(localOptions.colors && localOptions.colors.length > 0) {
        url.addSearch("color[]", localOptions.colors);
    }
    var colors = [
        "red", "blue", "yellow"
    ];
    return fetch(url).then((res=>{return res.json()})).then(
        function(res) {
            let count = 0;
            let open = [];
            let ids = [];
            var nPage = res.length <= 10;
            if(!nPage) {res.splice(10, 1)}
            res.forEach(elem => {
                ids.push(elem.id)
                if(elem.disposition=="closed")
                {
                    if(elem.color=="red"||elem.color=="blue"||elem.color=="yellow")
                    {
                        count++;
                    }
                }
                if(elem.disposition=="open")
        {
            if(elem.color=="red"||elem.color=="blue"||elem.color=="yellow")
            {
                elem.isPrimary=true
                open.push(elem)
            }
            else{
                elem.isPrimary=false
                open.push(elem)
            }
        }
            });
            res.forEach(elem => elem.isPrimary = colors.indexOf(elem.color) != -1);
            var obj = {};
            obj.ids = ids;
            obj.open = open;
            obj.closedPrimaryCount = count;
            obj.previousPage = localPage == 1 ? null : localPage - 1;
            obj.nextPage = nPage ? null : localPage + 1;
            return obj;
        }
    ).catch(
        function(err) {
            console.log(err);
        }
    )
}
export default retrieve;