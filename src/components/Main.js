require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

let imageDatas = require('../data/imageData.json');

// 获取图片数据，将图片名信息转化为图片路径
imageDatas = (function genImageUrl(imageDataArr) {
  for (var i = 0; i < imageDataArr.length; i++){
    var singleImageData = imageDataArr[i];
    singleImageData.imageURL = require('../images/'+singleImageData.fileName);
    imageDataArr[i] = singleImageData;
  }
  return imageDataArr;
})(imageDatas);

// 图片组件
var ImgFigure = React.createClass({

  handleClick:function (e) {
    if(this.props.arrange.isCenter)
      this.props.inverse();
    else
      this.props.center();

    e.stopPropagation();
    e.preventDefault();
  },

  render:function () {

    var imgFigureClassName = 'img-figure';
    imgFigureClassName += this.props.arrange.isInverse ? ' isInverse' : '';

    return(
      <figure className={imgFigureClassName} style={this.props.arrange.pos} onClick={this.handleClick}>
        <img src={this.props.data.imageURL} alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>
              {this.props.data.desc}
            </p>
          </div>
        </figcaption>
      </figure>
    );
  }
});

// 在给定范围内，获取图片位置随机值
function getRandomValue(low,high) {
  return Math.ceil(Math.random()*(high-low)+low);
}
// 在给定范围内，获取图片 旋转随机值
function getRandomDeg() {
  return (Math.random()> 0.5 ? '':'-') + Math.ceil(Math.random()*30);
}

var AppComponent = React.createClass({

  Constant:{
    width_S:0,
    height_S:0,
    width_P:0,
    height_P:0
  },

  reArrange: function (index) {
    var Constant = this.Constant;
    var imgsArrangeArr = [];
    for(var i = 0; i < imageDatas.length; i++){
      var styleObj = {};
      var center_flag = false;
      if((i+imageDatas.length-index)%imageDatas.length>0 && (i+imageDatas.length-index)%imageDatas.length<=imageDatas.length/2)
      {
        styleObj.left = getRandomValue(-Constant.width_P/2,Constant.width_S/2-Constant.width_P/2*3);
        styleObj.top = getRandomValue(-Constant.height_P/2,Constant.height_S-Constant.height_P/2);
        styleObj.transform = 'rotate('+getRandomDeg()+'deg)';
      }
      else if((i+imageDatas.length-index)%imageDatas.length>imageDatas.length/2)
      {
        styleObj.left = getRandomValue(Constant.width_S/2+Constant.width_P/2,Constant.width_S-Constant.width_P/2);
        styleObj.top = getRandomValue(-Constant.height_P/2,Constant.height_S-Constant.height_P/2);
        styleObj.transform = 'rotate('+getRandomDeg()+'deg)';
      }
      else if(i == index)
      {
        styleObj.left = Constant.width_S/2-Constant.width_P/2;
        styleObj.top = Constant.height_S/2-Constant.height_P/2;
        center_flag = true;
      }
      imgsArrangeArr.push({'pos':styleObj,'isInverse':false,'isCenter':center_flag});
    }
    this.setState({
      imageArrangeArr: imgsArrangeArr
    });
  },

  inverse:function (index) {
    return function () {
      var imgsArr = this.state.imageArrangeArr;

      imgsArr[index].isInverse = !imgsArr[index].isInverse;

      this.setState({
          imageArrangeArr:imgsArr
      });

    }.bind(this);
  },

  center :function (index) {
    return function () {
      this.reArrange(index);
    }.bind(this);
  },

  getInitialState:function () {
    return {
      imageArrangeArr :[]
    }
  },

  componentDidMount: function () {
    var stageDOM = ReactDOM.findDOMNode(this.refs.stage);
    var picDOM = ReactDOM.findDOMNode(this.refs.imgFigure0);
    this.Constant.width_S = stageDOM.scrollWidth;
    this.Constant.height_S = stageDOM.scrollHeight;
    this.Constant.width_P = picDOM.scrollWidth;
    this.Constant.height_P = picDOM.scrollHeight;
    this.reArrange(0);
  },

  render:function() {
    var controllerUnits = [],imageFigure = [];

    imageDatas.forEach(function (value,index) {

      if(!this.state.imageArrangeArr[index]) {
        this.state.imageArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0,
            transform: 0
          },
          isInverse: false,
          isCenter:false
        };
      }

      imageFigure.push(<ImgFigure data={value} key={index} inverse={this.inverse(index)} center={this.center(index)} arrange={this.state.imageArrangeArr[index]} ref={'imgFigure' + index}/>);
    },this);

    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imageFigure}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
});

AppComponent.defaultProps = {
};

export default AppComponent;
