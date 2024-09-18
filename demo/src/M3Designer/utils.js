import _ from "lodash";

export function uuid(len = 8, radix = 16) {
    let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    let uuid = [];
    let i = 0;
    radix = radix || chars.length;

    if (len) {
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
        let r;
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }

    return uuid.join('');
}

export function api2Design(fields, errorCb) {
    if (fields && fields.length > 0) {
        let hasError = false
        return fields.map(item => {
            if (item.showIf) {
                // 如果该问卷经过高级配置修改，即 item.showIf !== item._showIf，禁止使用设计器
                if (!hasError && item.showIf !== item._showIf) {
                    hasError = true
                    errorCb()
                }
                // 转移 showIf ，否则无法在设计器中被展示
                delete item.showIf
            }
            if (/(set|enum)/.test(item.type) && !item.relevance) {
                // 初始化 relevance 字段
                item.relevance = {}
            }
            return item
        })
    } else {
        return fields
    }
}

export function design2Api(fields) {
    const showIfMap = {}
    const res = _.cloneDeep(fields).map((item) => {
        console.log('showIfMap', item)
        // 合法化 name， 如果 name 中不含 t_ 开头，视为非法，改成合法格式
        if (!/^t_/.test(item.name)) item.name = `t_${uuid()}`
        // 收集 relevance
        if (item.relevance) {
            const name = item.name
            Object.keys(item.relevance).forEach(optionKey => {
                item.relevance[optionKey].forEach(element => {
                    if (showIfMap[element]) {
                        showIfMap[element].push(`_.includes(${name}, '${optionKey}')`)
                    } else {
                        showIfMap[element] = [`_.includes(${name}, '${optionKey}')`]
                    }
                });
            })
        }
        return item
    })
    console.log('showIfMap', showIfMap)
    // relevance 转化为 showIf 和 _showIf, 用来判断是否经过外部修改，
    Object.keys(showIfMap).forEach(key => {
        const temp = res.find(i => i.name === key)
        if (temp) temp.showIf = temp._showIf = showIfMap[key].join('||')
    })
    // 二级关联关系处理
    res.forEach(ele => {
        if (ele.showIf) {
            const temp = ele.showIf.split('||')
            const temp2 = temp.map(e => {
                return 't_'  + e.split('t_')[1].split(',')[0]
            })
            console.log(temp2)
            // 判断上级是否也存在关联关系
            temp2.forEach(e2 => {
                const temp3 = res.find(i => i.name === e2)
                // 如果上级存在关联关系，植入到当前题目中
                if (temp3 && temp3.showIf) {
                    const newShowIf =  `(${temp3.showIf})&&(${ele.showIf})`
                    ele.showIf = newShowIf
                    ele._showIf = newShowIf
                }
            })
        }
    })
    console.log('res', res)
    return res
}