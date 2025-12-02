import { Country, State, City } from 'country-state-city';
import "./style.css";
//display all the countries
const countries = Country.getAllCountries();
const body=document.querySelector('.body');
function addChoices(select,arr){
    //function that displays all choices 
    for (let i=0;i<arr.length;i++) {
            const opt=document.createElement("option");
            opt.value=arr[i].isoCode;
            // opt.value=arr[i].name;
            opt.textContent=arr[i].name;
            select.appendChild(opt)  
        }
}
//default values for each input 
const defaultStateValue=document.createElement("option");
defaultStateValue.value="";
defaultStateValue.text="Select a state";
defaultStateValue.disabled=true;
defaultStateValue.selected=true;
defaultStateValue.hidden=true;
const defaultCityValue=document.createElement("option");
defaultCityValue.value="";
defaultCityValue.text="Select a city";
defaultCityValue.disabled=true;
defaultCityValue.selected=true;
defaultCityValue.hidden=true;
const countryinput=document.querySelector("#country-choice")
addChoices(countryinput,countries)
let countryval="";let stateval="";let cityval="";
countryinput.addEventListener("change",(event)=>{
    if(countryinput.value!="") //if a valid choice of country is selected
    {   countryval=countryinput.value //save the choice
        stateval="";
        const findstateinput=document.querySelector("#state-choice");
        if(findstateinput!=null){ //reset any previous choice of state if country was chosen
            const findCityinput=document.querySelector("#city-choice");
                if(findCityinput!=null)//reset any choice of city if state was chosen
                    findCityinput.remove();
            findstateinput.remove();
        }
        const stateinput=document.createElement("select");
        stateinput.id="state-choice";
        stateinput.name="stateChoice";
        const states=State.getStatesOfCountry(countryinput.value);
        stateinput.appendChild(defaultStateValue);
        body.append(stateinput);
        addChoices(stateinput,states); //add choice of states for chosen country
        stateinput.addEventListener("change",(event)=>{
            if(stateinput.value!=""){
                stateval=stateinput.value
                const findCityinput=document.querySelector("#city-choice");
                if(findCityinput!=null) //reset to display new entry of cities after removing the previous entry of cities
                    findCityinput.remove();
                const cityinput=document.createElement("select");
                cityinput.id="city-choice";
                cityinput.name="cityChoice"
                const cities=City.getCitiesOfState(countryinput.value,stateinput.value);
                cityinput.appendChild(defaultCityValue);
                body.append(cityinput);
               addChoices(cityinput,cities);//add choice of city for chosen state.
            //    console.log(stateinput.value);
            }
        })   
    }
})
//button to request weather data
const btn=document.querySelector("#btn");
btn.addEventListener("click",()=>{
    //validate choices
    //retrieve values to make a request.
console.log(countryval+ stateval)
let countryName=Country.getCountryByCode(countryval);
let stateName=State.getStateByCodeAndCountry(stateval,countryval);
console.log(countryName.name)
console.log(stateName.name);
// fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${stateName.name},${countryName.name}?key=${key}`)
// .then(function(response){
//     return response.json()
// }).then(function(response){
//     console.log(response);
// })
const rq=(getWeatherData(stateName.latitude,stateName.longitude));
console.log(rq);
})
var map = L.map('map').setView([51.505, -0.09], 13);    
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
map.on("click",async(e)=>{
    const {lat,lng}=e.latlng;
    console.log(lat+"  "+lng);
    getWeatherData(lat,lng);
})
async function getWeatherData(countryName,stateName) {
    try{
    const weatherrequest=fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${countryName},${stateName}?key=${key}`);
    const response=(await weatherrequest)
    const data= await response.json();
    const current=data.currentConditions;
    console.log(current)
    const weatherHTML=`<b>Weather</b>
    <br>
    Temp:${((current.temp-32)*5/9).toFixed(2)}*C<br>
    Conditions:${current.conditions}<br>
    Wind:${current.windspeed} km/h`;
    L.marker([countryName,stateName])
    .addTo(map)
    .bindPopup(weatherHTML)
    .openPopup();
    return data;
     }
     catch(err){
        console.log(err);
        return "Error-could not receive data";
}
     
}
