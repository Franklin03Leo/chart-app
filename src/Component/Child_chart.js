import React from "react";
import Plot from 'react-plotly.js';

const Child_chart = () =>{

    var icon1 = {
        'width': 500,
        'height': 600,
        'path': 'M224 512c35.32 0 63.97-28.65 63.97-64H160.03c0 35.35 28.65 64 63.97 64zm215.39-149.71c-19.32-20.76-55.47-51.99-55.47-154.29 0-77.7-54.48-139.9-127.94-155.16V32c0-17.67-14.32-32-31.98-32s-31.98 14.33-31.98 32v20.84C118.56 68.1 64.08 130.3 64.08 208c0 102.3-36.15 133.53-55.47 154.29-6 6.45-8.66 14.16-8.61 21.71.11 16.4 12.98 32 32.1 32h383.8c19.12 0 32-15.6 32.1-32 .05-7.55-2.61-15.27-8.61-21.71z'
      }

    var config = {
        toImageButtonOptions: {
          format: 'svg', // one of png, svg, jpeg, webp
          filename: 'custom_image', 
          height: 500,
          width: 700,
          scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
        },

        // showLink: false,
        // displayModeBar: true
      };

      let data = [
        {
          type: 'scatter',  // all "scatter"  (pointer)
          x: [1, 2, 3],     // #scatter-x
          y: [8, 2, 3],     // #scatter-y
          marker: {         // marker is an object, valid marker keys: #scatter-marker
            color: 'rgb(16, 32, 77)' // more about "marker.color": #scatter-marker-color
          }
        },
        {
          type: 'bar',      // all "bar" chart attributes: #bar
          x: [1, 2, 3],     // more about "x": #bar-x
          y: [6, 2, 3],     // #bar-y
          name: 'bar chart example', // #bar-name
          orientation: 'v'  // set the orientation like horizontal or vertical
        },
      ];
      let layout = {                     // all "layout" attributes: #layout
        title: 'simple example',  // more about "layout.title": #layout-title
        xaxis: {                  // all "layout.xaxis" attributes: #layout-xaxis
          title: 'time'         // more about "layout.xaxis.title": #layout-xaxis-title
        },
      };
         
      
    return (
        <Plot
          data={data}
          layout={layout}
          config={config}
        />
      );
}

export default Child_chart;



{/* <Plot
        data={this.state.data}
        layout={this.state.layout}
        frames={this.state.frames}
        config={this.state.config}
        onInitialized={(figure) => this.setState(figure)}
        onUpdate={(figure) => this.setState(figure)}
      /> */}