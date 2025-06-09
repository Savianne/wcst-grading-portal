"use client"
import React from "react"
import { styled } from '@mui/material/styles';
import { IStyledFC } from "../types/IStyledFC";
import usePhilippinePlacesPickerSelect from "../helpers/usePhLocPicker";

import { 
    Button,
    Paper,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
} from "@mui/material";

export interface IPhLocSelectVal {
    region: string;
    province: string;
    cityMun: string;
    barangay: string
}

interface IPhLocPicker extends IStyledFC {
    value: IPhLocSelectVal;
    required?: boolean;
    onChange: (value: IPhLocSelectVal) => void
}



const PhLocPickerFC:React.FC<IPhLocPicker> = ({className, onChange, value, required}) => {
    const picker = usePhilippinePlacesPickerSelect(onChange);

    React.useEffect(() => {
        console.log(picker.values)
    }, [picker.values])
    return(
        <div className={className}> 
            <FormControl sx={{ flex: 1,  minWidth: 120 }} required={required}>
                <InputLabel id="region-label">Region</InputLabel>
                <Select
                    labelId="region-label"
                    id="region"
                    label="Region"
                    value={picker.values.region}
                    onChange={(e)=> {
                        picker.setRegion(e.target.value);
                        onChange({...picker.values})
                    }}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {
                        picker.regions?.map(region => (
                            <MenuItem value={`${region.reg_code}-${region.name}`}>{region.name}</MenuItem>
                        ))
                    }
                </Select> 
            </FormControl>
            <FormControl sx={{ flex: 1,  minWidth: 120 }} required={required}>
                <InputLabel id="province-label">Province</InputLabel>
                <Select
                    labelId="province-label"
                    id="province"
                    label="Province"
                    value={picker.values.province}
                    onChange={(e)=> {
                        picker.setProvince(e.target.value);
                        onChange({...picker.values})
                    }}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {
                        picker.provinces?.map(province => (
                            <MenuItem value={`${province.prov_code}-${province.name}`}>{province.name}</MenuItem>
                        ))
                    }
                </Select> 
            </FormControl>
            <FormControl sx={{ flex: 1,  minWidth: 120 }} required={required}>
                <InputLabel id="city-label">City</InputLabel>
                <Select
                    labelId="city-label"
                    id="city"
                    label="City"
                    value={picker.values.cityMun}
                    onChange={(e)=> {
                        picker.setCityMun(e.target.value);
                        onChange({...picker.values})
                    }}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {
                        picker.cityMun?.map(city => (
                            <MenuItem value={`${city.mun_code}-${city.name}`}>{city.name}</MenuItem>
                        ))
                    }
                </Select> 
            </FormControl>
            <FormControl sx={{ flex: 1,  minWidth: 120 }} required={required}>
                <InputLabel id="brgy-label">Barangay</InputLabel>
                <Select
                    labelId="brgy-label"
                    id="brgy"
                    label="Barangay"
                    value={picker.values.barangay}
                    onChange={(e)=> {
                        picker.setBarangay(e.target.value);
                        onChange({...picker.values})
                    }}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {
                        picker.barangay?.map(brgy => (
                            <MenuItem value={`${brgy.name}-${brgy.name}`}>{brgy.name}</MenuItem>
                        ))
                    }
                </Select> 
            </FormControl>
        </div> 
    )
}

const PhLocPicker = styled(PhLocPickerFC)`
    display: flex;
    flex: 0 1 100%;
    height: fit-content;
    gap: 10px;
    flex-wrap: wrap;
`;

export default PhLocPicker;