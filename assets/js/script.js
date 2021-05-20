
  let menu =  document.querySelector('.menu');
   document.querySelector('#search').addEventListener('click',()=>{
alert('relaxa');
    })
  document.querySelector('.menu-icon').addEventListener('click',()=>{
    menu.classList.add('active');
  })
    document.querySelector('.menu-close').addEventListener('click',()=>{
menu.classList.remove('active');
    })