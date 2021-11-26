// 所有表单控件（type + editor）的枚举
const editorMap = {
    AInputBox: {
        editor: "AInputBox",
        type: "string",
    },
    ARate: {
        editor: "ARate",
        type: "int",
    },
    NPS: {
        editor: "NPS",
        type: "int",
    },
    AIntBox: {
        editor: "AIntBox",
        type: "int",
    },
    AFloatBox: {
        editor: "AIntBox",
        type: "float",
    },
    ARadio: {
        editor: 'ARadio',
        type: 'enum',
    },
    ASelector: {
        editor: 'ASelector',
        type: 'enum',
    },
    ASetSelector: {
        editor: 'ASetSelector',
        type: 'array',
    },
    ARemoteSelector: {
        editor: 'ARemoteSelector',
        type: 'array',
    },
    AArrayGrid: {
        editor: 'AArrayGrid',
        type: 'array',
    },
    ACascadePicker: {
        editor: 'ACascadePicker',
        type: 'cascade',
    },     
    AGB2260: {
        editor: 'AGB2260',
        type: 'gb2260',
    },
    ARangePicker: {
        editor: 'ARangePicker',
        type: 'dateRange',
    },
    ADatetimePicker: {
        editor: 'ADatetimePicker',
        type: 'datetime',
    },
    AYearPicker: {
        editor: 'ADatetimePicker',
        type: 'year',
    },
    AYearMonthPicker: {
        editor: 'ADatetimePicker',
        type: 'yearMonth',
    },
    AYearMonthDayPicker: {
        editor: 'ADatetimePicker',
        type: 'yearMonthDay',
    },
    ACheckBox: {
        editor: "ACheckBox",
        type: "set",
    },
    AArray: {
        editor: "AArray",
        type: 'array',
    },
    AMatrix: {
        editor: "AMatrix",
        type: "matrix",
    },
    AExperience: {
        editor: "AExperience",
        type: "experience",
    },
    AKvSet: {
        editor: "AKvSet",
        type: "kvSet",
    },
    ACnAddress: {
        editor: "ACnAddress",
        type: "cnAddress",
    },
    ATelBox: {
        editor: 'ASpecInputBox',
        type: 'tel',
    },
    AEmailBox: {
        editor: 'ASpecInputBox',
        type: 'email',
    },
    DecorationViewer: {
        editor: 'DecorationViewer',
        type: 'decoration',
    },
}

export default editorMap