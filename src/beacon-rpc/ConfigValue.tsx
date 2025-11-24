type NullConfigValue = {
    cfgType: 0
    cfgVal: null,
};

type BooleanConfigValue = {
    cfgType: 1,
    cfgVal: boolean,
};

type IntegerConfigValue = {
    cfgType: 2,
    cfgVal: number,
};

type FloatConfigValue = {
    cfgType: 3,
    cfgVal: number,
};

type StringConfigValue = {
    cfgType: 4,
    cfgVal: string,
};

type ArrayConfigValue = {
    cfgType: 5,
    cfgVal: unknown[],
};

type ObjectConfigValue = {
    cfgType: 6,
    cfgVal: { [key: string]: unknown },
};

type ConfigurableBooleanConfigValue = {
    cfgType: 7,
    cfgVal: boolean,
};

type ConfigurableIntegerConfigValue = {
    cfgType: 8,
    cfgVal: number,

    minVal: number,
    maxVal: number,
    incVal: number,
    signed: boolean,
};

type ConfigurableFloatConfigValue = {
    cfgType: 9,
    cfgVal: number,

    minVal: number,
    maxVal: number,
    incVal: number,
};

type ConfigurableStringConfigValue = {
    cfgType: 10,
    cfgVal: string,

    maxLen: number,
};

type ConfigurableEnumConfigValue = {
    cfgType: 11,
    cfgVal: number,

    vals: number[],
    valTxt: string[],
};

export type ConfigValue =
    | NullConfigValue
    | BooleanConfigValue
    | IntegerConfigValue
    | FloatConfigValue
    | StringConfigValue
    | ArrayConfigValue
    | ObjectConfigValue
    | ConfigurableBooleanConfigValue
    | ConfigurableIntegerConfigValue
    | ConfigurableFloatConfigValue
    | ConfigurableStringConfigValue
    | ConfigurableEnumConfigValue;