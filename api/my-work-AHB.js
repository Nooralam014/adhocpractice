import fetch from "../util/fetch-fill";
import URI from "urijs";
// /records endpoint
window.path = "http://localhost:3000/records";

// Your retrieve function plus any additional functions go here ...
function retrieve(options){
let ids=[];
let open=[];
let closedPrimaryCount
let count = 0
let previousPage
let nextPage
    return new Promise((resolve, reject) => {
    var page
    var url 
    if(options)
    {
    if(options.page)
    {
        page = options.page
    }
    else if(!options.page) 
    {
        page = 1
    }
    if(options.colors)
    {
        let url = `http://localhost:3000/records?limit=10&offset=${(page*10)-10}`
        options.colors.forEach(element=>{
        url = url + `&color[]=${element}`
    })
    }
    else{
     url = `http://localhost:3000/records?limit=10&offset=${(page*10)-10}`
    }
}
    else
    {
    url = `http://localhost:3000/records?limit=10`
    }
    fetch(url)
    .then((response)=>response.json())
    .then((data) => {
        console.log(options)
        console.log(url)
        data.forEach(elem=>{
        ids.push(elem.id)
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
        if(elem.disposition=="closed")
        {
            if(elem.color=="red"||elem.color=="blue"||elem.color=="yellow")
            {
                count++;
            }
        }
    }) 
    closedPrimaryCount =count;
    if(page===1 || !options)
    {
        previousPage = null
        nextPage = 2
    }
    else {
    previousPage = page-1
    nextPage = page+1    
}
          try {
            var result = {previousPage:previousPage,nextPage:nextPage,ids:ids,open:open,closedPrimaryCount:closedPrimaryCount}
            console.log(JSON.stringify(result))
            resolve(result);
          } catch( err ) {
             reject(err)
          }
        }).catch((err) => console.log("error",err));
})
    .catch((err) => console.log("error2",err));
}
export default retrieve;
