const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let dataobjet;

fs.readFile('input.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  dataobjet = JSON.parse(data);
  research();
});

async function fetchdata(lat, lng) {
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`);
  const data = await response.json();
  return data;
}

async function research() {
  rl.question('Please enter the city you want to search: ', async (city) => {
    console.log(`Ok, we will search for the city: ${city}`);
    let cityfounded = false;
    
    for (let i = 0; i < dataobjet.length; i++) {
      let current = dataobjet[i];
      
      if (current.name.toLowerCase() === city.toLowerCase()) {
        console.log(current.name);
        const latlng = await fetchdata(current.lat, current.lng);
        console.log("The name of city : " + current.name + " With the information you need weather and more : " + JSON.stringify(latlng));
        cityfounded = true;
        
        fs.writeFile(`${current.name}.txt`, JSON.stringify(latlng), (err) => {
          if(err) console.log('Error while creating file');
        });
        
        break;
      }
    }
    
    if (!cityfounded) {
      console.log(`City "${city}" not found.`);
    }
    
    rl.close();
  });
}
