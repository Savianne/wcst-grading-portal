
import regions from '../ph-loc-json/regions.json';
import provinces from '../ph-loc-json/provinces.json';
import city_mun from '../ph-loc-json/city-mun.json';
import brgy from '../ph-loc-json/barangays.json';

let lib = {
  regions: regions,
  provinces: provinces,
  city_mun: city_mun,
  barangays: brgy,

  // get all provinces in selected region
  getProvincesByRegion: (region_code: number | string) => {
    return provinces.filter((val: any) => {
      return val.reg_code == region_code;
    })

  },


  // get all cities and municipalities in selected province
  getCityMunByProvince: (province_code: number | string) => {
    return city_mun.filter((val: any) => {
      return val.prov_code == province_code
    })

  },


  // get all barangays in selected city or municipality
  getBarangayByMun: (mun_code: number | string) => {
    return brgy.filter((val: any) => {
      return val.mun_code == mun_code
    })
  },


  sort: (arr: any[], sort = 'A') => {

    // A for asc
    // z for desc

    var sorted = arr.slice(0);

    if (sort == 'A') {

      sorted.sort(function(a,b) {
        var x = a.name.toLowerCase();
        var y = b.name.toLowerCase();
        return x < y ? -1 : x > y ? 1 : 0;
      });


    }else if (sort == 'Z') {

      sorted.sort(function(a,b) {
        var x = a.name.toLowerCase();
        var y = b.name.toLowerCase();
        return y < x ? -1 : y > x ? 1 : 0;
      });

    }


    return sorted;
  }

}

export default lib;