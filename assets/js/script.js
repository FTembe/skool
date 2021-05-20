// menu
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
// accordion-button-course

      document.querySelectorAll('.accordion-button-course ').forEach((button, i)=>{

    button.addEventListener('click',()=>{

      let accordion_content = button.nextElementSibling,
      accordion_height = accordion_content.scrollHeight;
      button.classList.toggle('active');
      console.log((button.classList.contains('active')));

      if(button.classList.contains('active')){

        accordion_content.style.maxHeight=accordion_height+'px';

        document.body.scrollHeight+accordion_height+'px';
      }else{
       accordion_content.style.maxHeight=0;
      }
    })

  });