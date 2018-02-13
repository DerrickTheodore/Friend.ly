import React from 'react';

export class UserChart extends React.Component {
  constructor(props) {
    super(props)
    this.makeGraph.bind(this);
  }

  componentDidMount() {
    this.makeGraph();
  }

  makeGraph(){
    AmCharts.makeChart("chartdiv",
    {
        "type": "serial",
        "theme": "light",
        "dataProvider": [
            {
                "name": "Arts/Cultre",
                "points": "1",
                "color": "#7F8DA9",
                "bullet": "https://librariestaskforce.blog.gov.uk/wp-content/uploads/sites/159/2016/08/LD_IconCulture.png"
            },
            {
                "name": "Drinks",
                "points": "2",
                "color": "#7F8DA9",
                "bullet": "https://d27t3nufpewl0w.cloudfront.net/lichess/e7fd1e30904c7fcb9b86dd6aba626f3d536be03c_raster.png"
            },
            {
                "name": "Gaming",
                "points": "3",
                "color": "#7F8DA9",
                "bullet": "https://www.shareicon.net/download/2015/08/29/92894_game_2133x2133.png"
            },
            {
                "name": "Exercise",
                "points": "4",
                "color": "#7F8DA9",
                "bullet": "https://www.shareicon.net/download/2015/09/22/104946_fitness_512x512.png"
            },
                    {
                "name": "Live Music",
                "points": "5",
                "color": "#7F8DA9",
                "bullet": "https://cdn4.iconfinder.com/data/icons/music-and-entertainment/512/Music_Entertainment_Crowd-512.png"
            },
            {
                "name": "Food/Dining",
                "points": "6",
                "color": "#7F8DA9",
                "bullet": "https://housing.umn.edu/sites/housing.umn.edu/files/dining_icon-01.png"
            },
            {
                "name": "Outdoors",
                "points": "7",
                "color": "#7F8DA9",
                "bullet": "https://cdn0.iconfinder.com/data/icons/camping-circular/128/camping_outdoors_equipment-07-512.png"
            },
            {
                "name": "Movies",
                "points": "8",
                "color": "#7F8DA9",
                "bullet": "https://cdn4.iconfinder.com/data/icons/ballicons-2-new-generation-of-flat-icons/100/cinema-256.png"
            }      
        ],
        "startDuration": 1,
        "graphs": [{
            "balloonText": "<span style='font-size:13px;'>[[category]]: <b>[[value]]</b></span>",
            "bulletOffset": 10,
            "bulletSize": 52,
            "colorField": "color",
            "cornerRadiusTop": 8,
            "customBulletField": "bullet",
            "fillAlphas": 0.8,
            "lineAlpha": 0,
            "type": "column",
            "valueField": "points"
        }],
        "marginTop": 0,
        "marginRight": 0,
        "marginLeft": 0,
        "marginBottom": 0,
        "autoMargins": false,
        "categoryField": "name",
        "categoryAxis": {
            "axisAlpha": 0,
            "gridAlpha": 0,
            "inside": true,
            "tickLength": 0
        },
        "export": {
            "enabled": true
        }
    });
  }

  render() {
    return(
      <div id="chartdiv"> </div>
    )
  }
}

export default UserChart;
