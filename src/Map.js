import React from 'react';
import ReactDOMServer from "react-dom/server";
import H from "@here/maps-api-for-javascript";

function MarkerContent({content}) {
  return (
    <>
      <h1>Here Dynamic Content Test</h1>
      <div dangerouslySetInnerHTML={{__html: content}}></div>
    </>);
}

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    // the reference to the container
    this.ref = React.createRef();
    // reference to the map
    this.map = null;
    this.ui = null;
  }

  componentDidMount() {
    if (!this.map) {
      // instantiate a platform, default layers and a map as usual
      const platform = new H.service.Platform({
        apikey: '{YOUR_API_KEY}'
      });
      const layers = platform.createDefaultLayers();
      const map = new H.Map(
        this.ref.current,
        layers.vector.normal.map,
        {
          pixelRatio: window.devicePixelRatio,
          center: { lat: 50, lng: 5 },
          zoom: 4,
        },
      );
      this.map = map;
      // attach the listener
      map.addEventListener('mapviewchange', this.handleMapViewChange);

      // add the interactive behaviour to the map
      new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

      //Layout Assign
      this.ui = H.ui.UI.createDefault(map, layers);
    }
  }

  componentWillUnmount() {
    if (this.map) {
      this.map.removeEventListener('mapviewchange', this.handleMapViewChange);
    }
  }

  handleMapViewChange = (ev) => {
    const {
      onMapViewChange
    } = this.props;
    if (ev.newValue && ev.newValue.lookAt) {
      const lookAt = ev.newValue.lookAt;
      // adjust precision
      const lat = Math.trunc(lookAt.position.lat * 1E7) / 1E7;
      const lng = Math.trunc(lookAt.position.lng * 1E7) / 1E7;
      const zoom = Math.trunc(lookAt.zoom * 1E2) / 1E2;
      onMapViewChange(zoom, lat, lng);
    }
  }

  onMarkerClick = (evt) => {
    var bubble = new H.ui.InfoBubble(evt.target.getGeometry(), {
      // read custom data
      content: ReactDOMServer.renderToString(<MarkerContent content={evt.target.getData()} />)
    });
    // show info bubble
    this.ui.addBubble(bubble);
  }

  onAddMarkers = () => {
    var parisMarker = new H.map.Marker({ lat: 48.8567, lng: 2.3508 });
    parisMarker.addEventListener('tap', this.onMarkerClick);
    parisMarker.setData();
    this.map.addObject(parisMarker);

    var romeMarker = new H.map.Marker({ lat: 41.9, lng: 12.5 });
    romeMarker.addEventListener('tap', this.onMarkerClick);
    romeMarker.setData('<div><a href="https://www.mcfc.co.uk">Manchester City</a></div>' +
      '<div>City of Manchester Stadium<br />Capacity: 55,097</div>')
    this.map.addObject(romeMarker);

    var berlinMarker = new H.map.Marker({ lat: 52.5166, lng: 13.3833 });
    berlinMarker.addEventListener('tap', this.onMarkerClick);
    berlinMarker.setData('<div><a href="https://www.mcfc.co.uk">Manchester City</a></div>' +
      '<div>City of Manchester Stadium<br />Capacity: 55,097</div>')
    this.map.addObject(berlinMarker);

    var madridMarker = new H.map.Marker({ lat: 40.4, lng: -3.6833 });
    madridMarker.addEventListener('tap', this.onMarkerClick);
    madridMarker.setData('<div><a href="https://www.mcfc.co.uk">Manchester City</a></div>' +
      '<div>City of Manchester Stadium<br />Capacity: 55,097</div>')
    this.map.addObject(madridMarker);

    var londonMarker = new H.map.Marker({ lat: 51.5008, lng: -0.1224 });
    londonMarker.addEventListener('tap', this.onMarkerClick);
    londonMarker.setData('<div><a href="https://www.mcfc.co.uk">Manchester City</a></div>' +
      '<div>City of Manchester Stadium<br />Capacity: 55,097</div>');
    this.map.addObject(londonMarker);
  }

  render() {
    return (
      <>
        <div
          style={{ position: 'relative', width: '100%', height: '600px' }}
          ref={this.ref}
        />
        <button onClick={this.onAddMarkers}>Add Markers</button>
      </>
    )
  }
}
