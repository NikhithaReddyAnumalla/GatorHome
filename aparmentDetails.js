let map;
let localContextMapView;
let askButton="display";//"submit is the other value"
const styles = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#f5f5f5",
      },
    ],
  },
  {
    elementType: "labels",
    stylers: [
      {
        visibility: "on",
      },
    ],
  },
  {
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "on",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#616161",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#f5f5f5",
      },
    ],
  },
  {
    featureType: "administrative.land_parcel",
    stylers: [
      {
        visibility: "on",
      },
    ],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#bdbdbd",
      },
    ],
  },
  {
    featureType: "administrative.neighborhood",
    stylers: [
      {
        visibility: "on",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [
      {
        color: "#eeeeee",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      {
        color: "#e5e5e5",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9e9e9e",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      {
        color: "#ffffff",
      },
    ],
  },
  {
    featureType: "road.arterial",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#dadada",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#616161",
      },
    ],
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9e9e9e",
      },
    ],
  },
  {
    featureType: "transit.line",
    elementType: "geometry",
    stylers: [
      {
        color: "#e5e5e5",
      },
    ],
  },
  {
    featureType: "transit.station",
    elementType: "geometry",
    stylers: [
      {
        color: "#eeeeee",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#c9c9c9",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9e9e9e",
      },
    ],
  },
];

function initMap() {
  localContextMapView = new google.maps.localContext.LocalContextMapView({
    element: document.getElementById("map"),
    placeTypePreferences: [
        { type: "bakery", weight: 1 },
        { type: "bank", weight: 1 },
        { type: "cafe", weight: 2 },
        { type: "department_store", weight: 1 },
        { type: "drugstore", weight: 1 },
        { type: "park", weight: 3 },
        { type: "restaurant", weight: 2 },
        { type: "primary_school", weight: 3 },
        { type: "secondary_school", weight: 3 },
        { type: "supermarket", weight: 2 },
      ],
    maxPlaceCount: 24,
  });
  map = localContextMapView.map;
  map.setOptions({
    center: { lat: 29.654254, lng: -82.348162 },
    zoom: 14,
    styles,
  });

  // Build and add the Autocomplete search bar
  const input = document.getElementById("input");
  const options = {
    types: ["address"],
    componentRestrictions: {
      country: "us",
    },
    fields: ["address_components", "geometry", "name"],
  };
  const autocomplete = new google.maps.places.Autocomplete(input, options);

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();

    if (!place || !place.geometry) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("No address available for that input.");
      return;
    }

    // Recenter the map to the selected address
    map.setOptions({
      center: place.geometry.location,
      zoom: 14,
    });
    // Update the localContext directionsOptions origin
    localContextMapView.directionsOptions = {
      origin: place.geometry.location,
    };
    new google.maps.Marker({
      position: place.geometry.location,
      map: map,
      icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAAbUlEQVR4Ae3LoQ2AMAAF0TMYPJoV2IApGIJtmIMtmIAVqutraj6IiqZpmyYoCO/08R7bXbOOHSF2Ohr0HCh00EPdwImiTgYqRgxKMowUTFiUyTKRMeNQIcdMYsGjSp6FyIoaWkmoUuLxEPzDh1xIaLFFuTyHMgAAAABJRU5ErkJggg==",
      zIndex: 30,
    });
    // update the results with new places
    localContextMapView.search();
  });
}

window.onload=function seteverything()
{
    let currentelement=parseInt(localStorage.getItem('currentResult'))
    let allData=JSON.parse(localStorage.getItem('allData'))
    let currentResult=null
    for(let i=0;i<allData.results.length;i++)
    {
      let currentId=parseInt(allData.results[i].property_id)
      if(currentelement==currentId)
      {
        currentResult=allData.results[i]
        break
      }
    }
    document.getElementById('price').innerHTML=`$ ${currentResult.list_price_min} <small>/mo</small>`
    document.getElementById('apartmentDets').innerHTML=`<b>${currentResult.description.beds_max}</b> bed &nbsp;&nbsp;&nbsp;&nbsp; 
     <b>${currentResult.description.baths_min}</b> bath &nbsp;&nbsp;&nbsp;&nbsp;  <b>${currentResult.description.sqft_min}</b> sqft`
    document.getElementById('name').innerHTML=`${currentResult.description.name}` 
    document.getElementById('address').innerHTML=`${currentResult.location.address.line},
     ${currentResult.location.address.city}, ${currentResult.location.address.state_code} 
     ${currentResult.location.address.postal_code}`
     document.getElementById('l1').innerHTML=
     `<i class="fa fa-bed" aria-hidden="true" ></i> ${currentResult.description.beds_max} bed`
     document.getElementById('l2').innerHTML=
     `<i class="fa fa-bath" aria-hidden="true"></i> ${currentResult.description.baths_min} bath`
     document.getElementById('l3').innerHTML=
     `<i class='fas fa-ruler-horizontal'></i> ${currentResult.description.sqft_min} sqft`
     document.getElementById('l4').innerHTML=
     `$${currentResult.list_price_min}`

     document.getElementById('firstSlide').src=`${currentResult.primary_photo.href}`
     document.getElementById('secondSlide').src=`${currentResult.photos[0].href}`
     document.getElementById('thirdSlide').src=`${currentResult.photos[1].href}`
     document.getElementById('apartmentMap').innerHTML=
     `<iframe width="100%" height="100%" style="border:0" loading="lazy" allowfullscreen src="https://www.google.com/maps/embed/v1/place?q=place_id:${currentResult.placeId}&key=AIzaSyBVdQy-W4vqrrIA7-al0r8QAnEj9kiKzAE"></iframe>`
    // setEqualHeight()
} 

document.getElementById('AskME').addEventListener("click",(e)=>{
    document.getElementById('AskME').style.display='none'
    document.getElementById('questionsTab').style.display='inline-block'
})

document.getElementById('closeBox').addEventListener("click",(e)=>{
  document.getElementById('AskME').style.display='inline-block'
  document.getElementById('questionsTab').style.display='none'
})

document.getElementById('submit').addEventListener('click',(e)=>{
  let text=document.getElementById('inputText').value
  fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer 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"
        },
        body: JSON.stringify({
            "model": "text-davinci-003",
            "prompt": text,
            "temperature": 0.7,
            "max_tokens": 256,
            "top_p": 1,
            "frequency_penalty": 0,
            "presence_penalty": 0
        })
      })
      .then(response => response.json())
      .then(response => {
        // Display the API's response in the div
        document.getElementById("outputBox").innerHTML = response.choices[0].text;
        document.getElementById('inputText').value=''
      });
})


window.initMap = initMap;