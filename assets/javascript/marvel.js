
const RECORDS_PER_PAGE = 20;
const PAGES_PER_SET = 10;
var currentPage = 1;
var totalRecords = 0;
var currentSet = 1;
  /* 
      This is only for demo purposes. Keep your keys secret and 
      store them in a safe place!
  */

  const PUBLIC_KEY = "";
  const PRIVATE_KEY = "";
  
  const errorHandler=((response)=>{
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response;
  });

  const validateKeys=(()=>{
    if (PUBLIC_KEY === "" || PRIVATE_KEY === "") {
      alert("Please enter your own PUBLIC_KEY and PRIVATE_KEY in the marvel.js file");
      return false
    }
    return true;
  });

  const fetchComics=((id,name)=>{
    const ts = Date.now();
    var hash = md5(ts + PRIVATE_KEY + PUBLIC_KEY);
    
    if (validateKeys === false) {
      return;
    }

    const URL = `http://gateway.marvel.com/v1/public/characters/${id}/comics?ts=${ts}&apikey=${PUBLIC_KEY}&hash=${hash}`;
    const lista = document.querySelector("#lista");

    fetch(URL)
        .then(errorHandler)
        .then(response => response.json())
        .then(data => {
          const myModal = new bootstrap.Modal(document.getElementById('wndComics'), {
            keyboard: false
          });

          let content = document.querySelector("#content");
          let title = document.querySelector("#title");
          title.innerHTML = name + " Comics";
          
          let templateComics = `<ul>`;
          data.data.results.forEach(comic => {
            console.log(comic);
            templateComics += `
              <li>${comic.title}</li>                    
            `;
          });
          
          content.innerHTML = templateComics + `</ul>`;
          myModal.show();
          
        })
        .catch(error =>{
          console.log(error)
        });
  });
    

  const renderPagination=(()=>{
      const paginationTop = document.querySelector("#pagination-top");
      paginationTop.innerHTML = "";
      const totalPages = Math.ceil(totalRecords / RECORDS_PER_PAGE);
      const startPage = (currentSet - 1)  * PAGES_PER_SET + 1;  
      const endPage = Math.min( startPage + PAGES_PER_SET - 1,totalPages);
      
      if (startPage > 1) {
          const element = document.createElement("li");
          element.innerHTML = `<a href="#">Back</a>`;
          
          element.addEventListener("click", (e) => {
              e.preventDefault();
              currentSet--;
              if (currentPage < 1) {
                  currentPage = 1;
              }
              currentPage = startPage - 1;
              fetchData(currentPage - 1);
          });
          
            paginationTop.appendChild(element);
      }
      
      for (let index=startPage; index <= endPage; index++) {
          const element = document.createElement("li");
          
          let className = (index === currentPage) ? "class='active'" : "";
          //element.className = "active";
          element.innerHTML = `<a ${className} href="#">${index}</a>`;
      
          element.addEventListener("click", (e) => {
              e.preventDefault();
              currentPage = index;
              fetchData(currentPage);
          });
      
          paginationTop.appendChild(element);
      }
      
      if (endPage < totalPages) {
          const element = document.createElement("li");
          element.innerHTML = `<a href="#">Next</a>`;

          element.addEventListener("click", (e) => {
              e.preventDefault();
              currentSet++;                    
              currentPage = endPage + 1;
              if (currentPage > totalPages) {
                  currentPage = totalPages;
              }
              fetchData(currentPage);
          });
          paginationTop.appendChild(element);
      }
  });
  

  const renderCards=((data)=>{
      const lista = document.querySelector(".cards");
      lista.innerHTML = "";
   
      data.data.results.forEach(hero => {
          let templateHero =  `<div class="card" >
                                  <div class="card-content">              
                                      <img src="${hero.thumbnail.path}.${hero.thumbnail.extension}" 
                                          alt="${hero.name}"
                                          onclick="handlerComics(${hero.id},'${hero.name}')"
                                           >
                                      <div class="card-body">
                                          <h3>${hero.name} </h3>
                                          <p>${hero.description}</p>
                                      </div>                                      
                                  </div>
                              </div>`;

          lista.innerHTML += templateHero;
      })
      
  });

  const fetchData=((pageNumber)=>{
    if (validateKeys === false) {
      return;
    }

    const ts = Date.now();
    var hash = md5(ts + PRIVATE_KEY + PUBLIC_KEY);
    const OFFSET =(pageNumber - 1) * RECORDS_PER_PAGE;
    
    const URL = `http://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${PUBLIC_KEY}&hash=${hash}&limit=${RECORDS_PER_PAGE}&offset=${OFFSET}`;
    
    fetch(URL)
        .then(errorHandler)
        .then(response => response.json())
        .then(data => {
          totalRecords = data.data.total;
          renderCards(data);
          renderPagination();
        })
        .catch(error =>{
          console.log(error)
        });
    });
    
    //generate ramdom
    
  const handlerComics=((id,name)=>{
    
    fetchComics(id,name);
    
  });  

fetchData(1); //load data when page is loaded
