let apiData = {}; 
let colorMode = "LIGHT"

let fullName = $("#name");
let joined = $("#created"); 
let username = $("#username");
let bio = $("#bio"); 
let repoNumber = $("#repoNumber"); 
let followerNumber = $("#followerNumber"); 
let following = $("#following");
let city = $("#city");
let twitter = $("#twitter"); 
let link = $("#link"); 
let company = $("#company");
let profilePic = $("#profilePic");
let btnLigthMode = $("#btn-light-mode");
let input = $("#search")
let serachButton = $("button.search-btn")
let resultText = $(".no-result");
let NotFound = $("#not-found");


btnLigthMode.css("cursor", "pointer");

const moonPath = "M91.5 133.5C116.697 195.394 191.5 212.5 191.5 212.5C104 249 33.1972 229.894 7.99994 168C-17.1973 106.106 18 21 104 0.500002C104 0.500002 66.3027 71.606 91.5 133.5Z";
const sunPath =  "M234.069 76.3763C259.266 138.27 229.518 208.872 167.624 234.069C105.73 259.266 35.1281 229.518 9.93084 167.624C-15.2664 105.73 14.4822 35.1282 76.3762 9.93092C138.27 -15.2664 208.872 14.4822 234.069 76.3763Z";

const lightModeIcon = $("#light-mode-icon");

let isDarkMode = false;

btnLigthMode.on("click", ()=>{

    const timeline = anime.timeline({
        duration : 700,
        easing : "easeOutExpo"
    });

    timeline.add({
        targets: ".sun",
        d: [{value: isDarkMode ? moonPath : sunPath}]
    });
    timeline.add({
        targets: ".ray",
        d: [{value: ""}]
    }, "-=300");
    timeline.add({
        targets: "#light-mode-icon",
        rotate: isDarkMode ? 0 : -380
    }, "-=600");
    timeline.add({
        targets: "body",
        backgroundColor: isDarkMode ? "#F6F8FF" : "#141D2F",
        color: isDarkMode ? "#222731" : "#FFF"
    }, "-=700");
    timeline.add({
        targets: ".search, .input, .data",
        backgroundColor: isDarkMode ? "#FFF" : "#1E2A47",
    }, "-=700");
    timeline.add({
        targets: ".stats",
        backgroundColor: isDarkMode ? "#F6F8FF" : "#141D2F",
        color: isDarkMode ? "#222731" : "#FFF"
    }, "-=700");
    timeline.add({
        targets: ".light-mode-text",
        
        update: function() {
            if(isDarkMode){
                document.querySelector('.light-mode-text').innerHTML = "LIGHT";
            } else{
                document.querySelector('.light-mode-text').innerHTML = "DARK";
            }
            
        }
    }, "-=900");

    if(!isDarkMode){
        isDarkMode = true;
    }else{
        isDarkMode = false;
    }
})


let user = "GazdagB"



window.addEventListener("load", async ()=>{
apiData = await fetchBase();     
//console.log(apiData);
fillInUser(); 
styleAfterAvailability();
loadLinks();
})

serachButton.on("click",async ()=>{
    user = input.val();
    await fetchSearch();
    if(apiData.message === "Not Found"){
        hideElements();
        showNotFound();
        resultText.removeClass("hidden")
    }else{
        resultText.addClass("hidden")
        hideNotFound();
        fillInUser();
        showElements();
        styleAfterAvailability();
        loadLinks();
    }
    
})

input.on("keypress", async (e) => {
       if (e.key === "Enter") {
        user = input.val();
        await fetchSearch();


        if(apiData.message === "Not Found"){
            console.log("User not found");   
            showNotFound();
            resultText.removeClass("hidden")
        
        }else{
            resultText.addClass("hidden")
            hideNotFound();
            fillInUser();
            showElements();
            styleAfterAvailability();
            loadLinks();
        }
    }
});



async function fetchBase(){
    let res = await fetch("https://api.github.com/users/octocat");
    let data = res.json(); 
    return data; 
} 

async function fetchSearch(){
    let res = await fetch(`https://api.github.com/users/${user}`)
    let data = await res.json(); 
    apiData = data;
}

function formatDate(dateString) {
    // Parse the string date format
    const date = new Date(dateString);
  
    // Format the date parts
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
  
    // Return the formatted date string
    return `Joined ${day} ${month} ${year}`;
}

function fillInUser(){
    joined.text(formatDate(apiData.created_at))
    fullName.text(apiData.name)
    username.text("@"+apiData.login)
    bio.text(apiData.bio === null ? "This profile has no bio" : apiData.bio)
    repoNumber.text(apiData.public_repos)
    followerNumber.text(apiData.followers)
    following.text(apiData.following)
    city.text(truncateString(!apiData.location ? "Not Available" : apiData.location, 16))
    twitter.text(truncateString(!apiData.twitter_username ? "Not Available" : apiData.twitter_username, 16))
    link.text(truncateString(!apiData.blog ? "Not Available" : apiData.blog, 16));
    company.text(truncateString(!apiData.company? "Not Available" : apiData.company, 19))
    profilePic.css('background-image', 'url(' + apiData.avatar_url + ')');
    profilePic.css('background-size', "contain")
}
  

function hideElements(){
    $("#profileContainer").hide();
    $("#data-container").hide();
}

function showElements(){
    $("#profileContainer").show();
    $("#data-container").show();
}

function showNotFound(){
    NotFound.removeClass("hidden")
}

function hideNotFound(){
    NotFound.addClass("hidden")
}


/**
 * Truncates a string to a specified length, adding the whished ending example (...) at the end if the string is longer.
 * @param {string} str The string to be truncated.
 * @param {number} length The maximum desired length of the truncated string. 
 * @param {*} ending  [ending='...'] (Optional) The string to append to the truncated string if it's longer than the specified length (defaults to '...').
 * @returns The truncated string, potentially with the ending appended.
 */
function truncateString(str, length, ending = '...') {
    
    if (str.length <= length) return str;
    return str.slice(0, length) + ending;
  }


  //It has to be deterministic
function styleAfterAvailability(){
    //LOCATION
    if(apiData.location === ""){
        city.css("opacity", "0.5");
    }else if(apiData.location){
        city.css("opacity", "1");
    }

    //TWITTER
    if(apiData.twitter_username === null){
        twitter.css("opacity", "0.5");
    }else if(apiData.twitter_username){
        twitter.css("opacity", "1");
    }

    //LINK
    if(apiData.blog === ""){
        link.css("opacity", "0.5");
    }else if(apiData.blog){
        link.css("opacity", "1");
    }

    //COMPANY
    if(apiData.company === null){
        company.css("opacity", "0.5");
    }else if(apiData.company){
        company.css("opacity", "1");
    }

    //BIO
    if(apiData.bio === null){
        bio.css("opacity", "0.5");
    }else if(apiData.bio){
        bio.css("opacity", "1");
    }
}

function loadLinks(){
    if(apiData.blog !== ""){
        link.attr("href", apiData.blog);
        link.off('click'); // Remove previous click event handlers
    } else {
        link.attr("href", "#");
        link.on('click', function(event) {
            event.preventDefault(); // Prevent the default action
        });
    }

    username.attr("href", apiData.html_url); 
    
}