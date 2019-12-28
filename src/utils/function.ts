//给DIV添加水印
export function watermark (id) {
  let user = sessionStorage.getItem('user') ? sessionStorage.getItem('user') : "";
  //debugger;
  //默认设置
  const newUser = JSON.parse(user)
  var defaultSettings = {
    // watermark_txt: user && user === 'ViewingRoles' ? '张晓明' + ' ' + '230103198901011314' : '章明鑫' + ' ' + '230103198901011213',
    watermark_txt: newUser&&newUser.name&&newUser.idCard?(newUser.name+' '+newUser.idCard):'暂无数据',
    watermark_x: 35, //水印起始位置x轴坐标
    watermark_y: 48, //水印起始位置Y轴坐标
    watermark_rows: 20, //水印行数
    watermark_cols: 8, //水印列数
    watermark_x_space: 10, //水印x轴间隔
    watermark_y_space: 20, //水印y轴间隔
    watermark_color: '#bbb', //水印字体颜色
    watermark_alpha: 0.1, //水印透明度
    watermark_fontsize: '15px', //水印字体大小
    watermark_font: '微软雅黑', //水印字体
    watermark_width: 210, //水印宽度
    watermark_height: 80, //水印长度
    watermark_angle: 20, //水印倾斜度数
  };
  //采用配置项替换默认值，作用类似jquery.extend
  if (arguments.length === 1 && typeof arguments[0] === 'object') {
    var src = arguments[0] || {};
    for (var key in src) {
      if (src[key] && defaultSettings[key] && src[key] === defaultSettings[key]) continue;
      else if (src[key]) defaultSettings[key] = src[key];
    }
  }
  var oTemp = document.createDocumentFragment();
  // console.info('element', document.getElementById(id));
  //获取页面最大宽度
  var page_width = Math.max(
    document.getElementById(id).scrollWidth,
    document.getElementById(id).clientWidth
  );

  // console.info('width', page_width);

  //var page_width = Math.max(document.body.scrollWidth,document.body.clientWidth);
  var cutWidth = page_width * 0.015;
  var page_width = page_width - cutWidth;
  //获取页面最大高度
  // console.info('scrollHeight', document.getElementById(id).scrollHeight);
  // console.info('clientHeight', document.getElementById(id).clientHeight);
  var page_height = Math.max(document.getElementById(id).clientHeight);
  // console.info('height', page_height);
  //var page_height = Math.max(document.body.scrollHeight,document.body.clientHeight)+450;
  // var page_height = document.body.scrollHeight+document.body.scrollTop;
  //如果将水印列数设置为0，或水印列数设置过大，超过页面最大宽度，则重新计算水印列数和水印x轴间隔
  if (
    defaultSettings.watermark_cols == 0 ||
    parseInt(
      defaultSettings.watermark_x +
      defaultSettings.watermark_width * defaultSettings.watermark_cols +
      defaultSettings.watermark_x_space * (defaultSettings.watermark_cols - 1)
    ) > page_width
  ) {
    defaultSettings.watermark_cols = parseInt(
      (page_width - defaultSettings.watermark_x + defaultSettings.watermark_x_space) /
      (defaultSettings.watermark_width + defaultSettings.watermark_x_space)
    );
    defaultSettings.watermark_x_space = parseInt(
      (page_width -
        defaultSettings.watermark_x -
        defaultSettings.watermark_width * defaultSettings.watermark_cols) /
      (defaultSettings.watermark_cols - 1)
    );
  }
  //如果将水印行数设置为0，或水印行数设置过大，超过页面最大长度，则重新计算水印行数和水印y轴间隔
  // if (defaultSettings.watermark_rows == 0 || (parseInt(defaultSettings.watermark_y + defaultSettings.watermark_height * defaultSettings.watermark_rows + defaultSettings.watermark_y_space * (defaultSettings.watermark_rows - 1)) > page_height)) {
  //     defaultSettings.watermark_rows = parseInt((defaultSettings.watermark_y_space + page_height - defaultSettings.watermark_y) / (defaultSettings.watermark_height + defaultSettings.watermark_y_space));
  //     defaultSettings.watermark_y_space = parseInt(((page_height - defaultSettings.watermark_y) - defaultSettings.watermark_height * defaultSettings.watermark_rows) / (defaultSettings.watermark_rows - 1));
  // }
  var x;
  var y;
  for (var i = 0; i < defaultSettings.watermark_rows; i++) {
    y =
      defaultSettings.watermark_y +
      (defaultSettings.watermark_y_space + defaultSettings.watermark_height) * i;
    for (var j = 0; j < defaultSettings.watermark_cols; j++) {
      x =
        defaultSettings.watermark_x +
        (defaultSettings.watermark_width + defaultSettings.watermark_x_space) * j;

      var mask_div = document.createElement('div');
      mask_div.id = 'mask_div' + i + j;
      mask_div.className = 'mask_div';
      mask_div.appendChild(document.createTextNode(defaultSettings.watermark_txt));
      //设置水印div倾斜显示
      mask_div.style.webkitTransform = 'rotate(-' + defaultSettings.watermark_angle + 'deg)';
      mask_div.style.MozTransform = 'rotate(-' + defaultSettings.watermark_angle + 'deg)';
      mask_div.style.msTransform = 'rotate(-' + defaultSettings.watermark_angle + 'deg)';
      mask_div.style.OTransform = 'rotate(-' + defaultSettings.watermark_angle + 'deg)';
      mask_div.style.transform = 'rotate(-' + defaultSettings.watermark_angle + 'deg)';
      mask_div.style.visibility = '';
      mask_div.style.position = 'fixed';
      mask_div.style.left = x + 'px';
      mask_div.style.top = y + 80 + 'px';
      mask_div.style.overflow = 'hidden';
      mask_div.style.zIndex = '9999';
      mask_div.style.pointerEvents = 'none'; //pointer-events:none  让水印不遮挡页面的点击事件
      //mask_div.style.border="solid #eee 1px";
      mask_div.style.opacity = defaultSettings.watermark_alpha;
      mask_div.style.fontSize = defaultSettings.watermark_fontsize;
      mask_div.style.fontFamily = defaultSettings.watermark_font;
      mask_div.style.color = defaultSettings.watermark_color;
      mask_div.style.textAlign = 'center';
      mask_div.style.width = defaultSettings.watermark_width + 'px';
      mask_div.style.height = defaultSettings.watermark_height + 'px';
      mask_div.style.display = 'block';
      oTemp.appendChild(mask_div);
    }
  }
  //document.body.appendChild(oTemp);
  document.getElementById(id).appendChild(oTemp);
}
