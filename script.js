var map = L.map('map').setView([0, 0], 2);
map.setMaxBounds([[80, -190], [-80, 190]]);
map.setMinZoom(2);
var osmLayer = new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  noWrap: true
}).addTo(map);
var data;
var poem_dict = {}
var marker_dict={}
var country_mapping={}
var latlng_mapping={}
$.get('./data.csv', function(csvString) {

  // Use PapaParse to convert string to array of objects
  data = Papa.parse(csvString, { header: true, dynamicTyping: true }).data;

  // For each row in data, create a marker and add it to the map
  // For each row, columns `Latitude`, `Longitude`, and `Title` are required
  for (var i in data) {
    var row = data[i];


    //{"adventure":LayerGroup([Marker1, Marker2]), "party":LayerGroup([Marker1, Marker2, Marker3])}
    if (row.poemname in poem_dict) {
      poem_dict[row.poemname].push(row)
    }
    else {
      poem_dict[row.poemname] = [row]
    }
  }
  let poemDictionary = Object.keys(poem_dict);
	country_mapping[row.country]+=" Country:"+row.country+"<br>"
	country_mapping[row.country]+="Poem: "+row.poemname
  poemDictionary.forEach((poem) => {
		country_mapping={}
		latlng_mapping={}
		
		for (var j=0; j<poem_dict[poem].length; ++j){
			var row=poem_dict[poem][j]
			
			if (row.country in country_mapping){
				country_mapping[row.country]+="Line #: "+row.linenumber + ", Word: " + row.word+"<br>"
				
			}
			else{
				country_mapping[row.country]="Country: "+row.country+"<br>"
				country_mapping[row.country]+="Poem: "+row.poemname+"<br>"+"Line #: "+row.linenumber + ", Word: " + row.word+"<br>"
				
			}
			
			latlng_mapping[row.country]=[row.Latitude, row.Longitude]

		}
				
		let countryMapping = Object.keys(country_mapping);
		countryMapping.forEach((country) => {
			
			var marker = L.marker(latlng_mapping[country], {
    	opacity: 1
  	}).bindPopup(country_mapping[country]);
			if (poem in marker_dict){
				marker_dict[poem].push(marker)
			}
			else{
				marker_dict[poem]=[marker]
			}
		});
	  	
  });
	let markerMapping = Object.keys(marker_dict);	
  markerMapping.forEach((poem) => {
    marker_dict[poem] = L.layerGroup(marker_dict[poem]);
  });
  
  marker_dict["adventure"].addTo(map)
  others = marker_dict["adventure"]
});


function changePoem(value) {
  if (others){
    map.removeLayer(others);
  }
  marker_dict[value].addTo(map)
  others = marker_dict[value]
}

