module.exports = function download(data, filename, mimetype, res) {
  res.writeHead(200, {
      'Content-Type': mimetype,
      'Content-disposition': 'attachment;filename=' + filename,
      'Content-Length': data.length
  });
  res.end(Buffer.from(data, 'binary'));
};