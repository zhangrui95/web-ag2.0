// banner动效
//2018-11-19
import React, {PureComponent} from 'react';
import BannerAnim, {Element} from 'rc-banner-anim';

const BgElement = Element.BgElement;
import 'rc-banner-anim/assets/index.css';
import 'moment/locale/zh-cn';


class BannerAnimMark extends PureComponent {
    constructor(props) {
        super(props);


        // if (this.props.currentImg) {
        //     this.imgArray = this.props.arrayImg;//数组
        //     this.currentImg = this.props.currentImg;
        //     this.index = this.props.index;
        // } else {//不是数组的情况
        //     if (this.props.arrayImg instanceof Array) {//判断是否是数组
        //         this.imgArray = this.props.arrayImg;
        //     } else {
        //         this.imgArray.push(this.props.arrayImg);
        //         this.currentImg = this.props.arrayImg;
        //     }
        // }
        this.state = {
            arrayImg: this.props.arrayImg,
        };

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps !== this.props) {
            if (nextProps.index !== this.props.index) {
                this.banner.slickGoTo(nextProps.index);
            }

            this.setState({
                arrayImg: nextProps.arrayImg,
            });
        }
    }

    // componentDidMount(){
    //     console.log('1111111');
    // }
    // handleCancel = () => {
    //     this.props.handleCancel();
    // }
    photoChange = (a, b) => {
        if (this.state.arrayImg && this.state.arrayImg.length > 0) {
            let id = this.state.arrayImg[b].id;
            this.props.getPageId(id);
        }
        this.props.currentIndex(b);
    };
    // slickGoTo=(num)=>{
    //     console.log('num',num);
    // }
    render() {
        let showCurret = [];
        // if (this.props.currentImg) {
        let imgArray = this.state.arrayImg;//数组
        // this.currentImg = this.props.currentImg;
        let index = this.props.index;
        // } else {//不是数组的情况
        //     if (this.props.arrayImg instanceof Array) {//判断是否是数组
        //         this.imgArray = this.props.arrayImg;
        //     } else {
        //         this.imgArray.push(this.props.arrayImg);
        //         this.currentImg = this.props.arrayImg;
        //     }
        // }
        if (imgArray && imgArray.length > 0) {
            for (let i = 0; i < imgArray.length; i++) {
                showCurret.push(
                    <Element key={'ele' + i} style={{textAlign: 'center'}}>
                        <BgElement
                            key="bg"
                            className="bg"
                            style={{
                                backgroundImage: `url(${imgArray[i].Path})`,
                                backgroundSize: '100% 100%',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                height: '860px',
                                width: '615px',
                                position: 'absolute',
                                top: '0',
                                left: '22%',
                            }}
                        />
                        {/* {
                            this.props.isShowAnnotation ?
                             imgArray[i].annotationp_page ?
                             imgArray[i].annotationp_page.electronic_page_url ? <img src={imgArray[i].annotationp_page.electronic_page_url} style={{ height: '860px', width: '615px' }} /> : '' : '' : ''
                        } */}
                        <div> {
                            this.props.isShowAnnotation ?
                                imgArray[i].annotationp_page ?
                                    imgArray[i].annotationp_page.electronic_page_url ?
                                        <img src={imgArray[i].annotationp_page.electronic_page_url} style={{
                                            height: '860px',
                                            width: '615px',
                                            position: 'absolute',
                                            left: '22%',
                                            top: '0',
                                        }}/> : '' : '' : ''
                        }
                        </div>

                    </Element>,
                );

            }
        }


        return (
            <div>
                <BannerAnim
                    prefixCls="banner-user"
                    type='acrossOverlay'
                    thumb={false}
                    style={{height: '860px'}}
                    onChange={this.photoChange}
                    // initShow={0}
                    // slickGoTo={()=>this.slickGoTo(3)}
                    ref={(c) => {
                        this.banner = c;
                    }}
                >
                    {showCurret}
                </BannerAnim>

            </div>
        );
    }
}

export default BannerAnimMark;
