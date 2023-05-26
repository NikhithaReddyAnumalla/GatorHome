displayFliters=false;
let rowCount=0;
let Filters={
    priceRange:{
        min:0,
        max:1000000
    },
    beds:{
        min:0,
        max:1000
    },
    baths:{
        min:0,
        max:1000
    },
    applicationFee:null,
    swimmingPool:null,
    gym:null,
    laundry:null
}
document.getElementById('fliterButton').addEventListener('click',(e)=>{
if(!displayFliters)
{    
    document.getElementById('aparmentsDisplay').className='col-9';
    document.getElementById('filtersDisplay').style.display='block';
    setEqualHeight()
}
else
{
    document.getElementById('aparmentsDisplay').className='col-12';
    document.getElementById('filtersDisplay').style.display='none';
    setEqualHeight()
}
displayFliters=!displayFliters;
})
function addComponents(allData)
{
    let count=0;
    document.getElementById("aparmentsDisplay").innerHTML=``
    for(let i=0;i<allData.results.length;i+=4)
    {
        let newRow=document.createElement("div")
        newRow.id="apartmentsRow"
        newRow.className='row my-2'
        for(let j=i;j<i+4&&j<allData.results.length;j++)
        {
            let cr=allData.results[j]
            if(allData.results[j].description.name==null||allData.results[j].location.address==null)
            {
                allData.results[j].description.name=""
            }
            let currentName=allData.results[j].description.name.split("-")
            let currentAddress=allData.results[j].location.address
            let currentDesc=allData.results[j].description
            let newCard=document.createElement("div")
            let petsAllowed='No'
            let currentImage=null
            let imageId=`img_${count}_${j-i}`
            let currentPrice="";
            // if(allData.results[j].list_price_min)
            if(allData.results[j].primary_photo)
            {
                currentImage=allData.results[j].primary_photo.href
            }
            if(!currentImage)
            {
                currentImage="./img/noImage.png"
            }
            if(allData.results[j].pet_policy&&allData.results[j].pet_policy.text=='pets_allowed')
            {
                petsAllowed='Ok'
            }
            newCard.className='col-3'
            newCard.style.cursor='pointer'
            newCard.addEventListener("click",(e)=>{
                setLocalStorageSelected(allData.results[j].property_id)
            })
            newCard.innerHTML=
            `<div class="card colla" data-id='${i+j}'>
            <img src="${currentImage}"
            id=${imageId}  class="card-img">
            </div>
            <div class="card" style="margin-top: -10px;z-index: -1;">
                <div class="card-body">
                <h5>${currentName[0]}</h5>
                <p class="small" style="margin-top: -8px;">${currentAddress.line}, ${currentAddress.city}, 
                ${currentAddress.state_code} ${currentAddress.postal_code}</p>
                <h5 style="margin-top: -12px;">$${allData.results[j].list_price_min}</h5>
                <ul class="nav">
                    <li class="nav-item mx-1">
                        <b>${currentDesc.beds_max}</b> bed
                    </li>
                    <li class="nav-item mx-1">
                        <b>${currentDesc.baths_min}</b> bath
                    </li>
                    <li class="nav-item mx-1">
                        <b>${currentDesc.sqft_min}</b> sqft
                    </li>
                    <li class="nav-item mx-1">
                        Pets <b>${petsAllowed}</b>
                    </li>
                </ul>
                </div>
            </div>`
            newRow.appendChild(newCard)
        }
        document.getElementById("aparmentsDisplay").appendChild(newRow)
        count++;
    }
    rowCount=count
    setEqualHeight() 
}
window.onload=function seteverything()
{
    if(localStorage.getItem("allData")==null)
    {
        addLocalStorage()
    }  
    else
    {
        let allData=JSON.parse(localStorage.getItem("allData"))
        addComponents(allData)
        setFilters()
    }
    // setEqualHeight()
}    
function setFilters()
{
    document.getElementById('applicationFee').indeterminate=true
    document.getElementById('swimmingPool').indeterminate=true
    document.getElementById('gym').indeterminate=true
    document.getElementById('laundry').indeterminate=true
}
function setEqualHeight()
{  
    for(let i=0;i<rowCount;i++)
    {
        let minHeight=1000;
        for(let j=0;j<4;j++)
        {
            if(document.getElementById(`img_${i}_${j}`)==null)
             continue
            let currentHeight=document.getElementById(`img_${i}_${j}`).clientHeight
            if(currentHeight<minHeight)
            minHeight=currentHeight;
        }
        if(minHeight==0)
        {
            for(let j=0;j<4;j++)
            {
                if(document.getElementById(`img_${i}_${j}`)==null)
                    continue
                let currentHeight=document.getElementById(`img_${i}_${j}`).clientHeight
                if(currentHeight>minHeight)
                minHeight=currentHeight;
            }
        }
        if(minHeight==0)
        {
            minHeight=document.getElementById(`img_${i}_${0}`).clientWidth*0.8
        }
        for(let j=0;j<4;j++)
        {
            if(document.getElementById(`img_${i}_${j}`)==null)
                    continue
            document.getElementById(`img_${i}_${j}`).style.height=`${minHeight}px`
        }
    }
}
function addLocalStorage()
{
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "./jsons/allTheData.json", true);
    xhr.send();
    let allData=null;
    xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        let allData=JSON.parse(this.responseText)
        localStorage.setItem("allData",this.responseText)
        addComponents(allData)
        setFilters()
    }
    }
}
function clearFilter(parameter)
{
    if(parameter=='priceRange'||parameter=='beds'||parameter=='baths')
    {
        document.getElementById(`${parameter}Min`).value=''
        document.getElementById(`${parameter}Max`).value=''
        Filters[`${parameter}`]={min:0,max:100000}
    }
    else
    {
        document.getElementById(`${parameter}`).indeterminate=true
        Filters[`${parameter}`]=null
    }
}
function createAparmentsBasedOnFilters()
{
    let allData=JSON.parse(localStorage.getItem("allData"))
    let filterData={
        results:[]
      }
    let results=allData.results  
    for(let i=0;i<results.length;i++)
    {
        let isAllowed=true;
        isAllowed=isAllowed&&(results[i].list_price_min>=Filters['priceRange'].min&&results[i].list_price_min<=Filters['priceRange'].max)
        isAllowed=isAllowed&&(results[i].description.beds_max>=Filters['beds'].min&&results[i].description.beds_max<=Filters['beds'].max)
        isAllowed=isAllowed&&(results[i].description.baths_min>=Filters['baths'].min&&results[i].description.baths_min<=Filters['baths'].max)
        if(Filters['applicationFee']!=null)
        {
            isAllowed=isAllowed&&(results[i].applicationFee==Filters['applicationFee'])
        }
        if(Filters['swimmingPool']!=null)
        {
            isAllowed=isAllowed&&(results[i].swimmingPool==Filters['swimmingPool'])
        }
        if(Filters['gym']!=null)
        {
            isAllowed=isAllowed&&(results[i].gym==Filters['gym'])
        }
        if(Filters['laundry']!=null)
        {
            isAllowed=isAllowed&&(results[i].laundry==Filters['laundry'])
        }
        if(isAllowed)
        {
            filterData.results.push(results[i])
        }
    }
    if(filterData.results.length==0)
    {
        alert('There are no apartments in our database with specified filters')
    }
    else
    {
        addComponents(filterData)
    }      
}
function applyFilters()
{
    if(document.getElementById('priceRangeMin').value)
    {
        Filters['priceRange'].min=document.getElementById('priceRangeMin').value
    }
    if(document.getElementById('priceRangeMax').value)
    {
        Filters['priceRange'].max=document.getElementById('priceRangeMax').value
    }
    if(document.getElementById('bedsMin').value)
    {
        Filters['beds'].min=document.getElementById('bedsMin').value
    }
    if(document.getElementById('bedsMax').value)
    {
        Filters['beds'].max=document.getElementById('bedsMax').value
    }
    if(document.getElementById('bathsMin').value)
    {
        Filters['baths'].min=document.getElementById('bathsMin').value
    }
    if(document.getElementById('bathsMax').value)
    {
        Filters['baths'].max=document.getElementById('bathsMax').value
    }
    if(!document.getElementById('applicationFee').indeterminate)
    {
        Filters['applicationFee']=document.getElementById('applicationFee').checked
    }
    if(!document.getElementById('swimmingPool').indeterminate)
    {
        Filters['swimmingPool']=document.getElementById('swimmingPool').checked
    }
    if(!document.getElementById('gym').indeterminate)
    {
        Filters['gym']=document.getElementById('gym').checked
    }
    if(!document.getElementById('laundry').indeterminate)
    {
        Filters['laundry']=document.getElementById('laundry').checked
    }
    createAparmentsBasedOnFilters()
}
function setLocalStorageSelected(index)
{
    localStorage.setItem("currentResult",index)
    location.assign('apartmentDetails.html')
}