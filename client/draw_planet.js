import map_pixel from './map/map_pixel';
import map_pixel_overlay from './map/map_pixel_overlay';
//import map_thermal from './map/map_thermal';
import legend from './map/legend';
import globes from './map/globes';
import globes_overlay from './map/globes_overlay';

import settings from './settings';

var map_width = settings.map.projection.width;
var map_height = settings.map.projection.height;
var globe_map_size = settings.map.globe_size;

function disableSmoothRendering(ctx) {
  ctx.webkitImageSmoothingEnabled = false;
  ctx.mozImageSmoothingEnabled = false;
  ctx.msImageSmoothingEnabled = false;
  ctx.imageSmoothingEnabled = false;
  return ctx;
}


export default function(id, planet, callback){
  console.log('/Drawing at: ', settings.pixelation);

  var canvas = document.getElementById(id);
  //canvas.style.backgroundColor = "#caeffc";
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');

        // Store the current transformation matrix
    ctx.save();

    // Use the identity matrix while clearing the canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Restore the transform
    //ctx.restore();


    disableSmoothRendering(ctx);

    var cx = 10;
    var cy = 10;
    map_pixel(planet, cx, cy, settings.pixelation, function(img_data_map, cx, cy){
      ctx.putImageData(img_data_map, cx, cy);
      ctx.drawImage(canvas, cx, cy, map_width*settings.pixelation, map_height*settings.pixelation, cx, cy, map_width, map_height);
      map_pixel_overlay(ctx, planet, [cx,cy]);
    });

    cx = 10 + map_width + 40;
    cy = 10;


    legend(ctx, planet, [cx,cy]);

    var map_settings = JSON.parse(JSON.stringify(settings));
    map_settings.pixelation = settings.pixelation;

    cx = 10;
    cy = 10 + map_height + 10 + 50;
    globes(planet, map_settings, function(img_data_map, map_settings){
      ctx.fillStyle = 'black';
      ctx.fillRect(cx, cy, map_settings.map.globe_size*3, map_settings.map.globe_size*3);
      ctx.putImageData(img_data_map, cx, cy);
      //*
      ctx.drawImage(ctx.canvas,
        cx, cy,
        map_settings.map.globe_size_adjusted*3,
        map_settings.map.globe_size_adjusted*3,
        cx, cy,
        map_settings.map.globe_size*3,
        map_settings.map.globe_size*3
      );
      //*/

      globes_overlay(ctx, planet, cx, cy);
    });


  }

  console.log('\\ DRAW done');
  callback();
}
