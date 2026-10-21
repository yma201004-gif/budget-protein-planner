// Reviewed changes layered over the original import and price snapshot.
(function(){
 const replacements={"F002413":"F002414","F005177":"F005184","F007432":"F007433"};
 const nutrients=[
  {
    "id": "F002414",
    "row": 447,
    "sheet": "All solids & liquids per 100 g",
    "values": {
      "Food Name": "Cheese, cheddar, natural, regular fat",
      "Energy with dietary fibre, equated (kJ)": 1686,
      "Protein (g)": 24.6,
      "Fat, total (g)": 33.4,
      "Total dietary fibre (g)": 0,
      "Available carbohydrate, with sugar alcohols (g)": 0.3
    }
  },
  {
    "id": "F005184",
    "row": 760,
    "sheet": "All solids & liquids per 100 g",
    "values": {
      "Food Name": "Lentil, red, hulled, dry",
      "Energy with dietary fibre, equated (kJ)": 1364,
      "Protein (g)": 23,
      "Fat, total (g)": 1.9,
      "Total dietary fibre (g)": 13.7,
      "Available carbohydrate, with sugar alcohols (g)": 45.7
    }
  },
  {
    "id": "F007433",
    "row": 1264,
    "sheet": "All solids & liquids per 100 g",
    "values": {
      "Food Name": "Prawn, flesh, raw (green)",
      "Energy with dietary fibre, equated (kJ)": 381,
      "Protein (g)": 20.7,
      "Fat, total (g)": 0.8,
      "Total dietary fibre (g)": 0,
      "Available carbohydrate, with sugar alcohols (g)": 0
    }
  },
  {
    "id": "F005614",
    "row": 124,
    "sheet": "Liquids only per 100 mL",
    "values": {
      "Food Name": "Milk, cow, fluid, reduced fat (~1%)",
      "Energy with dietary fibre, equated (kJ)": 188,
      "Protein (g)": 3.5,
      "Fat, total (g)": 1.2,
      "Total dietary fibre (g)": 0,
      "Available carbohydrate, with sugar alcohols (g)": 5
    }
  },
  {
    "id": "F005637",
    "row": 126,
    "sheet": "Liquids only per 100 mL",
    "values": {
      "Food Name": "Milk, cow, fluid, skim (~0.15% fat)",
      "Energy with dietary fibre, equated (kJ)": 152,
      "Protein (g)": 3.7,
      "Fat, total (g)": 0,
      "Total dietary fibre (g)": 0,
      "Available carbohydrate, with sugar alcohols (g)": 5.5
    }
  },
  {
    "id": "F008720",
    "row": 165,
    "sheet": "Liquids only per 100 mL",
    "values": {
      "Food Name": "Soy beverage, regular fat (~3%), added Ca & vitamins A, B1, B2 & B12",
      "Energy with dietary fibre, equated (kJ)": 265,
      "Protein (g)": 4.5,
      "Fat, total (g)": 2.8,
      "Total dietary fibre (g)": 0.6,
      "Available carbohydrate, with sugar alcohols (g)": 4.8
    }
  }
];
 window.FOODS=window.FOODS.filter(f=>f.id!=="F003705");
 for(const f of window.FOODS){
   const id=replacements[f.id]||f.id,n=nutrients.find(n=>n.id===id);
   f.basis=100;f.nutritionSheet="All solids & liquids per 100 g";f.nutritionSourceType="AFCD";
   if(n){
     const v=n.values;
     Object.assign(f,{id,name:v["Food Name"],protein:v["Protein (g)"],energyKj:v["Energy with dietary fibre, equated (kJ)"],
       kcal:v["Energy with dietary fibre, equated (kJ)"]/4.184,fat:v["Fat, total (g)"],carbs:v["Available carbohydrate, with sugar alcohols (g)"],
       fibre:v["Total dietary fibre (g)"],nutritionRow:n.row,nutritionSheet:n.sheet});
     if(n.sheet.includes("100 mL"))f.unit="mL";
     if(Object.values(replacements).includes(id)){f.detailsRow=n.row;f.offers={};}
   }
 }
 const egg=FOODS.find(f=>f.id==="F003721");
 for(const key of ["protein","kcal","energyKj","fat","carbs","fibre"])egg[key]*=0.5;
 Object.assign(egg,{unit:"egg",basis:1,quality:"Estimate: 50 g edible hard-boiled whole egg per egg. Actual egg size varies; shell excluded.",name:"Egg, whole, hard-boiled (estimated per egg)"});
 const soy=FOODS.find(f=>f.id==="F008720");
 Object.assign(soy,{id:"VITASOY_CALCI",name:"Vitasoy Calci-Plus soy milk",protein:3.2,kcal:64,energyKj:269,fat:3,carbs:5.8,fibre:0.6,
  nutritionSourceType:"Manufacturer",source:"https://soy.com.au/product/soy-milk-calci-plus/",nutritionRow:null,detailsRow:null,
  quality:"Manufacturer nutrition per 100 mL; replaces generic AFCD soy proxy. Check packaging for formulation changes.",offers:{}});
 FOODS.push({id:"COLES_TUNA_95",name:"Coles tuna chunks in olive oil blend, solid portion (95 g can)",category:"Fish",
  unit:"can",basis:1,protein:15.7,kcal:127,energyKj:533,fat:7.1,carbs:0,fibre:0,source:"https://www.coles.com.au/product/8675339",
  nutritionSourceType:"User-supplied packaging",quality:"Packaging photos: one serving per can, solid portion only. Discarded oil excluded. 95 g is net contents, not drained weight. No 70% yield assumption.",offers:{}});
 const mapped={
  "COLES_TUNA_95": {
    "Coles": {
      "id": "coles_8675339",
      "name": "coles tuna chunks in olive oil blend 95g",
      "store": "coles",
      "price": 1.1,
      "currency": "AUD",
      "cup_price": "$11.58/ 1kg",
      "unit_price": 11.58,
      "unit_measure": "kg",
      "uom": "g",
      "weight": 95,
      "url": "https://www.coles.com.au/product/8675339",
      "category": "pantry",
      "out_of_stock": false,
      "is_special": false,
      "updated_at": "2026-10-20T00:00:00.000Z",
      "is_stale": false,
      "region": "AU",
      "pack": 1
    }
  },
  "F005637": {
    "Coles": {
      "id": "coles_1079800",
      "name": "coles skim milk 2l",
      "store": "coles",
      "price": 3.4,
      "currency": "AUD",
      "cup_price": "$1.70/ 1L",
      "unit_price": 1.7,
      "unit_measure": "l",
      "uom": "l",
      "weight": 2,
      "url": "https://www.coles.com.au/product/1079800",
      "category": "dairy-eggs-fridge",
      "out_of_stock": false,
      "is_special": false,
      "updated_at": "2026-10-20T00:00:00.000Z",
      "is_stale": false,
      "region": "AU",
      "pack": 2000
    },
    "Woolworths": {
      "id": "woolworths_51379",
      "name": "woolworths skim milk 1l",
      "store": "woolworths",
      "price": 1.75,
      "currency": "AUD",
      "cup_price": "$1.75 / 1L",
      "unit_price": 1.75,
      "unit_measure": "l",
      "uom": "l",
      "weight": 1,
      "url": "https://www.woolworths.com.au/shop/productdetails/51379/woolworths-skim-milk",
      "category": "dairy-eggs-fridge",
      "out_of_stock": false,
      "is_special": false,
      "updated_at": "2026-10-20T00:00:00.000Z",
      "is_stale": false,
      "region": "AU",
      "pack": 1000
    }
  },
  "VITASOY_CALCI": {
    "Coles": {
      "id": "coles_9067496",
      "name": "vitasoy soy milk calci plus 1l",
      "store": "coles",
      "price": 3.8,
      "currency": "AUD",
      "cup_price": "$3.80/ 1L",
      "unit_price": 3.8,
      "unit_measure": "l",
      "uom": "l",
      "weight": 1,
      "url": "https://www.coles.com.au/product/9067496",
      "category": "dairy-eggs-fridge",
      "out_of_stock": false,
      "is_special": false,
      "updated_at": "2026-10-20T00:00:00.000Z",
      "is_stale": false,
      "region": "AU",
      "pack": 1000
    },
    "Woolworths": {
      "id": "woolworths_153587",
      "name": "vitasoy calci plus soy milk 1l",
      "store": "woolworths",
      "price": 3.8,
      "currency": "AUD",
      "cup_price": "$3.80 / 1L",
      "unit_price": 3.8,
      "unit_measure": "l",
      "uom": "l",
      "weight": 1,
      "url": "https://www.woolworths.com.au/shop/productdetails/153587/vitasoy-calci-plus-soy-milk",
      "category": "dairy-eggs-fridge",
      "out_of_stock": false,
      "is_special": false,
      "updated_at": "2026-10-20T00:00:00.000Z",
      "is_stale": false,
      "region": "AU",
      "pack": 1000
    }
  },
  "F003721": {
    "Coles": {
      "id": "coles_9131063",
      "name": "sunrise cage free eggs 12 pack 700g",
      "store": "coles",
      "price": 6.5,
      "currency": "AUD",
      "cup_price": "$0.93/ 100g",
      "unit_price": 0.93,
      "unit_measure": "100g",
      "uom": "pk",
      "weight": 12,
      "url": "https://www.coles.com.au/product/9131063",
      "category": "dairy-eggs-fridge",
      "out_of_stock": false,
      "is_special": false,
      "updated_at": "2026-10-20T00:00:00.000Z",
      "is_stale": false,
      "region": "AU",
      "pack": 12
    },
    "Woolworths": {
      "id": "woolworths_118213",
      "name": "simply eggs 12 pack extra large cage free eggs 700g",
      "store": "woolworths",
      "price": 6.9,
      "currency": "AUD",
      "cup_price": "$0.99 / 100G",
      "unit_price": 0.99,
      "unit_measure": "100g",
      "uom": "pk",
      "weight": 12,
      "url": "https://www.woolworths.com.au/shop/productdetails/118213/simply-eggs-12-pack-extra-large-cage-free-eggs",
      "category": "dairy-eggs-fridge",
      "out_of_stock": false,
      "is_special": true,
      "updated_at": "2026-10-20T00:00:00.000Z",
      "is_stale": false,
      "region": "AU",
      "pack": 12
    }
  },
  "F002414": {
    "Coles": {
      "id": "coles_1093903",
      "name": "castello cheddar cheese 200g",
      "store": "coles",
      "price": 8.8,
      "currency": "AUD",
      "cup_price": "$44.00/ 1kg",
      "unit_price": 44,
      "unit_measure": "kg",
      "uom": "g",
      "weight": 200,
      "url": "https://www.coles.com.au/product/1093903",
      "category": "dairy-eggs-fridge",
      "out_of_stock": false,
      "is_special": false,
      "updated_at": "2026-10-20T00:00:00.000Z",
      "is_stale": false,
      "region": "AU",
      "pack": 200
    },
    "Woolworths": {
      "id": "woolworths_925797",
      "name": "castello mature cheddar cheese 200g",
      "store": "woolworths",
      "price": 8.8,
      "currency": "AUD",
      "cup_price": "$44.00 / 1KG",
      "unit_price": 44,
      "unit_measure": "kg",
      "uom": "g",
      "weight": 200,
      "url": "https://www.woolworths.com.au/shop/productdetails/925797/castello-mature-cheddar-cheese",
      "category": "dairy-eggs-fridge",
      "out_of_stock": false,
      "is_special": false,
      "updated_at": "2026-10-20T00:00:00.000Z",
      "is_stale": false,
      "region": "AU",
      "pack": 200
    }
  },
  "F007433": {
    "Coles": {
      "id": "coles_3773396",
      "name": "coles prawns raw peeled 260g",
      "store": "coles",
      "price": 12.5,
      "currency": "AUD",
      "cup_price": "$48.08/ 1kg",
      "unit_price": 48.08,
      "unit_measure": "kg",
      "uom": "g",
      "weight": 260,
      "url": "https://www.coles.com.au/product/3773396",
      "category": "meat-seafood",
      "out_of_stock": false,
      "is_special": false,
      "updated_at": "2026-10-20T00:00:00.000Z",
      "is_stale": false,
      "region": "AU",
      "pack": 260
    },
    "Woolworths": {
      "id": "woolworths_289586",
      "name": "woolworths raw prawn meat 220g",
      "store": "woolworths",
      "price": 10,
      "currency": "AUD",
      "cup_price": "$45.45 / 1KG",
      "unit_price": 45.45,
      "unit_measure": "kg",
      "uom": "g",
      "weight": 220,
      "url": "https://www.woolworths.com.au/shop/productdetails/289586/woolworths-raw-prawn-meat",
      "category": "meat-seafood",
      "out_of_stock": false,
      "is_special": false,
      "updated_at": "2026-10-20T00:00:00.000Z",
      "is_stale": false,
      "region": "AU",
      "pack": 220
    }
  },
  "F005184": {
    "Coles": {
      "id": "coles_4683608",
      "name": "katoomba red lentils 1kg",
      "store": "coles",
      "price": 4,
      "currency": "AUD",
      "cup_price": "$4.00/ 1kg",
      "unit_price": 4,
      "unit_measure": "kg",
      "uom": "kg",
      "weight": 1,
      "url": "https://www.coles.com.au/product/4683608",
      "category": "pantry",
      "out_of_stock": false,
      "is_special": false,
      "updated_at": "2026-10-20T00:00:00.000Z",
      "is_stale": false,
      "region": "AU",
      "pack": 1000
    }
  },
  "F006899": {
    "Coles": {
      "id": "coles_2359370",
      "name": "coles pork fillet approx. 400g",
      "store": "coles",
      "price": 7.4,
      "currency": "AUD",
      "cup_price": "$18.50/ 1kg",
      "unit_price": 18.5,
      "unit_measure": "kg",
      "uom": "g",
      "weight": 400,
      "url": "https://www.coles.com.au/product/2359370",
      "category": "meat-seafood",
      "out_of_stock": false,
      "is_special": false,
      "updated_at": "2026-10-20T00:00:00.000Z",
      "is_stale": false,
      "region": "AU",
      "pack": 400,
      "estimatedPack": true,
      "unitPrice": 1.85
    }
  },
  "F007827": {
    "Woolworths": {
      "id": "woolworths_126497",
      "name": "fresh tasmanian atlantic salmon fillets per 200g",
      "store": "woolworths",
      "price": null,
      "currency": "AUD",
      "cup_price": "$48.00 / 1KG",
      "unit_price": 48,
      "unit_measure": "kg",
      "uom": "g",
      "weight": 200,
      "url": "https://www.woolworths.com.au/shop/productdetails/126497/fresh-tasmanian-atlantic-salmon-fillets",
      "category": "meat-seafood",
      "out_of_stock": false,
      "is_special": false,
      "updated_at": "2026-10-20T00:00:00.000Z",
      "is_stale": false,
      "region": "AU",
      "pack": null,
      "unitPrice": 4.8
    }
  }
};
 for(const f of FOODS)if(mapped[f.id])f.offers=mapped[f.id];
 const reasons={
 F000448:"Drained weight not verified; nutrition only.",
 F002880:"Drained weight not verified; nutrition only.",
 F007853:"Drained weight not verified; nutrition only.",
 F009300:"Water-packed tuna: drained weight not verified. The separate Coles oil-blend tuna uses its own label.",
 F000386:"Unseasoned, boneless frozen fillet not verified; seasoned and skin-on alternatives not substituted.",
 F005614:"Matching approximately 1% fat milk not verified; 2% and extra-protein alternatives excluded."
 };
 for(const f of FOODS){f.missingReason=reasons[f.id]||f.missingReason||"No matching product for this retailer.";if(mapped[f.id])f.missingReason="No matching product for this retailer.";}
 FOODS.find(f=>f.id==="F005184").quality+=". Dry weight before cooking; canned alternative lacked verified drained weight.";
 window.REVIEW_META={date:"2026-10-20",note:"Units and food states reviewed. Catalogue snapshots are not live shelf prices."};
})();

