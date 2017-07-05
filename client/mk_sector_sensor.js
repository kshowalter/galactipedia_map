import Chance from 'chance';
var noise = require('../lib/noisejs/perlin');



// https://stackoverflow.com/a/15762794
function roundTo(n, digits) {
  if (digits === undefined) {
    digits = 0;
  }

  var multiplicator = Math.pow(10, digits);
  n = parseFloat((n * multiplicator).toFixed(11));
  var test =(Math.round(n) / multiplicator);
  return +(test.toFixed(digits));
}

export default function(sector){
  console.log( 'SCANNING: ', sector.id );
  var chance = Chance(sector.id);
  var noise_seed = chance.floating({min:0,max:1});

  noise.seed(noise_seed);


  var sector_density_factor = 6000;


  var sensor = function(coor){
    var timer = global.Timer();

    var x = coor[0];
    var y = coor[1];
    var z = coor[2];

    x = roundTo( x, 2 );
    y = roundTo( y, 2 );
    z = roundTo( z, 2 );

    var measurment_id = sector.id;

    global.to_inspect.samples++;
    var measurment;
    if( global.measurments[measurment_id] ){
      global.to_inspect.reused++;
      //global.to_inspect.reused_anal(timer());
      measurment = global.measurments[measurment_id];
      return measurment;
    } else {
      global.to_inspect.calculated++;
      measurment = {
        coor: coor
      };




      var sector_density_noise = noise.simplex3( x/sector_density_factor, y/sector_density_factor, z/sector_density_factor );

      sector_density_noise = ( sector_density_noise + 1 ) / 2;

      measurment.density = sector_density_noise;







      //global.measurments[lat] = global.measurments[lat] || [];
      global.measurments[measurment_id] = measurment;
      //global.to_inspect.calculated_anal(timer());
      return measurment;

    }
  };


  return sensor;
}
