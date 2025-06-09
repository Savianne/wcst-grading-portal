import React, { useEffect } from "react";
import philippinePlaces from "./philippineLocPicker";

export function optionValue(code: string, val: string) {
    return `${code}:${val}`
}

export function getValue(optionValue: string | null) {
    return optionValue? optionValue.split(':')[1] : optionValue;
}

export function getCode(optionValue: string | null) {
    return optionValue? optionValue.split(':')[0] : optionValue;
}

interface IPhLocSelectVal {
    region: string;
    province: string;
    cityMun: string;
    barangay: string
}

function usePhilippinePlacesPickerSelect(onChange: (value: IPhLocSelectVal) => void) {
    const [region, setRegion] = React.useState('');
    const [province, setProvince] = React.useState('');
    const [cityMun, setCityMun] = React.useState('');
    const [barangay, setBarangay] = React.useState('');

    React.useEffect(() => {
        setProvince("");
        setCityMun("");
        setBarangay("");
        onChange({region, province: '', cityMun: '', barangay: ''})
    }, [region]);

    React.useEffect(() => {
        setCityMun("");
        setBarangay("");
        onChange({region, province, cityMun: '', barangay: ''})
    }, [province])

    React.useEffect(() => {
        setBarangay("");
        onChange({region, province, cityMun, barangay: ''})
    }, [cityMun])

    return {
        regions: philippinePlaces.regions,
        provinces: region? philippinePlaces.getProvincesByRegion(region.split('-')[0]) : [],
        cityMun: province? philippinePlaces.getCityMunByProvince(province.split('-')[0]) : [],
        barangay: cityMun? philippinePlaces.getBarangayByMun(cityMun.split('-')[0]) : [],
        values: {
            region,
            province,
            cityMun,
            barangay
        },
        setRegion,
        setProvince,
        setCityMun,
        setBarangay,
    } 
}

export default usePhilippinePlacesPickerSelect;