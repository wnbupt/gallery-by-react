require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

let yeomanImage = require('../images/yeoman.png');
let imageDatas = require('../data/imageData.json');

// 获取图片数据，将图片名信息转化为图片路径
function genImageUrl(imageDataArr) {
  for (var i = 0; i < imageDataArr.length; i++){
    var singleImageData = imageDataArr[i];
    singleImageData.imageURl = require('../images/'+singleImageData.fileName);
    imageDataArr[i] = singleImageData;
  }
  return imageDataArr;
}

imageDatas = genImageUrl(imageDatas);

class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
        <section className="img-sec">

        </section>
        <nav className="controller-nav">

        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
