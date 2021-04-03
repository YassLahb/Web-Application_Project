var movie_link, movie_id, credit_link, cast_link;
var title1, description1, release1,cover1;
var title2, description2, release2,cover2;
var actor_name, role,person_cover, person_id;
var Acting;
var Iteration, Iteration2, IterationV2, type, Iteration3, type2;
var IMG_URL;
var AlreadyVue, AlreadyVue2;
var personList = [];
var moviesList = [];

IMG_URL ='https://image.tmdb.org/t/p/w500';
cast_link = 'null';
var movie_id = 22; //parseInt(1000 * Math.random());

// Making Person data invisible in the beginning
document.getElementById("person-details").style.visibility = "hidden";

//Making Person Form inputs invisible in the beginning
document.getElementById("form-2").style.visibility = "hidden";

//Making Play again inputs invisible in the beginning
document.getElementById("form-3").style.visibility = "hidden";



// Fetching for movie 1
function firstFetching(){
    movie_link = 'https://api.themoviedb.org/3/movie/' + movie_id + '?api_key=0eaa933dc96ec53a1a9af3837810a4e2&language=en-US';
    credit_link = 'https://api.themoviedb.org/3/movie/' + movie_id + '/credits?api_key=0eaa933dc96ec53a1a9af3837810a4e2&language=en-US';
    fetch(movie_link)
  .then(response => response.json())
  .then(data => { 
      console.log(movie_id);
    title1 = data.title;
    description1 = data.overview;
    release1 = 'Released in: ' + data.release_date;
    cover1 = data.poster_path;
    setDataMovie();
  });
}


firstFetching();


//Fetching for Actor
document.querySelector('#Btn-envoyer').addEventListener('click', function(){
    fetch(credit_link)
          .then(response => response.json())
          .then(data => {
            Iteration = data.cast.length;
            IterationV2 = data.crew.length;
            

            // Getting data from input
                Production = document.getElementById('ProductionInput').value.toString();
                var ProductionValue = Production;
                AlreadyVue = personList.includes(ProductionValue);
                
                //personList.push(Production);
                // Search and comparing person with our input value
                /* VARS */ 
                var found, i, Compar,k;
                found = false; i = 0; k=0;
        
                while( !found && i < Iteration ){
                    Compar = data.cast[i].name.toLowerCase().localeCompare(ProductionValue.toLowerCase());
                    if (Compar == 0){
                        found = true;
                        type = 'actor';
                        person_id = data.cast[i].id;
                        cast_link = 'https://api.themoviedb.org/3/person/' + person_id + '/movie_credits?api_key=0eaa933dc96ec53a1a9af3837810a4e2&language=en-US';
                    } else {i = i+1;}
                }

                while(!found && k < IterationV2){
                            Compar = data.crew[k].name.toLowerCase().localeCompare(ProductionValue.toLowerCase());
                            if (Compar == 0){
                                type = 'other';
                                person_id = data.crew[k].id;
                                console.log(person_id);
                                cast_link = 'https://api.themoviedb.org/3/person/' + person_id + '/movie_credits?api_key=0eaa933dc96ec53a1a9af3837810a4e2&language=en-US';
                                found = true;
                            } else {k = k + 1;}
                }
        
                if (found && !AlreadyVue){ // if found person display his data
                    
                    if(type == 'actor'){
                        actor_name = data.cast[i].name;
                        role = data.cast[i].character;
                        person_cover = data.cast[i].profile_path;
                        document.querySelector('#person-role').innerHTML = 'he played in this movie the role of ' + role.bold();
                        (setDataPerson(person_cover));
                    } else if(type == 'other') {
                        actor_name = data.crew[k].name;
                        role = data.crew[k].job;
                        person_cover = data.crew[k].profile_path;
                        document.querySelector('#person-role').innerHTML = 'He was in this movie a ' + role.bold();

                        (setDataPerson(person_cover));
                    }

                    document.getElementById("person-details").style.visibility = "visible";
                    document.getElementById("form-2").style.visibility = "visible";
                    //console.log(cast_link);
                    if (cast_link !== 'null'){
                        
                        } 

                    } else if (found == true && AlreadyVue == true) { //if the person is wrong
                        clearData5('Person',1,'ProductionInput');
                        document.getElementById("person-details").style.visibility = "hidden";
                        document.getElementById('person-cover-1').src = '';
                    } else {
                        clearData1();
                    }
        });

})

document.querySelector('#Btn-envoyer-2').addEventListener('click', function(e){
    console.log(e)

    fetch(cast_link)
            .then(response => response.json())
            .then(data => {
    console.log("after fetch");

            Iteration2 = data.cast.length;
            Iteration3 = data.crew.length;

            //Getting the data of the movie input
                Acting = document.getElementById('ActingInput').value.toString();
                var ActingValue = Acting;
                console.log(personList);

                AlreadyVue2 = personList.includes(ActingValue.toLowerCase());
                personList.push(Acting.toLowerCase()); 
                

                // Search and comparing person with our input value
                var found2, j, Compar2, n;
                found2 = false; j = 0, n=0, type2 = '';
                
                if (found2 == false){
                    while(found2 == false && n < Iteration3){
                        Compar2 = data.crew[n].title.toLowerCase().localeCompare(ActingValue.toLowerCase());
                        if (Compar2 == 0){
                            type2 = 'crew';
                            found2 = true;
                        } else {n = n+1;}
                    } 
                }
                
                if (found2 == false){
                    while(found2 == false && j < Iteration2 ){
                        Compar2 = data.cast[j].title.toLowerCase().localeCompare(ActingValue.toLowerCase());
                        if (Compar2 == 0){
                            type2 = 'cast';
                            found2 = true;
                        } else {j = j+1;}
                    }
                }

                if (found2 == true && AlreadyVue2 == false){ // if found movie display his data
                    if( type2 == 'cast'){
                        title2 = data.cast[j].title;
                        description2 = data.cast[j].overview;
                        release2 = data.cast[j].release_date;
                        cover2 = data.cast[j].poster_path;
                        movie_id = data.cast[j].id;
                        setDataMovie2();
                    } else if(type2 == 'crew'){
                        title2 = data.crew[n].title;
                        description2 = data.crew[n].overview;
                        release2 = data.crew[n].release_date;
                        cover2 = data.crew[n].poster_path;
                        movie_id = data.crew[n].id;
                        setDataMovie2();
                    }
                    
                    document.getElementById("movie-details-2").style.visibility = "visible";
                    document.getElementById("form-3").style.visibility = "visible"; //make play again visible
                }
                else if(found2 == true && AlreadyVue2 == true){
                    clearData5('Movie',2,'ActingInput');
                    document.getElementById("form-3").style.visibility = "hidden";
                    document.getElementById("movie-details-2").style.visibility = "hidden";
                    document.getElementById('movie-cover-3').src = '';
                } else { //if the 2nd movie is wrong
                    clearData2();
                }
        });
})

document.getElementById('Btn-replay').addEventListener('click', function() {
        init();
        topFunction();
} )




// FUNCTIONS USED 

// Function SetData for the 1st movie
function setDataMovie(){
    document.querySelector('#movie-title-1').textContent = title1;
    document.querySelector('#movie-description-1').textContent = description1;
    document.querySelector('#movie-release-1').textContent = release1;
    document.getElementById("Movie-cover-1").src = IMG_URL + cover1;
}


function setDataMovie2(){
    if(cover2 != null){
        document.querySelector('#movie-title-2').textContent = title2;
        document.querySelector('#movie-description-2').textContent = description2;
        document.querySelector('#movie-release-2').textContent = release2;
        document.getElementById('movie-cover-3').src = IMG_URL + cover2;
    } else {
        document.querySelector('#movie-title-2').textContent = title2;
        document.querySelector('#movie-description-2').textContent = description2;
        document.querySelector('#movie-release-2').textContent = release2;
        document.getElementById('movie-cover-3').src = './src/img/black.jpg';
    }
}

// Function SetData for person
function setDataPerson( person_cover){
    if (person_cover != null){
        document.querySelector('#person-name').textContent = actor_name;
        document.getElementById('person-cover-1').src = IMG_URL + person_cover;
    } else if (person_cover == null){
        document.querySelector('#person-name').textContent = actor_name;
        document.getElementById('person-cover-1').src = './src/img/black.jpg';
    }

}

function clearData1(){
    document.getElementById('Hint-1').textContent = "Wrong Answer, Try again!";
    document.getElementById('ProductionInput').value = "";
}


function clearData2(){
    document.getElementById('Hint-2').textContent = "Wrong Answer, Try again!";
    document.getElementById('ActingInput').value = "";
}

function clearData3(){
    document.getElementById('Hint-1').textContent = "Please enter the director name or one of the actors movie";
    document.getElementById('ProductionInput').value = "";
}

function clearData4(){
    document.getElementById('Hint-2').textContent = "Please enter the a name of a movie where this person was actor or director";
    document.getElementById('ActingInput').value = "";
}

function clearData5(type,id,input){
    document.getElementById('Hint-' + id).textContent = type + " already mentionned, try another one";
    document.getElementById(input).value = "";
}

function init(){
    title2 = "";
    description2 = "";
    release2 = "";
    found2 = false;
    cast_link = "null"
    document.getElementById("movie-details-2").style.visibility = "hidden";
    document.getElementById("person-details").style.visibility = "hidden";
    document.getElementById("form-2").style.visibility = "hidden";
    document.getElementById("form-3").style.visibility = "hidden";
    document.getElementById('person-cover-1').src = '';
    document.getElementById('movie-cover-3').src = '';

    clearData3();
    clearData4();
    firstFetching();
}

function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }