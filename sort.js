
const fs = require('fs');

// Read data from the CSV file
const fileContent = fs.readFileSync('moncton_master_locations.csv', 'utf-8');

// Split data on newline
let data = fileContent.split('\n');

data.shift()

// Remove '\n' from each element
data = data.map((item) => item.replace('\n', ''));


let aisles = new Map()

data.forEach((item)=>{
    let code = item.split(',')[0]

    let aisle = code.split(',')[0].split('-')[0]
    let level = code.split(',')[0].split('-')[1]
    let bin = code.split(',')[0].split('-')[2]

    // check if aisle exists
    if(aisles.has(aisle)){
        // check if level exists
        if(aisles.get(aisle).has(level)){
            // check if bin exists
            if(aisles.get(aisle).get(level).has(bin)){
                // add to bin
                aisles.get(aisle).get(level).get(bin).push(item)
            }else{
                // create bin
                aisles.get(aisle).get(level).set(bin,[item])
            }
        }else{
            // create level
            aisles.get(aisle).set(level,new Map())
            // create bin
            aisles.get(aisle).get(level).set(bin,[item])
        }

    } else{
        // create aisle
        aisles.set(aisle,new Map())
        // create level
        aisles.get(aisle).set(level,new Map())
        // create bin
        aisles.get(aisle).get(level).set(bin,[item])
    }

})


// Assuming aisles is your Map object

// Create a string to store CSV content
let csvContent = '';


// Iterate over aisles
for (let [aisle, levelsMap] of aisles) {
    // Add aisle information to CSV
    // csvContent += `Aisle,${aisle}\n`;

    // Accumulate items at each level
    let levelItems = new Map();

    // Iterate over levels in reverse order
    for (let [level, binsMap] of [...levelsMap.entries()].reverse()) {
        // Get an array of bin codes
        let binCodes = [...binsMap.keys()];


        // Iterate over bins in sorted order
        for (let bin of binCodes) {
            const items = binsMap.get(bin);

            // Add items to the accumulated list for the current level and bin
            if (!levelItems.has(bin)) {
                levelItems.set(bin, new Map());
            }
            levelItems.get(bin).set(level, items);
        }
    }

 // Add level and item information to CSV
for (let [bin, levels] of [...levelItems.entries()].sort()) {
  
    // csvContent += `Bin ${bin}\n`;

    // Iterate over levels for the current bin
    for (let [level, items] of levels) {
        // csvContent += `Level ${level}: ${items.join(', ')}\n`;
        csvContent += `${items.join(', ')}\n`;
    }

    csvContent += '\n';  // Add a newline after each bin
}

}

// Write CSV content to a file
fs.writeFileSync('outputX.csv', csvContent, 'utf-8');
console.log('CSV file written successfully.');
