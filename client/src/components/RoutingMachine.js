import { MapLayer } from 'react-leaflet';
import L from 'leaflet';
import { withLeaflet } from 'react-leaflet';
import 'leaflet-routing-machine/src';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

class RoutingMachine extends MapLayer {
  createLeafletElement() {
    const { color, map, road } = this.props;

    // console.log("Route computation: ", road)

    let leafletElement = L.Routing.control({
      waypoints: road,
      // router: L.Routing.mapbox('TOKEN'),
      lineOptions: {
        styles: [{
          color,
          opacity: .8,
          weight: 6
        }]
      },
      addWaypoints: true,
      draggableWaypoints: true,
      routeWhileDragging: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      altLineOptions: { styles: [{ opacity: 1 }] },
      //createMarker: () => { return null; }
    })
      .addTo(map.current.leafletElement);

    leafletElement.hide(); // hide road describtion
    // console.log(leafletElement)
    return leafletElement.getPlan();
  }
}

export default withLeaflet(RoutingMachine);