import {parse} from 'querystring';
import moment from 'moment';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
    if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
        return true;
    }
    return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
    const {NODE_ENV} = process.env;
    if (NODE_ENV === 'development') {
        return true;
    }
    return isAntDesignPro();
};

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

//获取token
export const getUserToken = (): string => {
    return sessionStorage.getItem('userToken') || '';
};

// 获取sessionStorage中user信息
export function getUserInfos() {
    let userInfo = null;
    const userStr = sessionStorage.getItem('user');
    if (userStr) {
        userInfo = JSON.parse(userStr);
    }
    return userInfo;
}

//获取路由上的参数
export function getQueryString(path, name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = path.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

// 身份证正则验证
export const cerValidate = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;

// 表格每页显示条数
export const tableList = 10;
// 导出限制时间长度(天)
export const exportListDataMaxDays = 180;
// 用户权限资源编码 督办
export const userResourceCodeDb = {
    item: 'zhag_sawp_db',
    police: 'zhag_jcj_db',
    baq: 'zhag_baq_db',
    dossier: 'zhag_jz_db',
    zfba_xz: 'zhag_zfba_xzdb',
    zfba_xs: 'zhag_zfba_xsdb', // 受立案与执法办案统一用执法办案的权限
    // sla_xs: 'zhag_sla_xsdb',
    // sla_xz: 'zhag_sla_xzdb',
};
// 用户权限code
export const userAuthorityCode = {
    TUIBU: 'zhag_zfba_tb', // 退补
    ZHIBIAO: 'zhag_zfba_zb', // 制表
    RIQING: 'zhag_sqdd_jqrq', // 日清
    TIANJIAJIANGUANDIAN: 'zhag_xtpz_jgpz_tjjgd', // 添加监管点
    SHANCHUJIANGUANDIAN: 'zhag_xtpz_jgpz_scjgd', // 删除监管点
};

export function fixedZero(val) {
    return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
    const now = new Date();
    const oneDay = 1000 * 60 * 60 * 24;

    if (type === 'all') {
        const year = now.getFullYear();
        const allYear = year - 100;
        // return [moment(`${allYear}-01-01`), moment(now)];
        return ['', ''];
        // return [moment, moment];
    }

    if (type === 'today') {
        now.setHours(0);
        now.setMinutes(0);
        now.setSeconds(0);
        return [moment(now), moment(now.getTime() + (oneDay - 1000))];
    }

    if (type === 'week') {
        let day = now.getDay();
        now.setHours(0);
        now.setMinutes(0);
        now.setSeconds(0);

        if (day === 0) {
            day = 6;
        } else {
            day -= 1;
        }

        const beginTime = now.getTime() - day * oneDay;

        // return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
        return [moment(beginTime), moment(now.getTime())];
    }

    if (type === 'month') {
        const year = now.getFullYear();
        const month = now.getMonth();
        const nextDate = moment(now).add(1, 'months');
        const nextYear = nextDate.year();
        const nextMonth = nextDate.month();

        // 原来
        // return [moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`), moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000)];
        // 新
        return [moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`), moment(now.getTime())];
    }

    if (type === 'year') {
        const year = now.getFullYear();

        // return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
        return [moment(`${year}-01-01 00:00:00`), moment(now.getTime())];
    }
    // 昨日
    if (type === 'lastDay') {
        return [
            moment()
                .subtract(1, 'days')
                .startOf('day'),
            moment()
                .subtract(1, 'days')
                .endOf('day'),
        ];
    }
    // 前日
    if (type === 'beforeLastDay') {
        return [
            moment()
                .subtract(2, 'days')
                .startOf('day'),
            moment()
                .subtract(2, 'days')
                .endOf('day'),
        ];
    }
    // 上周
    if (type === 'lastWeek') {
        return [
            moment()
                .subtract(1, 'weeks')
                .startOf('week'),
            moment()
                .subtract(1, 'weeks')
                .endOf('week'),
        ];
    }
    // 前周
    if (type === 'beforeLastWeek') {
        return [
            moment()
                .subtract(2, 'weeks')
                .startOf('week'),
            moment()
                .subtract(2, 'weeks')
                .endOf('week'),
        ];
    }
    // 上月
    if (type === 'lastMonth') {
        return [
            moment()
                .subtract(1, 'months')
                .startOf('month'),
            moment()
                .subtract(1, 'months')
                .endOf('month'),
        ];
    }
    // 前月
    if (type === 'beforeLastMonth') {
        return [
            moment()
                .subtract(2, 'months')
                .startOf('month'),
            moment()
                .subtract(2, 'months')
                .endOf('month'),
        ];
    }
}

// 返回查询月份的固定日期
export function getDefaultDaysForMonth(momentMonth) {
    let dayArry = ['', '', '', '', '', '', ''];
    if (momentMonth) {
        dayArry = [
            momentMonth.startOf('month').format('YYYY-MM-DD'),
            momentMonth.date(5).format('YYYY-MM-DD'),
            momentMonth.date(10).format('YYYY-MM-DD'),
            momentMonth.date(15).format('YYYY-MM-DD'),
            momentMonth.date(20).format('YYYY-MM-DD'),
            momentMonth.date(25).format('YYYY-MM-DD'),
            momentMonth.endOf('month').format('YYYY-MM-DD'),
        ];
    }
    return dayArry;
}

export function getPlainNode(nodeList, parentPath = '') {
    const arr = [];
    nodeList.forEach(node => {
        const item = node;
        item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
        item.exact = true;
        if (item.children && !item.component) {
            arr.push(...getPlainNode(item.children, item.path));
        } else {
            if (item.children && item.component) {
                item.exact = false;
            }
            arr.push(item);
        }
    });
    return arr;
}

export function digitUppercase(n) {
    const fraction = ['角', '分'];
    const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    const unit = [
        ['元', '万', '亿'],
        ['', '拾', '佰', '仟'],
    ];
    let num = Math.abs(n);
    let s = '';
    fraction.forEach((item, index) => {
        s += (digit[Math.floor(num * 10 * 10 ** index) % 10] + item).replace(/零./, '');
    });
    s = s || '整';
    num = Math.floor(num);
    for (let i = 0; i < unit[0].length && num > 0; i += 1) {
        let p = '';
        for (let j = 0; j < unit[1].length && num > 0; j += 1) {
            p = digit[num % 10] + unit[1][j] + p;
            num = Math.floor(num / 10);
        }
        s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
    }

    return s
        .replace(/(零.)*零元/, '元')
        .replace(/(零.)+/g, '零')
        .replace(/^整$/, '零元整');
}

function getRelation(str1, str2) {
    if (str1 === str2) {
        console.warn('Two path are equal!'); // eslint-disable-line
    }
    const arr1 = str1.split('/');
    const arr2 = str2.split('/');
    if (arr2.every((item, index) => item === arr1[index])) {
        return 1;
    } else if (arr1.every((item, index) => item === arr2[index])) {
        return 2;
    }
    return 3;
}

function getRenderArr(routes) {
    let renderArr = [];
    renderArr.push(routes[0]);
    for (let i = 1; i < routes.length; i += 1) {
        let isAdd = false;
        // 是否包含
        isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
        // 去重
        renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
        if (isAdd) {
            renderArr.push(routes[i]);
        }
    }
    return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
    let routes = Object.keys(routerData).filter(
        routePath => routePath.indexOf(path) === 0 && routePath !== path,
    );
    // Replace path to '' eg. path='user' /user/name => name
    routes = routes.map(item => item.replace(path, ''));
    // Get the route to be rendered to remove the deep rendering
    const renderArr = getRenderArr(routes);
    // Conversion and stitching parameters
    const renderRoutes = renderArr.map(item => {
        const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
        return {
            exact,
            ...routerData[`${path}${item}`],
            key: `${path}${item}`,
            path: `${path}${item}`,
        };
    });
    return renderRoutes;
}

// /* eslint no-useless-escape:0 */
// const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;
//
// export function isUrl(path) {
//   return reg.test(path);
// }

//自适应浏览器高度
export function autoheight() {
    var winHeight = 0;
    if (window.innerHeight) winHeight = window.innerHeight;
    else if (document.body && document.body.clientHeight) winHeight = document.body.clientHeight;
    if (document.documentElement && document.documentElement.clientHeight)
        winHeight = document.documentElement.clientHeight;
    return winHeight;
}

// 推送事项
export const pushMattersDictCode = {
    POLICE: '203201',
    CASE: '203202',
    AREA: '203203',
    ITEM: '203204',
    XZ: '203205',
    DOSSIER: '203206',
};
// 推送类型(督办、预警、告警)
export const pushTypeDictCode = {
    SUPERVISION: '5009673',
    EARLYWARNING: '5009672',
    WARNING: '5009671',
};
export const DATASYNCTIMEID = 200; // 数据同步时间ID
