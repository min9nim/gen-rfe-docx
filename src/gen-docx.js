var PizZip = require('pizzip');
var Docxtemplater = require('docxtemplater');

var fs = require('fs');
var path = require('path');

module.exports = function genDocx(json){
  //Load the docx file as a binary
  var content = fs
      .readFileSync(path.resolve(__dirname, 'rfe_template.docx'), 'binary');

  var zip = new PizZip(content);

  var doc = new Docxtemplater();
  doc.loadZip(zip);

  //set the templateVariables
  doc.setData(json);

  try {
      // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
      doc.render()
  }
  catch (error) {
      // The error thrown here contains additional information when logged with JSON.stringify (it contains a properties object).
      var e = {
          message: error.message,
          name: error.name,
          stack: error.stack,
          properties: error.properties,
      }
      console.log(JSON.stringify({error: e}));
      if (error.properties && error.properties.errors instanceof Array) {
          const errorMessages = error.properties.errors.map(function (error) {
              return error.properties.explanation;
          }).join("\n");
          console.log('errorMessages', errorMessages);
          // errorMessages is a humanly readable message looking like this :
          // 'The tag beginning with "foobar" is unopened'
      }
      throw error;
  }

  var buf = doc.getZip()
              .generate({type: 'nodebuffer'});

  // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
    const filename =  Date.now() + '.docx'
    fs.writeFileSync('/tmp/' + filename, buf);
    return filename
} 

