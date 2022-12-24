var map = L.map('map').setView([0, 0], 2);
map.setMaxBounds([[80, -190], [-80, 190]]);
map.setMinZoom(2);
var osmLayer = new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  noWrap: true
}).addTo(map);
var data;
var poem_dict = {}
var marker_dict = {}
var country_mapping = {}
var latlng_mapping = {}

//Cards
var cards_poems = {};
var countries = {};

$.get('./titles.csv', function(csvString) {

  // Use PapaParse to convert string to array of objects
  data = Papa.parse(csvString, { header: true, dynamicTyping: true }).data;

  // For each row in data, create a marker and add it to the map
  // For each row, columns `Latitude`, `Longitude`, and `Title` are required
  let dropdown = $("#mySelect")

  for (var i in data) {
    var name = data[i].PoemName;
    dropdown.append($('<option></option>').attr('value', name).text(name));

  }
});

$.get('./countries.csv', function(csvString) {

  // Use PapaParse to convert string to array of objects
  data = Papa.parse(csvString, { header: true, dynamicTyping: true }).data;

  // For each row in data, create a marker and add it to the map
  // For each row, columns `Latitude`, `Longitude`, and `Title` are required
  let dropdown = $("#countrySelect")

  for (var i in data) {
    var name = data[i].Country;
    dropdown.append($('<option></option>').attr('value', name).text(name));

  }
});



$.get('./data.csv', function(csvString) {


  // Use PapaParse to convert string to array of objects
  data = Papa.parse(csvString, { header: true, dynamicTyping: true }).data;

  // For each row in data, create a marker and add it to the map
  // For each row, columns `Latitude`, `Longitude`, and `Title` are required
  for (var i in data) {
    var row = data[i];
    if (row.poemname in poem_dict) {
      poem_dict[row.poemname].push(row)
    }
    else {
      poem_dict[row.poemname] = [row]
    }
  }
  let poemDictionary = Object.keys(poem_dict);
  country_mapping[row.country] += " Country:" + row.country + "<br>"
  country_mapping[row.country] += "Poem: " + row.poemname
  poemDictionary.forEach((poem) => {
    country_mapping = {}
    latlng_mapping = {}

    for (var j = 0; j < poem_dict[poem].length; ++j) {
      var row = poem_dict[poem][j]

      if (row.country in country_mapping) {
        country_mapping[row.country] += "Line #: " + row.linenumber + ", Word: " + row.word + "<br>"

      }
      else {
        country_mapping[row.country] = "Country: " + row.country + "<br>"
        country_mapping[row.country] += "Poem: " + row.poemname + "<br>" + "Line #: " + row.linenumber + ", Word: " + row.word + "<br>"

      }
      latlng_mapping[row.country] = [row.Latitude, row.Longitude]

    }

    let countryMapping = Object.keys(country_mapping);
    countryMapping.forEach((country) => {

      var marker = L.marker(latlng_mapping[country], {
        opacity: 1
      }).bindPopup(country_mapping[country]);
      if (poem in marker_dict) {
        marker_dict[poem].push(marker)
      }
      else {
        marker_dict[poem] = [marker]
      }
    });

  });
  let markerMapping = Object.keys(marker_dict);
  markerMapping.forEach((poem) => {
    marker_dict[poem] = L.layerGroup(marker_dict[poem]);
  });

  marker_dict["An Octopus"].addTo(map)
  others = marker_dict["An Octopus"]


//Cards
    // Compile data
  for (var i in data) {
    var row = data[i];
    var line = {
      "linenumber": row.linenumber,
      "word": row.word,
      "country": row.country
    };

    if (row.poemname in cards_poems) { // create cards_poems: each poem maps to an array of its lines
      cards_poems[row.poemname].push(line);
    }
    else {
      cards_poems[row.poemname] = [line]
    }

    if (!(row.country in countries)) { // create countries: each country maps to array of peoms
      countries[row.country] = [row.poemname];
    } else if (!countries[row.country].includes(row.poemname)) {
      countries[row.country].push(row.poemname);
    }
  }

  // Create cards with compiled data
  cardfolder = document.createElement("div");
  cardfolder.setAttribute("id", "cardfolder");
  for (var i = 0; i < countries["Africa"].length; i++) { // loop through all the poems Africa maps to
    poem = countries["Africa"][i];

    card = document.createElement("div");

    // Add poem name to card
    h1 = document.createElement("h1");
    h1.appendChild(document.createTextNode(poem));
    h1.className = "h1";
    card.appendChild(h1);

    //Add the poem's lines to card
    var line = cards_poems[poem]; // array of all the geographic words in the poem
    p = document.createElement("p");
    for (var j = 0; j < line.length; j++) { // loop through array of all the lines
      // get line info
      var line_info = line[j];
      var linenumber = line_info["linenumber"];
      var word = line_info["word"];
      var country = line_info["country"];

      // Add line info to card
      p.appendChild(document.createTextNode(linenumber + " " + "\"" + word + "\"" + " " + country));
      p.appendChild(document.createElement("br"));
    }
    p.className = "p";
    card.appendChild(p);

    card.className = "card";
    cardfolder.appendChild(card);
  }
  document.body.appendChild(cardfolder);
});


function changePoem(value) {
  if (others) {
    map.removeLayer(others);
  }
  marker_dict[value].addTo(map)
  others = marker_dict[value]
}


function changeCountry(value) {
    cf = document.getElementById("cardfolder");
  if (cf != null) {
    document.body.removeChild(cf);
  }

  cardfolder = document.createElement("div");
  cardfolder.setAttribute("id", "cardfolder");
  if (countries[value] != null) {
    for (var i = 0; i < countries[value].length; i++) {
      poem = countries[value][i];

      card = document.createElement("div");

      // Add poem name to card
      h1 = document.createElement("h1");
      h1.appendChild(document.createTextNode(poem));
      h1.className = "h1";
      card.appendChild(h1);

      //Add the poem's lines to card
      var line = cards_poems[poem]; // array of all the geographic words in the poem
      p = document.createElement("p");
      for (var j = 0; j < line.length; j++) { // loop through array of all the lines
        // get line info
        var line_info = line[j];
        var linenumber = line_info["linenumber"];
        var word = line_info["word"];
        var country = line_info["country"];

        // Add line info to card
        p.appendChild(document.createTextNode(linenumber + " " + "\"" + word + "\"" + " " + country));
        p.appendChild(document.createElement("br"));
      }
      p.className = "p";
      card.appendChild(p);

      card.className = "card";
      cardfolder.appendChild(card);
    }
    document.body.appendChild(cardfolder);
  }
}
