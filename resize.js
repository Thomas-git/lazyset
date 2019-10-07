/*
IMAGE RESIZE
create different size images based on desired widths
*/

var jimp = require('jimp');

var createdImgs = [];

// wrap jimp operations in function
var resizeImg = function(dir, name, type, width, quality) {
  var orgImg = dir + name + "." + type; // original image
  var newImg
  if (parseInt(quality)>0){ //If quality is given, we make a jpeg regardless of source image type
    if (width > 0 ){
      newImg = name + "-" + width + ".jpg"; // append width to new image name and set file type de jpeg
    }else{
      newImg = name + ".jpg"; // we have to write original image size as jpeg
    }
  }else{
    newImg = name + "-" + width + "." + type; // append width to new image name
  }
  var newFile = dir + newImg;

  jimp.read(orgImg, function(err, image){
    if (err) throw err;
    if (parseInt(quality)>0){
      //write a jpeg with given quality
      if (width > 0 ){
        image.resize(width, jimp.AUTO).quality(quality).write(newFile);
      }else{
        image.quality(quality).write(newFile);
      }
    }else{
      image.resize(width, jimp.AUTO).write(newFile);
    }
    // keep track of created images
    createdImgs.push(newImg);
    console.log(" created:" + " " + newFile);
  });
};


exports.createImg = function(dir, file, widths, quality) {
  // extract image name and type from file
  var info = file.split('.');
  var name = info[0];
  var type = info[1].toLowerCase();

  // generate image for each desired width
  for (var i = 0; i < widths.length; i++ ) {
    resizeImg(dir, name, type, parseInt(widths[i]),quality);
  }
  
  // generate base jpg when source is not jpg but resized images are (so browser not using srcset will have a proper jpeg to display)
  if (type!='jpg' && type!='jpeg' && parseInt(quality)>0){
    resizeImg(dir, name, type, 0,quality);
  }
  
  return createdImgs;
}
