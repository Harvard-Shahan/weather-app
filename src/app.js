import { Country, State, City } from 'country-state-city';
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
let countryval="";let stateval="";
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
})

