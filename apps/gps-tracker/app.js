let searching = true;
let lastLat;
let lastLon;
let currLat;
let currLon;
let dist = 0;

function getDistanceInM(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // metres
    const a1 = lat1 * Math.PI/180;
    const a2 = lat2 * Math.PI/180;
    const da = (lat2-lat1) * Math.PI/180;
    const dl = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(da/2) * Math.sin(da/2) +
              Math.cos(a1) * Math.cos(a2) *
              Math.sin(dl/2) * Math.sin(dl/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const d = R * c; // in metres
    return d;
}

function updatePosition() {
   if(currLat && currLon) {
     dist += getDistanceInM(lastLat, lastLon, currLat, currLot);
     lastLat = currLat;
     lastLon = currLon;
     currLat = undefined;
     currLon = undefined;
   }
    draw();
}

function draw() {
  const width = g.getWidth();
  const height = g.getHeight();
  const midX = width/2;
  const midY = height/2;
  g.clear();
  g.setColor(-1);
  g.drawString(`lastLat: ${lastLat}`, 60, midY);
  g.drawString(`lastLon: ${lastLon}`, 60, midY + 10);
  g.drawString(`currLat: ${currLat}`, 60, midY + 20);
  g.drawString(`currLon: ${currLon}`, 60, midY + 30);
  g.drawString(`distance: ${dist}m`, 60, midY + 40);
  if(!searching) {
    g.setColor(0, 255, 0);
    g.drawString(`connected`, 60, midY + 50);
  }
  else {
    g.setColor(255, 0, 0);
    g.drawString(`searching...`, 60, midY + 50);
  }
}

Bangle.on('GPS', (fix) => {
  const connected = fix.fix;
  if(connected) {
    searching = false;
    currLat = fix.lat;
    currLon = fix.lon;
  } else {
    searching = true;
  }
});

Bangle.setGPSPower(true);
g.setColor(-1);
g.setFontAlign(-1, 0);
setInterval(updatePosition, 1000);
