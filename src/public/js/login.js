const form = document.getElementById('loginForm')
const btn = document.getElementById('redirectSignup')

form.addEventListener('submit', (e)=>{
    e.preventDefault()

    const data = new FormData(form)    
    const obj = {}

    data.forEach((value,key)=>obj[key]=value)

    const url = '/api/auth';
    const headers = {
        'Content-Type': 'application/json'
    }
    const method = 'POST';
    const body = JSON.stringify(obj);

    fetch(url,{
        headers,
        method,
        body,
    })
    .then(res=>res.json())
    .then(data=>{
        console.log(data);
        window.location.href = '/api/products';
    })
    .catch(error=>console.log(error))
})



btn.addEventListener('click', ()=>{
    const url = '/api/login/redirect'
    const method = 'GET';

    fetch(url, {method})
    .then((res)=>{
        window.location.href = '/api/signup';
    })
    .catch((err)=>{
        console.log(err);
    })
})

