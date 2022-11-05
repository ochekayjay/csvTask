
const {parse} = require('csv-parse')
const fs = require('fs')
const sha256 = require('sha256')




//this function takes in the final array of Objects which includes the hashed key and converts it into a csv file
const convertToCsv = (finalOut)=>{

    const csvString = [
        [
          "format",
          "name",
          "description",
          "mining_tool",
          "sensitive_content",
          "series_total",
          "Attributes",
          "collection"
        ],
        ...finalOut.map(item => [
          item.format,
          item.name,
          item.description,
          item.sensitive_content,
          item.series_total,
          item.Attributes,
          item.collection,
        ])
      ].map(e => e.join(",")) 
      .join("\n");
   ;

   return csvString;
    
}




// this function generates the organizes the data to be in the desired CHIP-00007 format 
const generateData = (result)=>{

    let finalOutput = []

    

for(let i =0;i<result.length;i++){
    
    let firstObj = {}

    firstObj.format = "CHIP-0007"
    firstObj.name = result[i]['Filename']
    firstObj.description = result[i]['Description']
    firstObj.mining_tool = result[i]['Name']
    firstObj.sensitive_content = result[i]['Series Number']
    firstObj.series_total = 420

    let loopdata = result[i]['Attributes'].split(";")

    
    let smallerArray = []
    for(let i=0;i<loopdata.length;i++){
    
        let smallerObj = {}
        predicade = loopdata[i].split(":")
        
        
        smallerObj[predicade[0]] = predicade[1]
    
        smallerArray.push(smallerObj)
        
    }
    firstObj.Attributes = smallerArray
    
    firstObj.collection = {"name":"Zuri NFT Tickets for Free Lunch",
                            "id":"b774f676-c1d5-422e-beed-00ef5510c64d",
                            "attributes": [{
                                "type":"description",
                                "value":"Rewards for accomplishments during HNGi9"
                            }]

                            }
    
    
    const outpt = JSON.stringify(firstObj)
    
    firstObj.HASH = sha256(outpt)
    
    finalOutput.push(firstObj)

}

const finalCsv = convertToCsv(finalOutput)

fs.writeFile('filename.output.csv', finalCsv, 'utf8', function (err) {
    if (err) {
      console.log('Some error occured - file either not saved or corrupted file saved.');
    } else{
      console.log('It\'s saved!');
    }
  });
}

let result = []
// the initial csv without HASH was read here
fs.createReadStream('hngcsv.csv')
.pipe(parse({
    comment: '#',
    columns: true
}))
.on('data',(data)=>{
        result.push(data)
        generateData(result)
        
})
.on('error',(error)=>{
        console.log(error)
})
.on('end',(end)=>{
    console.log('done')
})





