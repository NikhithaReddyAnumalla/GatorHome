document.getElementById('submit').addEventListener("click",(e)=>{
    let name=document.getElementById('name').value
    let email=document.getElementById('email').value
    let sugg=document.getElementById('sugg').value
    if(name&&email&&sugg)
    {
        window.alert("Thank you for your valuable feedback");
    }
    else
    {
        window.alert("Please fill detiails in all the fields");
    }    
})