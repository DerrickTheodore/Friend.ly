import React from 'react';

export class UserChart extends React.Component {
  constructor(props) {
    super(props)
    this.makeBarGraph.bind(this);
    this.makePieChart.bind(this);
  }

  componentDidMount() {
    this.props.toggleGraph ? this.makePieChart() : this.makeBarGraph()
  }

  componentDidUpdate(prevProps) {
    if(prevProps.toggleGraph !== this.props.toggleGraph) {
      this.props.toggleGraph ? this.makePieChart() : this.makeBarGraph()
    } 
  }

  makeBarGraph(){
    AmCharts.makeChart("chartdiv",
    {
        "type": "serial",
        "theme": "light",
        "dataProvider": [
            {
                "name": "Arts/Culture",
                "points": `${this.props.categories.arts || 0}`,
                "color": "#7F8DA9",
                "bullet": "https://librariestaskforce.blog.gov.uk/wp-content/uploads/sites/159/2016/08/LD_IconCulture.png"
            },
            {
                "name": "Drinks",
                "points": `${this.props.categories.drinks || 0}`,
                "color": "#7F8DA9",
                "bullet": "https://d27t3nufpewl0w.cloudfront.net/lichess/e7fd1e30904c7fcb9b86dd6aba626f3d536be03c_raster.png"
            },
            {
                "name": "Gaming",
                "points": `${this.props.categories.gaming || 0}`,
                "color": "#7F8DA9",
                "bullet": "https://www.shareicon.net/download/2015/08/29/92894_game_2133x2133.png"
            },
            {
                "name": "Exercise",
                "points": `${this.props.categories.exercise || 0}`,
                "color": "#7F8DA9",
                "bullet": "https://www.shareicon.net/download/2015/09/22/104946_fitness_512x512.png"
            },
                    {
                "name": "Live Music",
                "points": `${this.props.categories.music || 0}`,
                "color": "#7F8DA9",
                "bullet": "https://cdn4.iconfinder.com/data/icons/music-and-entertainment/512/Music_Entertainment_Crowd-512.png"
            },
            {
                "name": "Food/Dining",
                "points": `${this.props.categories.food || 0}`,
                "color": "#7F8DA9",
                "bullet": "https://housing.umn.edu/sites/housing.umn.edu/files/dining_icon-01.png"
            },
            {
                "name": "Outdoors",
                "points": `${this.props.categories.outdoors || 0}`,
                "color": "#7F8DA9",
                "bullet": "https://cdn0.iconfinder.com/data/icons/camping-circular/128/camping_outdoors_equipment-07-512.png"
            },
            {
                "name": "Movies",
                "points": `${this.props.categories.movies || 0}`,
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
            "inside": false,
            "tickLength": 0,
            "autoWrap": true
        },
        "export": {
            "enabled": true
        }
    });
  }

  makePieChart(){
    let chart = AmCharts.makeChart("chartdiv", {
      "type": "pie",
      "startDuration": 0,
       "theme": "light",
      "addClassNames": true,
      "innerRadius": "30%",
      "defs": {
        "filter": [{
          "id": "shadow",
          "feBlend": {
            "in": "SourceGraphic",
            "in2": "blurOut",
            "mode": "normal"
          }
        }]
      },
      "dataProvider": [ {
        "Category": "Arts/Culture",
        "points": `${this.props.categories.arts || 0}`
    },
    {
        "Category": "Drinks",
        "points": `${this.props.categories.drinks || 0}`
    },
    {
        "Category": "Gaming",
        "points": `${this.props.categories.gaming || 0}`
    },
    {
        "Category": "Exercise",
        "points": `${this.props.categories.exercise || 0}`
    },
            {
        "Category": "Live Music",
        "points": `${this.props.categories.music || 0}`
    },
    {
       "Category": "Food/Dining",
        "points": `${this.props.categories.food || 0}`
    },
    {
        "Category": "Outdoors",
        "points": `${this.props.categories.outdoors || 0}`
    },
    {
        "Category": "Movies",
        "points": `${this.props.categories.movies || 0}`
    }      ],
      "valueField": "points",
      "titleField": "Category",
      "export": {
        "enabled": true
      }
    });
    
    chart.addListener("init", handleInit);
    
    chart.addListener("rollOverSlice", function(e) {
      handleRollOver(e);
    });
    
    const handleInit = () => {
      this.legend.addListener("rollOverItem", handleRollOver);
    }
    
    const handleRollOver = (e) => {
      var wedge = e.dataItem.wedge.node;
      wedge.parentNode.appendChild(wedge);
    }
  }

  render() {
    return(
      <div id="chartdiv" className={this.props.toggleGraph ? "amcharts-pie-slice" : "amcharts-bar"}> </div>
    )
  }
}

export default UserChart;
